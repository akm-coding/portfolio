import type { Variants, Transition } from "motion/react"

// Shared animation variants for scroll-reveal sections
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Stagger container for generic lists
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

// Stagger item for generic lists
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
}

// Hero-specific stagger (slower, more dramatic)
export const heroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

// Default transition for scroll-reveal
export const defaultTransition: Transition = {
  duration: 0.4,
  ease: "easeOut",
}

// Default viewport config (play once, trigger slightly before visible)
export const defaultViewport = {
  once: true,
  margin: "-100px" as const,
}
