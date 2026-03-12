import Image from "next/image"
import { Download, Mail } from "lucide-react"

import { getProfile } from "@/lib/queries/profile"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export async function HeroSection() {
  const profile = await getProfile()

  if (!profile) return null

  const initials = profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <section
      id="hero"
      className="min-h-[calc(100vh-3.5rem)] flex items-center"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Text content */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {profile.full_name}
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground">
              {profile.title}
            </p>
            {profile.tagline && (
              <p className="mt-3 text-lg text-muted-foreground/80">
                {profile.tagline}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              {profile.resume_url && (
                <a
                  href={profile.resume_url}
                  download
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "gap-2"
                  )}
                >
                  <Download className="size-4" />
                  Download Resume
                </a>
              )}
              <a
                href="#contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2"
                )}
              >
                <Mail className="size-4" />
                Contact Me
              </a>
            </div>
          </div>

          {/* Profile photo */}
          <div className="order-1 md:order-2 flex justify-center">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                width={400}
                height={400}
                priority
                className="rounded-lg aspect-square object-cover"
              />
            ) : (
              <div className="w-[400px] h-[400px] max-w-full aspect-square rounded-lg bg-muted flex items-center justify-center">
                <span className="text-6xl font-bold text-muted-foreground">
                  {initials}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
