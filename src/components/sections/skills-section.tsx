import { getSkills } from "@/lib/queries/skills"
import { Section } from "@/components/layout/section"
import { SkillsTabs } from "@/components/sections/skills-tabs"

export async function SkillsSection() {
  const skills = await getSkills()

  if (skills.length === 0) return null

  const grouped = skills.reduce<Record<string, string[]>>((acc, skill) => {
    ;(acc[skill.category] ??= []).push(skill.name)
    return acc
  }, {})

  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Tech I work with"
      description="The tools I reach for day to day, grouped by area."
    >
      <SkillsTabs groups={grouped} />
    </Section>
  )
}
