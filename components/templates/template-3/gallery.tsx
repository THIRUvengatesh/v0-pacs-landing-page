"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import type { GalleryItem } from "@/lib/types/pacs"

interface Template3GalleryProps {
  gallery: GalleryItem[]
  pacsName: string
}

export function Template3Gallery({ gallery, pacsName }: Template3GalleryProps) {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            Gallery
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">Moments that define our journey and impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.map((item) => (
            <Card
              key={item.id}
              className="group backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={item.image_url || "/placeholder.svg?height=400&width=600"}
                  alt={item.caption || `${pacsName} gallery image`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              {item.caption && (
                <div className="p-6">
                  <p className="text-white font-medium">{item.caption}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
