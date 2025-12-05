"use client"

import type { PACS } from "@/lib/types/pacs"
import { useEffect, useRef } from "react"

interface MapSectionProps {
  pacs: PACS
}

export function MapSection({ pacs }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current || !pacs.latitude || !pacs.longitude) return

    // Create iframe for embedded map
    const iframe = document.createElement("iframe")
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.style.border = "0"
    iframe.loading = "lazy"
    iframe.referrerPolicy = "no-referrer-when-downgrade"
    iframe.src = `https://www.google.com/maps/embed/v1/place?key=&q=${pacs.latitude},${pacs.longitude}&zoom=15`

    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(iframe)
  }, [pacs.latitude, pacs.longitude])

  if (!pacs.latitude || !pacs.longitude) return null

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">Find Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">Visit us at our location</p>
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg h-[400px] md:h-[500px]" ref={mapRef}>
          {/* Map will be inserted here via JavaScript */}
          <div className="w-full h-full bg-green-50 flex items-center justify-center">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
    </section>
  )
}
