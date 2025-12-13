"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  full_name: string
}

interface PACS {
  id: string
  name: string
  slug: string
}

interface Assignment {
  user_id: string
  pacs_slug: string
  email: string
  pacs_name: string
  role: string
}

export default function UserPACSAssignment({ onUpdate }: { onUpdate: () => void }) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [pacs, setPacs] = useState<PACS[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    user_id: "",
    pacs_slug: "",
    role: "admin",
  })

  useEffect(() => {
    fetchAssignments()
    fetchUsers()
    fetchPACS()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/super-admin/assignments")
      if (response.ok) {
        const data = await response.json()
        setAssignments(data)
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/super-admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.filter((u: User) => u.role !== "super_admin"))
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const fetchPACS = async () => {
    try {
      const response = await fetch("/api/super-admin/pacs")
      if (response.ok) {
        const data = await response.json()
        setPacs(data)
      }
    } catch (error) {
      console.error("Failed to fetch PACS:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/super-admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User assigned to PACS successfully",
        })
        setIsDialogOpen(false)
        resetForm()
        fetchAssignments()
        onUpdate()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to assign user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (userId: string, pacsSlug: string) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return

    try {
      const response = await fetch(`/api/super-admin/assignments?user_id=${userId}&pacs_slug=${pacsSlug}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Assignment removed successfully",
        })
        fetchAssignments()
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: "Failed to remove assignment",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      user_id: "",
      pacs_slug: "",
      role: "admin",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User-PACS Assignments</h3>
        <Button
          onClick={() => {
            resetForm()
            setIsDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Assign User to PACS
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>PACS</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={`${assignment.user_id}-${assignment.pacs_slug}`}>
                <TableCell className="font-medium">
                  {users.find((u) => u.id === assignment.user_id)?.full_name || "Unknown"}
                </TableCell>
                <TableCell>{assignment.email}</TableCell>
                <TableCell>{assignment.pacs_name}</TableCell>
                <TableCell>
                  <Badge>{assignment.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(assignment.user_id, assignment.pacs_slug)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign User to PACS</DialogTitle>
            <DialogDescription>Select a user and PACS to create an assignment</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user">User *</Label>
                <Select
                  value={formData.user_id}
                  onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pacs">PACS *</Label>
                <Select
                  value={formData.pacs_slug}
                  onValueChange={(value) => setFormData({ ...formData, pacs_slug: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a PACS" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacs.map((p) => (
                      <SelectItem key={p.id} value={p.slug}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !formData.user_id || !formData.pacs_slug}>
                {isLoading ? "Assigning..." : "Assign User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
