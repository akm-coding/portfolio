import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { EducationSection } from '@/components/sections/education-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ContactSection } from '@/components/sections/contact-section'


export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <ContactSection />
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} Aung Kaung Myat. All rights reserved.
      </footer>
    </>
  )
}
