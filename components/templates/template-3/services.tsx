"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sprout, TrendingUp, Users, Wallet, HandCoins, PiggyBank } from "lucide-react"
import Link from "next/link"
import type { Service } from "@/lib/types/pacs"

interface Template3ServicesProps {
  services: Service[]
  pacsSlug: string
  loanSchemesCount?: number
  depositSchemesCount?: number
}

const defaultIcons = [Sprout, TrendingUp, Users, Wallet]

export function Template3Services({
  services,
  pacsSlug,
  loanSchemesCount = 0,
  depositSchemesCount = 0,
}: Template3ServicesProps) {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Comprehensive solutions designed to support and empower our farming community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = defaultIcons[index % defaultIcons.length]

            return (
              <Link key={service.id} href={`/${pacsSlug}/service/${service.id}`}>
                <Card className="group relative backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden h-full">
                  {/* Animated gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500" />

                  <CardContent className="p-8 relative z-10">
                    <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="text-white" size={32} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                      {service.service_name}
                    </h3>

                    <p className="text-purple-200 leading-relaxed line-clamp-3">{service.service_description}</p>

                    <div className="mt-6 text-pink-300 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                      Learn More →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}

          {loanSchemesCount > 0 && (
            <Link href={`/${pacsSlug}/loans`}>
              <Card className="group relative backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500" />

                <CardContent className="p-8 relative z-10">
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-500">
                    <HandCoins className="text-white" size={32} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                    Loans
                  </h3>

                  <p className="text-purple-200 leading-relaxed line-clamp-3">
                    {loanSchemesCount} loan scheme{loanSchemesCount !== 1 ? "s" : ""} available with competitive
                    interest rates and flexible repayment options
                  </p>

                  <div className="mt-6 text-pink-300 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                    View Schemes →
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {depositSchemesCount > 0 && (
            <Link href={`/${pacsSlug}/deposits`}>
              <Card className="group relative backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-500" />

                <CardContent className="p-8 relative z-10">
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-500">
                    <PiggyBank className="text-white" size={32} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors">
                    Savings & Deposits
                  </h3>

                  <p className="text-purple-200 leading-relaxed line-clamp-3">
                    {depositSchemesCount} deposit scheme{depositSchemesCount !== 1 ? "s" : ""} available with attractive
                    interest rates and flexible terms
                  </p>

                  <div className="mt-6 text-green-300 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                    View Schemes →
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
