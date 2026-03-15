'use client'

import { useRef, useEffect } from 'react'
import { useInView, useMotionValue, useTransform, animate } from 'motion/react'

function CountUp({ to, isInView }: { to: number; isInView: boolean }) {
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
        spanRef.current.textContent = String(latest)
      }
    })
    return unsubscribe
  }, [rounded])

  return <span ref={spanRef} className="font-semibold text-foreground">0</span>
}

export function GitHubStatsRow({
  totalContributions,
  totalRepos,
  totalStars,
}: {
  totalContributions: number
  totalRepos: number
  totalStars: number
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(rowRef, { once: true, margin: '-100px' })

  return (
    <div ref={rowRef} className="py-6 text-center text-sm text-muted-foreground">
      <CountUp to={totalContributions} isInView={isInView} />{' '}
      contributions{' '}
      <span aria-hidden="true">&middot;</span>{' '}
      <CountUp to={totalRepos} isInView={isInView} />{' '}
      repos{' '}
      <span aria-hidden="true">&middot;</span>{' '}
      <CountUp to={totalStars} isInView={isInView} />{' '}
      stars
    </div>
  )
}
