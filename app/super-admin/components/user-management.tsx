"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, Edit, Trash2, KeyRound } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
}

export default function UserManagement({ onUpdate }: { onUpdate: () => void }) {
  const [users, setUsers] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "admin",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/super-admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = editingUser ? `/api/super-admin/users/${editingUser.id}` : "/api/super-admin/users"
      const method = editingUser ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${editingUser ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchUsers()
        onUpdate()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save user",
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

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      full_name: user.full_name,
      password: "",
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/super-admin/users/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchUsers()
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
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

  const handleResetAllPasswords = async () => {
    if (!confirm("Are you sure you want to reset all user passwords to 'password123'? This action cannot be undone.")) {
      return
    }

    setIsResetting(true)
    try {
      const response = await fetch("/api/super-admin/reset-passwords", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message || "All passwords have been reset to 'password123'",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to reset passwords",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while resetting passwords",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: "",
      full_name: "",
      password: "",
      role: "admin",
    })
    setEditingUser(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <div className="flex gap-2">
          <Button
            onClick={handleResetAllPasswords}
            variant="outline"
            className="gap-2 bg-transparent"
            disabled={isResetting}
          >
            <KeyRound className="h-4 w-4" />
            {isResetting ? "Resetting..." : "Reset All Passwords"}
          </Button>
          <Button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "super_admin" ? "default" : "secondary"}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? "default" : "secondary"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {user.role !== "super_admin" && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>Fill in the details to {editingUser ? "update" : "create"} a user</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!editingUser}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password {!editingUser && "*"}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  placeholder={editingUser ? "Leave blank to keep current password" : ""}
                />
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingUser ? "Update User" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
