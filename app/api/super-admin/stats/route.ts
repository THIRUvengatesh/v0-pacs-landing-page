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

    // Get total PACS count
    const { count: pacsCount } = await supabase.from("pacs").select("*", { count: "exact", head: true })

    // Get total users count
    const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })

    // Get active assignments count
    const { count: assignmentsCount } = await supabase
      .from("user_pacs_assignments")
      .select("*", { count: "exact", head: true })

    return NextResponse.json({
      totalPACS: pacsCount || 0,
      totalUsers: usersCount || 0,
      activeAssignments: assignmentsCount || 0,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
