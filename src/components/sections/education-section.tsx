import { GraduationCap, Calendar } from "lucide-react"

import { getEducation } from "@/lib/queries/education"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export async function EducationSection() {
  const education = await getEducation()

  if (education.length === 0) return null

  return (
    <section id="education" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Education</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((entry) => (
            <Card
              key={entry.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="size-5 text-muted-foreground" />
                  {entry.institution}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">
                  {entry.degree}
                  {entry.field_of_study && ` in ${entry.field_of_study}`}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="size-3.5" />
                  {formatDate(entry.start_date)} –{" "}
                  {entry.end_date ? formatDate(entry.end_date) : "Present"}
                </p>
                {entry.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                    {entry.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
