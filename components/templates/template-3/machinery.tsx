import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tractor, IndianRupee } from "lucide-react"
import type { Machinery } from "@/lib/types/pacs"

interface Template3MachineryProps {
  machinery: Machinery[]
}

export function Template3Machinery({ machinery }: Template3MachineryProps) {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Machinery Rental
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Modern equipment available for rent at affordable rates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {machinery.map((item) => (
            <Card
              key={item.id}
              className="group backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <CardContent className="p-8">
                <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <Tractor className="text-white" size={32} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{item.machinery_name}</h3>

                {item.description && <p className="text-purple-200 mb-4 leading-relaxed">{item.description}</p>}

                <div className="flex items-center gap-4 mb-4">
                  {item.rental_rate_per_day && (
                    <div className="flex items-center gap-2">
                      <IndianRupee className="text-pink-300" size={20} />
                      <span className="text-white font-bold">₹{item.rental_rate_per_day}/day</span>
                    </div>
                  )}
                </div>

                {item.is_available ? (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-white/10 text-purple-200">
                    Currently Rented
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
