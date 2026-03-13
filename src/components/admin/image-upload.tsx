'use client'

import { useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload } from 'lucide-react'

interface ImageUploadProps {
  bucket: string
  folder: string
  currentUrl?: string | null
  onUpload: (url: string) => void
}

export function ImageUpload({ bucket, folder, currentUrl, onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return

    setUploading(true)
    setPreview(URL.createObjectURL(file))

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: true })

    if (error) {
      console.error('Upload failed:', error.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
    onUpload(urlData.publicUrl)
    setUploading(false)
  }, [bucket, folder, onUpload])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
      onClick={() => !uploading && fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
        ${uploading ? 'pointer-events-none opacity-60' : ''}`}
    >
      {preview ? (
        <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded object-contain" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Upload className="h-8 w-8" />
          <p>Drag & drop or click to upload</p>
        </div>
      )}
      {uploading && (
        <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
