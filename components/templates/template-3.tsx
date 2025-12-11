import { Template3Hero } from "@/components/templates/template-3/hero"
import { Template3Services } from "@/components/templates/template-3/services"
import { Template3Loans } from "@/components/templates/template-3/loans"
import { Template3About } from "@/components/templates/template-3/about"
import { Template3Machinery } from "@/components/templates/template-3/machinery"
import { Template3Gallery } from "@/components/templates/template-3/gallery"
import { Template3Contact } from "@/components/templates/template-3/contact"
import { Template3Footer } from "@/components/templates/template-3/footer"
import type { PACSWithRelations, LoanScheme } from "@/lib/types/pacs"

interface Template3Props {
  pacs: PACSWithRelations
  loanSchemes: LoanScheme[]
}

export function Template3({ pacs, loanSchemes }: Template3Props) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Template3Hero pacs={pacs} />
      <Template3Services services={pacs.services || []} pacsSlug={pacs.slug} />
      {loanSchemes.length > 0 && <Template3Loans loans={loanSchemes} pacsSlug={pacs.slug} />}
      <Template3About pacs={pacs} />
      {pacs.machinery && pacs.machinery.length > 0 && <Template3Machinery machinery={pacs.machinery} />}
      {pacs.gallery && pacs.gallery.length > 0 && <Template3Gallery gallery={pacs.gallery} pacsName={pacs.name} />}
      <Template3Contact pacs={pacs} />
      <Template3Footer pacs={pacs} />
    </main>
  )
}
