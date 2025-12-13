import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth/session"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, slug, email, phone, address, district, state, description } = body

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("pacs")
      .update({
        name,
        slug,
        email,
        phone,
        address,
        district,
        state,
        description,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating PACS:", error)
    return NextResponse.json({ error: "Failed to update PACS" }, { status: 500 })
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

    const { error } = await supabase.from("pacs").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting PACS:", error)
    return NextResponse.json({ error: "Failed to delete PACS" }, { status: 500 })
  }
}
