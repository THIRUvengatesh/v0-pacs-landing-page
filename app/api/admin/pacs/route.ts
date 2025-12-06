import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth/session"

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

    const supabase = await createClient()

    // Verify user has access to this PACS
    const { data: assignment } = await supabase
      .from("user_pacs_assignments")
      .select("*")
      .eq("user_id", session.userId)
      .eq("pacs_slug", updateData.slug)
      .single()

    if (!assignment) {
      console.log("[v0] User not authorized for this PACS")
      return NextResponse.json({ error: "Not authorized for this PACS" }, { status: 403 })
    }

    // Update PACS information
    const { data, error } = await supabase
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
      console.error("[v0] Database error:", error)
      throw error
    }

    console.log("[v0] PACS updated successfully")
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error in PACS update:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update PACS" },
      { status: 500 },
    )
  }
}
