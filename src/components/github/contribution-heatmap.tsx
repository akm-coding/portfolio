'use client'

import { useState, useEffect } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import { useTheme } from 'next-themes'
import 'react-activity-calendar/tooltips.css'

const greenTheme = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
}

interface ContributionHeatmapProps {
  activities: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>
}

export function ContributionHeatmap({ activities }: ContributionHeatmapProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[160px]" />
  }

  return (
    <div className="overflow-x-auto">
      <ActivityCalendar
        data={activities}
        theme={greenTheme}
        colorScheme={(resolvedTheme as 'light' | 'dark') ?? 'light'}
        showTotalCount={false}
        showColorLegend={true}
        showWeekdayLabels={false}
        tooltips={{
          activity: {
            text: (activity) => {
              if (activity.count === 0) {
                return `No contributions on ${formatDate(activity.date)}`
              }
              return `${activity.count} contribution${activity.count !== 1 ? 's' : ''} on ${formatDate(activity.date)}`
            },
          },
        }}
      />
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
