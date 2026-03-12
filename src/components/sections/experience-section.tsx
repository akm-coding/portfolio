import { Briefcase, Calendar } from "lucide-react"

import { getExperiences } from "@/lib/queries/experiences"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export async function ExperienceSection() {
  const experiences = await getExperiences()

  if (experiences.length === 0) return null

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8 md:mb-12">
          Experience
        </h2>

        {/* Desktop: alternating timeline */}
        <div className="relative hidden md:block">
          {/* Vertical center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0

              return (
                <div key={exp.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10">
                    <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                  </div>

                  {/* Card positioned on alternating sides */}
                  <div
                    className={cn(
                      "w-1/2",
                      isLeft ? "pr-12" : "pl-12 ml-auto"
                    )}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="size-4 text-muted-foreground" />
                          {exp.company}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="font-semibold text-primary">{exp.role}</p>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="size-3.5" />
                          {formatDate(exp.start_date)} –{" "}
                          {exp.is_current
                            ? "Present"
                            : exp.end_date
                              ? formatDate(exp.end_date)
                              : ""}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                            {exp.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile: stacked with left border */}
        <div className="md:hidden space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="border-l-2 border-primary pl-4 ml-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="size-4 text-muted-foreground" />
                    {exp.company}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold text-primary">{exp.role}</p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {formatDate(exp.start_date)} –{" "}
                    {exp.is_current
                      ? "Present"
                      : exp.end_date
                        ? formatDate(exp.end_date)
                        : ""}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
