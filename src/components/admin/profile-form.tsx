'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import { updateProfile } from '@/actions/profile'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/image-upload'
import type { Profile } from '@/lib/types/database'

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const prevStateRef = useRef(state)

  useEffect(() => {
    if (state === prevStateRef.current) return
    prevStateRef.current = state

    if (state?.error) {
      toast.error(state.error)
    } else if (state === null && !isPending) {
      // state reset to null after successful submission (no error returned)
    }
  }, [state, isPending])

  // Detect successful save: state transitions from non-null back to null
  // Since updateProfile returns null on success, we track submissions
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    if (hasSubmitted && state === null && !isPending) {
      toast.success('Profile saved successfully!')
      setHasSubmitted(false)
    }
    if (state?.error) {
      setHasSubmitted(false)
    }
  }, [state, isPending, hasSubmitted])

  return (
    <form
      action={formAction}
      onSubmit={() => setHasSubmitted(true)}
      className="max-w-2xl space-y-8"
    >
      <input type="hidden" name="id" value={profile.id} />
      <input type="hidden" name="avatar_url" value={avatarUrl} />

      {/* Personal Info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Personal Info</legend>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            name="full_name"
            required
            defaultValue={profile.full_name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={profile.title}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            name="tagline"
            defaultValue={profile.tagline || ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={6}
            defaultValue={profile.bio || ''}
          />
        </div>

        <div className="space-y-2">
          <Label>Avatar Photo</Label>
          <ImageUpload
            bucket="portfolio"
            folder="avatars"
            currentUrl={profile.avatar_url}
            onUpload={setAvatarUrl}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume_url">Resume URL</Label>
          <Input
            id="resume_url"
            name="resume_url"
            defaultValue={profile.resume_url || ''}
            placeholder="https://..."
          />
        </div>
      </fieldset>

      {/* Contact Info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Contact Info</legend>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={profile.email || ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={profile.phone || ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={profile.location || ''}
          />
        </div>
      </fieldset>

      {/* Social Links */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Social Links</legend>

        <div className="space-y-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            name="github_url"
            defaultValue={profile.github_url || ''}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            name="linkedin_url"
            defaultValue={profile.linkedin_url || ''}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </fieldset>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  )
}
