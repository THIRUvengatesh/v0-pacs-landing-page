import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth/session"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("users")
      .select("id, email, full_name, role, is_active, created_at")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email, full_name, password, role } = body

    if (!email || !full_name || !password) {
      return NextResponse.json({ error: "Email, name, and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        full_name,
        password: hashedPassword,
        role: role || "admin",
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
