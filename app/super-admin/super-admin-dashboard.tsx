"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, UserCog, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import PACSManagement from "./components/pacs-management"
import UserManagement from "./components/user-management"
import UserPACSAssignment from "./components/user-pacs-assignment"

export default function SuperAdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalPACS: 0,
    totalUsers: 0,
    activeAssignments: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/super-admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Super Admin Panel</h1>
            <p className="text-slate-600 mt-2">Manage PACS, users, and assignments</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total PACS</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalPACS}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Assignments</CardTitle>
              <UserCog className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.activeAssignments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>System Management</CardTitle>
            <CardDescription>Manage all aspects of the PACS directory system</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pacs" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pacs">PACS Management</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="assignments">User Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="pacs" className="mt-6">
                <PACSManagement onUpdate={fetchStats} />
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <UserManagement onUpdate={fetchStats} />
              </TabsContent>

              <TabsContent value="assignments" className="mt-6">
                <UserPACSAssignment onUpdate={fetchStats} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
