"use client"

import type { PACS } from "@/lib/types/pacs"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Mail } from "lucide-react"

interface CTASectionProps {
  pacs: PACS
}

export function CTASection({ pacs }: CTASectionProps) {
  const handleCall = () => {
    if (pacs.phone) window.location.href = `tel:${pacs.phone}`
  }

  const handleMap = () => {
    if (pacs.map_url) {
      window.open(pacs.map_url, "_blank")
    } else if (pacs.latitude && pacs.longitude) {
      window.open(`https://maps.google.com/?q=${pacs.latitude},${pacs.longitude}`, "_blank")
    }
  }

  const handleEmail = () => {
    if (pacs.email) window.location.href = `mailto:${pacs.email}`
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-green-600 to-green-700">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-green-50 mb-8 max-w-2xl mx-auto text-balance">
          Contact us today to learn more about our services and how we can support your agricultural needs
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {pacs.phone && (
            <Button
              onClick={handleCall}
              size="lg"
              variant="secondary"
              className="bg-white text-green-700 hover:bg-green-50"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Now
            </Button>
          )}

          {(pacs.map_url || (pacs.latitude && pacs.longitude)) && (
            <Button
              onClick={handleMap}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <MapPin className="h-5 w-5 mr-2" />
              View on Map
            </Button>
          )}

          {pacs.email && (
            <Button
              onClick={handleEmail}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Mail className="h-5 w-5 mr-2" />
              Send Email
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
