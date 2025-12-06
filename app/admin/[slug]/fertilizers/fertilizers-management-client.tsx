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
import type { PACS, PACSFertilizer } from "@/lib/types/pacs"

interface FertilizersManagementProps {
  pacs: PACS
  fertilizers: PACSFertilizer[]
}

export function FertilizersManagement({ pacs, fertilizers: initialFertilizers }: FertilizersManagementProps) {
  const [fertilizers, setFertilizers] = useState(initialFertilizers)
  const [isOpen, setIsOpen] = useState(false)
  const [editingFertilizer, setEditingFertilizer] = useState<PACSFertilizer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    fertilizer_name: "",
    fertilizer_type: "",
    brand: "",
    price_per_unit: "",
    unit: "",
    stock_quantity: "",
    description: "",
    is_available: true,
  })

  const resetForm = () => {
    setFormData({
      fertilizer_name: "",
      fertilizer_type: "",
      brand: "",
      price_per_unit: "",
      unit: "",
      stock_quantity: "",
      description: "",
      is_available: true,
    })
    setEditingFertilizer(null)
  }

  const handleEdit = (fertilizer: PACSFertilizer) => {
    setEditingFertilizer(fertilizer)
    setFormData({
      fertilizer_name: fertilizer.fertilizer_name,
      fertilizer_type: fertilizer.fertilizer_type || "",
      brand: fertilizer.brand || "",
      price_per_unit: fertilizer.price_per_unit?.toString() || "",
      unit: fertilizer.unit || "",
      stock_quantity: fertilizer.stock_quantity?.toString() || "",
      description: fertilizer.description || "",
      is_available: fertilizer.is_available,
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const fertilizerData = {
      pacs_id: pacs.id,
      fertilizer_name: formData.fertilizer_name,
      fertilizer_type: formData.fertilizer_type,
      brand: formData.brand,
      price_per_unit: formData.price_per_unit ? Number.parseFloat(formData.price_per_unit) : null,
      unit: formData.unit,
      stock_quantity: formData.stock_quantity ? Number.parseFloat(formData.stock_quantity) : null,
      description: formData.description,
      is_available: formData.is_available,
    }

    try {
      if (editingFertilizer) {
        const { data, error } = await supabase
          .from("pacs_fertilizers")
          .update(fertilizerData)
          .eq("id", editingFertilizer.id)
          .select()
          .single()

        if (error) throw error

        setFertilizers(fertilizers.map((f) => (f.id === editingFertilizer.id ? data : f)))
      } else {
        const { data, error } = await supabase.from("pacs_fertilizers").insert([fertilizerData]).select().single()

        if (error) throw error

        setFertilizers([...fertilizers, data])
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving fertilizer:", error)
      alert("Failed to save fertilizer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (fertilizerId: string) => {
    if (!confirm("Are you sure you want to delete this fertilizer?")) return

    const supabase = createClient()
    const { error } = await supabase.from("pacs_fertilizers").delete().eq("id", fertilizerId)

    if (error) {
      console.error("Error deleting fertilizer:", error)
      alert("Failed to delete fertilizer")
    } else {
      setFertilizers(fertilizers.filter((f) => f.id !== fertilizerId))
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
                  <h1 className="text-lg font-bold text-green-900">Fertilizer Inventory</h1>
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
                  Add Fertilizer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingFertilizer ? "Edit Fertilizer" : "Add New Fertilizer"}</DialogTitle>
                  <DialogDescription>
                    {editingFertilizer ? "Update fertilizer details" : "Add fertilizer to inventory"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fertilizer_name">Fertilizer Name *</Label>
                      <Input
                        id="fertilizer_name"
                        value={formData.fertilizer_name}
                        onChange={(e) => setFormData({ ...formData, fertilizer_name: e.target.value })}
                        required
                        placeholder="e.g., Urea, DAP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fertilizer_type">Type</Label>
                      <Input
                        id="fertilizer_type"
                        value={formData.fertilizer_type}
                        onChange={(e) => setFormData({ ...formData, fertilizer_type: e.target.value })}
                        placeholder="Organic, Chemical"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price_per_unit">Price (₹)</Label>
                      <Input
                        id="price_per_unit"
                        type="number"
                        step="0.01"
                        value={formData.price_per_unit}
                        onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="kg, liter"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock_quantity">Stock Qty</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        step="0.01"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_available">Available</Label>
                    <Switch
                      id="is_available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-green-700 hover:bg-green-800">
                      {isLoading ? "Saving..." : editingFertilizer ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {fertilizers.length === 0 ? (
          <Card className="border-green-100">
            <CardContent className="py-12 text-center">
              <p className="text-green-600">No fertilizers added yet. Click "Add Fertilizer" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fertilizers.map((fertilizer) => (
              <Card key={fertilizer.id} className="border-green-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-green-900">{fertilizer.fertilizer_name}</CardTitle>
                      <CardDescription>
                        {fertilizer.brand && `${fertilizer.brand} • `}
                        {fertilizer.fertilizer_type}
                      </CardDescription>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        fertilizer.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {fertilizer.is_available ? "Available" : "Out of Stock"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {fertilizer.price_per_unit && (
                      <div>
                        <p className="text-green-600">Price</p>
                        <p className="text-green-900 font-medium">
                          ₹{fertilizer.price_per_unit}/{fertilizer.unit}
                        </p>
                      </div>
                    )}
                    {fertilizer.stock_quantity && (
                      <div>
                        <p className="text-green-600">Stock</p>
                        <p className="text-green-900 font-medium">
                          {fertilizer.stock_quantity} {fertilizer.unit}
                        </p>
                      </div>
                    )}
                  </div>
                  {fertilizer.description && <p className="text-sm text-green-700">{fertilizer.description}</p>}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEdit(fertilizer)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(fertilizer.id)}
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
