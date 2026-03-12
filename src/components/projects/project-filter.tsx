"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/projects/project-card"
import type { Project } from "@/lib/types/database"

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("All")

  const allTechs = [
    "All",
    ...Array.from(new Set(projects.flatMap((p) => p.tech_stack))).sort(),
  ]

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.tech_stack.includes(activeFilter))

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {allTechs.map((tech) => (
          <Button
            key={tech}
            variant={activeFilter === tech ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(tech)}
          >
            {tech}
          </Button>
        ))}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          No projects found for &ldquo;{activeFilter}&rdquo;.
        </p>
      )}
    </div>
  )
}
