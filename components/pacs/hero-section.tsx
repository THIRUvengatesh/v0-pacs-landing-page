import type { PACS } from "@/lib/types/pacs"
import Image from "next/image"
import { MapPin } from "lucide-react"

interface HeroSectionProps {
  pacs: PACS
}

export function HeroSection({ pacs }: HeroSectionProps) {
  return (
    <section className="relative w-full">
      {/* Cover Image */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <Image
          src={
            pacs.cover_image_url ||
            "/placeholder.svg?height=400&width=1200&query=agricultural cooperative society building"
          }
          alt={`${pacs.name} cover`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-balance">{pacs.name}</h1>
            <div className="flex items-center gap-2 text-sm md:text-base mb-3 text-white/90">
              <MapPin className="h-4 w-4" />
              <span>
                {pacs.district}
                {pacs.state ? `, ${pacs.state}` : ""}
              </span>
            </div>
            <p className="text-sm md:text-base max-w-3xl text-white/90 text-pretty">
              {pacs.description ||
                "A trusted Primary Agricultural Cooperative Society serving local farmers with essential services and financial support."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
