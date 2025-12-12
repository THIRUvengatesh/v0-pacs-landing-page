"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Leaf, User, Plus, Trash2, Users, Phone, Mail, Pencil } from "lucide-react"
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
  is_leadership: boolean
  display_priority: number
}

interface UnifiedTeamMember {
  id: string
  name: string
  position: string
  contact: string
  email?: string
  responsibilities?: string
  joining_date?: string
  isLeadership: boolean // true for president/secretary/manager
  type?: "president" | "secretary" | "manager" | "custom"
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
  const [isAddingLeadership, setIsAddingLeadership] = useState(false)

  const [newMemberData, setNewMemberData] = useState({
    member_name: "",
    position: "",
    contact_phone: "",
    email: "",
    responsibilities: "",
    joining_date: "",
    is_leadership: false,
  })

  const leadershipMembers = teamMembers
    .filter((m) => m.is_leadership)
    .sort((a, b) => a.display_priority - b.display_priority)
  const regularMembers = teamMembers.filter((m) => !m.is_leadership).sort((a, b) => a.display_order - b.display_order)

  const handleAddMember = async () => {
    if (!newMemberData.member_name || !newMemberData.position) {
      alert("Please fill in required fields (Name and Position)")
      return
    }

    setLoading(true)
    try {
      const displayPriority = newMemberData.is_leadership ? 10 : 100

      const { data, error } = await supabase
        .from("pacs_team_members")
        .insert([
          {
            pacs_id: pacs.id,
            member_name: newMemberData.member_name,
            position: newMemberData.position,
            contact_phone: newMemberData.contact_phone || "",
            email: newMemberData.email || "",
            responsibilities: newMemberData.responsibilities || "",
            joining_date: newMemberData.joining_date || null,
            display_order: teamMembers.length + 1,
            is_active: true,
            is_leadership: newMemberData.is_leadership,
            display_priority: displayPriority,
          },
        ])
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
        is_leadership: false,
      })
      setIsAddDialogOpen(false)
      setIsAddingLeadership(false)
      alert("Team member added successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error adding team member:", error)
      alert("Failed to add team member")
    } finally {
      setLoading(false)
    }
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
  }

  const handleUpdateMember = async () => {
    if (!editingMember) return

    setLoading(true)
    try {
      const displayPriority = editingMember.is_leadership ? 10 : 100

      const { data, error } = await supabase
        .from("pacs_team_members")
        .update({
          member_name: editingMember.member_name,
          position: editingMember.position,
          contact_phone: editingMember.contact_phone,
          email: editingMember.email || "",
          responsibilities: editingMember.responsibilities,
          joining_date: editingMember.joining_date || null,
          is_leadership: editingMember.is_leadership,
          display_priority: displayPriority,
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

  const handleDeleteMember = async (member: TeamMember) => {
    const memberType = member.is_leadership ? "leadership member" : "team member"
    if (!confirm(`Are you sure you want to delete this ${memberType}?`)) return

    setLoading(true)
    try {
      const { error } = await supabase.from("pacs_team_members").delete().eq("id", member.id)

      if (error) throw error

      setTeamMembers(teamMembers.filter((m) => m.id !== member.id))
      alert(`${memberType.charAt(0).toUpperCase() + memberType.slice(1)} deleted successfully!`)
      router.refresh()
    } catch (error) {
      console.error("Error deleting member:", error)
      alert(`Failed to delete ${memberType}`)
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
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-green-900">Leadership Team</h2>
                <p className="text-sm text-green-600 mt-1">Core leadership members with key responsibilities</p>
              </div>
              <Button
                onClick={() => {
                  setIsAddingLeadership(true)
                  setNewMemberData({ ...newMemberData, is_leadership: true })
                  setIsAddDialogOpen(true)
                }}
                className="bg-green-700 hover:bg-green-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Leadership Member
              </Button>
            </div>

            {leadershipMembers.length === 0 ? (
              <Card className="border-green-100">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <p className="text-green-600">No leadership members added yet</p>
                  <p className="text-sm text-green-500 mt-1">Click "Add Leadership Member" to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {leadershipMembers.map((member) => (
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
                          {member.contact_phone && (
                            <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                              <Phone className="h-4 w-4" />
                              {member.contact_phone}
                            </div>
                          )}
                          {member.email && (
                            <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                              <Mail className="h-4 w-4" />
                              {member.email}
                            </div>
                          )}
                          {member.responsibilities && (
                            <p className="text-sm text-green-600 mt-2">{member.responsibilities}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMember(member)}
                            className="border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMember(member)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
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

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-green-900">Additional Team Members</h2>
                <p className="text-sm text-green-600 mt-1">Other staff and committee members</p>
              </div>
              <Button
                onClick={() => {
                  setIsAddingLeadership(false)
                  setNewMemberData({ ...newMemberData, is_leadership: false })
                  setIsAddDialogOpen(true)
                }}
                className="bg-green-700 hover:bg-green-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>

            {regularMembers.length === 0 ? (
              <Card className="border-green-100">
                <CardContent className="py-12 text-center">
                  <User className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <p className="text-green-600">No additional team members added yet</p>
                  <p className="text-sm text-green-500 mt-1">Click "Add Team Member" to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {regularMembers.map((member) => (
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
                          {member.contact_phone && (
                            <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                              <Phone className="h-4 w-4" />
                              {member.contact_phone}
                            </div>
                          )}
                          {member.email && (
                            <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                              <Mail className="h-4 w-4" />
                              {member.email}
                            </div>
                          )}
                          {member.responsibilities && (
                            <p className="text-sm text-green-600 mt-2">{member.responsibilities}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMember(member)}
                            className="border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMember(member)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
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
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New {isAddingLeadership ? "Leadership" : "Team"} Member</DialogTitle>
              <DialogDescription>
                Enter the details for the new {isAddingLeadership ? "leadership" : "team"} member
              </DialogDescription>
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
                    placeholder={isAddingLeadership ? "e.g., President, Secretary" : "e.g., Board Member, Treasurer"}
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

        <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>
                Update the details for this {editingMember?.is_leadership ? "leadership" : "team"} member
              </DialogDescription>
            </DialogHeader>
            {editingMember && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_name">Name *</Label>
                    <Input
                      id="edit_name"
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
                      placeholder="e.g., President, Board Member"
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
                      value={editingMember.email || ""}
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit_is_leadership"
                    checked={editingMember.is_leadership}
                    onChange={(e) => setEditingMember({ ...editingMember, is_leadership: e.target.checked })}
                    className="rounded border-green-300 text-green-600 focus:ring-green-500"
                  />
                  <Label htmlFor="edit_is_leadership" className="text-sm">
                    Mark as Leadership Member
                  </Label>
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
