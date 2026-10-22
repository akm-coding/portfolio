import { getProfile } from "@/lib/queries/profile"
import { getStatistics } from "@/lib/queries/statistics"
import { HeroSectionAnimated } from "@/components/sections/hero-section-animated"

export async function HeroSection() {
  const [profile, statistics] = await Promise.all([
    getProfile(),
    getStatistics(),
  ])

  if (!profile) return null

  const initials = profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <HeroSectionAnimated
      profile={profile}
      statistics={statistics.slice(0, 4)}
      initials={initials}
    />
  )
}
