import { GraduationCap } from "lucide-react"

import { getEducation } from "@/lib/queries/education"
import { Section } from "@/components/layout/section"
import { formatYear } from "@/lib/format"

export async function EducationSection() {
  const education = await getEducation()

  if (education.length === 0) return null

  return (
    <Section id="education" eyebrow="Education" title="Education">
      <ul className="divide-y rounded-xl border">
        {education.map((entry) => (
          <li key={entry.id} className="flex gap-4 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <GraduationCap className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="font-semibold">{entry.institution}</h3>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {formatYear(entry.start_date)} –{" "}
                  {entry.end_date ? formatYear(entry.end_date) : "Present"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {entry.degree}
                {entry.field_of_study && ` in ${entry.field_of_study}`}
              </p>
              {entry.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {entry.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
