import type { PACS } from "@/lib/types/pacs"
import { Card, CardContent } from "@/components/ui/card"
import { User, Phone, Mail } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  position: string
  email?: string
  phone?: string
  is_leadership: boolean
}

interface ManagementSectionProps {
  pacs: PACS
  teamMembers?: TeamMember[]
  showTeamSection?: boolean
}

export function ManagementSection({ pacs, teamMembers = [], showTeamSection = true }: ManagementSectionProps) {
  const leadershipTeam = teamMembers.filter((member) => member.is_leadership)
  const otherTeam = teamMembers.filter((member) => !member.is_leadership)

  const hasOldData = pacs.president_name || pacs.secretary_name || pacs.manager_name
  const hasNewData = teamMembers.length > 0

  if (!hasNewData && !hasOldData) return null

  return (
    <section className="py-12 md:py-16 bg-green-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">Management Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Dedicated leadership committed to serving our farming community
          </p>
        </div>

        {hasNewData ? (
          <div className="space-y-12">
            {/* Leadership Team - Always visible */}
            {leadershipTeam.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-green-900 mb-6 text-center">Leadership Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {leadershipTeam.map((member) => (
                    <Card key={member.id} className="border-green-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="h-8 w-8 text-green-700" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{member.position}</p>
                        <h3 className="font-semibold text-green-900 mb-3">{member.member_name}</h3>
                        <div className="space-y-2">
                          {member.contact_phone && (
                            <a
                              href={`tel:${member.contact_phone}`}
                              className="flex items-center justify-center gap-2 text-sm text-green-600 hover:text-green-700"
                            >
                              <Phone className="h-3 w-3" />
                              {member.contact_phone}
                            </a>
                          )}
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="flex items-center justify-center gap-2 text-sm text-green-600 hover:text-green-700"
                            >
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {showTeamSection && otherTeam.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-green-900 mb-6 text-center">Our Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                  {otherTeam.map((member) => (
                    <Card key={member.id} className="border-green-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User className="h-6 w-6 text-green-700" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{member.position}</p>
                        <h4 className="font-semibold text-green-900 text-sm mb-2">{member.name}</h4>
                        <div className="space-y-1">
                          {member.phone && (
                            <a
                              href={`tel:${member.phone}`}
                              className="flex items-center justify-center gap-1 text-xs text-green-600 hover:text-green-700"
                            >
                              <Phone className="h-3 w-3" />
                              {member.phone}
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { role: "President", name: pacs.president_name, contact: pacs.president_contact },
              { role: "Secretary", name: pacs.secretary_name, contact: pacs.secretary_contact },
              { role: "Manager", name: pacs.manager_name, contact: pacs.manager_contact },
            ]
              .filter((member) => member.name)
              .map((member) => (
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
        )}
      </div>
    </section>
  )
}
