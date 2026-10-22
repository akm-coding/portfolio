"use client"

import { useEffect, useRef } from "react"
import { animate, useInView, useMotionValue, useTransform } from "motion/react"

export function CountUp({
  to,
  suffix,
  duration = 2,
}: {
  to: number
  suffix?: string | null
  duration?: number
}) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(spanRef, { once: true })
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    if (isInView) {
      animate(motionValue, to, { duration, ease: "easeOut" })
    }
  }, [isInView, motionValue, to, duration])

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = `${latest}${suffix || ""}`
      }
    })
    return unsubscribe
  }, [rounded, suffix])

  return (
    <span ref={spanRef} className="tabular-nums">
      0{suffix || ""}
    </span>
  )
}
