import { getProfile } from "@/lib/queries/profile"
import { Section } from "@/components/layout/section"

export async function AboutSection() {
  const profile = await getProfile()

  if (!profile || !profile.bio) return null

  const paragraphs = profile.bio.split("\n\n").filter(Boolean)

  return (
    <Section id="about" eyebrow="About" title="A bit about me">
      <div className="max-w-3xl space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  )
}
