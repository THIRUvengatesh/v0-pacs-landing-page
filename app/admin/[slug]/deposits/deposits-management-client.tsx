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
import type { PACS, PACSDepositScheme } from "@/lib/types/pacs"

interface DepositsManagementProps {
  pacs: PACS
  depositSchemes: PACSDepositScheme[]
}

export function DepositsManagement({ pacs, depositSchemes: initialSchemes }: DepositsManagementProps) {
  const [schemes, setSchemes] = useState(initialSchemes)
  const [isOpen, setIsOpen] = useState(false)
  const [editingScheme, setEditingScheme] = useState<PACSDepositScheme | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    scheme_name: "",
    scheme_description: "",
    interest_rate: "",
    min_deposit: "",
    tenure_months: "",
    withdrawal_rules: "",
    benefits: "",
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      scheme_name: "",
      scheme_description: "",
      interest_rate: "",
      min_deposit: "",
      tenure_months: "",
      withdrawal_rules: "",
      benefits: "",
      is_active: true,
    })
    setEditingScheme(null)
  }

  const handleEdit = (scheme: PACSDepositScheme) => {
    setEditingScheme(scheme)
    setFormData({
      scheme_name: scheme.scheme_name,
      scheme_description: scheme.scheme_description || "",
      interest_rate: scheme.interest_rate?.toString() || "",
      min_deposit: scheme.min_deposit?.toString() || "",
      tenure_months: scheme.tenure_months?.toString() || "",
      withdrawal_rules: scheme.withdrawal_rules || "",
      benefits: scheme.benefits?.join("\n") || "",
      is_active: scheme.is_active,
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const schemeData = {
      pacs_id: pacs.id,
      scheme_name: formData.scheme_name,
      scheme_description: formData.scheme_description,
      interest_rate: formData.interest_rate ? Number.parseFloat(formData.interest_rate) : null,
      min_deposit: formData.min_deposit ? Number.parseFloat(formData.min_deposit) : null,
      tenure_months: formData.tenure_months ? Number.parseInt(formData.tenure_months) : null,
      withdrawal_rules: formData.withdrawal_rules,
      benefits: formData.benefits.split("\n").filter((b) => b.trim()),
      is_active: formData.is_active,
    }

    try {
      if (editingScheme) {
        const { error } = await supabase.from("pacs_deposit_schemes").update(schemeData).eq("id", editingScheme.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("pacs_deposit_schemes").insert([schemeData])

        if (error) throw error
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving deposit scheme:", error)
      alert("Failed to save deposit scheme")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (schemeId: string) => {
    if (!confirm("Are you sure you want to delete this deposit scheme?")) return

    const supabase = createClient()
    const { error } = await supabase.from("pacs_deposit_schemes").delete().eq("id", schemeId)

    if (error) {
      console.error("Error deleting scheme:", error)
      alert("Failed to delete scheme")
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
                  <h1 className="text-lg font-bold text-green-900">Deposit Schemes</h1>
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
                  Add Deposit Scheme
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingScheme ? "Edit Deposit Scheme" : "Add New Deposit Scheme"}</DialogTitle>
                  <DialogDescription>
                    {editingScheme ? "Update deposit scheme details" : "Create a new savings scheme"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="scheme_name">Scheme Name *</Label>
                    <Input
                      id="scheme_name"
                      value={formData.scheme_name}
                      onChange={(e) => setFormData({ ...formData, scheme_name: e.target.value })}
                      required
                      placeholder="e.g., Fixed Deposit, Recurring Deposit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheme_description">Description</Label>
                    <Textarea
                      id="scheme_description"
                      value={formData.scheme_description}
                      onChange={(e) => setFormData({ ...formData, scheme_description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                      <Input
                        id="interest_rate"
                        type="number"
                        step="0.01"
                        value={formData.interest_rate}
                        onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                        placeholder="6.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="min_deposit">Min Deposit (₹)</Label>
                      <Input
                        id="min_deposit"
                        type="number"
                        step="0.01"
                        value={formData.min_deposit}
                        onChange={(e) => setFormData({ ...formData, min_deposit: e.target.value })}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tenure_months">Tenure (Months)</Label>
                      <Input
                        id="tenure_months"
                        type="number"
                        value={formData.tenure_months}
                        onChange={(e) => setFormData({ ...formData, tenure_months: e.target.value })}
                        placeholder="12"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="withdrawal_rules">Withdrawal Rules</Label>
                    <Textarea
                      id="withdrawal_rules"
                      value={formData.withdrawal_rules}
                      onChange={(e) => setFormData({ ...formData, withdrawal_rules: e.target.value })}
                      rows={2}
                      placeholder="e.g., Premature withdrawal allowed with penalty"
                    />
                  </div>
                  <div>
                    <Label htmlFor="benefits">Benefits (one per line)</Label>
                    <Textarea
                      id="benefits"
                      value={formData.benefits}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                      rows={3}
                      placeholder="Higher interest rates&#10;Tax benefits&#10;Loan facility against deposit"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Active Scheme</Label>
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
                      {isLoading ? "Saving..." : editingScheme ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {schemes.length === 0 ? (
          <Card className="border-green-100">
            <CardContent className="py-12 text-center">
              <p className="text-green-600">No deposit schemes added yet. Click "Add Deposit Scheme" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <Card key={scheme.id} className="border-green-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-green-900">{scheme.scheme_name}</CardTitle>
                      <CardDescription>{scheme.scheme_description}</CardDescription>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        scheme.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {scheme.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {scheme.interest_rate && (
                      <div>
                        <p className="text-green-600">Interest</p>
                        <p className="text-green-900 font-medium">{scheme.interest_rate}%</p>
                      </div>
                    )}
                    {scheme.min_deposit && (
                      <div>
                        <p className="text-green-600">Min Deposit</p>
                        <p className="text-green-900 font-medium">₹{scheme.min_deposit.toLocaleString()}</p>
                      </div>
                    )}
                    {scheme.tenure_months && (
                      <div>
                        <p className="text-green-600">Tenure</p>
                        <p className="text-green-900 font-medium">{scheme.tenure_months}m</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEdit(scheme)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(scheme.id)}
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
