import { Card, CardContent } from "@/components/ui/card"
import { Users, History, Target } from "lucide-react"
import type { PACS } from "@/lib/types/pacs"

interface Template3AboutProps {
  pacs: PACS
}

export function Template3About({ pacs }: Template3AboutProps) {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            About Us
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Building stronger communities through cooperation and trust
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {pacs.about_history && (
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardContent className="p-8">
                <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center shadow-lg">
                  <History className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our History</h3>
                <p className="text-purple-200 leading-relaxed">{pacs.about_history}</p>
              </CardContent>
            </Card>
          )}

          {pacs.about_services && (
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardContent className="p-8">
                <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-lg">
                  <Target className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Services</h3>
                <p className="text-purple-200 leading-relaxed">{pacs.about_services}</p>
              </CardContent>
            </Card>
          )}

          {pacs.about_impact && (
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardContent className="p-8">
                <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center shadow-lg">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Community Impact</h3>
                <p className="text-purple-200 leading-relaxed">{pacs.about_impact}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {pacs.member_count && (
          <div className="text-center">
            <Card className="inline-block backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-white/20">
              <CardContent className="px-12 py-8">
                <p className="text-purple-200 text-lg mb-2">Active Members</p>
                <p className="text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {pacs.member_count.toLocaleString()}+
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
