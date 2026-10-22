import { FileText, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

import { getProfile } from '@/lib/queries/profile'
import { ContactForm } from '@/components/contact/contact-form'
import { CopyEmailButton } from '@/components/contact/copy-email-button'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/site-config'

export async function ContactSection() {
  const profile = await getProfile()

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's work together"
      description={
        siteConfig.availability.open
          ? `I'm currently ${siteConfig.availability.label.toLowerCase()} (${siteConfig.availability.detail}). I usually reply within a day.`
          : 'Have a question or just want to say hi? I usually reply within a day.'
      }
    >
      <div className="grid gap-8 md:grid-cols-5 md:gap-12">
        <div className="space-y-6 md:col-span-2">
          {profile ? (
            <>
              <ul className="space-y-3 text-sm">
                {profile.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <a
                      href={`mailto:${profile.email}`}
                      className="truncate font-medium hover:underline"
                    >
                      {profile.email}
                    </a>
                    <CopyEmailButton email={profile.email} />
                  </li>
                )}
                {profile.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 shrink-0 text-muted-foreground" />
                    <a href={`tel:${profile.phone}`} className="hover:underline">
                      {profile.phone}
                    </a>
                  </li>
                )}
                {profile.location && (
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    {profile.location} · {siteConfig.timezone}
                  </li>
                )}
              </ul>

              <div className="flex flex-wrap gap-2">
                {profile.resume_url && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    nativeButton={false}
                    render={<a href={profile.resume_url} target="_blank" rel="noopener noreferrer" />}
                  >
                    <FileText className="size-4" />
                    Résumé
                  </Button>
                )}
                {profile.linkedin_url && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    nativeButton={false}
                    render={<a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" />}
                  >
                    <Linkedin className="size-4" />
                    LinkedIn
                  </Button>
                )}
                {profile.github_url && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    nativeButton={false}
                    render={<a href={profile.github_url} target="_blank" rel="noopener noreferrer" />}
                  >
                    <Github className="size-4" />
                    GitHub
                  </Button>
                )}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              Contact information will appear here once a profile is set up.
            </p>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 md:col-span-3 md:p-6">
          <ContactForm />
        </div>
      </div>
    </Section>
  )
}
