import type { Service } from "@/lib/types/pacs"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Sprout, Wheat, TrendingUp, LinkIcon } from "lucide-react"
import Link from "next/link"

interface Template2ServicesProps {
  services: Service[]
  pacsSlug: string
}

const iconMap: Record<string, any> = {
  leaf: Leaf,
  sprout: Sprout,
  wheat: Wheat,
  trending: TrendingUp,
}

export function Template2Services({ services, pacsSlug }: Template2ServicesProps) {
  if (services.length === 0) return null

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive agricultural support services for our farming community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon_name || "leaf"] || Leaf
            return (
              <Link key={service.id} href={`/${pacsSlug}/service/${service.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-blue-400 h-full cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.service_name}
                    </h3>

                    <p className="text-slate-600 line-clamp-3">{service.service_description}</p>

                    <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                      Learn more
                      <LinkIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
