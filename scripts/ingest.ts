/**
 * RAG ingestion: reads portfolio content from Supabase, embeds each chunk
 * with Gemini, and repopulates the `documents` table.
 *
 * Requires SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local —
 * writes bypass RLS, so the anon/publishable key won't work.
 *
 * Run: pnpm ingest
 */
import { readFile } from "node:fs/promises"
import path from "node:path"

import { createClient } from "@supabase/supabase-js"

import { embedText } from "../src/lib/gemini"

type Chunk = {
  source_type: string
  source_id: string | null
  content: string
}

function requireEnv(name: string, fallbackName?: string): string {
  const value =
    process.env[name] ?? (fallbackName ? process.env[fallbackName] : undefined)
  if (!value) {
    console.error(
      `Missing ${name}${fallbackName ? ` (or ${fallbackName})` : ""} in .env.local`
    )
    process.exit(1)
  }
  return value
}

const supabase = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY")
)

function formatDateRange(
  start: string | null,
  end: string | null,
  isCurrent?: boolean
): string {
  if (!start) return ""
  const from = start.slice(0, 7)
  const to = isCurrent ? "present" : (end?.slice(0, 7) ?? "present")
  return `${from} to ${to}`
}

// Each `## Question` section in content/faq.md becomes one chunk.
// Sections that still contain TODO placeholders (or no answer) are skipped.
async function buildFaqChunks(): Promise<Chunk[]> {
  let markdown: string
  try {
    markdown = await readFile(
      path.join(process.cwd(), "content", "faq.md"),
      "utf8"
    )
  } catch {
    console.log("No content/faq.md found, skipping FAQ chunks.")
    return []
  }

  const chunks: Chunk[] = []
  const sections = markdown.split(/^## /m).slice(1)
  for (const section of sections) {
    const [heading, ...body] = section.split("\n")
    const answer = body
      .join("\n")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim()
    if (!answer) continue
    chunks.push({
      source_type: "faq",
      source_id: null,
      content: `Q: ${heading.trim()}\nA: ${answer}`,
    })
  }
  return chunks
}

async function buildChunks(): Promise<Chunk[]> {
  const chunks: Chunk[] = [...(await buildFaqChunks())]

  const [profiles, projects, experiences, education, skills] =
    await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("projects").select("*"),
      supabase.from("experiences").select("*"),
      supabase.from("education").select("*"),
      supabase.from("skills").select("*"),
    ])

  for (const result of [profiles, projects, experiences, education, skills]) {
    if (result.error) throw result.error
  }

  for (const p of profiles.data ?? []) {
    chunks.push({
      source_type: "profile",
      source_id: p.id,
      content: [
        `About ${p.full_name}: ${p.title}.`,
        p.tagline,
        p.bio,
        p.location ? `Based in ${p.location}.` : null,
        p.github_url ? `GitHub: ${p.github_url}` : null,
        p.linkedin_url ? `LinkedIn: ${p.linkedin_url}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    })
  }

  for (const p of projects.data ?? []) {
    chunks.push({
      source_type: "project",
      source_id: p.id,
      content: [
        `Project: ${p.title}`,
        p.short_description,
        p.full_description,
        p.tech_stack?.length
          ? `Tech stack: ${p.tech_stack.join(", ")}`
          : null,
        p.github_url ? `Source code: ${p.github_url}` : null,
        p.live_url ? `Live site: ${p.live_url}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    })
  }

  for (const e of experiences.data ?? []) {
    chunks.push({
      source_type: "experience",
      source_id: e.id,
      content: [
        `Work experience: ${e.role} at ${e.company} (${formatDateRange(e.start_date, e.end_date, e.is_current)}).`,
        e.description,
      ]
        .filter(Boolean)
        .join("\n"),
    })
  }

  for (const e of education.data ?? []) {
    chunks.push({
      source_type: "education",
      source_id: e.id,
      content: [
        `Education: ${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""} at ${e.institution} (${formatDateRange(e.start_date, e.end_date)}).`,
        e.description,
      ]
        .filter(Boolean)
        .join("\n"),
    })
  }

  const skillsByCategory = new Map<string, string[]>()
  for (const s of skills.data ?? []) {
    const list = skillsByCategory.get(s.category) ?? []
    list.push(s.name)
    skillsByCategory.set(s.category, list)
  }
  if (skillsByCategory.size > 0) {
    const lines = [...skillsByCategory.entries()].map(
      ([category, names]) => `${category}: ${names.join(", ")}`
    )
    chunks.push({
      source_type: "skills",
      source_id: null,
      content: `Skills:\n${lines.join("\n")}`,
    })
  }

  return chunks
}

async function main() {
  const chunks = await buildChunks()
  console.log(`Built ${chunks.length} chunks. Embedding with Gemini...`)

  const rows = []
  for (const chunk of chunks) {
    const embedding = await embedText(chunk.content, "RETRIEVAL_DOCUMENT")
    rows.push({ ...chunk, embedding })
    console.log(`  embedded [${chunk.source_type}] ${chunk.content.slice(0, 60).replaceAll("\n", " ")}...`)
  }

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .gte("id", 0)
  if (deleteError) throw deleteError

  const { error: insertError } = await supabase.from("documents").insert(rows)
  if (insertError) throw insertError

  console.log(`Done. ${rows.length} documents ingested.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
