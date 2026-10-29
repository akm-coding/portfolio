import { Icon } from "@iconify/react"
import { Code2, Webhook } from "lucide-react"
import {
  siAntdesign,
  siAppwrite,
  siAxios,
  siClaude,
  siClerk,
  siDocker,
  siDrizzle,
  siExpo,
  siExpress,
  siFirebase,
  siGit,
  siGithub,
  siGithubactions,
  siGooglecloud,
  siGooglegemini,
  siGooglemaps,
  siHtml5,
  siJavascript,
  siJest,
  siMongodb,
  siMysql,
  siNeon,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPrisma,
  siReact,
  siReacthookform,
  siReactquery,
  siReactrouter,
  siRedux,
  siSentry,
  siShadcnui,
  siSocketdotio,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siZod,
  type SimpleIcon,
} from "simple-icons"

import { cn } from "@/lib/utils"

// Keys are normalized skill names: lowercase, letters and digits only.
// simple-icons is the primary source: bundled, so logos render instantly.
const brandIcons: Record<string, SimpleIcon> = {
  aisdk: siVercel,
  anthropic: siClaude,
  anthropicapi: siClaude,
  antdesign: siAntdesign,
  appwrite: siAppwrite,
  axios: siAxios,
  cicd: siGithubactions,
  claude: siClaude,
  claudeapi: siClaude,
  claudeanthropicapi: siClaude,
  claudecode: siClaude,
  clerk: siClerk,
  docker: siDocker,
  drizzle: siDrizzle,
  drizzleorm: siDrizzle,
  eas: siExpo,
  expo: siExpo,
  express: siExpress,
  expressjs: siExpress,
  firebase: siFirebase,
  gcp: siGooglecloud,
  gemini: siGooglegemini,
  geminiapi: siGooglegemini,
  git: siGit,
  github: siGithub,
  githubactions: siGithubactions,
  githubactionscicd: siGithubactions,
  googlecloud: siGooglecloud,
  googlegemini: siGooglegemini,
  googlemaps: siGooglemaps,
  googlemapsapi: siGooglemaps,
  html: siHtml5,
  htmlcss: siHtml5,
  javascript: siJavascript,
  jest: siJest,
  mongodb: siMongodb,
  mysql: siMysql,
  neon: siNeon,
  neondb: siNeon,
  nestjs: siNestjs,
  nextjs: siNextdotjs,
  nodejs: siNodedotjs,
  php: siPhp,
  postgresql: siPostgresql,
  prisma: siPrisma,
  react: siReact,
  reacthookform: siReacthookform,
  reactnative: siReact,
  reactnavigation: siReact,
  reactquery: siReactquery,
  reactrouter: siReactrouter,
  redux: siRedux,
  reduxtoolkit: siRedux,
  sentry: siSentry,
  shadcn: siShadcnui,
  shadcnui: siShadcnui,
  socketio: siSocketdotio,
  stripe: siStripe,
  supabase: siSupabase,
  tailwind: siTailwindcss,
  tailwindcss: siTailwindcss,
  tanstackquery: siReactquery,
  typescript: siTypescript,
  vercel: siVercel,
  vercelaisdk: siVercel,
  zod: siZod,
}

// Iconify fills the gaps simple-icons doesn't cover. These load on demand
// from the Iconify API; `hex` is the brand color (omit for a neutral icon).
// Browse IDs at https://icon-sets.iconify.design
const iconifyIcons: Record<string, { id: string; hex?: string }> = {
  amazonwebservices: { id: "mdi:aws", hex: "FF9900" },
  aws: { id: "mdi:aws", hex: "FF9900" },
  nativewind: { id: "thesvg-color:nativewind", hex: "38BDF8" },
  rag: { id: "carbon:rag" },
  zustand: { id: "devicon-plain:zustand", hex: "443E38" },
}

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "")

// WCAG relative luminance of a 6-digit hex color (0 = black, 1 = white).
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Brand colors that would disappear against a theme get adjusted per theme:
// near-black logos follow the text color, bright ones darken on light
// backgrounds, and dim ones lighten on dark backgrounds.
function colorClass(hex: string) {
  const l = luminance(hex)
  if (l < 0.06) return "text-foreground"
  if (l > 0.4) return "text-[color-mix(in_oklab,var(--tech)_65%,black)] dark:text-(--tech)"
  if (l < 0.2) return "text-(--tech) dark:text-[color-mix(in_oklab,var(--tech)_65%,white)]"
  return "text-(--tech)"
}

const techStyle = (hex: string) => ({ "--tech": `#${hex}` }) as React.CSSProperties

/**
 * Brand logo for a technology name (e.g. "Next.js", "Tailwind CSS"), in its
 * brand color adjusted for contrast in light and dark mode.
 * Unknown names fall back to a generic Lucide icon in the muted text color.
 */
export function TechIcon({ name, className }: { name: string; className?: string }) {
  const key = normalize(name)
  const icon = brandIcons[key]

  if (icon) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        fill="currentColor"
        style={techStyle(icon.hex)}
        className={cn("size-4 shrink-0", colorClass(icon.hex), className)}
      >
        <path d={icon.path} />
      </svg>
    )
  }

  const iconify = iconifyIcons[key]
  if (iconify) {
    return (
      // fill-current colors icons whose paths carry no fill of their own
      <Icon
        icon={iconify.id}
        aria-hidden
        style={iconify.hex ? techStyle(iconify.hex) : undefined}
        className={cn(
          "size-4 shrink-0 fill-current",
          iconify.hex ? colorClass(iconify.hex) : "text-muted-foreground",
          className
        )}
      />
    )
  }

  const Fallback = key.includes("api") ? Webhook : Code2
  return (
    <Fallback
      aria-hidden
      className={cn("size-4 shrink-0 text-muted-foreground", className)}
    />
  )
}
