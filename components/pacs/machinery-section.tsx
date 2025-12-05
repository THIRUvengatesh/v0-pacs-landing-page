import type { PACSmachinery } from "@/lib/types/pacs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone } from "lucide-react"

interface MachinerySectionProps {
  machinery: PACSmachinery[]
}

export function MachinerySection({ machinery }: MachinerySectionProps) {
  if (machinery.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">Machinery Rental Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Modern farm equipment available for rent at competitive rates
          </p>
        </div>

        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">Available Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machinery</TableHead>
                    <TableHead className="text-right">Per Hour</TableHead>
                    <TableHead className="text-right">Per Day</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machinery.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.machinery_name}</TableCell>
                      <TableCell className="text-right">
                        {item.rent_per_hour ? `₹${item.rent_per_hour.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.rent_per_day ? `₹${item.rent_per_day.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell>{item.contact_person || "—"}</TableCell>
                      <TableCell>
                        {item.contact_phone ? (
                          <a
                            href={`tel:${item.contact_phone}`}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700"
                          >
                            <Phone className="h-3 w-3" />
                            {item.contact_phone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
