"use client"

import Image from "next/image"
import { Download, Mail } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { heroContainerVariants, heroItemVariants } from "@/lib/motion"

interface HeroSectionAnimatedProps {
  fullName: string
  title: string
  tagline: string | null
  avatarUrl: string | null
  resumeUrl: string | null
  initials: string
}

export function HeroSectionAnimated({
  fullName,
  title,
  tagline,
  avatarUrl,
  resumeUrl,
  initials,
}: HeroSectionAnimatedProps) {
  return (
    <section
      id="hero"
      className="min-h-[calc(100vh-3.5rem)] flex items-center"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Text content */}
          <motion.div
            className="order-2 md:order-1 text-center md:text-left"
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              variants={heroItemVariants}
            >
              {fullName}
            </motion.h1>
            <motion.p
              className="mt-4 text-xl md:text-2xl text-muted-foreground"
              variants={heroItemVariants}
            >
              {title}
            </motion.p>
            {tagline && (
              <motion.p
                className="mt-3 text-lg text-muted-foreground/80"
                variants={heroItemVariants}
              >
                {tagline}
              </motion.p>
            )}
            <motion.div
              className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
              variants={heroItemVariants}
            >
              {resumeUrl && (
                <Button variant="default" size="lg" className="gap-2" nativeButton={false} render={<a href={resumeUrl} download />}>
                  <Download className="size-4" />
                  Download Resume
                </Button>
              )}
              <Button variant="outline" size="lg" className="gap-2" nativeButton={false} render={<a href="#contact" />}>
                <Mail className="size-4" />
                Contact Me
              </Button>
            </motion.div>
          </motion.div>

          {/* Profile photo */}
          <motion.div
            className="order-1 md:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                width={400}
                height={400}
                priority
                className="rounded-lg aspect-square object-cover"
              />
            ) : (
              <div className="w-[400px] h-[400px] max-w-full aspect-square rounded-lg bg-muted flex items-center justify-center">
                <span className="text-6xl font-bold text-muted-foreground">
                  {initials}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
