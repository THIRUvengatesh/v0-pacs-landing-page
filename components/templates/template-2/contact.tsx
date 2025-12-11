import type { PACS } from "@/lib/types/pacs"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail } from "lucide-react"

interface Template2ContactProps {
  pacs: PACS
}

export function Template2Contact({ pacs }: Template2ContactProps) {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Get In Touch</h2>
            <p className="text-blue-100 text-lg">
              Have questions or need assistance? We're here to help our farming community.
            </p>

            <div className="space-y-4 pt-4">
              {pacs.address && (
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Address</div>
                    <div className="text-blue-100">{pacs.address}</div>
                  </div>
                </div>
              )}

              {pacs.phone && (
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Phone</div>
                    <div className="text-blue-100">{pacs.phone}</div>
                  </div>
                </div>
              )}

              {pacs.email && (
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <div className="text-blue-100">{pacs.email}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {pacs.map_url && (
            <Card className="border-0 overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={pacs.map_url}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
