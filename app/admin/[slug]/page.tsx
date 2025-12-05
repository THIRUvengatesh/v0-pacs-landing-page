import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminPACSManagement } from "./admin-pacs-management-client"
import { getSession } from "@/lib/auth/session"

export default async function AdminPACSPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const session = await getSession()

  console.log("[v0] Admin PACS Page - Session:", session)

  if (!session) {
    redirect("/auth/login")
  }

  const { data: pacs, error: pacsError } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  console.log("[v0] PACS lookup:", { pacs, pacsError, slug })

  if (pacsError || !pacs) {
    console.error("[v0] PACS not found or error:", pacsError)
    redirect("/admin")
  }

  const { data: assignment, error: accessError } = await supabase
    .from("user_pacs_assignments")
    .select("*")
    .eq("user_id", session.userId)
    .eq("pacs_slug", slug)
    .single()

  console.log("[v0] Access check:", { assignment, accessError, userId: session.userId, slug })

  if (accessError || !assignment) {
    console.error("[v0] Access denied:", accessError)
    redirect("/admin")
  }

  return <AdminPACSManagement pacs={pacs} userRole={assignment.role} />
}
