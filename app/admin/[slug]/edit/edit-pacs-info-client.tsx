"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Leaf, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { PACS } from "@/lib/types/pacs"

interface EditPACSInfoProps {
  pacs: PACS
}

export function EditPACSInfo({ pacs }: EditPACSInfoProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: pacs.name || "",
    district: pacs.district || "",
    state: pacs.state || "",
    address: pacs.address || "",
    phone: pacs.phone || "",
    email: pacs.email || "",
    description: pacs.description || "",
    established_year: pacs.established_year || "",
    member_count: pacs.member_count || "",
    about_history: pacs.about_history || "",
    about_services: pacs.about_services || "",
    about_impact: pacs.about_impact || "",
    latitude: pacs.latitude || "",
    longitude: pacs.longitude || "",
    map_url: pacs.map_url || "",
    cover_image_url: pacs.cover_image_url || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("pacs")
        .update({
          name: formData.name,
          district: formData.district,
          state: formData.state,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          description: formData.description,
          established_year: formData.established_year ? Number.parseInt(formData.established_year) : null,
          member_count: formData.member_count ? Number.parseInt(formData.member_count) : null,
          about_history: formData.about_history,
          about_services: formData.about_services,
          about_impact: formData.about_impact,
          latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
          map_url: formData.map_url,
          cover_image_url: formData.cover_image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pacs.id)

      if (error) throw error

      alert("PACS information updated successfully!")
      router.push(`/admin/${pacs.slug}`)
      router.refresh()
    } catch (error) {
      console.error("Error updating PACS:", error)
      alert("Failed to update PACS information")
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
                <h1 className="text-lg font-bold text-green-900">Edit PACS Information</h1>
                <p className="text-xs text-green-600">{pacs.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-green-900">Basic Information</CardTitle>
              <CardDescription>Update the basic details of your PACS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">PACS Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established_year">Established Year</Label>
                  <Input
                    id="established_year"
                    type="number"
                    value={formData.established_year}
                    onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 mt-6">
            <CardHeader>
              <CardTitle className="text-green-900">About Section</CardTitle>
              <CardDescription>Detailed information about your PACS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_history">History</Label>
                <Textarea
                  id="about_history"
                  value={formData.about_history}
                  onChange={(e) => setFormData({ ...formData, about_history: e.target.value })}
                  rows={4}
                  placeholder="Tell the story of how your PACS was founded..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_services">Services Offered</Label>
                <Textarea
                  id="about_services"
                  value={formData.about_services}
                  onChange={(e) => setFormData({ ...formData, about_services: e.target.value })}
                  rows={4}
                  placeholder="Describe the services your PACS provides..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_impact">Community Impact</Label>
                <Textarea
                  id="about_impact"
                  value={formData.about_impact}
                  onChange={(e) => setFormData({ ...formData, about_impact: e.target.value })}
                  rows={4}
                  placeholder="Share the positive impact on your community..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member_count">Member Count</Label>
                <Input
                  id="member_count"
                  type="number"
                  value={formData.member_count}
                  onChange={(e) => setFormData({ ...formData, member_count: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 mt-6">
            <CardHeader>
              <CardTitle className="text-green-900">Location & Media</CardTitle>
              <CardDescription>Location coordinates and images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="e.g., 17.6868"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="e.g., 75.9064"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="map_url">Google Maps Embed URL</Label>
                  <Input
                    id="map_url"
                    value={formData.map_url}
                    onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cover_image_url">Cover Image URL</Label>
                  <Input
                    id="cover_image_url"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
