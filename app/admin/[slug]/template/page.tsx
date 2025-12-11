import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { TemplateManagement } from "./template-management-client"

interface TemplatePageProps {
  params: {
    slug: string
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = params
  const supabase = createClient()
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    redirect("/login")
  }

  const session = JSON.parse(sessionCookie.value)
  const userId = session.user_id

  // Check if user has access to this PACS
  const { data: assignment } = await supabase
    .from("user_pacs_assignments")
    .select("*")
    .eq("user_id", userId)
    .eq("pacs_slug", slug)
    .single()

  if (!assignment) {
    redirect("/admin")
  }

  // Fetch PACS data
  const { data: pacs, error } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  if (error || !pacs) {
    notFound()
  }

  return <TemplateManagement pacs={pacs} />
}
