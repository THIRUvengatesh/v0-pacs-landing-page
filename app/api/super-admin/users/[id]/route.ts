import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth/session"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { full_name, password, role } = body

    const supabase = await createClient()

    const updateData: any = {
      full_name,
      role,
    }

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const { data, error } = await supabase.from("users").update(updateData).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
