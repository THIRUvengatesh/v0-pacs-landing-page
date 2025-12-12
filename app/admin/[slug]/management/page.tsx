import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ManagementTeamClient from "./management-team-client"
import { getSession } from "@/lib/auth/session"

export default async function ManagementTeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const session = await getSession()
  if (!session) redirect("/auth/login")

  const { data: pacs } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  if (!pacs) redirect("/admin")

  const { data: assignment } = await supabase
    .from("user_pacs_assignments")
    .select("*")
    .eq("user_id", session.userId)
    .eq("pacs_slug", slug)
    .single()

  if (!assignment) redirect("/admin")

  const { data: teamMembers } = await supabase
    .from("pacs_team_members")
    .select("*")
    .eq("pacs_id", pacs.id)
    .eq("is_active", true)
    .order("display_priority", { ascending: true })
    .order("display_order", { ascending: true })

  return <ManagementTeamClient pacsId={pacs.id} pacsSlug={slug} initialTeamMembers={teamMembers || []} />
}
