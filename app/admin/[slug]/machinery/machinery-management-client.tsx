"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import type { PACS, PACSmachinery } from "@/lib/types/pacs"

interface MachineryManagementProps {
  pacs: PACS
  machinery: PACSmachinery[]
}

export function MachineryManagement({ pacs, machinery: initialMachinery }: MachineryManagementProps) {
  const [machinery, setMachinery] = useState(initialMachinery)
  const [isOpen, setIsOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<PACSmachinery | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    machinery_name: "",
    rent_per_hour: "",
    rent_per_day: "",
    contact_person: "",
    contact_phone: "",
    availability_status: "available",
  })

  const resetForm = () => {
    setFormData({
      machinery_name: "",
      rent_per_hour: "",
      rent_per_day: "",
      contact_person: "",
      contact_phone: "",
      availability_status: "available",
    })
    setEditingMachine(null)
  }

  const handleEdit = (machine: PACSmachinery) => {
    setEditingMachine(machine)
    setFormData({
      machinery_name: machine.machinery_name,
      rent_per_hour: machine.rent_per_hour?.toString() || "",
      rent_per_day: machine.rent_per_day?.toString() || "",
      contact_person: machine.contact_person || "",
      contact_phone: machine.contact_phone || "",
      availability_status: machine.availability_status || "available",
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const machineData = {
      pacs_id: pacs.id,
      machinery_name: formData.machinery_name,
      rent_per_hour: formData.rent_per_hour ? Number.parseFloat(formData.rent_per_hour) : null,
      rent_per_day: formData.rent_per_day ? Number.parseFloat(formData.rent_per_day) : null,
      contact_person: formData.contact_person,
      contact_phone: formData.contact_phone,
      availability_status: formData.availability_status,
    }

    try {
      if (editingMachine) {
        const { error } = await supabase.from("pacs_machinery").update(machineData).eq("id", editingMachine.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("pacs_machinery").insert([machineData])

        if (error) throw error
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving machinery:", error)
      alert("Failed to save machinery")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (machineId: string) => {
    if (!confirm("Are you sure you want to delete this machinery?")) return

    const supabase = createClient()
    const { error } = await supabase.from("pacs_machinery").delete().eq("id", machineId)

    if (error) {
      console.error("Error deleting machinery:", error)
      alert("Failed to delete machinery")
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
                  <h1 className="text-lg font-bold text-green-900">Machinery Management</h1>
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
                  Add Machinery
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingMachine ? "Edit Machinery" : "Add New Machinery"}</DialogTitle>
                  <DialogDescription>
                    {editingMachine ? "Update machinery details" : "Add new equipment for rental"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="machinery_name">Machinery Name *</Label>
                    <Input
                      id="machinery_name"
                      value={formData.machinery_name}
                      onChange={(e) => setFormData({ ...formData, machinery_name: e.target.value })}
                      required
                      placeholder="e.g., Tractor, Harvester, Sprayer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rent_per_hour">Rent per Hour (₹)</Label>
                      <Input
                        id="rent_per_hour"
                        type="number"
                        step="0.01"
                        value={formData.rent_per_hour}
                        onChange={(e) => setFormData({ ...formData, rent_per_hour: e.target.value })}
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rent_per_day">Rent per Day (₹)</Label>
                      <Input
                        id="rent_per_day"
                        type="number"
                        step="0.01"
                        value={formData.rent_per_day}
                        onChange={(e) => setFormData({ ...formData, rent_per_day: e.target.value })}
                        placeholder="3000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="availability_status">Availability Status</Label>
                    <Select
                      value={formData.availability_status}
                      onValueChange={(value) => setFormData({ ...formData, availability_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                        <SelectItem value="maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-green-700 hover:bg-green-800">
                      {isLoading ? "Saving..." : editingMachine ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {machinery.length === 0 ? (
          <Card className="border-green-100">
            <CardContent className="py-12 text-center">
              <p className="text-green-600">No machinery added yet. Click "Add Machinery" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machinery.map((machine) => (
              <Card key={machine.id} className="border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900">{machine.machinery_name}</CardTitle>
                  <CardDescription>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        machine.availability_status === "available"
                          ? "bg-green-100 text-green-700"
                          : machine.availability_status === "maintenance"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {machine.availability_status}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-green-600">Rates</p>
                    <p className="text-green-900">
                      {machine.rent_per_hour && `₹${machine.rent_per_hour}/hr`}
                      {machine.rent_per_hour && machine.rent_per_day && " • "}
                      {machine.rent_per_day && `₹${machine.rent_per_day}/day`}
                    </p>
                  </div>
                  {machine.contact_person && (
                    <div>
                      <p className="text-sm text-green-600">Contact</p>
                      <p className="text-green-900 text-sm">{machine.contact_person}</p>
                      {machine.contact_phone && <p className="text-green-700 text-sm">{machine.contact_phone}</p>}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEdit(machine)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(machine.id)}
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
