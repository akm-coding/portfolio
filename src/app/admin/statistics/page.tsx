import { getStatistics, getStatisticById } from '@/lib/queries/statistics'
import { StatisticsList } from '@/components/admin/statistics-list'
import { StatisticForm } from '@/components/admin/statistic-form'

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>
}) {
  const params = await searchParams
  const statistics = await getStatistics()

  // Edit mode
  if (params.edit) {
    const statistic = await getStatisticById(params.edit)
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Edit Statistic</h1>
        {statistic ? (
          <StatisticForm statistic={statistic} />
        ) : (
          <p className="text-muted-foreground">Statistic not found.</p>
        )}
      </div>
    )
  }

  // New mode
  if (params.new) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">New Statistic</h1>
        <StatisticForm />
      </div>
    )
  }

  // Default list view
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <StatisticsList statistics={statistics} />
    </div>
  )
}
