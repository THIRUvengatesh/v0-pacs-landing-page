import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import SuperAdminDashboard from "./super-admin-dashboard"

export default async function SuperAdminPage() {
  const session = await getSession()

  if (!session || session.role !== "super_admin") {
    redirect("/auth/login")
  }

  return <SuperAdminDashboard />
}
