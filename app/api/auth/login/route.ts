import { createClient } from "@/lib/supabase/server"
import { createSession } from "@/lib/auth/session"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Call the verify_password function
    const { data, error } = await supabase.rpc("verify_password", {
      email_input: email,
      password_input: password,
    })

    if (error) {
      console.error("Login error:", error)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!data || data.length === 0) {
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
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
