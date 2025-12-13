import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth/session"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_pacs_assignments")
      .select("*")
      .order("assigned_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { user_id, pacs_slug, role } = body

    if (!user_id || !pacs_slug) {
      return NextResponse.json({ error: "User ID and PACS slug are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user email and PACS name
    const { data: user } = await supabase.from("users").select("email").eq("id", user_id).single()

    const { data: pacs } = await supabase.from("pacs").select("name").eq("slug", pacs_slug).single()

    if (!user || !pacs) {
      return NextResponse.json({ error: "User or PACS not found" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("user_pacs_assignments")
      .insert({
        user_id,
        pacs_slug,
        email: user.email,
        pacs_name: pacs.name,
        role: role || "admin",
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "This user is already assigned to this PACS" }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating assignment:", error)
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get("user_id")
    const pacs_slug = searchParams.get("pacs_slug")

    if (!user_id || !pacs_slug) {
      return NextResponse.json({ error: "User ID and PACS slug are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("user_pacs_assignments")
      .delete()
      .eq("user_id", user_id)
      .eq("pacs_slug", pacs_slug)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting assignment:", error)
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 })
  }
}
