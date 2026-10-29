import { getSkills } from "@/lib/queries/skills"
import { cn } from "@/lib/utils"
import { Section } from "@/components/layout/section"
import { TechIcon } from "@/components/ui/tech-icon"

// Category order used to interleave skills; categories not listed here go last.
const categoryOrder = ["Frontend", "Backend", "Databases", "DevOps", "Tools", "Languages", "Other"]

function MarqueeRow({ names, reverse = false }: { names: string[]; reverse?: boolean }) {
  const items = names.map((name) => (
    <li
      key={name}
      className="flex shrink-0 items-center gap-2.5 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium"
    >
      <TechIcon name={name} className="size-5" />
      {name}
    </li>
  ))

  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[mask-image:none]">
      <div
        style={{ "--marquee-duration": `${names.length * 3}s` } as React.CSSProperties}
        className={cn(
          "flex w-max animate-marquee group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
          // Reduced motion: a static, wrapping row without the duplicate copy
          "motion-reduce:w-auto motion-reduce:animate-none"
        )}
      >
        <ul className="flex gap-3 pr-3 motion-reduce:flex-wrap">{items}</ul>
        {/* Second copy makes the loop seamless; hidden from screen readers */}
        <ul aria-hidden className="flex gap-3 pr-3 motion-reduce:hidden">
          {items}
        </ul>
      </div>
    </div>
  )
}

export async function SkillsSection() {
  const skills = await getSkills()

  if (skills.length === 0) return null

  const rank = (category: string) => {
    const i = categoryOrder.indexOf(category)
    return i === -1 ? categoryOrder.length : i
  }
  const names = [...skills]
    .sort((a, b) => rank(a.category) - rank(b.category))
    .map((skill) => skill.name)

  // Alternate skills between the two rows so each mixes categories
  const rows: [string[], string[]] = [[], []]
  names.forEach((name, i) => rows[i % 2].push(name))

  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Tech I work with"
      description={`${skills.length} tools I reach for day to day.`}
    >
      <div className="space-y-3">
        <MarqueeRow names={rows[0]} />
        <MarqueeRow names={rows[1]} reverse />
      </div>
    </Section>
  )
}
