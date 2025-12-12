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
import type { PACSWithRelations, LoanScheme } from "@/lib/types/pacs"

interface Template1Props {
  pacs: PACSWithRelations
  loanSchemes: LoanScheme[]
  depositSchemes: any[]
  teamMembers?: any[] // Added teamMembers prop
}

export function Template1({ pacs, loanSchemes, depositSchemes, teamMembers = [] }: Template1Props) {
  const loanSchemesCount = loanSchemes.length
  const depositSchemesCount = depositSchemes.length // Added deposit schemes count

  return (
    <main className="min-h-screen bg-white">
      <HeroSection pacs={pacs} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-0">
            {pacs.services && pacs.services.length > 0 && (
              <div className="-mx-6">
                <ServicesSection
                  services={pacs.services}
                  pacsSlug={pacs.slug}
                  loanSchemesCount={loanSchemesCount}
                  depositSchemesCount={depositSchemesCount}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <ContactCard pacs={pacs} />
            </div>
          </div>
        </div>
      </div>

      {pacs.machinery && pacs.machinery.length > 0 && <MachinerySection machinery={pacs.machinery} />}

      <ManagementSection pacs={pacs} teamMembers={teamMembers} />

      {pacs.gallery && pacs.gallery.length > 0 && <GallerySection gallery={pacs.gallery} />}

      <AboutSection pacs={pacs} />

      <MapSection pacs={pacs} />

      <CTASection pacs={pacs} />

      <Footer pacs={pacs} />
    </main>
  )
}
