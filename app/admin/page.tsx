import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { AdminDashboard } from "./admin-dashboard-client"

export default async function AdminPage() {
  const session = await getSession()

  console.log("[v0] Session data:", session)

  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  const { data: pacsAssignments, error: pacsError } = await supabase
    .from("user_pacs_assignments")
    .select("*")
    .eq("user_id", session.userId)

  console.log("[v0] PACS assignments query result:", {
    pacsAssignments,
    pacsError,
    userId: session.userId,
  })

  if (pacsError) {
    console.error("[v0] Error fetching PACS assignments:", pacsError)
    // Return empty state instead of crashing
    return (
      <AdminDashboard
        user={{
          id: session.userId,
          email: session.email,
        }}
        pacsAssociations={[]}
      />
    )
  }

  let pacsAssociations: any[] = []

  if (pacsAssignments && pacsAssignments.length > 0) {
    const slugs = pacsAssignments.map((assignment) => assignment.pacs_slug)

    console.log("[v0] Fetching PACS details for slugs:", slugs)

    const { data: pacsDetails, error: pacsDetailsError } = await supabase.from("pacs").select("*").in("slug", slugs)

    console.log("[v0] PACS details query result:", { pacsDetails, pacsDetailsError })

    if (pacsDetailsError) {
      console.error("[v0] Error fetching PACS details:", pacsDetailsError)
    }

    pacsAssociations = pacsAssignments.map((assignment) => {
      const pacsDetail = pacsDetails?.find((p) => p.slug === assignment.pacs_slug)

      console.log("[v0] Mapping assignment:", {
        assignment,
        foundDetail: !!pacsDetail,
        pacsDetailSlug: pacsDetail?.slug,
      })

      return {
        id: pacsDetail?.id || assignment.pacs_slug,
        role: assignment.role,
        pacs: {
          id: pacsDetail?.id || assignment.pacs_slug,
          name: assignment.pacs_name || pacsDetail?.name || "Unknown PACS",
          slug: assignment.pacs_slug,
          district: pacsDetail?.district || "",
          cover_image_url: pacsDetail?.cover_image_url || null,
        },
      }
    })
  }

  console.log("[v0] Final PACS associations:", pacsAssociations)

  return (
    <AdminDashboard
      user={{
        id: session.userId,
        email: session.email,
      }}
      pacsAssociations={pacsAssociations}
    />
  )
}
