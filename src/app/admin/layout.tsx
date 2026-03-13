import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { getUnreadMessageCount } from '@/lib/queries/messages'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const unreadCount = await getUnreadMessageCount()

  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <AdminSidebar unreadCount={unreadCount} />
      <main className="flex-1 p-6 md:ml-64">
        {children}
      </main>
    </div>
  )
}
