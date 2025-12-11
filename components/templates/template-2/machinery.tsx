import type { Machinery } from "@/lib/types/pacs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tractor, Phone } from "lucide-react"

interface Template2MachineryProps {
  machinery: Machinery[]
}

export function Template2Machinery({ machinery }: Template2MachineryProps) {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Machinery Rental</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Modern equipment available for rent to enhance your farming efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machinery.map((item) => (
            <Card key={item.id} className="border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.machinery_name}</h3>
                    <Badge variant={item.availability_status === "available" ? "default" : "secondary"}>
                      {item.availability_status}
                    </Badge>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Tractor className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {(item.rent_per_hour || item.rent_per_day) && (
                  <div className="space-y-1">
                    {item.rent_per_hour && (
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">₹{item.rent_per_hour}</span> per hour
                      </p>
                    )}
                    {item.rent_per_day && (
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">₹{item.rent_per_day}</span> per day
                      </p>
                    )}
                  </div>
                )}

                {item.contact_person && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-sm text-slate-600">Contact: {item.contact_person}</p>
                    {item.contact_phone && (
                      <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {item.contact_phone}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
