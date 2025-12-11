import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import type { PACS } from "@/lib/types/pacs"

interface Template3ContactProps {
  pacs: PACS
}

export function Template3Contact({ pacs }: Template3ContactProps) {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            We're here to help. Reach out to us through any of these channels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pacs.address && (
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mx-auto shadow-lg">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-white font-bold mb-2">Address</h3>
                <p className="text-purple-200 text-sm">{pacs.address}</p>
              </CardContent>
            </Card>
          )}

          {pacs.phone && (
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mx-auto shadow-lg">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="text-white font-bold mb-2">Phone</h3>
                <p className="text-purple-200 text-sm">{pacs.phone}</p>
              </CardContent>
            </Card>
          )}

          {pacs.email && (
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center mx-auto shadow-lg">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="text-white font-bold mb-2">Email</h3>
                <p className="text-purple-200 text-sm">{pacs.email}</p>
              </CardContent>
            </Card>
          )}

          <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center mx-auto shadow-lg">
                <Clock className="text-white" size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Working Hours</h3>
              <p className="text-purple-200 text-sm">Mon - Sat: 9AM - 5PM</p>
            </CardContent>
          </Card>
        </div>

        {pacs.map_url && (
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 overflow-hidden">
            <CardContent className="p-0">
              <iframe
                src={pacs.map_url}
                width="100%"
                height="450"
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
    </section>
  )
}
