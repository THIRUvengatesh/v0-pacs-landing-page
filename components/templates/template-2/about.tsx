import type { PACS } from "@/lib/types/pacs"
import { Card } from "@/components/ui/card"
import { Building2, Target, TrendingUp } from "lucide-react"

interface Template2AboutProps {
  pacs: PACS
}

export function Template2About({ pacs }: Template2AboutProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-slate-900">About Us</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              {pacs.about_history && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Our History
                  </h3>
                  <p>{pacs.about_history}</p>
                </div>
              )}
              {pacs.about_services && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    What We Do
                  </h3>
                  <p>{pacs.about_services}</p>
                </div>
              )}
              {pacs.about_impact && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Our Impact
                  </h3>
                  <p>{pacs.about_impact}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">{pacs.established_year || "1950"}</div>
              <div className="text-slate-600">Established</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {pacs.member_count?.toLocaleString() || "1000+"}
              </div>
              <div className="text-slate-600">Members</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 col-span-2">
              <div className="text-4xl font-bold text-purple-600 mb-2">{pacs.services?.length || 5}+</div>
              <div className="text-slate-600">Services Offered</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
