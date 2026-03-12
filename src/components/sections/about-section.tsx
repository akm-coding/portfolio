import { Download } from "lucide-react"

import { getProfile } from "@/lib/queries/profile"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export async function AboutSection() {
  const profile = await getProfile()

  if (!profile || !profile.bio) return null

  const paragraphs = profile.bio.split("\n\n").filter(Boolean)

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">About Me</h2>
        <div className="max-w-3xl space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
        {profile.resume_url && (
          <div className="mt-8">
            <a
              href={profile.resume_url}
              download
              className={cn(
                buttonVariants({ variant: "outline" }),
                "gap-2"
              )}
            >
              <Download className="size-4" />
              Download Resume
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
