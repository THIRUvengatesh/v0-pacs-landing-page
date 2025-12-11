"use client"

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
        <div className="text-center mb-12 animate-fade-in-down">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive agricultural support services for our farming community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon_name || "leaf"] || Leaf
            return (
              <Link key={service.id} href={`/${pacsSlug}/service/${service.id}`}>
                <Card
                  className="group hover:shadow-2xl transition-all duration-500 border-slate-200 hover:border-blue-400 h-full cursor-pointer transform hover:scale-105 hover:-rotate-1 animate-fade-in-scale"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    perspective: "1000px",
                  }}
                >
                  <CardContent className="p-6 space-y-4 relative overflow-hidden">
                    {/* Animated background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
                        <Icon className="h-7 w-7 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        {service.service_name}
                      </h3>

                      <p className="text-slate-600 line-clamp-3">{service.service_description}</p>

                      <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all duration-300">
                        Learn more
                        <LinkIcon className="h-4 w-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
