"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ArrowLeft, Store, MapPin, Phone, User, Clock, Package } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface PDSShop {
  id: string
  shop_name: string
  shop_code: string | null
  address: string
  contact_person: string | null
  contact_phone: string | null
  operating_hours: string | null
  commodities_available: string[] | null
  license_number: string | null
  latitude: number | null
  longitude: number | null
}

interface PACS {
  id: string
  name: string
  slug: string
}

interface PDSShopsPageClientProps {
  pacs: PACS
  pdsShops: PDSShop[]
}

export default function PDSShopsPageClient({ pacs, pdsShops }: PDSShopsPageClientProps) {
  const [selectedShop, setSelectedShop] = useState<PDSShop | null>(null)

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href={`/${pacs.slug}`}>
            <Button variant="ghost" className="mb-4 text-green-700 hover:text-green-900 hover:bg-green-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {pacs.name}
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">PDS Shops</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Public Distribution System shops managed by {pacs.name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {pdsShops.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Store className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-muted-foreground">No PDS shops available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdsShops.map((shop) => (
              <Card
                key={shop.id}
                className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedShop(shop)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                      <Store className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-green-900 mb-1">{shop.shop_name}</h3>
                      {shop.shop_code && (
                        <p className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded inline-block">
                          Code: {shop.shop_code}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{shop.address}</span>
                    </div>

                    {shop.contact_person && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4 shrink-0" />
                        <span>{shop.contact_person}</span>
                      </div>
                    )}

                    {shop.contact_phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{shop.contact_phone}</span>
                      </div>
                    )}

                    {shop.operating_hours && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{shop.operating_hours}</span>
                      </div>
                    )}
                  </div>

                  {shop.commodities_available && shop.commodities_available.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-700 mb-2">Available Commodities:</p>
                      <div className="flex flex-wrap gap-1">
                        {shop.commodities_available.slice(0, 3).map((commodity, index) => (
                          <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                            {commodity}
                          </span>
                        ))}
                        {shop.commodities_available.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{shop.commodities_available.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <span className="text-xs text-green-600 font-medium">Click for full details</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Shop Details Dialog */}
      <Dialog open={!!selectedShop} onOpenChange={(open) => !open && setSelectedShop(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedShop && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-green-900 flex items-center gap-2">
                  <Store className="h-7 w-7 text-orange-600" />
                  {selectedShop.shop_name}
                </DialogTitle>
                {selectedShop.shop_code && (
                  <DialogDescription className="text-base pt-2">
                    Shop Code: <span className="font-semibold text-orange-600">{selectedShop.shop_code}</span>
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Address */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Address
                  </h4>
                  <p className="text-sm text-green-800">{selectedShop.address}</p>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedShop.contact_person && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Contact Person
                      </h4>
                      <p className="text-sm text-blue-800">{selectedShop.contact_person}</p>
                    </div>
                  )}

                  {selectedShop.contact_phone && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Phone className="h-5 w-5 text-blue-600" />
                        Phone Number
                      </h4>
                      <p className="text-sm text-blue-800">{selectedShop.contact_phone}</p>
                    </div>
                  )}
                </div>

                {/* Operating Hours */}
                {selectedShop.operating_hours && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      Operating Hours
                    </h4>
                    <p className="text-sm text-amber-800">{selectedShop.operating_hours}</p>
                  </div>
                )}

                {/* Commodities */}
                {selectedShop.commodities_available && selectedShop.commodities_available.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-600" />
                      Available Commodities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedShop.commodities_available.map((commodity, index) => (
                        <span
                          key={index}
                          className="text-sm bg-white text-green-700 px-3 py-2 rounded-lg border border-green-300 font-medium"
                        >
                          {commodity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* License Number */}
                {selectedShop.license_number && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">License Number</h4>
                    <p className="text-sm text-gray-800 font-mono">{selectedShop.license_number}</p>
                  </div>
                )}

                {/* Map Link */}
                {selectedShop.latitude && selectedShop.longitude && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Location</h4>
                    <a
                      href={`https://www.google.com/maps?q=${selectedShop.latitude},${selectedShop.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => setSelectedShop(null)}
                    variant="outline"
                    className="flex-1 border-green-200 hover:bg-green-50"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
