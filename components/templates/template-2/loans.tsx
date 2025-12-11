"use client"

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
    <section className="py-20 px-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">Financial Support</Badge>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Available Loan Schemes</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Flexible financing options to support your agricultural needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loans.slice(0, 3).map((loan, index) => (
            <Card
              key={loan.id}
              className="border-slate-200 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-2 animate-slide-up group"
              style={{
                animationDelay: `${index * 0.15}s`,
                transformStyle: "preserve-3d",
              }}
            >
              <CardContent className="p-6 space-y-4 relative overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-slate-900 flex-1 group-hover:text-green-700 transition-colors duration-300">
                      {loan.scheme_name}
                    </h3>
                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow group-hover:shadow-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2">{loan.scheme_description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm group-hover:scale-105 transition-transform duration-300">
                      <span className="text-slate-600 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Interest Rate
                      </span>
                      <span className="font-bold text-green-600">{loan.interest_rate}% p.a.</span>
                    </div>
                    <div className="flex items-center justify-between text-sm group-hover:scale-105 transition-transform duration-300">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Tenure
                      </span>
                      <span className="font-semibold text-slate-900">{loan.tenure_months} months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <Link href={`/${pacsSlug}/loans`}>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 transform transition-all hover:scale-110 hover:shadow-xl"
            >
              View All Loan Schemes
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-up {
          animation: slide-up 0.7s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
