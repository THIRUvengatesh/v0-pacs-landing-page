import type { PACS } from "@/lib/types/pacs"
import { Heart } from "lucide-react"

interface Template2FooterProps {
  pacs: PACS
}

export function Template2Footer({ pacs }: Template2FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{pacs.name}</h3>
            <p className="text-sm leading-relaxed">
              {pacs.description || "Serving our farming community with dedication and excellence"}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm">
              {pacs.phone && <p>Phone: {pacs.phone}</p>}
              {pacs.email && <p>Email: {pacs.email}</p>}
              {pacs.address && <p>Address: {pacs.address}</p>}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <p>Services</p>
              <p>Loan Schemes</p>
              <p>Machinery Rental</p>
              <p>Gallery</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          <p className="flex items-center justify-center gap-2">
            © {new Date().getFullYear()} {pacs.name}. Made with <Heart className="h-4 w-4 text-red-500 fill-current" />{" "}
            for farmers
          </p>
        </div>
      </div>
    </footer>
  )
}
