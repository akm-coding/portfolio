import { getProjects } from '@/lib/queries/projects'
import { getExperiences } from '@/lib/queries/experiences'
import { getMessages, getUnreadMessageCount } from '@/lib/queries/messages'
import { StatCard } from '@/components/admin/stat-card'
import { FolderKanban, Briefcase, MessageSquare } from 'lucide-react'

export default async function AdminDashboard() {
  const [projects, experiences, unreadCount, messages] = await Promise.all([
    getProjects(),
    getExperiences(),
    getUnreadMessageCount(),
    getMessages(),
  ])

  const unreadMessages = messages.filter((m) => !m.is_read).slice(0, 5)

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <StatCard
          title="Total Experience"
          value={experiences.length}
          icon={<Briefcase className="h-5 w-5" />}
        />
        <StatCard
          title="Unread Messages"
          value={unreadCount}
          icon={<MessageSquare className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight">
          Recent Unread Messages
        </h2>

        {unreadMessages.length === 0 ? (
          <p className="mt-4 text-muted-foreground">
            All caught up! No unread messages.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {unreadMessages.map((msg) => {
              const truncated =
                msg.message.length > 100
                  ? msg.message.slice(0, 100) + '...'
                  : msg.message
              const relativeDate = getRelativeDate(msg.created_at)

              return (
                <div
                  key={msg.id}
                  className="rounded-lg border bg-card p-4 text-card-foreground"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                      <span className="font-medium">{msg.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {msg.email}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {relativeDate}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {truncated}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function getRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
