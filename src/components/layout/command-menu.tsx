"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Copy,
  FileText,
  Github,
  Hash,
  Linkedin,
  Mail,
  Monitor,
  Moon,
  Search,
  Sun,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { navLinks } from "@/lib/site-config"

export interface CommandMenuLinks {
  resumeUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  email: string | null
}

export function CommandMenu({ links }: { links: CommandMenuLinks }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function run(action: () => void) {
    setOpen(false)
    action()
  }

  const openExternal = (url: string) => () => window.open(url, "_blank", "noopener")

  const externalLinks = [
    links.linkedinUrl && { label: "LinkedIn", icon: Linkedin, url: links.linkedinUrl },
    links.githubUrl && { label: "GitHub", icon: Github, url: links.githubUrl },
  ].filter(Boolean) as { label: string; icon: typeof Github; url: string }[]

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden w-44 justify-start gap-2 text-muted-foreground lg:inline-flex"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="pointer-events-none rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
          ⌘K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Open command menu"
      >
        <Search className="size-4" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command menu"
        description="Jump to a section or open a link"
      >
        <Command>
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Sections">
              {navLinks.map((link) => (
                <CommandItem
                  key={link.href}
                  onSelect={() => run(() => router.push(link.href))}
                >
                  <Hash />
                  {link.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Links">
              <CommandItem onSelect={() => run(() => router.push("/resume"))}>
                <FileText />
                View resume
              </CommandItem>
              {links.resumeUrl && (
                <CommandItem onSelect={() => run(openExternal(links.resumeUrl!))}>
                  <FileText />
                  Download resume (PDF)
                </CommandItem>
              )}
              {externalLinks.map(({ label, icon: Icon, url }) => (
                <CommandItem key={label} onSelect={() => run(openExternal(url))}>
                  <Icon />
                  {label}
                </CommandItem>
              ))}
              {links.email && (
                <>
                  <CommandItem
                    onSelect={() => run(() => (window.location.href = `mailto:${links.email}`))}
                  >
                    <Mail />
                    Send an email
                  </CommandItem>
                  <CommandItem
                    onSelect={() =>
                      run(() =>
                        navigator.clipboard
                          .writeText(links.email!)
                          .then(() => toast.success("Email copied to clipboard"))
                      )
                    }
                  >
                    <Copy />
                    Copy email address
                  </CommandItem>
                </>
              )}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Theme">
              <CommandItem onSelect={() => run(() => setTheme("light"))}>
                <Sun />
                Light
              </CommandItem>
              <CommandItem onSelect={() => run(() => setTheme("dark"))}>
                <Moon />
                Dark
              </CommandItem>
              <CommandItem onSelect={() => run(() => setTheme("system"))}>
                <Monitor />
                System
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
