import { CardContent } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { HeroSection } from "@/components/pacs/hero-section"
import { ContactCard } from "@/components/pacs/contact-card"
import { ServicesSection } from "@/components/pacs/services-section"
import { MachinerySection } from "@/components/pacs/machinery-section"
import { ManagementSection } from "@/components/pacs/management-section"
import { GallerySection } from "@/components/pacs/gallery-section"
import { AboutSection } from "@/components/pacs/about-section"
import { MapSection } from "@/components/pacs/map-section"
import { CTASection } from "@/components/pacs/cta-section"
import { Footer } from "@/components/pacs/footer"
import type { PACSWithRelations } from "@/lib/types/pacs"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PACSPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch PACS data
  const { data: pacs, error } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  if (error || !pacs) {
    notFound()
  }

  const [servicesRes, machineryRes, galleryRes, loansRes] = await Promise.all([
    supabase
      .from("pacs_services")
      .select("*")
      .eq("pacs_id", pacs.id)
      .eq("is_visible", true)
      .order("created_at", { ascending: true }),
    supabase.from("pacs_machinery").select("*").eq("pacs_id", pacs.id).order("machinery_name", { ascending: true }),
    supabase.from("pacs_gallery").select("*").eq("pacs_id", pacs.id).order("display_order", { ascending: true }),
    supabase
      .from("pacs_loan_schemes")
      .select("*")
      .eq("pacs_id", pacs.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
  ])

  const pacsData: PACSWithRelations = {
    ...pacs,
    services: servicesRes.data || [],
    machinery: machineryRes.data || [],
    gallery: galleryRes.data || [],
  }

  const loanSchemes = loansRes.data || []
  const loanSchemesCount = loansRes.data?.length || 0

  return (
    <main className="min-h-screen bg-white">
      <HeroSection pacs={pacsData} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-0">
            {pacsData.services && pacsData.services.length > 0 && (
              <div className="-mx-6">
                <ServicesSection services={pacsData.services} pacsSlug={slug} loanSchemesCount={loanSchemesCount} />
              </div>
            )}

            {loanSchemes.length > 0 && (
              <section className="py-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-green-900 mb-3">Available Loan Schemes</h2>
                  <p className="text-muted-foreground">
                    Explore our agricultural loan schemes with competitive interest rates and flexible repayment options
                  </p>
                </div>

                <div className="grid gap-6">
                  {loanSchemes.map((loan) => (
                    <Card key={loan.id} className="border-green-100 hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-green-900">{loan.scheme_name}</CardTitle>
                        {loan.description && (
                          <CardDescription className="text-base">{loan.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <span className="text-sm font-medium text-green-900">Interest Rate</span>
                              <span className="text-lg font-bold text-green-600">{loan.interest_rate}%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-700">Loan Amount</span>
                              <span className="text-base font-semibold text-gray-900">
                                ₹{loan.min_amount?.toLocaleString()} - ₹{loan.max_amount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <span className="text-sm font-medium text-blue-900">Tenure</span>
                              <span className="text-base font-semibold text-blue-700">
                                {loan.min_tenure} - {loan.max_tenure} months
                              </span>
                            </div>
                            {loan.processing_fee && (
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Processing Fee</span>
                                <span className="text-base font-semibold text-gray-900">{loan.processing_fee}%</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {loan.eligibility_criteria && (
                          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <h4 className="text-sm font-semibold text-amber-900 mb-2">Eligibility Criteria</h4>
                            <p className="text-sm text-amber-800">{loan.eligibility_criteria}</p>
                          </div>
                        )}

                        {loan.required_documents && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">Required Documents</h4>
                            <p className="text-sm text-blue-800">{loan.required_documents}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <ContactCard pacs={pacsData} />
            </div>
          </div>
        </div>
      </div>

      {pacsData.machinery && pacsData.machinery.length > 0 && <MachinerySection machinery={pacsData.machinery} />}

      <ManagementSection pacs={pacsData} />

      {pacsData.gallery && pacsData.gallery.length > 0 && <GallerySection gallery={pacsData.gallery} />}

      <AboutSection pacs={pacsData} />

      <MapSection pacs={pacsData} />

      <CTASection pacs={pacsData} />

      <Footer pacs={pacsData} />
    </main>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pacs } = await supabase
    .from("pacs")
    .select("name, district, state, description")
    .eq("slug", slug)
    .single()

  if (!pacs) {
    return {
      title: "PACS Not Found",
    }
  }

  return {
    title: `${pacs.name} – Primary Agricultural Cooperative Society`,
    description:
      pacs.description ||
      `${pacs.name} in ${pacs.district} - A trusted Primary Agricultural Cooperative Society serving local farmers with essential services and financial support.`,
  }
}
