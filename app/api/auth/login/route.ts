import { createClient } from "@/lib/supabase/server"
import { createSession } from "@/lib/auth/session"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: userCheck, error: checkError } = await supabase
      .from("users")
      .select("id, email, is_active, role")
      .eq("email", email)
      .single()

    console.log("[v0] User check result:", userCheck, "Error:", checkError)

    if (checkError || !userCheck) {
      console.log("[v0] User not found:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!userCheck.is_active) {
      console.log("[v0] User is not active:", email)
      return NextResponse.json({ error: "Account is not active" }, { status: 401 })
    }

    // Call the verify_password function
    const { data, error } = await supabase.rpc("verify_password", {
      email_input: email,
      password_input: password,
    })

    console.log("[v0] verify_password result:", data, "Error:", error)

    if (error) {
      console.error("[v0] Login error:", error)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!data || data.length === 0) {
      console.log("[v0] Password verification failed for:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = data[0]

    // Create session
    await createSession({
      userId: user.user_id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    })

    const redirectUrl = user.role === "super_admin" ? "/super-admin" : "/admin"
    console.log("[v0] User logged in:", user.email, "Redirecting to:", redirectUrl)

    return NextResponse.json({
      success: true,
      user: {
        id: user.user_id,
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
