import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ExternalLink, Github, Smartphone } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Project } from "@/lib/types/database"
import { cn } from "@/lib/utils"

function ProjectLinks({ project }: { project: Project }) {
  const links = [
    project.live_url && { href: project.live_url, label: "Live", icon: ExternalLink },
    project.github_url && { href: project.github_url, label: "Code", icon: Github },
    project.appstore_url && { href: project.appstore_url, label: "App Store", icon: Smartphone },
    project.playstore_url && { href: project.playstore_url, label: "Play Store", icon: Smartphone },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Github }[]

  if (links.length === 0) return null

  return (
    // z-10 lifts these above the card's full-size overlay link
    <div className="relative z-10 flex flex-wrap gap-x-4 gap-y-1">
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon className="size-3.5" />
          {label}
        </a>
      ))}
    </div>
  )
}

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project
  featured?: boolean
}) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-foreground/20 hover:shadow-md",
        featured && "md:flex-row"
      )}
    >
      <div
        className={cn(
          "relative aspect-video shrink-0 overflow-hidden border-b bg-muted",
          featured && "md:aspect-auto md:min-h-64 md:w-1/2 md:border-r md:border-b-0"
        )}
      >
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 480px"
                : "(max-width: 640px) 100vw, 320px"
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-background">
            <span className="text-2xl font-semibold text-muted-foreground/50">
              {project.title}
            </span>
          </div>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col gap-3 p-5", featured && "md:p-6")}>
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn("font-semibold leading-tight", featured ? "text-xl" : "text-base")}>
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0"
            >
              {project.title}
            </Link>
          </h3>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>

        {project.short_description && (
          <p
            className={cn(
              "text-sm leading-relaxed text-muted-foreground",
              featured ? "line-clamp-4" : "line-clamp-2"
            )}
          >
            {project.short_description}
          </p>
        )}

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.slice(0, featured ? 8 : 5).map((tech) => (
              <Badge key={tech} variant="secondary" className="font-normal">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  )
}
