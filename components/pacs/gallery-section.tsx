import type { PACSGallery } from "@/lib/types/pacs"
import Image from "next/image"

interface GallerySectionProps {
  gallery: PACSGallery[]
}

export function GallerySection({ gallery }: GallerySectionProps) {
  if (gallery.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            A glimpse of our facilities and services
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((item) => (
            <div key={item.id} className="relative aspect-[4/3] overflow-hidden rounded-lg group">
              <Image
                src={item.image_url || "/placeholder.svg"}
                alt={item.caption || "PACS Gallery Image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {item.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium">{item.caption}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
