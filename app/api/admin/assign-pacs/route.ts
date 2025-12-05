import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { email, pacsSlug, role } = await request.json()

    // Call the PostgreSQL function to assign PACS
    const { data, error } = await supabase.rpc("quick_assign_pacs_by_email", {
      p_user_email: email,
      p_pacs_slug: pacsSlug,
      p_role: role,
    })

    if (error) {
      console.error("[v0] Error assigning PACS:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Server error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
