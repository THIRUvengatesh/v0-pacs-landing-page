import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST() {
  try {
    // Generate bcrypt hash for 'password123'
    const hashedPassword = await bcrypt.hash("password123", 10)

    console.log("[v0] Resetting all passwords to: password123")
    console.log("[v0] Hashed password:", hashedPassword)

    // Update all users
    const { data, error } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .neq("id", 0) // Update all users
      .select()

    if (error) {
      console.error("[v0] Error resetting passwords:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Successfully reset passwords for", data?.length, "users")

    return NextResponse.json({
      success: true,
      message: `Successfully reset passwords for ${data?.length} users`,
      updatedUsers: data?.length,
    })
  } catch (error: any) {
    console.error("[v0] Error in password reset:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
