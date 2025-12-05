import type { PACS } from "@/lib/types/pacs"
import { Leaf } from "lucide-react"

interface FooterProps {
  pacs: PACS
}

export function Footer({ pacs }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-green-900 text-green-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-300" />
            <div>
              <p className="font-semibold">{pacs.name}</p>
              <p className="text-sm text-green-200">
                {pacs.district}
                {pacs.state ? `, ${pacs.state}` : ""}
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-green-200">
              © {currentYear} {pacs.name}. All rights reserved.
            </p>
            <p className="text-xs text-green-300 mt-1">Empowering farmers, strengthening communities</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
