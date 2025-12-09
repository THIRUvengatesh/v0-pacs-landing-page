import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
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

    if (!pacsSlug) {
      return NextResponse.json({ error: "PACS slug is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    console.log(supabaseUrl, supabaseServiceKey)
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[v0] Missing Supabase credentials")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = `pacs/${pacsSlug}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === "uploads")

    if (!bucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket("uploads", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"],
      })

      if (bucketError && !bucketError.message.includes("already exists")) {
        console.error("[v0] Bucket creation error:", bucketError)
        return NextResponse.json({ error: `Bucket creation failed: ${bucketError.message}` }, { status: 500 })
      }
    }

    const { data: uploadData, error: uploadError } = await supabase.storage.from("uploads").upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError)
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(uploadData.path)

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
