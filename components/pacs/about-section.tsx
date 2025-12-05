import type { PACS } from "@/lib/types/pacs"
import { Card, CardContent } from "@/components/ui/card"
import { History, Briefcase, TrendingUp } from "lucide-react"

interface AboutSectionProps {
  pacs: PACS
}

export function AboutSection({ pacs }: AboutSectionProps) {
  const sections = [
    {
      icon: History,
      title: "Our History",
      content: pacs.about_history,
    },
    {
      icon: Briefcase,
      title: "Services Offered",
      content: pacs.about_services,
    },
    {
      icon: TrendingUp,
      title: "Community Impact",
      content: pacs.about_impact,
    },
  ].filter((section) => section.content)

  if (sections.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-green-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">About {pacs.name.split(" ")[0]} PACS</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our journey, mission, and commitment to the farming community
          </p>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title} className="border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg shrink-0">
                      <Icon className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-green-900 mb-3">{section.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-pretty">{section.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats */}
        {(pacs.established_year || pacs.member_count) && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pacs.established_year && (
              <Card className="border-green-100 bg-white">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-green-700">{pacs.established_year}</p>
                  <p className="text-sm text-muted-foreground mt-1">Year Established</p>
                </CardContent>
              </Card>
            )}
            {pacs.member_count && (
              <Card className="border-green-100 bg-white">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-green-700">{pacs.member_count}+</p>
                  <p className="text-sm text-muted-foreground mt-1">Member Farmers</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
