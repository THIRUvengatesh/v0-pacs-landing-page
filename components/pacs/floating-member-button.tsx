"use client"

import { useState } from "react"
import { UserPlus, Check, FileText, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function FloatingMemberButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(true)
  }

  return (
    <>
      <Button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-base font-semibold rounded-full bg-green-600 hover:bg-green-700 text-white animate-bounce hover:animate-none"
        size="lg"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        To Become a Member
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Become a Member of Our PACS
            </DialogTitle>
            <DialogDescription>Join our cooperative society and enjoy exclusive benefits</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Membership Procedures */}
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                How to Become a Member
              </h3>
              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    title: "Fill Application Form",
                    description: "Complete the membership application form with your personal and financial details",
                  },
                  {
                    step: 2,
                    title: "Submit Required Documents",
                    description:
                      "Provide proof of identity (Aadhaar card), address proof, and passport-size photographs",
                  },
                  {
                    step: 3,
                    title: "Pay Membership Fee",
                    description: "Pay the initial share capital and admission fee as per society bylaws",
                  },
                  {
                    step: 4,
                    title: "Board Approval",
                    description: "Your application will be reviewed and approved by the Board of Directors",
                  },
                  {
                    step: 5,
                    title: "Receive Membership",
                    description: "Once approved, you'll receive your membership certificate and passbook",
                  },
                ].map((step) => (
                  <div key={step.step} className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Types of Members */}
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Types of Membership
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    type: "Ordinary Member",
                    description: "Individual farmers and agricultural workers who are primary members of the society",
                    benefits: [
                      "Access to all services",
                      "Voting rights in general meetings",
                      "Eligible for loans and credit facilities",
                      "Share dividends",
                    ],
                  },
                  {
                    type: "Nominal Member",
                    description: "Non-agricultural individuals or organizations supporting the society's objectives",
                    benefits: [
                      "Access to limited services",
                      "No voting rights",
                      "Support society's mission",
                      "Receive society communications",
                    ],
                  },
                  {
                    type: "Associate Member",
                    description: "Government officials or institutions linked to agricultural development",
                    benefits: [
                      "Advisory role in society",
                      "No voting rights",
                      "Facilitate government schemes",
                      "Technical guidance",
                    ],
                  },
                  {
                    type: "Honorary Member",
                    description: "Distinguished individuals contributing significantly to agricultural development",
                    benefits: [
                      "Recognition of contribution",
                      "Advisory capacity",
                      "No financial obligations",
                      "Attend special meetings",
                    ],
                  },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
                  >
                    <h4 className="font-semibold text-lg text-green-700 mb-2">{member.type}</h4>
                    <p className="text-sm text-gray-600 mb-3">{member.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Benefits:</p>
                      {member.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Ready to Join?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Visit our office during working hours or contact us for more information about membership requirements
                and procedures.
              </p>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  // Scroll to contact section
                  setTimeout(() => {
                    const contactSection = document.querySelector('[data-section="contact"]')
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }, 100)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
