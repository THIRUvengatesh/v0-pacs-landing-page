import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

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

    const supabase = createClient()

    // Create a unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = `pacs/${pacsSlug}/${fileName}`

    // Convert File to ArrayBuffer for Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage bucket 'pacs-images'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("pacs-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)

      // If bucket doesn't exist, try to create it
      if (uploadError.message.includes("not found") || uploadError.message.includes("does not exist")) {
        // Create the bucket (this will fail if user doesn't have permission, but that's ok)
        const { error: bucketError } = await supabase.storage.createBucket("pacs-images", {
          public: true,
        })

        if (bucketError && !bucketError.message.includes("already exists")) {
          console.error("Bucket creation error:", bucketError)
        }

        // Try upload again
        const { data: retryData, error: retryError } = await supabase.storage
          .from("pacs-images")
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false,
          })

        if (retryError) {
          throw new Error(`Upload failed: ${retryError.message}`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from("pacs-images").getPublicUrl(retryData.path)

        return NextResponse.json({
          success: true,
          url: urlData.publicUrl,
        })
      }

      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from("pacs-images").getPublicUrl(uploadData.path)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 },
    )
  }
}
