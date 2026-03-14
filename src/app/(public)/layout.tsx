import { PublicNavbar } from "@/components/layout/public-navbar"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aung Kaung Myat",
  jobTitle: "Full Stack Developer",
  description:
    "Full Stack Developer specializing in React Native and frontend development",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  sameAs: [],
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PublicNavbar />
      <main className="pt-14">{children}</main>
    </>
  )
}
