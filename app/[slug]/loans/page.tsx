import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LoansPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pacs, error } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  if (error || !pacs) {
    notFound()
  }

  const { data: loanSchemes } = await supabase
    .from("pacs_loan_schemes")
    .select("*")
    .eq("pacs_id", pacs.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  const loans = loanSchemes || []

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href={`/${slug}`}>
            <Button variant="ghost" className="mb-4 text-green-700 hover:text-green-900 hover:bg-green-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {pacs.name}
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">Available Loan Schemes</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore our agricultural loan schemes with competitive interest rates and flexible repayment options
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loans.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No active loan schemes available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {loans.map((loan) => (
              <Card key={loan.id} className="border-green-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-green-900">{loan.scheme_name}</CardTitle>
                  {loan.description && <CardDescription className="text-base">{loan.description}</CardDescription>}
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
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pacs } = await supabase.from("pacs").select("name").eq("slug", slug).single()

  if (!pacs) {
    return {
      title: "Loans Not Found",
    }
  }

  return {
    title: `Loan Schemes - ${pacs.name}`,
    description: `Explore agricultural loan schemes offered by ${pacs.name} with competitive interest rates and flexible repayment options.`,
  }
}
