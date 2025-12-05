-- Create PACS table for storing Primary Agricultural Cooperative Society information
CREATE TABLE IF NOT EXISTS pacs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  map_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  cover_image_url TEXT,
  president_name TEXT,
  president_contact TEXT,
  secretary_name TEXT,
  secretary_contact TEXT,
  manager_name TEXT,
  manager_contact TEXT,
  established_year INTEGER,
  member_count INTEGER,
  about_history TEXT,
  about_services TEXT,
  about_impact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create machinery rental table
CREATE TABLE IF NOT EXISTS pacs_machinery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacs_id UUID REFERENCES pacs(id) ON DELETE CASCADE,
  machinery_name TEXT NOT NULL,
  rent_per_hour DECIMAL(10, 2),
  rent_per_day DECIMAL(10, 2),
  contact_person TEXT,
  contact_phone TEXT,
  availability_status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS pacs_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacs_id UUID REFERENCES pacs(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_description TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS pacs_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacs_id UUID REFERENCES pacs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pacs_slug ON pacs(slug);
CREATE INDEX IF NOT EXISTS idx_pacs_district ON pacs(district);
CREATE INDEX IF NOT EXISTS idx_machinery_pacs_id ON pacs_machinery(pacs_id);
CREATE INDEX IF NOT EXISTS idx_services_pacs_id ON pacs_services(pacs_id);
CREATE INDEX IF NOT EXISTS idx_gallery_pacs_id ON pacs_gallery(pacs_id);

-- Enable Row Level Security
ALTER TABLE pacs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacs_machinery ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacs_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacs_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication required for viewing)
CREATE POLICY "Allow public read access to pacs" 
  ON pacs FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to machinery" 
  ON pacs_machinery FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to services" 
  ON pacs_services FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to gallery" 
  ON pacs_gallery FOR SELECT 
  USING (true);
