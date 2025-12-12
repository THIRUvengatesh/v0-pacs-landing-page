-- Create table for PACS team members
CREATE TABLE IF NOT EXISTS pacs_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacs_id UUID NOT NULL REFERENCES pacs(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  position TEXT NOT NULL,
  contact_phone TEXT,
  email TEXT,
  photo_url TEXT,
  responsibilities TEXT,
  joining_date DATE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_pacs_team_members_pacs_id ON pacs_team_members(pacs_id);
CREATE INDEX IF NOT EXISTS idx_pacs_team_members_is_active ON pacs_team_members(is_active);

-- Add RLS policies
ALTER TABLE pacs_team_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to team members"
ON pacs_team_members FOR SELECT
TO public
USING (is_active = true);

-- Allow PACS admins to manage team members
CREATE POLICY "Allow PACS admins to manage team members"
ON pacs_team_members FOR ALL
TO public
USING (true)
WITH CHECK (true);

COMMENT ON TABLE pacs_team_members IS 'Stores team member information for each PACS';
