"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import type { PACS, PACSProcurement } from "@/lib/types/pacs"

interface ProcurementManagementProps {
  pacs: PACS
  procurement: PACSProcurement[]
}

export function ProcurementManagement({ pacs, procurement: initialProcurement }: ProcurementManagementProps) {
  const [procurement, setProcurement] = useState(initialProcurement)
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PACSProcurement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    crop_name: "",
    procurement_season: "",
    price_per_quintal: "",
    payment_terms: "",
    quality_standards: "",
    contact_person: "",
    contact_phone: "",
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      crop_name: "",
      procurement_season: "",
      price_per_quintal: "",
      payment_terms: "",
      quality_standards: "",
      contact_person: "",
      contact_phone: "",
      is_active: true,
    })
    setEditingItem(null)
  }

  const handleEdit = (item: PACSProcurement) => {
    setEditingItem(item)
    setFormData({
      crop_name: item.crop_name,
      procurement_season: item.procurement_season || "",
      price_per_quintal: item.price_per_quintal?.toString() || "",
      payment_terms: item.payment_terms || "",
      quality_standards: item.quality_standards || "",
      contact_person: item.contact_person || "",
      contact_phone: item.contact_phone || "",
      is_active: item.is_active,
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const procurementData = {
      pacs_id: pacs.id,
      crop_name: formData.crop_name,
      procurement_season: formData.procurement_season,
      price_per_quintal: formData.price_per_quintal ? Number.parseFloat(formData.price_per_quintal) : null,
      payment_terms: formData.payment_terms,
      quality_standards: formData.quality_standards,
      contact_person: formData.contact_person,
      contact_phone: formData.contact_phone,
      is_active: formData.is_active,
    }

    try {
      if (editingItem) {
        const { data, error } = await supabase
          .from("pacs_procurement")
          .update(procurementData)
          .eq("id", editingItem.id)
          .select()
          .single()

        if (error) throw error

        setProcurement(procurement.map((p) => (p.id === editingItem.id ? data : p)))
      } else {
        const { data, error } = await supabase.from("pacs_procurement").insert([procurementData]).select().single()

        if (error) throw error

        setProcurement([...procurement, data])
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving procurement:", error)
      alert("Failed to save procurement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this procurement item?")) return

    const supabase = createClient()
    const { error } = await supabase.from("pacs_procurement").delete().eq("id", itemId)

    if (error) {
      console.error("Error deleting procurement:", error)
      alert("Failed to delete procurement")
    } else {
      setProcurement(procurement.filter((p) => p.id !== itemId))
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
                  <h1 className="text-lg font-bold text-green-900">Crop Procurement</h1>
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
                  Add Procurement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Procurement" : "Add New Procurement"}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? "Update procurement details" : "Add crop procurement information"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="crop_name">Crop Name *</Label>
                      <Input
                        id="crop_name"
                        value={formData.crop_name}
                        onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                        required
                        placeholder="e.g., Wheat, Rice, Cotton"
                      />
                    </div>
                    <div>
                      <Label htmlFor="procurement_season">Season</Label>
                      <Input
                        id="procurement_season"
                        value={formData.procurement_season}
                        onChange={(e) => setFormData({ ...formData, procurement_season: e.target.value })}
                        placeholder="Kharif, Rabi"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="price_per_quintal">Price per Quintal (₹)</Label>
                    <Input
                      id="price_per_quintal"
                      type="number"
                      step="0.01"
                      value={formData.price_per_quintal}
                      onChange={(e) => setFormData({ ...formData, price_per_quintal: e.target.value })}
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment_terms">Payment Terms</Label>
                    <Textarea
                      id="payment_terms"
                      value={formData.payment_terms}
                      onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                      rows={2}
                      placeholder="e.g., Immediate payment on delivery"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quality_standards">Quality Standards</Label>
                    <Textarea
                      id="quality_standards"
                      value={formData.quality_standards}
                      onChange={(e) => setFormData({ ...formData, quality_standards: e.target.value })}
                      rows={2}
                      placeholder="e.g., Moisture content below 12%, no mixing"
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
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Currently Procuring</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-green-700 hover:bg-green-800">
                      {isLoading ? "Saving..." : editingItem ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {procurement.length === 0 ? (
          <Card className="border-green-100">
            <CardContent className="py-12 text-center">
              <p className="text-green-600">No procurement data added yet. Click "Add Procurement" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {procurement.map((item) => (
              <Card key={item.id} className="border-green-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-green-900">{item.crop_name}</CardTitle>
                      <CardDescription>{item.procurement_season}</CardDescription>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.price_per_quintal && (
                    <div>
                      <p className="text-sm text-green-600">Price</p>
                      <p className="text-green-900 font-medium">₹{item.price_per_quintal}/quintal</p>
                    </div>
                  )}
                  {item.contact_person && (
                    <div>
                      <p className="text-sm text-green-600">Contact</p>
                      <p className="text-green-900 text-sm">{item.contact_person}</p>
                      {item.contact_phone && <p className="text-green-700 text-sm">{item.contact_phone}</p>}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
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
