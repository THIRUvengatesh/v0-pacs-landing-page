"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Leaf, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Redirect to admin dashboard
      router.push("/admin")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-green-700 hover:text-green-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="border-green-100 shadow-lg">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-green-900">Welcome Back</CardTitle>
              <CardDescription className="text-green-600">Sign in to access your PACS account</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-green-900">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-green-900">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-green-600">
                Contact your administrator for login credentials
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials info */}
        <Card className="mt-4 border-green-100 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold text-green-900 mb-2">Demo Login Credentials:</p>
            <div className="text-xs text-green-700 space-y-1">
              <p>📧 admin@rajnagar.com</p>
              <p>📧 admin@basavakalyan.com</p>
              <p className="mt-2">🔑 Password: password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
