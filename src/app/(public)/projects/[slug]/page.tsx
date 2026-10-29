import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Globe,
  Smartphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { TechIcon } from "@/components/ui/tech-icon"
import { ProjectDescription } from "@/components/projects/project-description"
import { ProjectGallery } from "@/components/projects/project-gallery"
import { getProjectBySlug, getProjects } from "@/lib/queries/projects"
import { prettyUrl } from "@/lib/format"
import type { Project } from "@/lib/types/database"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return { title: "Project Not Found" }
  }

  return {
    title: project.title,
    description: project.short_description ?? undefined,
    openGraph: {
      title: project.title,
      description: project.short_description ?? undefined,
      type: "article",
      ...(project.thumbnail_url
        ? { images: [{ url: project.thumbnail_url }] }
        : {}),
    },
  }
}

function getPlatforms(project: Project): string[] {
  return [
    project.appstore_url && "iOS",
    project.playstore_url && "Android",
    project.live_url && "Web",
  ].filter(Boolean) as string[]
}

function getLinks(project: Project) {
  return [
    project.live_url && { href: project.live_url, label: "Live site", icon: Globe },
    project.appstore_url && { href: project.appstore_url, label: "App Store", icon: Smartphone },
    project.playstore_url && { href: project.playstore_url, label: "Google Play", icon: Smartphone },
    project.github_url && { href: project.github_url, label: "Source code", icon: Github },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Github }[]
}

function AsideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </div>
  )
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ])

  if (!project) {
    notFound()
  }

  const images = [...(project.project_images ?? [])].sort(
    (a, b) => a.display_order - b.display_order
  )
  const platforms = getPlatforms(project)
  const links = getLinks(project)
  const [primaryLink, ...secondaryLinks] = links

  const index = allProjects.findIndex((p) => p.id === project.id)
  const prev = index > 0 ? allProjects[index - 1] : null
  const next = index >= 0 && index < allProjects.length - 1 ? allProjects[index + 1] : null

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>

      {/* Header */}
      <header className="mt-8 max-w-3xl">
        {platforms.length > 0 && (
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {platforms.join(" · ")}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {project.title}
        </h1>
        {project.short_description && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {project.short_description}
          </p>
        )}

        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {primaryLink && (
              <Button
                className="h-10 gap-2 px-4"
                nativeButton={false}
                render={<a href={primaryLink.href} target="_blank" rel="noopener noreferrer" />}
              >
                <primaryLink.icon className="size-4" />
                {primaryLink.label}
                <ExternalLink className="size-3.5 opacity-60" />
              </Button>
            )}
            {secondaryLinks.map(({ href, label, icon: Icon }) => (
              <Button
                key={label}
                variant="outline"
                className="h-10 gap-2 px-4"
                nativeButton={false}
                render={<a href={href} target="_blank" rel="noopener noreferrer" />}
              >
                <Icon className="size-4" />
                {label}
              </Button>
            ))}
          </div>
        )}
      </header>

      {/* Media */}
      {images.length > 0 ? (
        <div className="mt-10">
          <ProjectGallery images={images} projectTitle={project.title} />
        </div>
      ) : project.thumbnail_url ? (
        <div className="relative mt-10 aspect-video overflow-hidden rounded-xl border bg-muted">
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>
      ) : null}

      {/* Body */}
      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_240px] md:gap-12">
        <div className="min-w-0">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Overview</h2>
          {project.full_description ? (
            <ProjectDescription text={project.full_description} />
          ) : project.short_description ? (
            <p className="leading-relaxed text-muted-foreground">
              {project.short_description}
            </p>
          ) : (
            <p className="text-muted-foreground">More details coming soon.</p>
          )}
        </div>

        <aside className="space-y-8 md:sticky md:top-24 md:self-start">
          {project.tech_stack.length > 0 && (
            <AsideBlock title="Tech stack">
              <ul className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((tech) => (
                  <li
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-xs font-medium"
                  >
                    <TechIcon name={tech} className="size-3.5" />
                    {tech}
                  </li>
                ))}
              </ul>
            </AsideBlock>
          )}

          {platforms.length > 0 && (
            <AsideBlock title="Platforms">
              <p className="text-sm">{platforms.join(", ")}</p>
            </AsideBlock>
          )}

          {links.length > 0 && (
            <AsideBlock title="Links">
              <ul className="space-y-2 text-sm">
                {links.map(({ href, label, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 hover:text-foreground"
                    >
                      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0">
                        <span className="block font-medium group-hover:underline">{label}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {prettyUrl(href)}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </AsideBlock>
          )}
        </aside>
      </div>

      {/* Prev / next */}
      {(prev || next) && (
        <nav
          aria-label="More projects"
          className="mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group rounded-xl border p-4 transition-colors hover:border-foreground/20"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                Previous
              </span>
              <span className="mt-1 block font-semibold">{prev.title}</span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="group rounded-xl border p-4 text-right transition-colors hover:border-foreground/20"
            >
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                Next
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block font-semibold">{next.title}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  )
}
