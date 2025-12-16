import { createClient } from "@/lib/supabase/server"
import { createSession } from "@/lib/auth/session"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, password, full_name, role, is_active")
      .eq("email", email)
      .maybeSingle()

    console.log(
      "[v0] User check result:",
      user ? { id: user.id, email: user.email, role: user.role, is_active: user.is_active } : null,
      "Error:",
      userError,
    )

    if (userError || user === null) {
      console.log("[v0] User not found:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!user.is_active) {
      console.log("[v0] User is not active:", email)
      return NextResponse.json({ error: "Account is not active" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    console.log("[v0] Password verification result:", isPasswordValid)

    if (!isPasswordValid) {
      console.log("[v0] Password verification failed for:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    })

    const redirectUrl = user.role === "super_admin" ? "/super-admin" : "/admin"
    console.log("[v0] User logged in:", user.email, "Redirecting to:", redirectUrl)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      redirectUrl,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
