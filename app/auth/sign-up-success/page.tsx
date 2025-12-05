import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mail, Leaf } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-green-100 shadow-lg">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-700" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-green-900">Check Your Email</CardTitle>
              <CardDescription className="text-green-600 mt-2">
                We've sent you a confirmation link to verify your account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 text-center">
                Please check your inbox and click the confirmation link to activate your account.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-700">
              <Leaf className="h-4 w-4" />
              <p>{"Didn't receive the email? Check your spam folder."}</p>
            </div>

            <Link href="/" className="block">
              <Button className="w-full bg-green-700 hover:bg-green-800">Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
