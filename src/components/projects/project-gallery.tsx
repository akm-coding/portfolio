"use client"

import { useState } from "react"
import Image from "next/image"

import type { ProjectImage } from "@/lib/types/database"

export function ProjectGallery({
  images,
  projectTitle,
}: {
  images: ProjectImage[]
  projectTitle: string
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return null
  }

  const currentImage = images[selectedIndex]

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
        <Image
          src={currentImage.image_url}
          alt={
            currentImage.alt_text ??
            `${projectTitle} screenshot ${selectedIndex + 1}`
          }
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show screenshot ${index + 1}`}
              aria-current={index === selectedIndex}
              className={`relative shrink-0 overflow-hidden rounded-lg border bg-muted transition-opacity ${
                index === selectedIndex
                  ? "ring-2 ring-primary"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image.image_url}
                alt={
                  image.alt_text ??
                  `${projectTitle} thumbnail ${index + 1}`
                }
                width={120}
                height={80}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
