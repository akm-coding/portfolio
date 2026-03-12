import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ProjectGallery } from "@/components/projects/project-gallery"
import { getProjectBySlug } from "@/lib/queries/projects"

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
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const images = project.project_images ?? []

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link
        href="/#projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Projects
      </Link>

      <h1 className="mb-6 text-3xl font-bold md:text-4xl">{project.title}</h1>

      {images.length > 0 ? (
        <div className="mb-8">
          <ProjectGallery
            images={images}
            projectTitle={project.title}
          />
        </div>
      ) : project.thumbnail_url ? (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </div>
      ) : null}

      <div className="md:grid md:grid-cols-3 md:gap-8">
        <div className="md:col-span-2">
          {project.full_description ? (
            <div className="space-y-4">
              {project.full_description.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : project.short_description ? (
            <p className="leading-relaxed text-muted-foreground">
              {project.short_description}
            </p>
          ) : null}
        </div>

        <div className="mt-8 md:col-span-1 md:mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              {(project.github_url || project.live_url) && (
                <div className="space-y-2 pt-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full gap-2"
                      )}
                    >
                      <Github className="size-4" />
                      View on GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full gap-2"
                      )}
                    >
                      <ExternalLink className="size-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
