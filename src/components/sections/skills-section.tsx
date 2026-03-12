import { getSkills } from "@/lib/queries/skills"
import { Badge } from "@/components/ui/badge"

type BadgeVariant = "default" | "secondary" | "outline" | "destructive"

const categoryVariants: Record<string, BadgeVariant> = {
  Frontend: "default",
  Backend: "secondary",
  "Tools & DevOps": "outline",
  Database: "destructive",
  Design: "default",
  Mobile: "secondary",
}

const variantCycle: BadgeVariant[] = ["default", "secondary", "outline"]

function getVariantForCategory(
  category: string,
  index: number
): BadgeVariant {
  return categoryVariants[category] ?? variantCycle[index % variantCycle.length]
}

export async function SkillsSection() {
  const skills = await getSkills()

  if (skills.length === 0) return null

  // Group skills by category
  const grouped = skills.reduce<Record<string, typeof skills>>(
    (acc, skill) => {
      const key = skill.category
      if (!acc[key]) acc[key] = []
      acc[key].push(skill)
      return acc
    },
    {}
  )

  const categories = Object.keys(grouped)

  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Skills</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, catIndex) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {grouped[category].map((skill) => (
                  <Badge
                    key={skill.id}
                    variant={getVariantForCategory(category, catIndex)}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
