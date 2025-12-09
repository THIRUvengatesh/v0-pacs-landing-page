"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ArrowLeft, DollarSign, Clock, FileText, CheckCircle2, ClipboardList } from "lucide-react"
import Link from "next/link"

interface LoanScheme {
  id: string
  scheme_name: string
  description: string | null
  interest_rate: number
  min_amount: number | null
  max_amount: number | null
  min_tenure: number | null
  max_tenure: number | null
  processing_fee: number | null
  eligibility_criteria: string | null
  required_documents: string | null
  is_active: boolean
}

interface PACS {
  id: string
  name: string
  slug: string
}

interface LoansPageClientProps {
  pacs: PACS
  loans: LoanScheme[]
}

export default function LoansPageClient({ pacs, loans }: LoansPageClientProps) {
  const [selectedLoan, setSelectedLoan] = useState<LoanScheme | null>(null)
  const [showProcedure, setShowProcedure] = useState(false)

  const applicationSteps = [
    {
      step: 1,
      title: "Check Eligibility",
      description: "Review the eligibility criteria and ensure you meet all the requirements for this loan scheme.",
    },
    {
      step: 2,
      title: "Prepare Documents",
      description:
        "Gather all required documents as listed in the loan details. Make sure they are up-to-date and properly attested.",
    },
    {
      step: 3,
      title: "Visit PACS Office",
      description: `Visit the ${pacs.name} office during working hours with your documents and identification proof.`,
    },
    {
      step: 4,
      title: "Fill Application Form",
      description: "Complete the loan application form with accurate information. Our staff will assist you if needed.",
    },
    {
      step: 5,
      title: "Submit Documents",
      description: "Submit your completed application form along with all required documents to the loan officer.",
    },
    {
      step: 6,
      title: "Verification Process",
      description: "Your application and documents will be verified. This typically takes 3-5 working days.",
    },
    {
      step: 7,
      title: "Approval & Disbursement",
      description: "Once approved, the loan amount will be disbursed to your account as per the scheme terms.",
    },
  ]

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <Card
                key={loan.id}
                className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedLoan(loan)}
              >
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-green-900 mb-2">{loan.scheme_name}</h4>
                  {loan.description && (
                    <p className="text-sm text-muted-foreground mb-4 text-pretty line-clamp-2">{loan.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-900">Interest Rate</span>
                      <span className="text-lg font-bold text-green-600">{loan.interest_rate}%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Loan Amount</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{loan.min_amount?.toLocaleString()} - ₹{loan.max_amount?.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">Tenure</span>
                      <span className="text-sm font-semibold text-blue-700">
                        {loan.min_tenure} - {loan.max_tenure} months
                      </span>
                    </div>
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

      <Dialog open={!!selectedLoan} onOpenChange={(open) => !open && setSelectedLoan(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedLoan && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-green-900 pr-8">{selectedLoan.scheme_name}</DialogTitle>
                {selectedLoan.description && (
                  <DialogDescription className="text-base text-muted-foreground pt-2">
                    {selectedLoan.description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <DollarSign className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Interest Rate</h4>
                      <p className="text-2xl font-bold text-green-600">{selectedLoan.interest_rate}%</p>
                      <p className="text-xs text-green-700 mt-1">per annum</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Clock className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Loan Tenure</h4>
                      <p className="text-lg font-bold text-blue-600">
                        {selectedLoan.min_tenure} - {selectedLoan.max_tenure}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">months</p>
                    </div>
                  </div>
                </div>

                {/* Loan Amount */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    Loan Amount Range
                  </h4>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{selectedLoan.min_amount?.toLocaleString()} - ₹{selectedLoan.max_amount?.toLocaleString()}
                  </p>
                </div>

                {/* Processing Fee */}
                {selectedLoan.processing_fee !== null && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2">Processing Fee</h4>
                    <p className="text-lg font-bold text-amber-700">{selectedLoan.processing_fee}%</p>
                  </div>
                )}

                {/* Eligibility Criteria */}
                {selectedLoan.eligibility_criteria && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Eligibility Criteria
                    </h4>
                    <p className="text-sm text-green-800 whitespace-pre-wrap">{selectedLoan.eligibility_criteria}</p>
                  </div>
                )}

                {/* Required Documents */}
                {selectedLoan.required_documents && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Required Documents
                    </h4>
                    <p className="text-sm text-blue-800 whitespace-pre-wrap">{selectedLoan.required_documents}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => setSelectedLoan(null)}
                    variant="outline"
                    className="flex-1 border-green-200 hover:bg-green-50"
                  >
                    Close
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setShowProcedure(true)}>
                    Apply for Loan
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showProcedure} onOpenChange={setShowProcedure}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-900 flex items-center gap-2">
              <ClipboardList className="h-7 w-7 text-green-600" />
              Loan Application Procedure
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Follow these steps to apply for {selectedLoan?.scheme_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {applicationSteps.map((step, index) => (
              <div
                key={step.step}
                className="flex gap-4 p-4 rounded-lg border-2 border-green-100 hover:border-green-300 transition-colors bg-white"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-green-900 mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < applicationSteps.length - 1 && (
                  <div className="absolute left-10 mt-16 w-0.5 h-4 bg-green-200" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Contact Information
            </h4>
            <div className="space-y-1 text-sm text-green-800">
              <p>
                <strong>PACS:</strong> {pacs.name}
              </p>
              <p>
                <strong>For queries:</strong> Visit our office or contact us during working hours
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => setShowProcedure(false)}
              variant="outline"
              className="flex-1 border-green-200 hover:bg-green-50"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowProcedure(false)
                setSelectedLoan(null)
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
