"use client"

import type { PACS } from "@/lib/types/pacs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Map } from "lucide-react"

interface ContactCardProps {
  pacs: PACS
}

export function ContactCard({ pacs }: ContactCardProps) {
  const openMap = () => {
    if (pacs.map_url) {
      window.open(pacs.map_url, "_blank")
    } else if (pacs.latitude && pacs.longitude) {
      window.open(`https://maps.google.com/?q=${pacs.latitude},${pacs.longitude}`, "_blank")
    }
  }

  return (
    <Card className="border-green-100">
      <CardHeader>
        <CardTitle className="text-xl text-green-800">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pacs.address && (
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-muted-foreground mb-1">Address</p>
              <p className="text-sm">{pacs.address}</p>
            </div>
          </div>
        )}

        {pacs.phone && (
          <div className="flex gap-3">
            <Phone className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-muted-foreground mb-1">Phone</p>
              <a href={`tel:${pacs.phone}`} className="text-sm hover:text-green-600 transition-colors">
                {pacs.phone}
              </a>
            </div>
          </div>
        )}

        {pacs.email && (
          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-muted-foreground mb-1">Email</p>
              <a href={`mailto:${pacs.email}`} className="text-sm hover:text-green-600 transition-colors break-all">
                {pacs.email}
              </a>
            </div>
          </div>
        )}

        {(pacs.map_url || (pacs.latitude && pacs.longitude)) && (
          <Button
            onClick={openMap}
            variant="outline"
            className="w-full mt-4 border-green-200 hover:bg-green-50 hover:border-green-300 bg-transparent"
          >
            <Map className="h-4 w-4 mr-2" />
            View on Map
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
