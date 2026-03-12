"use client"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { MobileNav } from "@/components/layout/mobile-nav"

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
]

export function PublicNavbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto flex h-14 items-center justify-between px-4">
        <a href="#hero" className="text-lg font-bold tracking-tight">
          AKM
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile hamburger */}
          <div className="md:hidden">
            <MobileNav links={navLinks} />
          </div>
        </div>
      </nav>
    </header>
  )
}
