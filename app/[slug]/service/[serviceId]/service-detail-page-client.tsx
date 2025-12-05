"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  User,
  Banknote,
  Sprout,
  Truck,
  PiggyBank,
  ShoppingCart,
  Leaf,
} from "lucide-react"
import type { PACSService, PACS } from "@/lib/types/pacs"
import type React from "react"

interface ServiceDetailPageClientProps {
  pacs: PACS
  service: PACSService
  slug: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Banknote,
  Sprout,
  Truck,
  PiggyBank,
  ShoppingCart,
  Leaf,
}

export default function ServiceDetailPageClient({ pacs, service, slug }: ServiceDetailPageClientProps) {
  const Icon = service.icon_name && iconMap[service.icon_name] ? iconMap[service.icon_name] : Leaf

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-green-700 text-white py-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <Link href={`/${slug}`}>
            <Button variant="ghost" className="text-white hover:bg-green-600 mb-4 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {pacs.name}
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-600 rounded-lg">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">{service.service_name}</h1>
              <p className="text-green-100 mt-1">{pacs.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-900">Service Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.detailed_description ||
                    service.service_description ||
                    "Detailed information about this service."}
                </p>
              </CardContent>
            </Card>

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Key Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Process Steps */}
            {service.process_steps && service.process_steps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-900">How to Apply</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {service.process_steps.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-semibold shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-muted-foreground pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Required Documents */}
            {service.required_documents && service.required_documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.required_documents.map((doc, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full shrink-0" />
                        <span className="text-muted-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Eligibility */}
            {service.eligibility && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900 text-lg">Eligibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.eligibility}</p>
                </CardContent>
              </Card>
            )}

            {/* Fees */}
            {service.fees && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900 text-lg flex items-center gap-2">
                    <Banknote className="h-5 w-5" />
                    Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-green-700">{service.fees}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-green-900 text-lg">Contact for Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.contact_person && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{service.contact_person}</p>
                      <p className="text-xs text-muted-foreground">Contact Person</p>
                    </div>
                  </div>
                )}
                {service.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <a href={`tel:${service.contact_phone}`} className="text-sm hover:text-green-600 transition-colors">
                      {service.contact_phone}
                    </a>
                  </div>
                )}
                {pacs.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <a
                      href={`mailto:${pacs.email}`}
                      className="text-sm hover:text-green-600 transition-colors break-all"
                    >
                      {pacs.email}
                    </a>
                  </div>
                )}
                <div className="pt-4 space-y-2">
                  {service.contact_phone && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => (window.location.href = `tel:${service.contact_phone}`)}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                  )}
                  {pacs.email && (
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                      onClick={() => (window.location.href = `mailto:${pacs.email}`)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* PACS Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-900 text-lg">About This PACS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-green-900">{pacs.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {pacs.district}
                    {pacs.state ? `, ${pacs.state}` : ""}
                  </p>
                </div>
                {pacs.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Main Office</p>
                    <a href={`tel:${pacs.phone}`} className="text-sm hover:text-green-600 transition-colors">
                      {pacs.phone}
                    </a>
                  </div>
                )}
                <Link href={`/${slug}`}>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View Full Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
