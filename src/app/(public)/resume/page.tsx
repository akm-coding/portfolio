import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ResumeToolbar } from "@/components/resume/resume-toolbar"
import { getEducation } from "@/lib/queries/education"
import { getExperiences } from "@/lib/queries/experiences"
import { getProfile } from "@/lib/queries/profile"
import { getProjects } from "@/lib/queries/projects"
import { getSkills } from "@/lib/queries/skills"
import { formatMonthYear, formatYear, prettyUrl, toBullets } from "@/lib/format"

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Aung Kaung Myat — Full Stack Developer specializing in React Native and Next.js.",
}

function ResumeSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 break-after-avoid border-b pb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default async function ResumePage() {
  const [profile, experiences, projects, skills, education] = await Promise.all([
    getProfile(),
    getExperiences(),
    getProjects(),
    getSkills(),
    getEducation(),
  ])

  if (!profile) notFound()

  const featured = projects.filter((p) => p.featured)
  const selectedProjects = (featured.length > 0 ? featured : projects).slice(0, 4)

  const skillGroups = skills.reduce<Record<string, string[]>>((acc, skill) => {
    ;(acc[skill.category] ??= []).push(skill.name)
    return acc
  }, {})

  const contacts = [
    profile.email && { label: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { label: profile.phone, href: `tel:${profile.phone}` },
    profile.location && { label: profile.location },
    profile.linkedin_url && {
      label: prettyUrl(profile.linkedin_url),
      href: profile.linkedin_url,
    },
    profile.github_url && {
      label: prettyUrl(profile.github_url),
      href: profile.github_url,
    },
    process.env.NEXT_PUBLIC_SITE_URL && {
      label: prettyUrl(process.env.NEXT_PUBLIC_SITE_URL),
      href: process.env.NEXT_PUBLIC_SITE_URL,
    },
  ].filter(Boolean) as { label: string; href?: string }[]

  return (
    <div className="mx-auto max-w-[850px] px-4 py-8 sm:px-6 md:py-12 print:max-w-none print:p-0">
      <ResumeToolbar pdfUrl={profile.resume_url} />

      {/* Card chrome only from sm up: on phones it would double the page gutter */}
      <article className="space-y-7 text-card-foreground sm:rounded-xl sm:border sm:bg-card sm:p-10 sm:shadow-sm print:space-y-5 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">{profile.full_name}</h1>
          <p className="mt-1 text-lg text-foreground/80">{profile.title}</p>
          <ul className="mt-3 flex flex-col gap-y-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5 print:flex-row print:flex-wrap print:gap-x-5">
            {contacts.map((c) => (
              <li key={c.label} className="min-w-0 [overflow-wrap:anywhere]">
                {c.href ? (
                  <a href={c.href} className="hover:text-foreground hover:underline">
                    {c.label}
                  </a>
                ) : (
                  c.label
                )}
              </li>
            ))}
          </ul>
        </header>

        {(profile.tagline || profile.bio) && (
          <ResumeSection title="Summary">
            <p className="text-sm leading-relaxed">
              {profile.bio?.split("\n\n")[0] ?? profile.tagline}
            </p>
          </ResumeSection>
        )}

        {experiences.length > 0 && (
          <ResumeSection title="Experience">
            <div className="space-y-5 print:space-y-4">
              {experiences.map((exp) => {
                const end = exp.is_current ? null : exp.end_date
                const bullets = exp.description ? toBullets(exp.description) : []
                return (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="w-full font-semibold sm:w-auto print:w-auto">
                        {exp.role}
                        <span className="block font-normal text-muted-foreground sm:inline print:inline">
                          <span className="hidden sm:inline print:inline"> · </span>
                          {exp.company}
                        </span>
                      </h3>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {formatMonthYear(exp.start_date)} –{" "}
                        {end ? formatMonthYear(end) : "Present"}
                      </span>
                    </div>
                    {bullets.length > 0 && (
                      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed marker:text-muted-foreground">
                        {bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </ResumeSection>
        )}

        {selectedProjects.length > 0 && (
          <ResumeSection title="Selected projects">
            <div className="space-y-3">
              {selectedProjects.map((project) => {
                const link =
                  project.live_url ??
                  project.appstore_url ??
                  project.playstore_url ??
                  project.github_url
                return (
                  <div key={project.id} className="break-inside-avoid text-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="font-semibold">{project.title}</h3>
                      {link && (
                        <a
                          href={link}
                          className="min-w-0 text-xs text-muted-foreground [overflow-wrap:anywhere] hover:underline"
                        >
                          {prettyUrl(link)}
                        </a>
                      )}
                    </div>
                    {project.short_description && (
                      <p className="mt-0.5 leading-relaxed">{project.short_description}</p>
                    )}
                    {project.tech_stack.length > 0 && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {project.tech_stack.join(" · ")}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </ResumeSection>
        )}

        {skills.length > 0 && (
          <ResumeSection title="Skills">
            <dl className="grid gap-1.5 text-sm sm:grid-cols-[8rem_1fr] print:grid-cols-[8rem_1fr]">
              {Object.entries(skillGroups).map(([category, names]) => (
                <div key={category} className="contents">
                  <dt className="font-semibold">{category}</dt>
                  <dd className="mb-1.5 text-foreground/90 sm:mb-0 print:mb-0">
                    {names.join(", ")}
                  </dd>
                </div>
              ))}
            </dl>
          </ResumeSection>
        )}

        {education.length > 0 && (
          <ResumeSection title="Education">
            <div className="space-y-2">
              {education.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm"
                >
                  <p>
                    <span className="font-semibold">
                      {entry.degree}
                      {entry.field_of_study && ` in ${entry.field_of_study}`}
                    </span>
                    <span className="block text-muted-foreground sm:inline print:inline">
                      <span className="hidden sm:inline print:inline"> · </span>
                      {entry.institution}
                    </span>
                  </p>
                  <span className="tabular-nums text-muted-foreground">
                    {formatYear(entry.start_date)} –{" "}
                    {entry.end_date ? formatYear(entry.end_date) : "Present"}
                  </span>
                </div>
              ))}
            </div>
          </ResumeSection>
        )}
      </article>
    </div>
  )
}
