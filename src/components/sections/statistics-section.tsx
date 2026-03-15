import { getStatistics } from '@/lib/queries/statistics'
import { AnimatedStatistics } from './animated-statistics'

export async function StatisticsSection() {
  const statistics = await getStatistics()

  if (statistics.length === 0) {
    return null
  }

  return <AnimatedStatistics statistics={statistics} />
}
