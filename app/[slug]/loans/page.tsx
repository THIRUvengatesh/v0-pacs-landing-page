import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import LoansPageClient from "./loans-page-client"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LoansPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pacs, error } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  if (error || !pacs) {
    notFound()
  }

  const { data: loanSchemes } = await supabase
    .from("pacs_loan_schemes")
    .select("*")
    .eq("pacs_id", pacs.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  const loans = loanSchemes || []

  return <LoansPageClient pacs={pacs} loans={loans} />
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pacs } = await supabase.from("pacs").select("name").eq("slug", slug).single()

  if (!pacs) {
    return {
      title: "Loans Not Found",
    }
  }

  return {
    title: `Loan Schemes - ${pacs.name}`,
    description: `Explore agricultural loan schemes offered by ${pacs.name} with competitive interest rates and flexible repayment options.`,
  }
}
