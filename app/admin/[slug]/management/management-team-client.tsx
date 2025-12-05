"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Leaf, Save, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { PACS } from "@/lib/types/pacs"

interface ManagementTeamProps {
  pacs: PACS
}

export function ManagementTeam({ pacs }: ManagementTeamProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    president_name: pacs.president_name || "",
    president_contact: pacs.president_contact || "",
    secretary_name: pacs.secretary_name || "",
    secretary_contact: pacs.secretary_contact || "",
    manager_name: pacs.manager_name || "",
    manager_contact: pacs.manager_contact || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("pacs")
        .update({
          president_name: formData.president_name,
          president_contact: formData.president_contact,
          secretary_name: formData.secretary_name,
          secretary_contact: formData.secretary_contact,
          manager_name: formData.manager_name,
          manager_contact: formData.manager_contact,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pacs.id)

      if (error) throw error

      alert("Management team updated successfully!")
      router.push(`/admin/${pacs.slug}`)
      router.refresh()
    } catch (error) {
      console.error("Error updating management team:", error)
      alert("Failed to update management team")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="border-b border-green-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/admin/${pacs.slug}`}>
              <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-900">Management Team</h1>
                <p className="text-xs text-green-600">{pacs.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  President
                </CardTitle>
                <CardDescription>Details of the PACS President</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="president_name">Name</Label>
                  <Input
                    id="president_name"
                    value={formData.president_name}
                    onChange={(e) => setFormData({ ...formData, president_name: e.target.value })}
                    placeholder="Enter president's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="president_contact">Contact Number</Label>
                  <Input
                    id="president_contact"
                    value={formData.president_contact}
                    onChange={(e) => setFormData({ ...formData, president_contact: e.target.value })}
                    placeholder="Enter contact number"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Secretary
                </CardTitle>
                <CardDescription>Details of the PACS Secretary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="secretary_name">Name</Label>
                  <Input
                    id="secretary_name"
                    value={formData.secretary_name}
                    onChange={(e) => setFormData({ ...formData, secretary_name: e.target.value })}
                    placeholder="Enter secretary's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secretary_contact">Contact Number</Label>
                  <Input
                    id="secretary_contact"
                    value={formData.secretary_contact}
                    onChange={(e) => setFormData({ ...formData, secretary_contact: e.target.value })}
                    placeholder="Enter contact number"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Manager
                </CardTitle>
                <CardDescription>Details of the PACS Manager</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manager_name">Name</Label>
                  <Input
                    id="manager_name"
                    value={formData.manager_name}
                    onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                    placeholder="Enter manager's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager_contact">Contact Number</Label>
                  <Input
                    id="manager_contact"
                    value={formData.manager_contact}
                    onChange={(e) => setFormData({ ...formData, manager_contact: e.target.value })}
                    placeholder="Enter contact number"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Link href={`/admin/${pacs.slug}`}>
              <Button type="button" variant="outline" className="border-green-200 bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
