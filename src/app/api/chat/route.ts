import { createClient } from "@supabase/supabase-js"

import { CHAT_MODEL, embedText, getGeminiClient } from "@/lib/gemini"

export const runtime = "nodejs"

const MAX_QUESTION_LENGTH = 500

type MatchedDocument = {
  id: number
  source_type: string
  source_id: string | null
  content: string
  similarity: number
}

export async function POST(request: Request) {
  let question: unknown
  try {
    ;({ question } = await request.json())
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof question !== "string" || question.trim().length === 0) {
    return Response.json({ error: "question is required" }, { status: 400 })
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return Response.json(
      { error: `question must be at most ${MAX_QUESTION_LENGTH} characters` },
      { status: 400 }
    )
  }

  const queryEmbedding = await embedText(question, "RETRIEVAL_QUERY")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: matches, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: 5,
  })
  if (error) {
    console.error("match_documents failed:", error)
    return Response.json({ error: "Retrieval failed" }, { status: 500 })
  }

  const context =
    (matches as MatchedDocument[] | null)
      ?.map((m) => `[${m.source_type}]\n${m.content}`)
      .join("\n---\n") || "(no matching content found)"

  const systemInstruction = `You are the assistant on Aung Kaung Myat's portfolio website.
Answer visitor questions about Aung — his projects, skills, experience, and education.

Rules:
- The portfolio context below is the authoritative source about Aung. If web search results conflict with it, the context wins.
- You may use web search ONLY for supplementary public information directly related to Aung's background — e.g. what a company he worked at does or where it's located, or what a technology he uses is.
- If neither the context nor a related search answers a question about Aung personally, say you don't have that information and suggest the contact form.
- Politely decline questions unrelated to Aung or his work (weather, news, general trivia, other people).
- Keep answers concise (2-4 sentences) and friendly. Do not invent facts, links, or dates.

<context>
${context}
</context>`

  // Google Search grounding needs a billing-enabled Gemini tier; on free-tier
  // keys the grounded call 429s, so fall back to answering from context only.
  const gemini = getGeminiClient()
  let geminiStream
  try {
    geminiStream = await gemini.models.generateContentStream({
      model: CHAT_MODEL,
      contents: question,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    })
  } catch (err) {
    console.warn("Grounded call failed, retrying without search:", err)
    geminiStream = await gemini.models.generateContentStream({
      model: CHAT_MODEL,
      contents: question,
      config: { systemInstruction },
    })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of geminiStream) {
          const text = chunk.text
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      } catch (err) {
        console.error("Gemini stream failed:", err)
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
