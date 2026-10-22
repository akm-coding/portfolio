import { cn } from "@/lib/utils"

interface SectionProps {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  className?: string
  children: React.ReactNode
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-20", className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10">
          {eyebrow && (
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
