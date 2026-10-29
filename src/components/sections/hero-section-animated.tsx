"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, FileText, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react"
import { motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CountUp } from "@/components/motion/count-up"
import { heroContainerVariants, heroItemVariants } from "@/lib/motion"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import type { Profile, Statistic } from "@/lib/types/database"

interface HeroSectionAnimatedProps {
  profile: Profile
  statistics: Statistic[]
  initials: string
}

export function HeroSectionAnimated({
  profile,
  statistics,
  initials,
}: HeroSectionAnimatedProps) {
  const socials = [
    profile.github_url && {
      label: "GitHub",
      href: profile.github_url,
      icon: Github,
    },
    profile.linkedin_url && {
      label: "LinkedIn",
      href: profile.linkedin_url,
      icon: Linkedin,
    },
    profile.email && {
      label: profile.email,
      href: `mailto:${profile.email}`,
      icon: Mail,
    },
  ].filter(Boolean) as { label: string; href: string; icon: typeof Mail }[]

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Subtle grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] opacity-60"
      />
      {/* Soft brand glow behind the portrait */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 -z-10 size-[520px] rounded-full bg-brand/15 blur-3xl md:right-[8%]"
      />

      <div className="mx-auto max-w-5xl px-4 pt-16 pb-12 sm:px-6 md:pt-24">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={heroItemVariants}
              className="flex flex-wrap items-center gap-2"
            >
              {siteConfig.availability.open && (
                <Badge
                  variant="outline"
                  className="h-6 gap-2 border-emerald-500/30 bg-emerald-500/10 px-2.5 text-emerald-700 dark:text-emerald-400"
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  {siteConfig.availability.label}
                </Badge>
              )}
              {profile.location && (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {profile.location}
                  <span className="text-muted-foreground/60">
                    · {siteConfig.timezone}
                  </span>
                </span>
              )}
            </motion.div>

            <motion.p
              variants={heroItemVariants}
              aria-hidden
              className="mt-6 font-mono text-sm text-muted-foreground"
            >
              <span className="text-brand">$</span> whoami
              <span className="terminal-cursor ml-1.5" />
            </motion.p>
            <motion.h1
              variants={heroItemVariants}
              className="mt-2 text-5xl font-bold tracking-tighter sm:text-6xl lg:text-7xl"
            >
              {profile.full_name}
            </motion.h1>
            <motion.p
              variants={heroItemVariants}
              className="mt-4 text-xl font-medium text-foreground/80 sm:text-2xl"
            >
              {profile.title}
              <span className="text-brand">.</span>
            </motion.p>
            {profile.tagline && (
              <motion.p
                variants={heroItemVariants}
                className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                {profile.tagline}
              </motion.p>
            )}

            <motion.div
              variants={heroItemVariants}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                className="h-10 gap-2 px-4"
                nativeButton={false}
                render={<Link href="/resume" />}
              >
                <FileText className="size-4" />
                View Resume
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group h-10 gap-2 px-4"
                nativeButton={false}
                render={<a href="#contact" />}
              >
                Get in touch
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-10 gap-2 border-brand/40 px-4 hover:border-brand hover:bg-brand/10"
                onClick={() => window.dispatchEvent(new Event("open-chat"))}
              >
                <Sparkles className="size-4 text-brand" />
                Ask my AI
              </Button>

              <div className="flex items-center gap-1 sm:ml-2">
                {socials.map(({ label, href, icon: Icon }) => (
                  <Tooltip key={href}>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          nativeButton={false}
                          render={
                            <a
                              href={href}
                              target={href.startsWith("mailto:") ? undefined : "_blank"}
                              rel="noopener noreferrer"
                              aria-label={label}
                            />
                          }
                        />
                      }
                    >
                      <Icon className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="order-first md:order-last"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                width={240}
                height={240}
                priority
                className="size-28 rounded-2xl object-cover shadow-lg ring-1 ring-border sm:size-36 md:size-60"
              />
            ) : (
              <div className="flex size-28 items-center justify-center rounded-2xl bg-muted ring-1 ring-border sm:size-36 md:size-60">
                <span className="text-4xl font-bold text-muted-foreground md:text-6xl">
                  {initials}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {statistics.length > 0 && (
          <motion.dl
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className={cn(
              "mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border",
              "[&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:col-span-1",
              statistics.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4"
            )}
          >
            {statistics.map((stat) => (
              <div key={stat.id} className="bg-background p-5">
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </motion.dl>
        )}
      </div>
    </section>
  )
}
