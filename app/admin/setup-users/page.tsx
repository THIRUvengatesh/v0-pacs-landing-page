import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SetupUsersClient from "./setup-users-client"
import { getSession } from "@/lib/auth/session"

export default async function SetupUsersPage() {
  const supabase = await createClient()

  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get all PACS
  const { data: allPacs } = await supabase.from("pacs").select("id, name, slug, district").order("name")

  // Get all user-PACS assignments
  const { data: assignments } = await supabase
    .from("pacs_users")
    .select(`
      id,
      user_id,
      role,
      created_at,
      pacs:pacs_id (name, slug)
    `)
    .order("created_at", { ascending: false })

  return (
    <SetupUsersClient allPacs={allPacs || []} existingAssignments={assignments || []} currentUserId={session.userId} />
  )
}
