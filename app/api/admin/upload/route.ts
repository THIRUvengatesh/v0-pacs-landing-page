import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] Upload API called")

    const session = await getSession()
    if (!session) {
      console.log("[v0] No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log("[v0] Session found:", session.userId)

    const formData = await request.formData()
    const file = formData.get("file") as File
    const pacsSlug = formData.get("pacsSlug") as string

    if (!file) {
      console.log("[v0] No file in form data")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!pacsSlug) {
      console.log("[v0] No PACS slug provided")
      return NextResponse.json({ error: "PACS slug is required" }, { status: 400 })
    }

    console.log("[v0] File details:", { name: file.name, type: file.type, size: file.size })

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_KEY
    console.log(supabaseUrl, supabaseServiceKey)
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[v0] Missing Supabase credentials:", {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
      })
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Create a simple Supabase client for storage using service role
    const supabase = createClient()

    // Create a unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = `pacs/${pacsSlug}/${fileName}`

    console.log("[v0] Uploading to path:", filePath)

    // Convert File to ArrayBuffer for Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === "pacs-images")

    if (!bucketExists) {
      console.log("[v0] Creating pacs-images bucket")
      const { error: bucketError } = await supabase.storage.createBucket("pacs-images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
      })

      if (bucketError && !bucketError.message.includes("already exists")) {
        console.error("[v0] Bucket creation error:", bucketError)
        return NextResponse.json({ error: `Bucket creation failed: ${bucketError.message}` }, { status: 500 })
      }
    }

    // Upload to Supabase Storage bucket 'pacs-images'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("pacs-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError)
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 })
    }

    console.log("[v0] Upload successful:", uploadData.path)

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from("pacs-images").getPublicUrl(uploadData.path)

    console.log("[v0] Public URL:", urlData.publicUrl)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    })
  } catch (error) {
    console.error("[v0] Error uploading file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 },
    )
  }
}
