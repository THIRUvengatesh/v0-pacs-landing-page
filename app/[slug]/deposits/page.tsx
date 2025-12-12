import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import DepositsPageClient from "./deposits-page-client"

export default async function DepositsPage({ params }: { params: Promise<{ slug: string }> }) {
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

  // Fetch active deposit schemes for this PACS
  const { data: deposits, error: depositsError } = await supabase
    .from("pacs_deposit_schemes")
    .select("*")
    .eq("pacs_id", pacs.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (depositsError) {
    console.error("Error fetching deposits:", depositsError)
  }

  return <DepositsPageClient pacs={pacs} deposits={deposits || []} />
}
