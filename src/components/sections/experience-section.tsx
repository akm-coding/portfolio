import { getExperiences } from "@/lib/queries/experiences"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/layout/section"
import { formatDuration, formatMonthYear, toBullets } from "@/lib/format"
import { cn } from "@/lib/utils"

export async function ExperienceSection() {
  const experiences = await getExperiences()

  if (experiences.length === 0) return null

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've worked"
      description="Building production mobile and web apps across agencies and product teams."
    >
      <ol className="relative space-y-12 border-l pl-8 md:border-l-0 md:pl-0">
        {experiences.map((exp) => {
          const bullets = exp.description ? toBullets(exp.description) : []
          const end = exp.is_current ? null : exp.end_date

          return (
            <li
              key={exp.id}
              className="relative md:grid md:grid-cols-[11rem_1fr] md:gap-10"
            >
              <span
                className={cn(
                  "absolute top-1.5 -left-[37px] size-[9px] rounded-full ring-4 ring-background md:hidden",
                  exp.is_current ? "bg-brand" : "bg-muted-foreground/40"
                )}
              />
              {/* Dates column (stacks above the role on mobile) */}
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground md:mb-0 md:flex-col md:items-start md:gap-1 md:pt-1">
                <span className="font-mono text-xs">
                  {formatMonthYear(exp.start_date)} –{" "}
                  {end ? formatMonthYear(end) : "Present"}
                </span>
                <span className="text-xs text-muted-foreground/70">
                  {formatDuration(exp.start_date, end)}
                </span>
                {exp.is_current && (
                  <Badge
                    variant="outline"
                    className="border-brand/30 bg-brand/10 text-brand md:mt-1"
                  >
                    Current
                  </Badge>
                )}
              </div>

              <div className="max-w-prose">
                <h3 className="text-lg font-semibold leading-tight">
                  {exp.role}
                </h3>
                <p className="text-muted-foreground">{exp.company}</p>

                {bullets.length > 1 ? (
                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2.5 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : (
                  bullets[0] && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {bullets[0]}
                    </p>
                  )
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
