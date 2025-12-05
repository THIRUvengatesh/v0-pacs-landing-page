import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import ServiceDetailPageClient from "./service-detail-page-client"

interface PageProps {
  params: Promise<{
    slug: string
    serviceId: string
  }>
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug, serviceId } = await params
  const supabase = await createServerClient()

  const { data: pacs, error: pacsError } = await supabase.from("pacs").select("*").eq("slug", slug).single()

  if (pacsError || !pacs) {
    notFound()
  }

  const { data: service, error: serviceError } = await supabase
    .from("pacs_services")
    .select("*")
    .eq("id", serviceId)
    .eq("pacs_id", pacs.id)
    .single()

  if (serviceError || !service) {
    notFound()
  }

  return <ServiceDetailPageClient pacs={pacs} service={service} slug={slug} />
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, serviceId } = await params
  const supabase = await createServerClient()

  const { data: pacs } = await supabase.from("pacs").select("name").eq("slug", slug).single()

  const { data: service } = await supabase
    .from("pacs_services")
    .select("service_name, service_description")
    .eq("id", serviceId)
    .single()

  if (!pacs || !service) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: `${service.service_name} - ${pacs.name}`,
    description: service.service_description || `Learn about ${service.service_name} offered by ${pacs.name}`,
  }
}
