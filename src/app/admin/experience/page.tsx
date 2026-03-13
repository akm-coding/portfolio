import Link from 'next/link'
import { getExperiences } from '@/lib/queries/experiences'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { ExperienceActions } from './experience-actions'

function formatDateRange(startDate: string, endDate: string | null, isCurrent: boolean): string {
  const format = (d: string) => {
    const date = new Date(d + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  const start = format(startDate)
  if (isCurrent) return `${start} - Present`
  if (endDate) return `${start} - ${format(endDate)}`
  return start
}

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Experience</h1>
        <Button nativeButton={false} render={<Link href="/admin/experience/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <p className="text-muted-foreground">No experience entries yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell className="font-medium">{exp.company}</TableCell>
                <TableCell>{exp.role}</TableCell>
                <TableCell>{formatDateRange(exp.start_date, exp.end_date, exp.is_current)}</TableCell>
                <TableCell>
                  <ExperienceActions id={exp.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
