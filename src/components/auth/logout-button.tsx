'use client'

import { logout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (confirmed) {
      await logout()
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Log out
    </Button>
  )
}
