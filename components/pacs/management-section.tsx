import type { PACS } from "@/lib/types/pacs"
import { Card, CardContent } from "@/components/ui/card"
import { User, Phone } from "lucide-react"

interface ManagementSectionProps {
  pacs: PACS
}

export function ManagementSection({ pacs }: ManagementSectionProps) {
  const managementTeam = [
    {
      role: "President",
      name: pacs.president_name,
      contact: pacs.president_contact,
    },
    {
      role: "Secretary",
      name: pacs.secretary_name,
      contact: pacs.secretary_contact,
    },
    {
      role: "Manager",
      name: pacs.manager_name,
      contact: pacs.manager_contact,
    },
  ].filter((member) => member.name)

  if (managementTeam.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-green-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">Management Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Dedicated leadership committed to serving our farming community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {managementTeam.map((member) => (
            <Card key={member.role} className="border-green-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-green-700" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{member.role}</p>
                <h3 className="font-semibold text-green-900 mb-3">{member.name}</h3>
                {member.contact && (
                  <a
                    href={`tel:${member.contact}`}
                    className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                  >
                    <Phone className="h-3 w-3" />
                    {member.contact}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
