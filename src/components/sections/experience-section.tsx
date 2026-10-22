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
      <ol className="relative space-y-10 border-l pl-8">
        {experiences.map((exp) => {
          const bullets = exp.description ? toBullets(exp.description) : []
          const end = exp.is_current ? null : exp.end_date

          return (
            <li key={exp.id} className="relative">
              <span
                className={cn(
                  "absolute top-1.5 -left-[37px] size-[9px] rounded-full ring-4 ring-background",
                  exp.is_current ? "bg-emerald-500" : "bg-muted-foreground/40"
                )}
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold leading-tight">
                    {exp.role}
                  </h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground sm:shrink-0">
                  {exp.is_current && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                    >
                      Current
                    </Badge>
                  )}
                  <span className="font-mono text-xs">
                    {formatMonthYear(exp.start_date)} –{" "}
                    {end ? formatMonthYear(end) : "Present"}
                  </span>
                  <span className="text-xs text-muted-foreground/70">
                    · {formatDuration(exp.start_date, end)}
                  </span>
                </div>
              </div>

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
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
