-- Create table for PDS (Public Distribution System) shops
CREATE TABLE IF NOT EXISTS public.pacs_pds_shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pacs_id UUID NOT NULL REFERENCES public.pacs(id) ON DELETE CASCADE,
    shop_name TEXT NOT NULL,
    shop_code TEXT,
    address TEXT NOT NULL,
    contact_person TEXT,
    contact_phone TEXT,
    operating_hours TEXT,
    commodities_available TEXT[],
    license_number TEXT,
    is_active BOOLEAN DEFAULT true,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pacs_pds_shops_pacs_id ON public.pacs_pds_shops(pacs_id);
CREATE INDEX IF NOT EXISTS idx_pacs_pds_shops_is_active ON public.pacs_pds_shops(is_active);

-- Add RLS policies
ALTER TABLE public.pacs_pds_shops ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active PDS shops
CREATE POLICY "Allow public read access to PDS shops"
ON public.pacs_pds_shops
FOR SELECT
USING (is_active = true);

-- Allow PACS admins to manage PDS shops
CREATE POLICY "Allow PACS admins to manage PDS shops"
ON public.pacs_pds_shops
FOR ALL
USING (true);
