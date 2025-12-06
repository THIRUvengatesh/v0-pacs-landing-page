import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { createAdminClient } from "@/lib/supabase/admin-client"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request) {
  try {
    console.log("[v0] PACS update API called")

    const session = await getSession()
    if (!session) {
      console.log("[v0] No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { pacsId, ...updateData } = body

    console.log("[v0] Updating PACS:", pacsId, "for user:", session.userId)
    console.log("[v0] Update data:", updateData)

    const supabase = await createClient()

    const { data: pacsData, error: pacsError } = await supabase.from("pacs").select("slug").eq("id", pacsId).single()

    if (pacsError || !pacsData) {
      console.log("[v0] PACS not found:", pacsError)
      return NextResponse.json({ error: "PACS not found" }, { status: 404 })
    }

    const { data: assignment, error: assignmentError } = await supabase
      .from("user_pacs_assignments")
      .select("*")
      .eq("user_id", session.userId)
      .eq("pacs_slug", pacsData.slug)
      .single()

    console.log("[v0] Assignment check:", assignment, assignmentError)

    if (!assignment) {
      console.log("[v0] User not authorized for this PACS")
      return NextResponse.json({ error: "Not authorized for this PACS" }, { status: 403 })
    }

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from("pacs")
      .update({
        name: updateData.name,
        district: updateData.district,
        state: updateData.state,
        address: updateData.address,
        phone: updateData.phone,
        email: updateData.email,
        description: updateData.description,
        established_year: updateData.established_year,
        member_count: updateData.member_count,
        about_history: updateData.about_history,
        about_services: updateData.about_services,
        about_impact: updateData.about_impact,
        latitude: updateData.latitude,
        longitude: updateData.longitude,
        map_url: updateData.map_url,
        cover_image_url: updateData.cover_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pacsId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Database update error:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] PACS updated successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error in PACS update:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update PACS" },
      { status: 500 },
    )
  }
}
