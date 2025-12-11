"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  ArrowLeft,
  Building2,
  Users,
  Briefcase,
  Tractor,
  Sprout,
  Wheat,
  CreditCard,
  PiggyBank,
  ImageIcon,
  Layout,
} from "lucide-react"
import Link from "next/link"
import type { PACS } from "@/lib/types/pacs"

interface AdminPACSManagementProps {
  pacs: PACS
  userRole: string
}

export function AdminPACSManagement({ pacs, userRole }: AdminPACSManagementProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-green-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
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
                  <h1 className="text-lg font-bold text-green-900">{pacs.name}</h1>
                  <p className="text-xs text-green-600">{userRole} Dashboard</p>
                </div>
              </div>
            </div>
            <Link href={`/${pacs.slug}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                View Public Page
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-green-100 p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="template"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              <Layout className="h-4 w-4 mr-2" />
              Template
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger
              value="machinery"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              <Tractor className="h-4 w-4 mr-2" />
              Machinery
            </TabsTrigger>
            <TabsTrigger value="loans" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
              <CreditCard className="h-4 w-4 mr-2" />
              Loans
            </TabsTrigger>
            <TabsTrigger
              value="deposits"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              <PiggyBank className="h-4 w-4 mr-2" />
              Deposits
            </TabsTrigger>
            <TabsTrigger
              value="fertilizers"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              <Sprout className="h-4 w-4 mr-2" />
              Fertilizers
            </TabsTrigger>
            <TabsTrigger
              value="procurement"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              <Wheat className="h-4 w-4 mr-2" />
              Procurement
            </TabsTrigger>
            <TabsTrigger
              value="management"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              <Users className="h-4 w-4 mr-2" />
              Management
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">PACS Information</CardTitle>
                <CardDescription>Basic details about your cooperative society</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-700">Name</p>
                    <p className="text-green-900">{pacs.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">District</p>
                    <p className="text-green-900">{pacs.district}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Phone</p>
                    <p className="text-green-900">{pacs.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Email</p>
                    <p className="text-green-900">{pacs.email || "Not provided"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-green-700">Address</p>
                    <p className="text-green-900">{pacs.address || "Not provided"}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href={`/admin/${pacs.slug}/edit`}>
                    <Button className="bg-green-700 hover:bg-green-800">Edit PACS Information</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="template">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">Template Management</CardTitle>
                <CardDescription>Choose and customize your landing page template</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/${pacs.slug}/template`}>
                  <Button className="bg-green-700 hover:bg-green-800">Manage Templates</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">Services Management</CardTitle>
                <CardDescription>Manage your PACS services and offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/${pacs.slug}/services`}>
                  <Button className="bg-green-700 hover:bg-green-800">Manage Services</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="machinery">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">Machinery Rental Management</CardTitle>
                <CardDescription>Manage tractors and agricultural equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/${pacs.slug}/machinery`}>
                  <Button className="bg-green-700 hover:bg-green-800">Manage Machinery</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">Loan Schemes Management</CardTitle>
                <CardDescription>Manage agricultural loan schemes</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/${pacs.slug}/loans`}>
                  <Button className="bg-green-700 hover:bg-green-800">Manage Loan Schemes</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposits">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">Deposit Schemes Management</CardTitle>
                <CardDescription>Manage savings and deposit schemes</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/${pacs.slug}/deposits`}>
                  <Button className="bg-green-700 hover:bg-green-800">Manage Deposit Schemes</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fertilizers">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">Fertilizer Inventory</CardTitle>
                <CardDescription>Manage fertilizer stock and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/${pacs.slug}/fertilizers`}>
                  <Button className="bg-green-700 hover:bg-green-800">Manage Fertilizers</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="procurement">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">Crop Procurement Management</CardTitle>
                <CardDescription>Manage crop procurement and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/${pacs.slug}/procurement`}>
                  <Button className="bg-green-700 hover:bg-green-800">Manage Procurement</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">Team Management</CardTitle>
                <CardDescription>Manage president, secretary, manager details</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/${pacs.slug}/management`}>
                  <Button className="bg-green-700 hover:bg-green-800">Manage Team</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-900">Photo Gallery</CardTitle>
                <CardDescription>Manage PACS photos and images</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/${pacs.slug}/gallery`}>
                  <Button className="bg-green-700 hover:bg-green-800">Manage Gallery</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
