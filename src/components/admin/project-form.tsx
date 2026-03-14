'use client'

import { useActionState, useEffect, useState } from 'react'
import { createProject, updateProject } from '@/actions/projects'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/image-upload'
import { TagInput } from '@/components/admin/tag-input'
import { Plus } from 'lucide-react'
import type { Project, ProjectImage } from '@/lib/types/database'
import Link from 'next/link'

interface ProjectFormProps {
  project?: Project & { project_images: ProjectImage[] }
}

export function ProjectForm({ project }: ProjectFormProps) {
  const action = project ? updateProject.bind(null, project.id) : createProject
  const [state, formAction, isPending] = useActionState(action, null)
  const [tags, setTags] = useState<string[]>(project?.tech_stack || [])
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail_url || '')
  const [imageUrls, setImageUrls] = useState<string[]>(
    project?.project_images?.map((img) => img.image_url) || []
  )
  const [slug, setSlug] = useState(project?.slug || '')

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
    // success redirects via server action
  }, [state])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const addImageSlot = () => {
    setImageUrls((prev) => [...prev, ''])
  }

  const updateImageUrl = (index: number, url: string) => {
    setImageUrls((prev) => {
      const next = [...prev]
      next[index] = url
      return next
    })
  }

  const removeImageSlot = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <input type="hidden" name="tech_stack" value={JSON.stringify(tags)} />
      <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />
      <input
        type="hidden"
        name="project_images"
        value={imageUrls.filter(Boolean).join(',')}
      />
      <input
        type="hidden"
        name="featured"
        value={String(project?.featured ?? false)}
      />

      {/* Basic Info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Basic Info</legend>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={project?.title || ''}
            onBlur={(e) => {
              if (!slug) {
                setSlug(generateSlug(e.target.value))
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-from-title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_description">Short Description</Label>
          <Textarea
            id="short_description"
            name="short_description"
            rows={3}
            defaultValue={project?.short_description || ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_description">Full Description</Label>
          <Textarea
            id="full_description"
            name="full_description"
            rows={8}
            defaultValue={project?.full_description || ''}
          />
        </div>
      </fieldset>

      {/* Tech & Links */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Tech & Links</legend>

        <div className="space-y-2">
          <Label>Tech Stack</Label>
          <TagInput value={tags} onChange={setTags} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            name="github_url"
            defaultValue={project?.github_url || ''}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="live_url">Live URL</Label>
          <Input
            id="live_url"
            name="live_url"
            defaultValue={project?.live_url || ''}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="playstore_url">Play Store URL</Label>
          <Input
            id="playstore_url"
            name="playstore_url"
            defaultValue={project?.playstore_url || ''}
            placeholder="https://play.google.com/store/apps/details?id=..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appstore_url">App Store URL</Label>
          <Input
            id="appstore_url"
            name="appstore_url"
            defaultValue={project?.appstore_url || ''}
            placeholder="https://apps.apple.com/app/..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured_checkbox"
            defaultChecked={project?.featured ?? false}
            onChange={(e) => {
              const hiddenInput = document.querySelector<HTMLInputElement>(
                'input[name="featured"]'
              )
              if (hiddenInput) {
                hiddenInput.value = String(e.target.checked)
              }
            }}
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="featured_checkbox">Featured Project</Label>
        </div>
      </fieldset>

      {/* Images */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Images</legend>

        <div className="space-y-2">
          <Label>Thumbnail</Label>
          <ImageUpload
            bucket="portfolio"
            folder="projects"
            currentUrl={project?.thumbnail_url}
            onUpload={setThumbnailUrl}
          />
        </div>

        <div className="space-y-2">
          <Label>Project Screenshots</Label>
          <div className="space-y-3">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <ImageUpload
                  bucket="portfolio"
                  folder="projects"
                  currentUrl={url || undefined}
                  onUpload={(uploadedUrl) => updateImageUrl(index, uploadedUrl)}
                />
                <button
                  type="button"
                  onClick={() => removeImageSlot(index)}
                  className="absolute top-2 right-2 rounded-full bg-destructive/80 p-1 text-destructive-foreground text-xs hover:bg-destructive"
                >
                  Remove
                </button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addImageSlot}>
              <Plus className="mr-1 h-4 w-4" />
              Add Image
            </Button>
          </div>
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? project
              ? 'Updating...'
              : 'Creating...'
            : project
              ? 'Update Project'
              : 'Create Project'}
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/admin/projects" />}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
