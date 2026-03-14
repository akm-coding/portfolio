import { getProfile } from "@/lib/queries/profile"
import { HeroSectionAnimated } from "@/components/sections/hero-section-animated"

export async function HeroSection() {
  const profile = await getProfile()

  if (!profile) return null

  const initials = profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <HeroSectionAnimated
      fullName={profile.full_name}
      title={profile.title}
      tagline={profile.tagline}
      avatarUrl={profile.avatar_url}
      resumeUrl={profile.resume_url}
      initials={initials}
    />
  )
}
