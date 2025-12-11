"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, ArrowDown } from "lucide-react"
import type { PACS } from "@/lib/types/pacs"
import Link from "next/link"

interface Template3HeroProps {
  pacs: PACS
}

export function Template3Hero({ pacs }: Template3HeroProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Glassmorphism navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white font-bold text-xl">{pacs.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">{pacs.name}</h1>
                <p className="text-purple-200 text-xs">{pacs.district}</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Directory
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero content with parallax */}
      <div
        className="container mx-auto px-4 text-center relative z-10"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <div className="inline-block mb-6 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-white/20 animate-pulse">
          <span className="text-purple-200 text-sm font-medium">Est. {pacs.established_year || "N/A"}</span>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-fade-in">
          {pacs.name}
        </h1>

        <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          {pacs.description || "Empowering farmers through cooperative excellence"}
        </p>

        {/* Glassmorphism info cards */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {pacs.address && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl px-6 py-4 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-xl">
              <div className="flex items-center gap-3">
                <MapPin className="text-purple-300" size={20} />
                <span className="text-white font-medium">
                  {pacs.district}, {pacs.state}
                </span>
              </div>
            </div>
          )}
          {pacs.phone && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl px-6 py-4 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-xl">
              <div className="flex items-center gap-3">
                <Phone className="text-pink-300" size={20} />
                <span className="text-white font-medium">{pacs.phone}</span>
              </div>
            </div>
          )}
          {pacs.email && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl px-6 py-4 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-xl">
              <div className="flex items-center gap-3">
                <Mail className="text-indigo-300" size={20} />
                <span className="text-white font-medium">{pacs.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-6 text-lg rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all hover:scale-105"
        >
          Explore Our Services
        </Button>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-white/50" size={32} />
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500 rounded-full opacity-20 blur-3xl" />
    </section>
  )
}
