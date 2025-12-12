"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Leaf, Save, User, Plus, Trash2, Edit2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { PACS } from "@/lib/types/pacs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

interface TeamMember {
  id: string
  member_name: string
  position: string
  contact_phone: string
  email: string
  photo_url?: string
  responsibilities?: string
  joining_date?: string
  display_order: number
  is_active: boolean
}

interface ManagementTeamProps {
  pacs: PACS
  teamMembers: TeamMember[]
}

export function ManagementTeam({ pacs, teamMembers: initialTeamMembers }: ManagementTeamProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  const [formData, setFormData] = useState({
    president_name: pacs.president_name || "",
    president_contact: pacs.president_contact || "",
    secretary_name: pacs.secretary_name || "",
    secretary_contact: pacs.secretary_contact || "",
    manager_name: pacs.manager_name || "",
    manager_contact: pacs.manager_contact || "",
  })

  const [newMemberData, setNewMemberData] = useState({
    member_name: "",
    position: "",
    contact_phone: "",
    email: "",
    responsibilities: "",
    joining_date: "",
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
      router.refresh()
    } catch (error) {
      console.error("Error updating management team:", error)
      alert("Failed to update management team")
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMemberData.member_name || !newMemberData.position) {
      alert("Please fill in name and position")
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("pacs_team_members")
        .insert({
          pacs_id: pacs.id,
          member_name: newMemberData.member_name,
          position: newMemberData.position,
          contact_phone: newMemberData.contact_phone,
          email: newMemberData.email,
          responsibilities: newMemberData.responsibilities,
          joining_date: newMemberData.joining_date || null,
          display_order: teamMembers.length,
        })
        .select()
        .single()

      if (error) throw error

      setTeamMembers([...teamMembers, data])
      setNewMemberData({
        member_name: "",
        position: "",
        contact_phone: "",
        email: "",
        responsibilities: "",
        joining_date: "",
      })
      setIsAddDialogOpen(false)
      alert("Team member added successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error adding team member:", error)
      alert("Failed to add team member")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateMember = async () => {
    if (!editingMember) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("pacs_team_members")
        .update({
          member_name: editingMember.member_name,
          position: editingMember.position,
          contact_phone: editingMember.contact_phone,
          email: editingMember.email,
          responsibilities: editingMember.responsibilities,
          joining_date: editingMember.joining_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingMember.id)
        .select()
        .single()

      if (error) throw error

      setTeamMembers(teamMembers.map((m) => (m.id === data.id ? data : m)))
      setEditingMember(null)
      alert("Team member updated successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error updating team member:", error)
      alert("Failed to update team member")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    setLoading(true)
    try {
      const { error } = await supabase.from("pacs_team_members").delete().eq("id", memberId)

      if (error) throw error

      setTeamMembers(teamMembers.filter((m) => m.id !== memberId))
      alert("Team member deleted successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error deleting team member:", error)
      alert("Failed to delete team member")
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
            {/* Leadership Section */}
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
              {loading ? "Saving..." : "Save Leadership Details"}
            </Button>
          </div>
        </form>

        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-900">Additional Team Members</h2>
              <p className="text-sm text-green-600 mt-1">Add and manage other team members</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-700 hover:bg-green-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                  <DialogDescription>Enter the details for the new team member</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new_member_name">Name *</Label>
                      <Input
                        id="new_member_name"
                        value={newMemberData.member_name}
                        onChange={(e) => setNewMemberData({ ...newMemberData, member_name: e.target.value })}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_position">Position *</Label>
                      <Input
                        id="new_position"
                        value={newMemberData.position}
                        onChange={(e) => setNewMemberData({ ...newMemberData, position: e.target.value })}
                        placeholder="e.g., Board Member, Treasurer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new_contact">Contact Phone</Label>
                      <Input
                        id="new_contact"
                        value={newMemberData.contact_phone}
                        onChange={(e) => setNewMemberData({ ...newMemberData, contact_phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_email">Email</Label>
                      <Input
                        id="new_email"
                        type="email"
                        value={newMemberData.email}
                        onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_joining_date">Joining Date</Label>
                    <Input
                      id="new_joining_date"
                      type="date"
                      value={newMemberData.joining_date}
                      onChange={(e) => setNewMemberData({ ...newMemberData, joining_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_responsibilities">Responsibilities</Label>
                    <Textarea
                      id="new_responsibilities"
                      value={newMemberData.responsibilities}
                      onChange={(e) => setNewMemberData({ ...newMemberData, responsibilities: e.target.value })}
                      placeholder="Enter key responsibilities"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember} disabled={loading} className="bg-green-700 hover:bg-green-800">
                    {loading ? "Adding..." : "Add Member"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Team Members List */}
          {teamMembers.length === 0 ? (
            <Card className="border-green-100">
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <p className="text-green-600">No additional team members added yet</p>
                <p className="text-sm text-green-500 mt-1">Click "Add Team Member" to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="border-green-100">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-green-700" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-900">{member.member_name}</h3>
                            <p className="text-sm text-green-600">{member.position}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {member.contact_phone && (
                            <div>
                              <span className="text-green-600">Phone:</span>
                              <p className="text-green-900">{member.contact_phone}</p>
                            </div>
                          )}
                          {member.email && (
                            <div>
                              <span className="text-green-600">Email:</span>
                              <p className="text-green-900">{member.email}</p>
                            </div>
                          )}
                          {member.joining_date && (
                            <div>
                              <span className="text-green-600">Joined:</span>
                              <p className="text-green-900">{new Date(member.joining_date).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                        {member.responsibilities && (
                          <div className="mt-3">
                            <span className="text-sm text-green-600">Responsibilities:</span>
                            <p className="text-sm text-green-900 mt-1">{member.responsibilities}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-200 bg-transparent"
                          onClick={() => setEditingMember(member)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Edit Member Dialog */}
        <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>Update the details for this team member</DialogDescription>
            </DialogHeader>
            {editingMember && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_member_name">Name *</Label>
                    <Input
                      id="edit_member_name"
                      value={editingMember.member_name}
                      onChange={(e) => setEditingMember({ ...editingMember, member_name: e.target.value })}
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_position">Position *</Label>
                    <Input
                      id="edit_position"
                      value={editingMember.position}
                      onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                      placeholder="e.g., Board Member, Treasurer"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_contact">Contact Phone</Label>
                    <Input
                      id="edit_contact"
                      value={editingMember.contact_phone}
                      onChange={(e) => setEditingMember({ ...editingMember, contact_phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_email">Email</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={editingMember.email}
                      onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_joining_date">Joining Date</Label>
                  <Input
                    id="edit_joining_date"
                    type="date"
                    value={editingMember.joining_date || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, joining_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_responsibilities">Responsibilities</Label>
                  <Textarea
                    id="edit_responsibilities"
                    value={editingMember.responsibilities || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, responsibilities: e.target.value })}
                    placeholder="Enter key responsibilities"
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMember} disabled={loading} className="bg-green-700 hover:bg-green-800">
                {loading ? "Updating..." : "Update Member"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
