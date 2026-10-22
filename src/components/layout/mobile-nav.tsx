"use client"

import { useState } from "react"
import { FileText, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileNavProps {
  links: { label: string; href: string }[]
  resumeUrl: string | null
}

export function MobileNav({ links, resumeUrl }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" />}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          {resumeUrl && (
            <Button
              className="mt-4 gap-2"
              nativeButton={false}
              render={<a href={resumeUrl} target="_blank" rel="noopener noreferrer" />}
            >
              <FileText className="size-4" />
              View Résumé
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
