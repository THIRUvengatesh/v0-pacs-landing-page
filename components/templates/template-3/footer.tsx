import { Leaf } from "lucide-react"
import type { PACS } from "@/lib/types/pacs"

interface Template3FooterProps {
  pacs: PACS
}

export function Template3Footer({ pacs }: Template3FooterProps) {
  return (
    <footer className="relative border-t border-white/20 backdrop-blur-xl bg-white/5">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
              <Leaf className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{pacs.name}</h3>
              <p className="text-purple-200 text-sm">
                {pacs.district}, {pacs.state}
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-purple-200 text-sm mb-1">
              © {new Date().getFullYear()} {pacs.name}. All rights reserved.
            </p>
            <p className="text-purple-300 text-xs">Empowering farmers through cooperation</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
