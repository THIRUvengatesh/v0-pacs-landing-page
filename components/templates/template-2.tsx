import { Template2Hero } from "@/components/templates/template-2/hero"
import { Template2Services } from "@/components/templates/template-2/services"
import { Template2Loans } from "@/components/templates/template-2/loans"
import { Template2About } from "@/components/templates/template-2/about"
import { Template2Machinery } from "@/components/templates/template-2/machinery"
import { Template2Gallery } from "@/components/templates/template-2/gallery"
import { Template2Contact } from "@/components/templates/template-2/contact"
import { Template2Footer } from "@/components/templates/template-2/footer"
import type { PACSWithRelations, LoanScheme } from "@/lib/types/pacs"

interface Template2Props {
  pacs: PACSWithRelations
  loanSchemes: LoanScheme[]
}

export function Template2({ pacs, loanSchemes }: Template2Props) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Template2Hero pacs={pacs} />
      <Template2Services services={pacs.services || []} pacsSlug={pacs.slug} />
      {loanSchemes.length > 0 && <Template2Loans loans={loanSchemes} pacsSlug={pacs.slug} />}
      <Template2About pacs={pacs} />
      {pacs.machinery && pacs.machinery.length > 0 && <Template2Machinery machinery={pacs.machinery} />}
      {pacs.gallery && pacs.gallery.length > 0 && <Template2Gallery gallery={pacs.gallery} pacsName={pacs.name} />}
      <Template2Contact pacs={pacs} />
      <Template2Footer pacs={pacs} />
    </main>
  )
}
