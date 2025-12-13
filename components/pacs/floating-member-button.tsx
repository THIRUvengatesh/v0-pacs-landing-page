"use client"

import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingMemberButton() {
  const handleClick = () => {
    // Scroll to contact section or open a membership form
    const contactSection = document.querySelector('[data-section="contact"]')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-base font-semibold rounded-full bg-green-600 hover:bg-green-700 text-white animate-bounce hover:animate-none"
      size="lg"
    >
      <UserPlus className="mr-2 h-5 w-5" />
      To Become a Member
    </Button>
  )
}
