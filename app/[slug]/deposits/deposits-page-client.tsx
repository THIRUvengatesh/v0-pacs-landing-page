"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ArrowLeft, Percent, Clock, FileText, CheckCircle2, TrendingUp, Banknote } from "lucide-react"
import Link from "next/link"

interface DepositScheme {
  id: string
  scheme_name: string
  scheme_description: string | null
  interest_rate: number
  min_deposit: number | null
  tenure_months: number | null
  benefits: string[] | null
  withdrawal_rules: string | null
  is_active: boolean
}

interface PACS {
  id: string
  name: string
  slug: string
}

interface DepositsPageClientProps {
  pacs: PACS
  deposits: DepositScheme[]
}

export default function DepositsPageClient({ pacs, deposits }: DepositsPageClientProps) {
  const [selectedDeposit, setSelectedDeposit] = useState<DepositScheme | null>(null)

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href={`/${pacs.slug}`}>
            <Button variant="ghost" className="mb-4 text-green-700 hover:text-green-900 hover:bg-green-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {pacs.name}
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">Savings & Deposit Schemes</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Secure your future with our attractive deposit schemes offering competitive interest rates and flexible
            terms
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {deposits.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No active deposit schemes available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deposits.map((deposit) => (
              <Card
                key={deposit.id}
                className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedDeposit(deposit)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-green-900">{deposit.scheme_name}</h4>
                      {deposit.scheme_description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{deposit.scheme_description}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-900">Interest Rate</span>
                      <span className="text-lg font-bold text-green-600">{deposit.interest_rate}%</span>
                    </div>

                    {deposit.min_deposit && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Min. Deposit</span>
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{deposit.min_deposit.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {deposit.tenure_months && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-900">Tenure</span>
                        <span className="text-sm font-semibold text-blue-700">{deposit.tenure_months} months</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <span className="text-xs text-green-600 font-medium">Click for full details</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedDeposit} onOpenChange={(open) => !open && setSelectedDeposit(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDeposit && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-green-900 pr-8">
                  {selectedDeposit.scheme_name}
                </DialogTitle>
                {selectedDeposit.scheme_description && (
                  <DialogDescription className="text-base text-muted-foreground pt-2">
                    {selectedDeposit.scheme_description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Percent className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Interest Rate</h4>
                      <p className="text-2xl font-bold text-green-600">{selectedDeposit.interest_rate}%</p>
                      <p className="text-xs text-green-700 mt-1">per annum</p>
                    </div>
                  </div>

                  {selectedDeposit.tenure_months && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Clock className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Tenure Period</h4>
                        <p className="text-lg font-bold text-blue-600">{selectedDeposit.tenure_months}</p>
                        <p className="text-xs text-blue-700 mt-1">months</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Minimum Deposit */}
                {selectedDeposit.min_deposit && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-gray-600" />
                      Minimum Deposit Amount
                    </h4>
                    <p className="text-xl font-bold text-gray-900">₹{selectedDeposit.min_deposit.toLocaleString()}</p>
                  </div>
                )}

                {/* Benefits */}
                {selectedDeposit.benefits && selectedDeposit.benefits.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Key Benefits
                    </h4>
                    <ul className="space-y-2">
                      {selectedDeposit.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Withdrawal Rules */}
                {selectedDeposit.withdrawal_rules && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-amber-600" />
                      Withdrawal Rules
                    </h4>
                    <p className="text-sm text-amber-800 whitespace-pre-wrap">{selectedDeposit.withdrawal_rules}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => setSelectedDeposit(null)}
                    variant="outline"
                    className="flex-1 border-green-200 hover:bg-green-50"
                  >
                    Close
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">Open Account</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
