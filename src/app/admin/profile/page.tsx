import { getProfile } from '@/lib/queries/profile'
import { ProfileForm } from '@/components/admin/profile-form'

export default async function AdminProfilePage() {
  const profile = await getProfile()

  if (!profile) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">
          No profile found. Please create a profile in the database first.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  )
}
