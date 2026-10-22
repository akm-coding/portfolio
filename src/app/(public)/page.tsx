import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { GitHubSection } from '@/components/sections/github-section'
import { EducationSection } from '@/components/sections/education-section'
import { ContactSection } from '@/components/sections/contact-section'
import { ScrollReveal } from '@/components/motion/scroll-reveal'

// Ordered for a recruiter's 30-second scan: who → where they've worked →
// proof of work → toolset → supporting signals → how to reach out.
export default function Home() {
  return (
    <>
      <HeroSection />
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal>
        <ExperienceSection />
      </ScrollReveal>
      <ScrollReveal>
        <ProjectsSection />
      </ScrollReveal>
      <ScrollReveal>
        <SkillsSection />
      </ScrollReveal>
      <ScrollReveal>
        <GitHubSection />
      </ScrollReveal>
      <ScrollReveal>
        <EducationSection />
      </ScrollReveal>
      <ScrollReveal>
        <ContactSection />
      </ScrollReveal>
    </>
  )
}
