import { getProjects } from "@/lib/queries/projects"
import { ProjectFilter } from "@/components/projects/project-filter"

export async function ProjectsSection() {
  const projects = await getProjects()

  if (projects.length === 0) {
    return null
  }

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold tracking-tight md:mb-12">
          Projects
        </h2>
        <ProjectFilter projects={projects} />
      </div>
    </section>
  )
}
