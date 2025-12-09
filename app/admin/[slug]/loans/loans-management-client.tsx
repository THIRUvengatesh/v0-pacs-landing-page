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
import { Leaf, ArrowLeft, Plus, Edit, Trash2, List, X } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { PACS, PACSLoanScheme } from "@/lib/types/pacs"

interface LoanApplicationStep {
  id?: string
  step_number: number
  step_title: string
  step_description: string
}

interface LoansManagementProps {
  pacs: PACS
  loanSchemes: PACSLoanScheme[]
}

export function LoansManagement({ pacs, loanSchemes: initialSchemes }: LoansManagementProps) {
  const [schemes, setSchemes] = useState(initialSchemes)
  const [isOpen, setIsOpen] = useState(false)
  const [editingScheme, setEditingScheme] = useState<PACSLoanScheme | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isStepsOpen, setIsStepsOpen] = useState(false)
  const [managingStepsSchemeId, setManagingStepsSchemeId] = useState<string | null>(null)
  const [applicationSteps, setApplicationSteps] = useState<LoanApplicationStep[]>([])
  const [newStep, setNewStep] = useState({ step_title: "", step_description: "" })
  //
  const router = useRouter()

  const [formData, setFormData] = useState({
    scheme_name: "",
    scheme_description: "",
    interest_rate: "",
    max_amount: "",
    min_amount: "",
    tenure_months: "",
    eligibility: "",
    required_documents: "",
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      scheme_name: "",
      scheme_description: "",
      interest_rate: "",
      max_amount: "",
      min_amount: "",
      tenure_months: "",
      eligibility: "",
      required_documents: "",
      is_active: true,
    })
    setEditingScheme(null)
  }

  const handleEdit = (scheme: PACSLoanScheme) => {
    setEditingScheme(scheme)
    setFormData({
      scheme_name: scheme.scheme_name,
      scheme_description: scheme.scheme_description || "",
      interest_rate: scheme.interest_rate?.toString() || "",
      max_amount: scheme.max_amount?.toString() || "",
      min_amount: scheme.min_amount?.toString() || "",
      tenure_months: scheme.tenure_months?.toString() || "",
      eligibility: scheme.eligibility || "",
      required_documents: scheme.required_documents?.join("\n") || "",
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
      max_amount: formData.max_amount ? Number.parseFloat(formData.max_amount) : null,
      min_amount: formData.min_amount ? Number.parseFloat(formData.min_amount) : null,
      tenure_months: formData.tenure_months ? Number.parseInt(formData.tenure_months) : null,
      eligibility: formData.eligibility,
      required_documents: formData.required_documents.split("\n").filter((d) => d.trim()),
      is_active: formData.is_active,
    }

    try {
      if (editingScheme) {
        const { data, error } = await supabase
          .from("pacs_loan_schemes")
          .update(schemeData)
          .eq("id", editingScheme.id)
          .select()
          .single()

        if (error) throw error

        setSchemes(schemes.map((s) => (s.id === editingScheme.id ? data : s)))
      } else {
        const { data, error } = await supabase.from("pacs_loan_schemes").insert([schemeData]).select().single()

        if (error) throw error

        setSchemes([...schemes, data])
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving loan scheme:", error)
      alert("Failed to save loan scheme")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (schemeId: string) => {
    if (!confirm("Are you sure you want to delete this loan scheme?")) return

    const supabase = createClient()
    const { error } = await supabase.from("pacs_loan_schemes").delete().eq("id", schemeId)

    if (error) {
      console.error("Error deleting scheme:", error)
      alert("Failed to delete scheme")
    } else {
      setSchemes(schemes.filter((s) => s.id !== schemeId))
      router.refresh()
    }
  }

  const handleManageSteps = async (schemeId: string) => {
    setManagingStepsSchemeId(schemeId)
    setIsStepsOpen(true)

    // Fetch existing steps
    const supabase = createClient()
    const { data, error } = await supabase
      .from("pacs_loan_application_steps")
      .select("*")
      .eq("loan_scheme_id", schemeId)
      .order("step_number")

    if (!error && data) {
      setApplicationSteps(data)
    } else {
      setApplicationSteps([])
    }
  }

  const handleAddStep = async () => {
    if (!newStep.step_title || !newStep.step_description || !managingStepsSchemeId) return

    const supabase = createClient()
    const stepNumber = applicationSteps.length + 1

    const { data, error } = await supabase
      .from("pacs_loan_application_steps")
      .insert([
        {
          loan_scheme_id: managingStepsSchemeId,
          step_number: stepNumber,
          step_title: newStep.step_title,
          step_description: newStep.step_description,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error adding step:", error)
      alert("Failed to add step")
    } else {
      setApplicationSteps([...applicationSteps, data])
      setNewStep({ step_title: "", step_description: "" })
    }
  }

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm("Are you sure you want to delete this step?")) return

    const supabase = createClient()
    const { error } = await supabase.from("pacs_loan_application_steps").delete().eq("id", stepId)

    if (error) {
      console.error("Error deleting step:", error)
      alert("Failed to delete step")
    } else {
      setApplicationSteps(applicationSteps.filter((s) => s.id !== stepId))
    }
  }

  const handleReorderSteps = async () => {
    if (!managingStepsSchemeId) return

    const supabase = createClient()

    // Update step numbers
    for (let i = 0; i < applicationSteps.length; i++) {
      await supabase
        .from("pacs_loan_application_steps")
        .update({ step_number: i + 1 })
        .eq("id", applicationSteps[i].id)
    }
  }

  const moveStepUp = (index: number) => {
    if (index === 0) return
    const newSteps = [...applicationSteps]
    ;[newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]]
    setApplicationSteps(newSteps)
    handleReorderSteps()
  }

  const moveStepDown = (index: number) => {
    if (index === applicationSteps.length - 1) return
    const newSteps = [...applicationSteps]
    ;[newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]]
    setApplicationSteps(newSteps)
    handleReorderSteps()
  }
  //

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
                  <h1 className="text-lg font-bold text-green-900">Loan Schemes</h1>
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
                  Add Loan Scheme
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingScheme ? "Edit Loan Scheme" : "Add New Loan Scheme"}</DialogTitle>
                  <DialogDescription>
                    {editingScheme ? "Update loan scheme details" : "Create a new loan scheme"}
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
                      placeholder="e.g., Agricultural Loan, Crop Loan"
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
                        placeholder="7.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="min_amount">Min Amount (₹)</Label>
                      <Input
                        id="min_amount"
                        type="number"
                        step="0.01"
                        value={formData.min_amount}
                        onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_amount">Max Amount (₹)</Label>
                      <Input
                        id="max_amount"
                        type="number"
                        step="0.01"
                        value={formData.max_amount}
                        onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
                        placeholder="500000"
                      />
                    </div>
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
                      placeholder="Aadhaar Card\nLand documents\nIncome proof"
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

      <Dialog open={isStepsOpen} onOpenChange={setIsStepsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Application Steps</DialogTitle>
            <DialogDescription>Add and manage the step-by-step procedure for this loan application</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Existing Steps */}
            <div className="space-y-3">
              {applicationSteps.map((step, index) => (
                <Card key={step.id} className="border-green-100">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveStepUp(index)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveStepDown(index)}
                          disabled={index === applicationSteps.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          ↓
                        </Button>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-900">{step.step_title}</h4>
                              <p className="text-sm text-green-600">{step.step_description}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => step.id && handleDeleteStep(step.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Step */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-sm">Add New Step</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="step_title">Step Title</Label>
                  <Input
                    id="step_title"
                    value={newStep.step_title}
                    onChange={(e) => setNewStep({ ...newStep, step_title: e.target.value })}
                    placeholder="e.g., Submit Application Form"
                  />
                </div>
                <div>
                  <Label htmlFor="step_description">Step Description</Label>
                  <Textarea
                    id="step_description"
                    value={newStep.step_description}
                    onChange={(e) => setNewStep({ ...newStep, step_description: e.target.value })}
                    rows={2}
                    placeholder="Describe what the applicant needs to do in this step"
                  />
                </div>
                <Button
                  onClick={handleAddStep}
                  disabled={!newStep.step_title || !newStep.step_description}
                  className="w-full bg-green-700 hover:bg-green-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setIsStepsOpen(false)}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* */}

      <main className="container mx-auto px-4 py-8">
        {schemes.length === 0 ? (
          <Card className="border-green-100">
            <CardContent className="py-12 text-center">
              <p className="text-green-600">No loan schemes added yet. Click "Add Loan Scheme" to get started.</p>
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
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {scheme.interest_rate && (
                      <div>
                        <p className="text-green-600">Interest Rate</p>
                        <p className="text-green-900 font-medium">{scheme.interest_rate}%</p>
                      </div>
                    )}
                    {scheme.tenure_months && (
                      <div>
                        <p className="text-green-600">Tenure</p>
                        <p className="text-green-900 font-medium">{scheme.tenure_months} months</p>
                      </div>
                    )}
                    {scheme.min_amount && (
                      <div>
                        <p className="text-green-600">Min Amount</p>
                        <p className="text-green-900 font-medium">₹{scheme.min_amount.toLocaleString()}</p>
                      </div>
                    )}
                    {scheme.max_amount && (
                      <div>
                        <p className="text-green-600">Max Amount</p>
                        <p className="text-green-900 font-medium">₹{scheme.max_amount.toLocaleString()}</p>
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
                      onClick={() => handleManageSteps(scheme.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-200"
                    >
                      <List className="h-4 w-4 mr-2" />
                      Steps
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
                  {/* */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
