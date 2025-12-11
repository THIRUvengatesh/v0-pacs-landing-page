"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Percent, DollarSign } from "lucide-react"
import Link from "next/link"
import type { LoanScheme } from "@/lib/types/pacs"

interface Template3LoansProps {
  loans: LoanScheme[]
  pacsSlug: string
}

export function Template3Loans({ loans, pacsSlug }: Template3LoansProps) {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            Available Loan Schemes
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Flexible financing options to help you grow and prosper
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loans.map((loan) => (
            <Card
              key={loan.id}
              className="group backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-bl-full" />

              <CardContent className="p-8 relative">
                <h3 className="text-2xl font-bold text-white mb-4">{loan.scheme_name}</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center">
                      <Percent className="text-purple-300" size={24} />
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Interest Rate</p>
                      <p className="text-white font-bold text-lg">{loan.interest_rate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center">
                      <DollarSign className="text-pink-300" size={24} />
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Loan Amount</p>
                      <p className="text-white font-bold text-lg">
                        ₹{loan.min_amount?.toLocaleString()} - ₹{loan.max_amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  {loan.max_tenure_months} Months
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${pacsSlug}/loans`}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            View All Loan Details
          </Link>
        </div>
      </div>
    </section>
  )
}
