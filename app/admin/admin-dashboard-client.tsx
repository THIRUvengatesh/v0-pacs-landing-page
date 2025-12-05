"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Building2, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PACSAssociation {
  id: string
  role: string
  pacs: {
    id: string
    name: string
    slug: string
    district: string
    cover_image_url: string | null
  }
}

interface AdminDashboardProps {
  user: {
    id: string
    email: string
  }
  pacsAssociations: PACSAssociation[]
}

export function AdminDashboard({ user, pacsAssociations }: AdminDashboardProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-green-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-900">PACS Admin</h1>
                <p className="text-xs text-green-600">Management Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <Building2 className="h-4 w-4 text-green-700" />
                <span className="text-sm text-green-900">{user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-900 mb-2">Welcome Back!</h2>
          <p className="text-green-600">Manage your PACS data and services from one place.</p>
        </div>

        {/* PACS Selection Cards */}
        {pacsAssociations.length === 0 ? (
          <Card className="border-green-100">
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">No PACS Associated</h3>
              <p className="text-green-600 mb-4">
                You don't have access to any PACS yet. Contact your administrator to get access.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacsAssociations.map((association) => (
              <Card
                key={association.id}
                className="border-green-100 hover:shadow-lg transition-all duration-200 hover:border-green-300"
              >
                <CardHeader className="pb-3">
                  <div
                    className="w-full h-32 rounded-lg mb-4 bg-cover bg-center"
                    style={{
                      backgroundImage: association.pacs.cover_image_url
                        ? `url(${association.pacs.cover_image_url})`
                        : `url(/placeholder.svg?height=128&width=400&query=agricultural+cooperative+building)`,
                    }}
                  />
                  <CardTitle className="text-green-900">{association.pacs.name}</CardTitle>
                  <CardDescription className="text-green-600">
                    {association.pacs.district} • {association.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/admin/${association.pacs.slug}`}>
                    <Button className="w-full bg-green-700 hover:bg-green-800">
                      <LogOut className="h-4 w-4 mr-2" />
                      Manage PACS
                    </Button>
                  </Link>
                  <Link href={`/${association.pacs.slug}`}>
                    <Button
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      View Public Page
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
