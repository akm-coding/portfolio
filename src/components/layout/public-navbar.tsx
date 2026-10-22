"use client"

import Link from "next/link"
import { FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { MobileNav } from "@/components/layout/mobile-nav"
import { CommandMenu, type CommandMenuLinks } from "@/components/layout/command-menu"
import { navLinks } from "@/lib/site-config"

export function PublicNavbar({ links }: { links: CommandMenuLinks }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          AKM<span className="text-muted-foreground">.dev</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <CommandMenu links={links} />
          <ThemeToggle />
          {links.resumeUrl && (
            <Button
              size="sm"
              className="hidden gap-1.5 sm:inline-flex"
              nativeButton={false}
              render={
                <a href={links.resumeUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              <FileText className="size-3.5" />
              Résumé
            </Button>
          )}
          <div className="md:hidden">
            <MobileNav links={navLinks} resumeUrl={links.resumeUrl} />
          </div>
        </div>
      </nav>
    </header>
  )
}
