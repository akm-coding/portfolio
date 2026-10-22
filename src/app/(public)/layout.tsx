import { PublicNavbar } from "@/components/layout/public-navbar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getProfile } from "@/lib/queries/profile"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.full_name ?? "Aung Kaung Myat",
    jobTitle: profile?.title ?? "Full Stack Developer",
    description:
      "Full Stack Developer specializing in React Native and frontend development",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    sameAs: [profile?.github_url, profile?.linkedin_url].filter(Boolean),
  }

  return (
    <TooltipProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PublicNavbar
        links={{
          resumeUrl: profile?.resume_url ?? null,
          githubUrl: profile?.github_url ?? null,
          linkedinUrl: profile?.linkedin_url ?? null,
          email: profile?.email ?? null,
        }}
      />
      <main className="pt-14">{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>&copy; {new Date().getFullYear()} {profile?.full_name ?? "Aung Kaung Myat"}</p>
          <p className="font-mono text-xs">
            Press <kbd className="rounded border bg-muted px-1">⌘K</kbd> to navigate
          </p>
        </div>
      </footer>
    </TooltipProvider>
  )
}
