-- Create tables for additional PACS data management

-- Loan Schemes table
CREATE TABLE IF NOT EXISTS pacs_loan_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacs_id UUID NOT NULL REFERENCES pacs(id) ON DELETE CASCADE,
  scheme_name TEXT NOT NULL,
  scheme_description TEXT,
  interest_rate NUMERIC(5,2),
  max_amount NUMERIC(12,2),
  min_amount NUMERIC(12,2),
  tenure_months INTEGER,
  eligibility TEXT,
  required_documents TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deposit Schemes table
CREATE TABLE IF NOT EXISTS pacs_deposit_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacs_id UUID NOT NULL REFERENCES pacs(id) ON DELETE CASCADE,
  scheme_name TEXT NOT NULL,
  scheme_description TEXT,
  interest_rate NUMERIC(5,2),
  min_deposit NUMERIC(12,2),
  tenure_months INTEGER,
  withdrawal_rules TEXT,
  benefits TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fertilizers table
CREATE TABLE IF NOT EXISTS pacs_fertilizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacs_id UUID NOT NULL REFERENCES pacs(id) ON DELETE CASCADE,
  fertilizer_name TEXT NOT NULL,
  fertilizer_type TEXT, -- organic, chemical, etc.
  brand TEXT,
  price_per_unit NUMERIC(10,2),
  unit TEXT, -- kg, liter, etc.
  stock_quantity NUMERIC(10,2),
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Procurement data table
CREATE TABLE IF NOT EXISTS pacs_procurement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacs_id UUID NOT NULL REFERENCES pacs(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  procurement_season TEXT,
  price_per_quintal NUMERIC(10,2),
  payment_terms TEXT,
  quality_standards TEXT,
  contact_person TEXT,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE pacs_loan_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacs_deposit_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacs_fertilizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacs_procurement ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read access to loan schemes"
  ON pacs_loan_schemes FOR SELECT USING (true);

CREATE POLICY "Allow public read access to deposit schemes"
  ON pacs_deposit_schemes FOR SELECT USING (true);

CREATE POLICY "Allow public read access to fertilizers"
  ON pacs_fertilizers FOR SELECT USING (true);

CREATE POLICY "Allow public read access to procurement"
  ON pacs_procurement FOR SELECT USING (true);

-- Admin management policies
CREATE POLICY "Allow PACS admins to manage loan schemes"
  ON pacs_loan_schemes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pacs_users
      WHERE pacs_users.pacs_id = pacs_loan_schemes.pacs_id
      AND pacs_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow PACS admins to manage deposit schemes"
  ON pacs_deposit_schemes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pacs_users
      WHERE pacs_users.pacs_id = pacs_deposit_schemes.pacs_id
      AND pacs_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow PACS admins to manage fertilizers"
  ON pacs_fertilizers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pacs_users
      WHERE pacs_users.pacs_id = pacs_fertilizers.pacs_id
      AND pacs_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow PACS admins to manage procurement"
  ON pacs_procurement FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pacs_users
      WHERE pacs_users.pacs_id = pacs_procurement.pacs_id
      AND pacs_users.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_loan_schemes_pacs ON pacs_loan_schemes(pacs_id);
CREATE INDEX idx_deposit_schemes_pacs ON pacs_deposit_schemes(pacs_id);
CREATE INDEX idx_fertilizers_pacs ON pacs_fertilizers(pacs_id);
CREATE INDEX idx_procurement_pacs ON pacs_procurement(pacs_id);
