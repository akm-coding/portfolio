"use client"

import Link from "next/link"
import { ArrowLeft, Download, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ResumeToolbar({ pdfUrl }: { pdfUrl: string | null }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to portfolio
      </Link>
      <div className="flex gap-2">
        {pdfUrl && (
          <Button
            variant="outline"
            className="gap-2"
            nativeButton={false}
            render={<a href={pdfUrl} target="_blank" rel="noopener noreferrer" />}
          >
            <Download className="size-4" />
            Download PDF
          </Button>
        )}
        <Button className="gap-2" onClick={() => window.print()}>
          <Printer className="size-4" />
          Print / Save as PDF
        </Button>
      </div>
    </div>
  )
}
