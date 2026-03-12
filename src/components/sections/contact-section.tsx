import { getProfile } from '@/lib/queries/profile'
import { ContactForm } from '@/components/contact/contact-form'
import { Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export async function ContactSection() {
  const profile = await getProfile()

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8 md:mb-12">
          Get In Touch
        </h2>
        <div className="grid gap-8 md:gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            {profile && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="space-y-3">
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="h-5 w-5" />
                        <span>{profile.email}</span>
                      </a>
                    )}
                    {profile.phone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="h-5 w-5" />
                        <span>{profile.phone}</span>
                      </a>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {(profile.github_url || profile.linkedin_url) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Links</h3>
                    <div className="flex gap-3">
                      {profile.github_url && (
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full w-10 h-10 flex items-center justify-center bg-[#333] hover:bg-[#24292e] text-white transition-colors"
                          aria-label="GitHub"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full w-10 h-10 flex items-center justify-center bg-[#0077B5] hover:bg-[#005885] text-white transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {!profile && (
              <p className="text-muted-foreground">
                Contact information will appear here once a profile is set up.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
