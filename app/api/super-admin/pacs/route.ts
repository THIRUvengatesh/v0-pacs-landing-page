import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth/session"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.from("pacs").select("*").order("name")

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching PACS:", error)
    return NextResponse.json({ error: "Failed to fetch PACS" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, email, phone, address, district, state, description } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("pacs")
      .insert({
        name,
        slug,
        email,
        phone,
        address,
        district,
        state,
        description,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A PACS with this slug already exists" }, { status: 400 })
      }
      throw error
    }

    const defaultServices = [
      {
        pacs_id: data.id,
        service_name: "Agriculture Loans",
        service_description: "Financial assistance for agricultural activities and farming needs",
        icon_name: "Sprout",
        is_visible: true,
        detailed_description:
          "Comprehensive loan schemes for farmers to support crop cultivation, equipment purchase, and agricultural development",
        benefits: ["Low interest rates", "Flexible repayment terms", "Quick approval process"],
        eligibility: "Active PACS members with agricultural land",
        required_documents: ["Land documents", "ID proof", "Member ID"],
      },
      {
        pacs_id: data.id,
        service_name: "Fertiliser & Seed Subsidy",
        service_description: "Subsidized fertilizers and quality seeds for agricultural growth",
        icon_name: "Leaf",
        is_visible: true,
        detailed_description:
          "Government subsidized fertilizers and certified seeds to support farmers in improving crop yield",
        benefits: ["Subsidized prices", "Quality products", "Easy availability"],
        eligibility: "All PACS members",
        required_documents: ["Member ID", "Land documents"],
      },
      {
        pacs_id: data.id,
        service_name: "Savings & Deposits",
        service_description: "Secure savings schemes with attractive interest rates",
        icon_name: "Wallet",
        is_visible: true,
        detailed_description: "Multiple savings and deposit schemes designed to help members build financial security",
        benefits: ["Competitive interest rates", "Secure deposits", "Regular returns"],
        eligibility: "All PACS members",
        required_documents: ["Member ID", "ID proof"],
      },
      {
        pacs_id: data.id,
        service_name: "Fixed Deposit",
        service_description: "Long-term investment with guaranteed returns",
        icon_name: "PiggyBank",
        is_visible: true,
        detailed_description: "Fixed deposit schemes offering higher interest rates for long-term investments",
        benefits: ["Higher interest rates", "Guaranteed returns", "Flexible tenure options"],
        eligibility: "All PACS members",
        required_documents: ["Member ID", "ID proof", "PAN card"],
      },
      {
        pacs_id: data.id,
        service_name: "Procurement Services",
        service_description: "Fair price procurement of agricultural produce",
        icon_name: "Package",
        is_visible: true,
        detailed_description: "Procurement services to ensure farmers get fair prices for their agricultural produce",
        benefits: ["Fair market prices", "Timely payments", "Quality assessment"],
        eligibility: "PACS members with agricultural produce",
        required_documents: ["Member ID", "Produce quality certificate"],
      },
    ]

    const { error: servicesError } = await supabase.from("pacs_services").insert(defaultServices)

    if (servicesError) {
      console.error("Error creating default services:", servicesError)
      // Continue even if services creation fails, PACS is already created
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating PACS:", error)
    return NextResponse.json({ error: "Failed to create PACS" }, { status: 500 })
  }
}
