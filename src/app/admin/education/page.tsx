import Link from 'next/link'
import { getEducation } from '@/lib/queries/education'
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
import { EducationActions } from './education-actions'

function formatDateRange(startDate: string, endDate: string | null): string {
  const format = (d: string) => {
    const date = new Date(d + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  const start = startDate ? format(startDate) : ''
  const end = endDate ? format(endDate) : 'Present'
  if (!start) return end
  return `${start} - ${end}`
}

export default async function EducationPage() {
  const education = await getEducation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Education</h1>
        <Button nativeButton={false} render={<Link href="/admin/education/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <p className="text-muted-foreground">No education entries yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {education.map((edu) => (
              <TableRow key={edu.id}>
                <TableCell className="font-medium">{edu.institution}</TableCell>
                <TableCell>{edu.degree}</TableCell>
                <TableCell>{edu.field_of_study ?? '-'}</TableCell>
                <TableCell>{formatDateRange(edu.start_date, edu.end_date)}</TableCell>
                <TableCell>
                  <EducationActions id={edu.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
