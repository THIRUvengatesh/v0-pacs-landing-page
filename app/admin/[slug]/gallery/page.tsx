import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GalleryManagement } from "./gallery-management-client"
import { getSession } from "@/lib/auth/session"

export default async function GalleryManagementPage({ params }: { params: Promise<{ slug: string }> }) {
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

  const { data: gallery } = await supabase
    .from("pacs_gallery")
    .select("*")
    .eq("pacs_id", pacs.id)
    .order("display_order", { ascending: true })

  return <GalleryManagement pacs={pacs} gallery={gallery || []} />
}
