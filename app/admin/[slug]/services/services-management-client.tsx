"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Leaf, ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { PACS, PACSService } from "@/lib/types/pacs"

interface ServicesManagementProps {
  pacs: PACS
  services: PACSService[]
}

export function ServicesManagement({ pacs, services: initialServices }: ServicesManagementProps) {
  const [services, setServices] = useState(initialServices)
  const [isOpen, setIsOpen] = useState(false)
  const [editingService, setEditingService] = useState<PACSService | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    service_name: "",
    service_description: "",
    icon_name: "",
    detailed_description: "",
    benefits: "",
    eligibility: "",
    required_documents: "",
    process_steps: "",
    fees: "",
    contact_person: "",
    contact_phone: "",
  })

  const resetForm = () => {
    setFormData({
      service_name: "",
      service_description: "",
      icon_name: "",
      detailed_description: "",
      benefits: "",
      eligibility: "",
      required_documents: "",
      process_steps: "",
      fees: "",
      contact_person: "",
      contact_phone: "",
    })
    setEditingService(null)
  }

  const handleEdit = (service: PACSService) => {
    setEditingService(service)
    setFormData({
      service_name: service.service_name,
      service_description: service.service_description || "",
      icon_name: service.icon_name || "",
      detailed_description: service.detailed_description || "",
      benefits: service.benefits?.join("\n") || "",
      eligibility: service.eligibility || "",
      required_documents: service.required_documents?.join("\n") || "",
      process_steps: service.process_steps?.join("\n") || "",
      fees: service.fees || "",
      contact_person: service.contact_person || "",
      contact_phone: service.contact_phone || "",
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const serviceData = {
      pacs_id: pacs.id,
      service_name: formData.service_name,
      service_description: formData.service_description,
      icon_name: formData.icon_name,
      detailed_description: formData.detailed_description,
      benefits: formData.benefits.split("\n").filter((b) => b.trim()),
      eligibility: formData.eligibility,
      required_documents: formData.required_documents.split("\n").filter((d) => d.trim()),
      process_steps: formData.process_steps.split("\n").filter((s) => s.trim()),
      fees: formData.fees,
      contact_person: formData.contact_person,
      contact_phone: formData.contact_phone,
    }

    try {
      if (editingService) {
        const { error } = await supabase.from("pacs_services").update(serviceData).eq("id", editingService.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("pacs_services").insert([serviceData])

        if (error) throw error
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving service:", error)
      alert("Failed to save service")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    const supabase = createClient()
    const { error } = await supabase.from("pacs_services").delete().eq("id", serviceId)

    if (error) {
      console.error("Error deleting service:", error)
      alert("Failed to delete service")
    } else {
      router.refresh()
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
                  <h1 className="text-lg font-bold text-green-900">Services Management</h1>
                  <p className="text-xs text-green-600">{pacs.name}</p>
                </div>
              </div>
            </div>
            <Dialog
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) resetForm()
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-green-700 hover:bg-green-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                  <DialogDescription>
                    {editingService ? "Update service details" : "Create a new service for your PACS"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="service_name">Service Name *</Label>
                      <Input
                        id="service_name"
                        value={formData.service_name}
                        onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="service_description">Short Description</Label>
                      <Textarea
                        id="service_description"
                        value={formData.service_description}
                        onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="icon_name">Icon Name</Label>
                      <Input
                        id="icon_name"
                        value={formData.icon_name}
                        onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                        placeholder="e.g., CreditCard, Sprout, Tractor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="detailed_description">Detailed Description</Label>
                      <Textarea
                        id="detailed_description"
                        value={formData.detailed_description}
                        onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="benefits">Benefits (one per line)</Label>
                      <Textarea
                        id="benefits"
                        value={formData.benefits}
                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                        rows={3}
                        placeholder="Low interest rates&#10;Quick processing&#10;Flexible repayment"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eligibility">Eligibility Criteria</Label>
                      <Textarea
                        id="eligibility"
                        value={formData.eligibility}
                        onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="required_documents">Required Documents (one per line)</Label>
                      <Textarea
                        id="required_documents"
                        value={formData.required_documents}
                        onChange={(e) => setFormData({ ...formData, required_documents: e.target.value })}
                        rows={3}
                        placeholder="Aadhaar Card&#10;Land documents&#10;Bank statements"
                      />
                    </div>
                    <div>
                      <Label htmlFor="process_steps">Application Process (one step per line)</Label>
                      <Textarea
                        id="process_steps"
                        value={formData.process_steps}
                        onChange={(e) => setFormData({ ...formData, process_steps: e.target.value })}
                        rows={3}
                        placeholder="Visit PACS office&#10;Submit application form&#10;Await approval"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fees">Fees/Charges</Label>
                      <Input
                        id="fees"
                        value={formData.fees}
                        onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                        placeholder="e.g., ₹500 processing fee"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact_person">Contact Person</Label>
                        <Input
                          id="contact_person"
                          value={formData.contact_person}
                          onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_phone">Contact Phone</Label>
                        <Input
                          id="contact_phone"
                          value={formData.contact_phone}
                          onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                          placeholder="e.g., +91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-green-700 hover:bg-green-800">
                      {isLoading ? "Saving..." : editingService ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {services.length === 0 ? (
          <Card className="border-green-100">
            <CardContent className="py-12 text-center">
              <p className="text-green-600">No services added yet. Click "Add Service" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900">{service.service_name}</CardTitle>
                  <CardDescription>{service.service_description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(service)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(service.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
