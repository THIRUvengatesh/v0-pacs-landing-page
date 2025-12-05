import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { AdminDashboard } from "./admin-dashboard-client"

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Get all PACS associations for this user
  const { data: pacsAssignments, error: pacsError } = await supabase
    .from("user_pacs_assignments")
    .select("*")
    .eq("user_id", session.userId)

  if (pacsError) {
    console.error("Error fetching PACS:", pacsError)
  }

  // Transform the data to match expected format
  const pacsAssociations =
    pacsAssignments?.map((assignment) => ({
      id: assignment.user_id,
      role: assignment.role,
      pacs: {
        id: assignment.user_id,
        name: assignment.pacs_name,
        slug: assignment.pacs_slug,
        district: "",
        cover_image_url: null,
      },
    })) || []

  return (
    <AdminDashboard
      user={{
        id: session.userId,
        email: session.email,
      }}
      pacsAssociations={pacsAssociations}
    />
  )
}
