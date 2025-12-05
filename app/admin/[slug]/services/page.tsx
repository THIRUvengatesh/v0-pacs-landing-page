import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ServicesManagement } from "./services-management-client"
import { getSession } from "@/lib/auth/session"

export default async function ServicesManagementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const session = await getSession()
  if (!session) redirect("/auth/login")

  const { data: pacs } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  if (!pacs) redirect("/admin")

  const { data: pacsUser } = await supabase
    .from("pacs_users")
    .select("*")
    .eq("user_id", session.userId)
    .eq("pacs_id", pacs.id)
    .single()

  if (!pacsUser) redirect("/admin")

  const { data: services } = await supabase
    .from("pacs_services")
    .select("*")
    .eq("pacs_id", pacs.id)
    .order("created_at", { ascending: false })

  return <ServicesManagement pacs={pacs} services={services || []} />
}
