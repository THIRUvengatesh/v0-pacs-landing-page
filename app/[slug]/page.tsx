import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Template1 } from "@/components/templates/template-1"
import { Template2 } from "@/components/templates/template-2"
import { Template3 } from "@/components/templates/template-3"
import type { PACSWithRelations } from "@/lib/types/pacs"

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    preview?: string
  }>
}

const RESERVED_ROUTES = ["admin", "api", "auth", "super-admin", "login", "loans"]

export default async function PACSPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { preview } = await searchParams

  if (RESERVED_ROUTES.includes(slug)) {
    redirect(`/${slug}`)
    return null
  }

  const supabase = await createClient()

  // Fetch PACS data
  const { data: pacs, error } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  if (error || !pacs) {
    notFound()
  }

  const [servicesRes, machineryRes, galleryRes, loansRes, depositsRes, teamMembersRes, pdsShopsRes] = await Promise.all(
    [
      supabase
        .from("pacs_services")
        .select("*")
        .eq("pacs_id", pacs.id)
        .eq("is_visible", true)
        .order("created_at", { ascending: true }),
      supabase.from("pacs_machinery").select("*").eq("pacs_id", pacs.id).order("machinery_name", { ascending: true }),
      supabase.from("pacs_gallery").select("*").eq("pacs_id", pacs.id).order("display_order", { ascending: true }),
      supabase
        .from("pacs_loan_schemes")
        .select("*")
        .eq("pacs_id", pacs.id)
        .eq("is_active", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("pacs_deposit_schemes")
        .select("*")
        .eq("pacs_id", pacs.id)
        .eq("is_active", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("pacs_team_members")
        .select("*")
        .eq("pacs_id", pacs.id)
        .eq("is_active", true)
        .order("display_priority", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("pacs_pds_shops").select("id").eq("pacs_id", pacs.id).eq("is_active", true),
    ],
  )

  const pacsData: PACSWithRelations = {
    ...pacs,
    services: servicesRes.data || [],
    machinery: machineryRes.data || [],
    gallery: galleryRes.data || [],
  }

  const loanSchemes = loansRes.data || []
  const depositSchemes = depositsRes.data || []
  const teamMembers = teamMembersRes.data || []
  const pdsShopsCount = pdsShopsRes.data?.length || 0

  const templateType = preview ? Number.parseInt(preview) : pacs.template_type

  if (templateType === 3) {
    return (
      <Template3
        pacs={pacsData}
        loanSchemes={loanSchemes}
        depositSchemes={depositSchemes}
        teamMembers={teamMembers}
        showTeamSection={pacs.show_team_section ?? true}
        pdsShopsCount={pdsShopsCount}
      />
    )
  }

  if (templateType === 2) {
    return (
      <Template2
        pacs={pacsData}
        loanSchemes={loanSchemes}
        depositSchemes={depositSchemes}
        teamMembers={teamMembers}
        showTeamSection={pacs.show_team_section ?? true}
        pdsShopsCount={pdsShopsCount}
      />
    )
  }

  // Default to Template 1
  return (
    <Template1
      pacs={pacsData}
      loanSchemes={loanSchemes}
      depositSchemes={depositSchemes}
      teamMembers={teamMembers}
      showTeamSection={pacs.show_team_section ?? true}
      pdsShopsCount={pdsShopsCount}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pacs } = await supabase
    .from("pacs")
    .select("name, district, state, description")
    .eq("slug", slug)
    .single()

  if (!pacs) {
    return {
      title: "PACS Not Found",
    }
  }

  return {
    title: `${pacs.name} – Primary Agricultural Cooperative Society`,
    description:
      pacs.description ||
      `${pacs.name} in ${pacs.district} - A trusted Primary Agricultural Cooperative Society serving local farmers with essential services and financial support.`,
  }
}
