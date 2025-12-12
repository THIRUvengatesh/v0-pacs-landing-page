import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import PDSShopsManagementClient from "./pds-shops-management-client"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PDSShopsManagementPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get PACS details
  const { data: pacs } = await supabase.from("pacs").select("id, name, slug").eq("slug", slug).single()

  if (!pacs) {
    redirect("/admin")
  }

  // Fetch PDS shops
  const { data: pdsShops } = await supabase.from("pacs_pds_shops").select("*").eq("pacs_id", pacs.id).order("shop_name")

  return <PDSShopsManagementClient pacsId={pacs.id} initialPDSShops={pdsShops || []} />
}
