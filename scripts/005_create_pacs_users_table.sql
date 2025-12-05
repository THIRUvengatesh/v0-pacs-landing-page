-- Create pacs_users table to link Supabase auth users with PACS
-- This allows each PACS to have one or more admin users who can manage their data

CREATE TABLE IF NOT EXISTS pacs_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pacs_id UUID NOT NULL REFERENCES pacs(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin', -- admin, manager, editor
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pacs_id)
);

-- Enable RLS
ALTER TABLE pacs_users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own PACS associations
CREATE POLICY "Users can view their own PACS associations"
  ON pacs_users
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can manage all
CREATE POLICY "Service role can manage pacs_users"
  ON pacs_users
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Add index for faster lookups
CREATE INDEX idx_pacs_users_user_id ON pacs_users(user_id);
CREATE INDEX idx_pacs_users_pacs_id ON pacs_users(pacs_id);
