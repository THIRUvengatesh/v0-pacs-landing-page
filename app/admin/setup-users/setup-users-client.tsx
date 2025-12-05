"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Leaf, UserPlus, Users, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

interface PACS {
  id: string
  name: string
  slug: string
  district: string
}

interface Assignment {
  id: string
  user_id: string
  role: string
  created_at: string
  pacs: {
    name: string
    slug: string
  }
}

export default function SetupUsersClient({
  allPacs,
  existingAssignments,
  currentUserId,
}: {
  allPacs: PACS[]
  existingAssignments: Assignment[]
  currentUserId: string
}) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [selectedPacs, setSelectedPacs] = useState("")
  const [role, setRole] = useState("admin")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/assign-pacs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pacsSlug: selectedPacs, role }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: data.message })
        setEmail("")
        setSelectedPacs("")
        router.refresh()
      } else {
        setMessage({ type: "error", text: data.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to assign PACS. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="font-semibold text-lg">PACS Admin</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">User & PACS Setup</h1>
          <p className="text-gray-600">Assign users to manage PACS</p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Demo User Credentials:</h3>
              <div className="bg-green-50 p-4 rounded-lg space-y-2 text-sm">
                <div>
                  <strong>Rajnagar PACS Admin:</strong>
                  <div className="ml-4 mt-1">
                    Email: <code className="bg-white px-2 py-1 rounded">admin@rajnagar-pacs.local</code>
                    <br />
                    Password: <code className="bg-white px-2 py-1 rounded">RajnagarAdmin123!</code>
                  </div>
                </div>
                <div>
                  <strong>Basavakalyan PACS Admin:</strong>
                  <div className="ml-4 mt-1">
                    Email: <code className="bg-white px-2 py-1 rounded">admin@basavakalyan-pacs.local</code>
                    <br />
                    Password: <code className="bg-white px-2 py-1 rounded">BasavakalyanAdmin123!</code>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Setup Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>
                  Create a new user account at{" "}
                  <Link href="/auth/sign-up" className="text-green-600 underline">
                    /auth/sign-up
                  </Link>
                </li>
                <li>Use the form below to assign that user to a PACS</li>
                <li>The user can then log in and manage their assigned PACS</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-600" />
              Assign User to PACS
            </CardTitle>
            <CardDescription>Enter the email of an existing user to assign them to a PACS</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssign} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pacs">Select PACS</Label>
                <Select value={selectedPacs} onValueChange={setSelectedPacs} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a PACS" />
                  </SelectTrigger>
                  <SelectContent>
                    {allPacs.map((pacs) => (
                      <SelectItem key={pacs.id} value={pacs.slug}>
                        {pacs.name} - {pacs.district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {message && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  <span>{message.text}</span>
                </div>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Assigning..." : "Assign User to PACS"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
            <CardDescription>Users who have been assigned to PACS</CardDescription>
          </CardHeader>
          <CardContent>
            {existingAssignments.length === 0 ? (
              <p className="text-gray-500 text-sm">No assignments yet. Create one above.</p>
            ) : (
              <div className="space-y-3">
                {existingAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{assignment.pacs.name}</p>
                      <p className="text-sm text-gray-600">
                        {assignment.user_id === currentUserId ? "You" : assignment.user_id} • {assignment.role}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(assignment.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
