import type { LoanScheme } from "@/lib/types/pacs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

interface Template2LoansProps {
  loans: LoanScheme[]
  pacsSlug: string
}

export function Template2Loans({ loans, pacsSlug }: Template2LoansProps) {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">Financial Support</Badge>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Available Loan Schemes</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Flexible financing options to support your agricultural needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loans.slice(0, 3).map((loan) => (
            <Card key={loan.id} className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex-1">{loan.scheme_name}</h3>
                  <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>

                <p className="text-slate-600 text-sm line-clamp-2">{loan.scheme_description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Interest Rate
                    </span>
                    <span className="font-bold text-green-600">{loan.interest_rate}% p.a.</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Tenure
                    </span>
                    <span className="font-semibold text-slate-900">{loan.tenure_months} months</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href={`/${pacsSlug}/loans`}>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              View All Loan Schemes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
