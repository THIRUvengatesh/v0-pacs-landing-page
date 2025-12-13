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

    const { data, error } = await supabase.from("pacs").select("*").order("name")

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching PACS:", error)
    return NextResponse.json({ error: "Failed to fetch PACS" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, email, phone, address, district, state, description } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("pacs")
      .insert({
        name,
        slug,
        email,
        phone,
        address,
        district,
        state,
        description,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A PACS with this slug already exists" }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating PACS:", error)
    return NextResponse.json({ error: "Failed to create PACS" }, { status: 500 })
  }
}
