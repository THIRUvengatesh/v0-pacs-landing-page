import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
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

const RESERVED_ROUTES = ["admin", "api", "auth", "super-admin", "login", "loans"]

export default async function PACSPage({ params }: PageProps) {
  const { slug } = await params

  if (RESERVED_ROUTES.includes(slug)) {
    redirect(`/${slug}`)
    return null
  }

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

  const loanSchemesCount = loansRes.data?.length || 0

  return (
    <main className="min-h-screen bg-white">
      <HeroSection pacs={pacsData} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-0">
            {pacsData.services && pacsData.services.length > 0 && (
              <div className="-mx-6">
                <ServicesSection
                  services={pacsData.services}
                  pacsSlug={slug}
                  loanSchemesCount={loanSchemesCount}
                  loans={loansRes.data || []}
                />
              </div>
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
