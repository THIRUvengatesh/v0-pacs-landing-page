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

interface Template3ManagementProps {
  teamMembers: TeamMember[]
}

export function Template3Management({ teamMembers }: Template3ManagementProps) {
  const leadershipTeam = teamMembers.filter((member) => member.is_leadership)
  const otherTeam = teamMembers.filter((member) => !member.is_leadership)

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Our Leadership Team</h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto text-pretty">
            Visionary leaders driving excellence in agricultural cooperation
          </p>
        </div>

        {/* Leadership Team */}
        {leadershipTeam.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {leadershipTeam.map((member, index) => (
                <div
                  key={member.id}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Card className="border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30">
                          <User className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" />
                      </div>
                      <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-full mb-3">
                        <p className="text-sm text-white font-semibold">{member.position}</p>
                      </div>
                      <h3 className="font-bold text-white text-xl mb-4">{member.name}</h3>
                      <div className="space-y-3">
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="flex items-center justify-center gap-2 text-sm text-purple-200 hover:text-white transition-colors group"
                          >
                            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                              <Phone className="h-4 w-4" />
                            </div>
                            {member.phone}
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center justify-center gap-2 text-sm text-purple-200 hover:text-white transition-colors group"
                          >
                            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                              <Mail className="h-4 w-4" />
                            </div>
                            <span className="truncate">{member.email}</span>
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

        {/* Other Team Members */}
        {otherTeam.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-white mb-10 text-center">Our Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {otherTeam.map((member, index) => (
                <div
                  key={member.id}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${(leadershipTeam.length + index) * 100}ms` }}
                >
                  <Card className="border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/20 hover:scale-110 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-500">
                    <CardContent className="p-6 text-center">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500/60 to-purple-500/60 rounded-full mb-2">
                        <p className="text-xs text-white font-medium">{member.position}</p>
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-3">{member.name}</h4>
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center justify-center gap-1 text-xs text-purple-200 hover:text-white transition-colors"
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
