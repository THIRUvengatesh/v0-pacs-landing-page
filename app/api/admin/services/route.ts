import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createClient()

    // Verify user has access to this PACS
    const { data: assignment } = await supabase
      .from("user_pacs_assignments")
      .select("*")
      .eq("user_id", session.userId)
      .single()

    if (!assignment) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get pacs_id from slug
    const { data: pacs } = await supabase.from("pacs").select("id").eq("slug", assignment.pacs_slug).single()

    if (!pacs) {
      return NextResponse.json({ error: "PACS not found" }, { status: 404 })
    }

    // Verify the service belongs to user's PACS
    if (body.pacs_id && body.pacs_id !== pacs.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const serviceData = {
      ...body,
      pacs_id: pacs.id,
    }

    const { data, error } = await supabase.from("pacs_services").insert([serviceData]).select().single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    const supabase = await createClient()

    // Verify user has access to this service's PACS
    const { data: service } = await supabase
      .from("pacs_services")
      .select("pacs_id, pacs:pacs!inner(slug)")
      .eq("id", id)
      .single()

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const { data: assignment } = await supabase
      .from("user_pacs_assignments")
      .select("*")
      .eq("user_id", session.userId)
      .eq("pacs_slug", (service.pacs as any).slug)
      .single()

    if (!assignment) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { data, error } = await supabase.from("pacs_services").update(updateData).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify user has access to this service's PACS
    const { data: service } = await supabase
      .from("pacs_services")
      .select("pacs_id, pacs:pacs!inner(slug)")
      .eq("id", id)
      .single()

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const { data: assignment } = await supabase
      .from("user_pacs_assignments")
      .select("*")
      .eq("user_id", session.userId)
      .eq("pacs_slug", (service.pacs as any).slug)
      .single()

    if (!assignment) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { error } = await supabase.from("pacs_services").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
