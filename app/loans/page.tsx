import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Calendar, IndianRupee, Percent, CheckCircle2 } from "lucide-react"

export default async function LoansPage() {
  const supabase = await createClient()

  // Fetch all active loan schemes with PACS information
  const { data: loanSchemes } = await supabase
    .from("pacs_loan_schemes")
    .select(
      `
      *,
      pacs:pacs_id (
        name,
        slug,
        district,
        state
      )
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-green-600 hover:text-green-700 hover:bg-green-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">Available Loan Schemes</h1>
          <p className="text-muted-foreground text-lg">
            Browse agricultural loan schemes from Primary Agricultural Cooperative Societies
          </p>
        </div>
      </header>

      {/* Loan Schemes List */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        {loanSchemes && loanSchemes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loanSchemes.map((loan) => (
              <Card key={loan.id} className="border-green-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <CardTitle className="text-xl text-green-900 line-clamp-2">{loan.scheme_name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 shrink-0">Active</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4" />
                    {loan.pacs?.name}
                    {loan.pacs?.district && ` • ${loan.pacs.district}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loan.scheme_description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{loan.scheme_description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {loan.interest_rate && (
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Interest Rate</p>
                          <p className="text-sm font-semibold">{loan.interest_rate}% p.a.</p>
                        </div>
                      </div>
                    )}

                    {loan.tenure_months && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Tenure</p>
                          <p className="text-sm font-semibold">{loan.tenure_months} months</p>
                        </div>
                      </div>
                    )}

                    {loan.min_amount && (
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Min Amount</p>
                          <p className="text-sm font-semibold">₹{loan.min_amount.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    )}

                    {loan.max_amount && (
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Max Amount</p>
                          <p className="text-sm font-semibold">₹{loan.max_amount.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {loan.eligibility && (
                    <div className="pt-2 border-t border-green-100">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Eligibility
                      </p>
                      <p className="text-sm line-clamp-2">{loan.eligibility}</p>
                    </div>
                  )}

                  {loan.pacs?.slug && (
                    <Link href={`/${loan.pacs.slug}`}>
                      <Button
                        variant="outline"
                        className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                      >
                        View PACS Details
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">No Loan Schemes Available</h3>
            <p className="text-muted-foreground">
              There are currently no active loan schemes. Please check back later.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-green-200">© {new Date().getFullYear()} PACS Directory. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
