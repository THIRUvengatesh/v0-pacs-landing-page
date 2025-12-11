"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Leaf, Check, ExternalLink, Eye, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { PACS } from "@/lib/types/pacs"
import Image from "next/image"

interface TemplateManagementProps {
  pacs: PACS
}

const templates = [
  {
    id: 1,
    name: "Classic Layout",
    description: "Traditional sidebar layout with green agricultural theme. Perfect for established cooperatives.",
    features: ["Sidebar navigation", "Green color scheme", "Traditional layout", "Mobile responsive"],
    preview: "/green-agricultural-website-sidebar.jpg",
  },
  {
    id: 2,
    name: "Modern Design",
    description:
      "Contemporary full-width design with blue gradient theme and smooth animations. Modern and professional.",
    features: ["Full-width layout", "Blue gradient theme", "3D hover effects", "Animated elements"],
    preview: "/modern-blue-gradient-website.jpg",
  },
  {
    id: 3,
    name: "Glassmorphism",
    description: "Ultra-modern design with glassmorphism effects, purple/pink gradients, and advanced animations.",
    features: ["Glassmorphism UI", "Purple/pink gradients", "Advanced animations", "Floating orbs"],
    preview: "/glassmorphism-purple-pink-gradient-website.jpg",
  },
]

export function TemplateManagement({ pacs }: TemplateManagementProps) {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState(pacs.template_type || 1)
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTemplateClick = (templateId: number) => {
    setPreviewTemplate(templateId)
  }

  const handleConfirmTemplate = () => {
    if (previewTemplate) {
      setSelectedTemplate(previewTemplate)
      setPreviewTemplate(null)
    }
  }

  const handleSaveTemplate = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/admin/pacs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pacsId: pacs.id,
          slug: pacs.slug,
          template_type: selectedTemplate,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update template")
      }

      alert("Template updated successfully!")
      router.push(`/admin/${pacs.slug}`)
      router.refresh()
    } catch (error) {
      console.error("Error updating template:", error)
      alert(error instanceof Error ? error.message : "Failed to update template")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="border-b border-green-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                  <h1 className="text-lg font-bold text-green-900">Template Management</h1>
                  <p className="text-xs text-green-600">{pacs.name}</p>
                </div>
              </div>
            </div>
            <Link href={`/${pacs.slug}`} target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Page
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="border-green-100 mb-6">
          <CardHeader>
            <CardTitle className="text-green-900">Template Selection</CardTitle>
            <CardDescription>Choose the design template for your PACS landing page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template_type">Landing Page Template</Label>
                <Select
                  value={selectedTemplate.toString()}
                  onValueChange={(value) => setSelectedTemplate(Number.parseInt(value))}
                >
                  <SelectTrigger id="template_type">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Template 1 - Classic Layout</SelectItem>
                    <SelectItem value="2">Template 2 - Modern Design</SelectItem>
                    <SelectItem value="3">Template 3 - Glassmorphism</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Template 1: Traditional sidebar layout with green theme
                  <br />
                  Template 2: Modern full-width design with blue gradient theme and animations
                  <br />
                  Template 3: Modern glassmorphism with purple/pink gradients and animations
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveTemplate}
                  disabled={loading || selectedTemplate === pacs.template_type}
                  className="bg-green-700 hover:bg-green-800"
                >
                  {loading ? "Saving..." : "Apply Selected Template"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100 mb-6">
          <CardHeader>
            <CardTitle className="text-green-900">Template Preview Gallery</CardTitle>
            <CardDescription>
              Click on any template card to preview how it will look with your PACS data before applying
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id
                      ? "ring-2 ring-green-600 border-green-600"
                      : "border-green-100 hover:border-green-300"
                  }`}
                  onClick={() => handleTemplateClick(template.id)}
                >
                  <div className="relative group">
                    <Image
                      src={template.preview || "/placeholder.svg"}
                      alt={template.name}
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-t-lg">
                      <Button size="sm" className="bg-white text-green-700 hover:bg-green-50">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Template
                      </Button>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-2">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-900">{template.name}</CardTitle>
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {template.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-green-700">
                          <Check className="h-3 w-3 mr-2 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-900">Template Customization</CardTitle>
            <CardDescription>Further customize your chosen template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href={`/admin/${pacs.slug}/edit`}>
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  Edit Basic Information
                </Button>
              </Link>
              <Link href={`/admin/${pacs.slug}/gallery`}>
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  Manage Images & Gallery
                </Button>
              </Link>
              <Link href={`/admin/${pacs.slug}/services`}>
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  Configure Services
                </Button>
              </Link>
              <Link href={`/admin/${pacs.slug}/management`}>
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  Update Team Information
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={previewTemplate !== null} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-7xl h-[90vh] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl text-green-900">
                  {templates.find((t) => t.id === previewTemplate)?.name} Preview
                </DialogTitle>
                <DialogDescription>Preview how your PACS page will look with this template</DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewTemplate(null)}
                className="text-green-700 hover:bg-green-50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden p-6 pt-0">
            <div className="h-full rounded-lg border border-green-200 overflow-hidden bg-white shadow-lg">
              <iframe
                src={`/${pacs.slug}?preview=${previewTemplate}`}
                className="w-full h-full"
                title="Template Preview"
              />
            </div>
          </div>
          <div className="p-6 pt-4 border-t flex justify-between items-center bg-green-50">
            <p className="text-sm text-green-700">
              Click "Select This Template" to choose this design for your PACS page
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setPreviewTemplate(null)}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmTemplate} className="bg-green-700 hover:bg-green-800">
                <Check className="h-4 w-4 mr-2" />
                Select This Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
