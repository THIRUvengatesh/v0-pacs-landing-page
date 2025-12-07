import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const pacsSlug = formData.get("pacsSlug") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`pacs/${pacsSlug}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
