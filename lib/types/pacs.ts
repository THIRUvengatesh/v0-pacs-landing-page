// TypeScript types for PACS data structures
export interface PACS {
  id: string
  slug: string
  name: string
  district: string
  state: string | null
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  map_url: string | null
  latitude: number | null
  longitude: number | null
  cover_image_url: string | null
  header_background_url: string | null // Added header_background_url for landing page hero section background
  logo_url?: string | null // Added logo_url field
  president_name: string | null
  president_contact: string | null
  secretary_name: string | null
  secretary_contact: string | null
  manager_name: string | null
  manager_contact: string | null
  established_year: number | null
  member_count: number | null
  about_history: string | null
  about_services: string | null
  about_impact: string | null
  template_type: number | null // Added template_type field for template selection
  created_at: string
  updated_at: string
}

export interface PACSmachinery {
  id: string
  pacs_id: string
  machinery_name: string
  rent_per_hour: number | null
  rent_per_day: number | null
  contact_person: string | null
  contact_phone: string | null
  availability_status: string
  created_at: string
}

export interface PACSService {
  id: string
  pacs_id: string
  service_name: string
  service_description: string | null
  icon_name: string | null
  detailed_description: string | null
  benefits: string[] | null
  eligibility: string | null
  required_documents: string[] | null
  process_steps: string[] | null
  fees: string | null
  contact_person: string | null
  contact_phone: string | null
  is_visible: boolean // Added is_visible field to control landing page display
  created_at: string
}

export interface PACSGallery {
  id: string
  pacs_id: string
  image_url: string
  caption: string | null
  display_order: number
  created_at: string
}

export interface PACSUser {
  id: string
  user_id: string
  pacs_id: string
  role: string
  created_at: string
  updated_at: string
}

export interface PACSLoanScheme {
  id: string
  pacs_id: string
  scheme_name: string
  scheme_description: string | null
  interest_rate: number | null
  max_amount: number | null
  min_amount: number | null
  tenure_months: number | null
  eligibility: string | null
  required_documents: string[] | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PACSDepositScheme {
  id: string
  pacs_id: string
  scheme_name: string
  scheme_description: string | null
  interest_rate: number | null
  min_deposit: number | null
  tenure_months: number | null
  withdrawal_rules: string | null
  benefits: string[] | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PACSFertilizer {
  id: string
  pacs_id: string
  fertilizer_name: string
  fertilizer_type: string | null
  brand: string | null
  price_per_unit: number | null
  unit: string | null
  stock_quantity: number | null
  description: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface PACSProcurement {
  id: string
  pacs_id: string
  crop_name: string
  procurement_season: string | null
  price_per_quintal: number | null
  payment_terms: string | null
  quality_standards: string | null
  contact_person: string | null
  contact_phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Type aliases for compatibility
export type Service = PACSService
export type Machinery = PACSmachinery
export type GalleryImage = PACSGallery
export type LoanScheme = PACSLoanScheme
export type DepositScheme = PACSDepositScheme
export type Fertilizer = PACSFertilizer
export type Procurement = PACSProcurement

export interface PACSWithRelations extends PACS {
  services?: PACSService[]
  machinery?: PACSmachinery[]
  gallery?: PACSGallery[]
  users?: PACSUser[]
  loan_schemes?: PACSLoanScheme[]
  deposit_schemes?: PACSDepositScheme[]
  fertilizers?: PACSFertilizer[]
  procurements?: PACSProcurement[]
}
