import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import PDSShopsPageClient from "./pds-shops-page-client"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PDSShopsPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch PACS details
  const { data: pacs, error: pacsError } = await supabase
    .from("pacs")
    .select("id, name, slug")
    .eq("slug", slug)
    .single()

  if (pacsError || !pacs) {
    notFound()
  }

  // Fetch PDS shops for this PACS
  const { data: pdsShops, error: shopsError } = await supabase
    .from("pacs_pds_shops")
    .select("*")
    .eq("pacs_id", pacs.id)
    .eq("is_active", true)
    .order("shop_name")

  if (shopsError) {
    console.error("Error fetching PDS shops:", shopsError)
  }

  return <PDSShopsPageClient pacs={pacs} pdsShops={pdsShops || []} />
}
