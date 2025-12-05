import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminPACSManagement } from "./admin-pacs-management-client"
import { getSession } from "@/lib/auth/session"

export default async function AdminPACSPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get PACS by slug
  const { data: pacs, error: pacsError } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  if (pacsError || !pacs) {
    redirect("/admin")
  }

  const { data: pacsUser, error: accessError } = await supabase
    .from("pacs_users")
    .select("*")
    .eq("user_id", session.userId)
    .eq("pacs_id", pacs.id)
    .single()

  if (accessError || !pacsUser) {
    redirect("/admin")
  }

  return <AdminPACSManagement pacs={pacs} userRole={pacsUser.role} />
}
