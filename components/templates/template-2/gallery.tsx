import type { GalleryImage } from "@/lib/types/pacs"
import Image from "next/image"

interface Template2GalleryProps {
  gallery: GalleryImage[]
  pacsName: string
}

export function Template2Gallery({ gallery, pacsName }: Template2GalleryProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Gallery</h2>
          <p className="text-xl text-slate-600">Moments from our cooperative community</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((image, index) => (
            <div key={image.id} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer">
              <Image
                src={image.image_url || "/placeholder.svg"}
                alt={image.caption || `${pacsName} gallery ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {image.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
