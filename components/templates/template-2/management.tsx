"use client"

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

interface Template2ManagementProps {
  teamMembers: TeamMember[]
  showTeamSection?: boolean // Added showTeamSection prop
}

export function Template2Management({ teamMembers, showTeamSection = true }: Template2ManagementProps) {
  const leadershipTeam = teamMembers.filter((member) => member.is_leadership)
  const otherTeam = teamMembers.filter((member) => !member.is_leadership)

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dedicated professionals committed to serving our community
          </p>
        </div>

        {/* Leadership Team - Always visible */}
        {leadershipTeam.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Leadership</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {leadershipTeam.map((member, index) => (
                <div
                  key={member.id}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Card className="border-blue-100 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <User className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-sm text-blue-600 font-medium mb-1">{member.position}</p>
                      <h3 className="font-bold text-gray-900 text-lg mb-3">{member.name}</h3>
                      <div className="space-y-2">
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                            {member.phone}
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {showTeamSection && otherTeam.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Team Members</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {otherTeam.map((member, index) => (
                <div
                  key={member.id}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${(leadershipTeam.length + index) * 100}ms` }}
                >
                  <Card className="border-blue-100 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-xs text-blue-600 font-medium mb-1">{member.position}</p>
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">{member.name}</h4>
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center justify-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{member.phone}</span>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
