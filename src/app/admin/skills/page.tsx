import { getSkills } from '@/lib/queries/skills'
import { SkillsList } from './skills-list'

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Skills</h1>
      <SkillsList skills={skills} />
    </div>
  )
}
