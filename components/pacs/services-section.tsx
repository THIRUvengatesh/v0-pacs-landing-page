"use client"

import type React from "react"
import type { PACSService } from "@/lib/types/pacs"
import { Card, CardContent } from "@/components/ui/card"
import { Banknote, Sprout, Truck, PiggyBank, ShoppingCart, Leaf, ArrowRight, HandCoins, Store } from "lucide-react"
import Link from "next/link"

interface ServicesSectionProps {
  services: PACSService[]
  pacsSlug: string
  loanSchemesCount?: number
  depositSchemesCount?: number
  pdsShopsCount?: number // Add pdsShopsCount prop
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Banknote,
  Sprout,
  Truck,
  PiggyBank,
  ShoppingCart,
  Leaf,
}

export function ServicesSection({
  services,
  pacsSlug,
  loanSchemesCount = 0,
  depositSchemesCount = 0,
  pdsShopsCount = 0, // Add pdsShopsCount
}: ServicesSectionProps) {
  const getIcon = (iconName: string | null) => {
    if (!iconName) return Leaf
    return iconMap[iconName] || Leaf
  }

  return (
    <section className="py-12 md:py-16 bg-green-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Comprehensive agricultural support services designed to empower farmers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = getIcon(service.icon_name)
            return (
              <Link key={service.id} href={`/${pacsSlug}/service/${service.id}`}>
                <Card className="border-green-100 hover:shadow-lg hover:border-green-300 transition-all duration-300 h-full cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg shrink-0 group-hover:bg-green-200 transition-colors">
                        <Icon className="h-6 w-6 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                          {service.service_name}
                        </h3>
                        <p className="text-sm text-muted-foreground text-pretty mb-3">{service.service_description}</p>
                        <div className="flex items-center text-sm text-green-600 font-medium group-hover:text-green-700">
                          Learn more
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}

          {loanSchemesCount > 0 && (
            <Link href={`/${pacsSlug}/loans`}>
              <Card className="border-green-100 hover:shadow-lg hover:border-green-300 transition-all duration-300 h-full cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg shrink-0 group-hover:bg-green-200 transition-colors">
                      <HandCoins className="h-6 w-6 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                        Loans
                      </h3>
                      <p className="text-sm text-muted-foreground text-pretty mb-3">
                        {loanSchemesCount} loan scheme{loanSchemesCount !== 1 ? "s" : ""} available with competitive
                        interest rates and flexible repayment options
                      </p>
                      <div className="flex items-center text-sm text-green-600 font-medium group-hover:text-green-700">
                        View schemes
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {depositSchemesCount > 0 && (
            <Link href={`/${pacsSlug}/deposits`}>
              <Card className="border-green-100 hover:shadow-lg hover:border-green-300 transition-all duration-300 h-full cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg shrink-0 group-hover:bg-green-200 transition-colors">
                      <PiggyBank className="h-6 w-6 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                        Savings & Deposits
                      </h3>
                      <p className="text-sm text-muted-foreground text-pretty mb-3">
                        {depositSchemesCount} deposit scheme{depositSchemesCount !== 1 ? "s" : ""} available with
                        attractive interest rates and flexible terms
                      </p>
                      <div className="flex items-center text-sm text-green-600 font-medium group-hover:text-green-700">
                        View schemes
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {pdsShopsCount > 0 && (
            <Link href={`/${pacsSlug}/pds-shops`}>
              <Card className="border-green-100 hover:shadow-lg hover:border-green-300 transition-all duration-300 h-full cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg shrink-0 group-hover:bg-orange-200 transition-colors">
                      <Store className="h-6 w-6 text-orange-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                        PDS Shops
                      </h3>
                      <p className="text-sm text-muted-foreground text-pretty mb-3">
                        {pdsShopsCount} PDS shop{pdsShopsCount !== 1 ? "s" : ""} providing essential commodities through
                        the Public Distribution System
                      </p>
                      <div className="flex items-center text-sm text-green-600 font-medium group-hover:text-green-700">
                        View shops
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
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
