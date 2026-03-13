'use client'

import { useState, useTransition } from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { toggleMessageRead, deleteMessage } from '@/actions/messages'
import type { Message } from '@/lib/types/database'
import { Mail, MailOpen, Trash2 } from 'lucide-react'

interface MessageRowProps {
  message: Message
}

export function MessageRow({ message }: MessageRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleRowClick() {
    const willExpand = !expanded
    setExpanded(willExpand)

    if (willExpand && !message.is_read) {
      startTransition(() => {
        toggleMessageRead(message.id, true)
      })
    }
  }

  function handleToggleRead(e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(() => {
      toggleMessageRead(message.id, !message.is_read)
    })
  }

  function handleDelete() {
    startTransition(() => {
      deleteMessage(message.id)
    })
  }

  const formattedDate = new Date(message.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={handleRowClick}
      >
        <TableCell>
          <div className="flex items-center gap-2">
            {!message.is_read && (
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            )}
            <span className={message.is_read ? '' : 'font-bold'}>
              {message.name}
            </span>
          </div>
        </TableCell>
        <TableCell>{message.email}</TableCell>
        <TableCell>{formattedDate}</TableCell>
      </TableRow>

      {expanded && (
        <TableRow>
          <TableCell colSpan={3} className="p-0">
            <div className="bg-muted/50 px-6 py-4 space-y-4">
              <p className="whitespace-pre-wrap text-sm">{message.message}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleRead}
                  disabled={isPending}
                >
                  {message.is_read ? (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <MailOpen className="mr-2 h-4 w-4" />
                      Mark Read
                    </>
                  )}
                </Button>
                <DeleteDialog
                  title="Delete message?"
                  description="This will permanently delete this message. This action cannot be undone."
                  onConfirm={handleDelete}
                  isPending={isPending}
                >
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </DeleteDialog>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
