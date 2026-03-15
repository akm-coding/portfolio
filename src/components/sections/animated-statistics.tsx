'use client'

import { useRef, useEffect } from 'react'
import { useInView, useMotionValue, useTransform, animate } from 'motion/react'
import type { Statistic } from '@/lib/types/database'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

function CountUp({
  to,
  suffix,
  isInView,
}: {
  to: number
  suffix: string | null
  isInView: boolean
}) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    if (isInView) {
      animate(motionValue, to, { duration: 3, ease: 'easeOut' })
    }
  }, [isInView, motionValue, to])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = `${latest}${suffix || ''}`
      }
    })
    return unsubscribe
  }, [rounded, suffix])

  return (
    <span ref={spanRef}>
      0{suffix || ''}
    </span>
  )
}

export function AnimatedStatistics({
  statistics,
}: {
  statistics: Statistic[]
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center border rounded-lg p-6 shadow-sm"
            >
              <DynamicIcon
                name={stat.icon_name}
                size={36}
                className="text-primary mb-3"
              />
              <div className="text-3xl font-bold mb-1">
                <CountUp
                  to={stat.value}
                  suffix={stat.suffix}
                  isInView={isInView}
                />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
