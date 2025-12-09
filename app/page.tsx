import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, ArrowRight, Leaf, LogIn } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()

  // Fetch all PACS for the directory
  const { data: pacsList } = await supabase
    .from("pacs")
    .select("slug, name, district, state, description, member_count")
    .order("name", { ascending: true })

  const { count: totalLoans } = await supabase
    .from("pacs_loan_schemes")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="font-semibold text-green-900">PACS Directory</span>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
            <Leaf className="h-4 w-4" />
            <span className="text-sm font-medium">Primary Agricultural Cooperative Societies</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-6 text-balance">
            Empowering Farmers, Strengthening Communities
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Find your local PACS and access essential agricultural services, financial support, and community resources
          </p>
        </div>
      </section>

      <section className="py-12 px-6 max-w-7xl mx-auto">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-green-900 mb-3">Available Loan Schemes</CardTitle>
            <CardDescription className="text-base md:text-lg">
              Explore {totalLoans || 0}+ agricultural loan schemes from PACS across the region
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Find the right financial support for your farming needs with competitive interest rates and flexible
              repayment options
            </p>
            <Link href="/loans">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                View All Loan Schemes
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* PACS Directory */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">Browse PACS Directory</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a cooperative society to view their complete profile
          </p>
        </div>

        {pacsList && pacsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacsList.map((pacs) => (
              <Card
                key={pacs.slug}
                className="border-green-100 hover:shadow-lg transition-all duration-300 hover:border-green-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-green-900 line-clamp-2">{pacs.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {pacs.district}
                    {pacs.state ? `, ${pacs.state}` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {pacs.description || "A trusted Primary Agricultural Cooperative Society serving local farmers"}
                  </p>
                  {pacs.member_count && (
                    <div className="flex items-center gap-2 text-sm text-green-700 mb-4">
                      <Users className="h-4 w-4" />
                      <span>{pacs.member_count}+ members</span>
                    </div>
                  )}
                  <Link href={`/${pacs.slug}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      View Profile
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No PACS found. Please add PACS data to the database.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-green-300" />
            <p className="font-semibold">PACS Directory</p>
          </div>
          <p className="text-sm text-green-200">© {new Date().getFullYear()} PACS Directory. All rights reserved.</p>
          <p className="text-xs text-green-300 mt-2">Empowering farmers, strengthening communities</p>
        </div>
      </footer>
    </main>
  )
}
