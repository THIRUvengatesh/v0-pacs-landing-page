import type { PACS } from "@/lib/types/pacs"
import Image from "next/image"
import { MapPin, Phone, Mail, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Template2HeroProps {
  pacs: PACS
}

export function Template2Hero({ pacs }: Template2HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6 z-10">
            {pacs.logo_url && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-3">
                <Image
                  src={pacs.logo_url || "/placeholder.svg"}
                  alt={pacs.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">{pacs.name}</h1>

            <p className="text-xl text-blue-100 text-pretty">
              {pacs.description || "Empowering farmers through cooperative agriculture"}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-blue-100">
                <MapPin className="h-5 w-5" />
                <span>
                  {pacs.district}
                  {pacs.state ? `, ${pacs.state}` : ""}
                </span>
              </div>
              {pacs.established_year && (
                <div className="flex items-center gap-2 text-blue-100">
                  <Calendar className="h-5 w-5" />
                  <span>Est. {pacs.established_year}</span>
                </div>
              )}
              {pacs.member_count && (
                <div className="flex items-center gap-2 text-blue-100">
                  <Users className="h-5 w-5" />
                  <span>{pacs.member_count.toLocaleString()} Members</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {pacs.phone && (
                <Button className="bg-white text-blue-900 hover:bg-blue-50">
                  <Phone className="h-4 w-4 mr-2" />
                  {pacs.phone}
                </Button>
              )}
              {pacs.email && (
                <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
              )}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={
                pacs.header_background_url ||
                pacs.cover_image_url ||
                "/placeholder.svg?height=500&width=600&query=modern cooperative agriculture"
              }
              alt={`${pacs.name} cover`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="rgb(248 250 252)"
          />
        </svg>
      </div>
    </section>
  )
}
