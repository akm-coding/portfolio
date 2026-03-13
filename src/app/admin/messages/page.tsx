import { getMessages, getUnreadMessageCount } from '@/lib/queries/messages'
import { MessageRow } from '@/components/admin/message-row'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function MessagesPage() {
  const [messages, unreadCount] = await Promise.all([
    getMessages(),
    getUnreadMessageCount(),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        Messages{' '}
        {unreadCount > 0 && (
          <span className="text-lg font-normal text-muted-foreground">
            ({unreadCount} unread)
          </span>
        )}
      </h1>

      {messages.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          No messages yet. Messages from the contact form will appear here.
        </p>
      ) : (
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <MessageRow key={message.id} message={message} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
