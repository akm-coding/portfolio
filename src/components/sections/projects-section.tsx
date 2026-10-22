import { getProjects } from "@/lib/queries/projects"
import { ProjectCard } from "@/components/projects/project-card"
import { ProjectFilter } from "@/components/projects/project-filter"
import { Section } from "@/components/layout/section"

export async function ProjectsSection() {
  const projects = await getProjects()

  if (projects.length === 0) {
    return null
  }

  // Fall back to the first two projects if none are flagged as featured.
  const flagged = projects.filter((p) => p.featured)
  const featured = flagged.length > 0 ? flagged : projects.slice(0, 2)
  const rest = projects.filter((p) => !featured.includes(p))

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      description="Production apps and side projects — click any card for the full case study."
    >
      <div className="space-y-6">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} featured />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-14">
          <h3 className="mb-4 text-lg font-semibold">More projects</h3>
          <ProjectFilter projects={rest} />
        </div>
      )}
    </Section>
  )
}
