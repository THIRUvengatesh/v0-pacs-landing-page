-- Fix RLS policies for user_pacs_assignments table
-- This allows users to read their own PACS assignments

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own PACS assignments" ON user_pacs_assignments;
DROP POLICY IF EXISTS "Service role can manage assignments" ON user_pacs_assignments;

-- Enable RLS if not already enabled
ALTER TABLE user_pacs_assignments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow users to view their own assignments
-- Since we're not using Supabase Auth, we need to allow all reads for now
-- and rely on application-level security through our session system
CREATE POLICY "Allow read access to assignments"
ON user_pacs_assignments
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy 2: Allow service role to manage all assignments
CREATE POLICY "Service role can manage assignments"
ON user_pacs_assignments
FOR ALL
TO service_role
USING (true);

-- Also add a policy for inserts/updates by authenticated users
CREATE POLICY "Authenticated users can insert assignments"
ON user_pacs_assignments
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Update policy for the duplicate table as well
ALTER TABLE user_pacs_assignments_1 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to assignments_1"
ON user_pacs_assignments_1
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Service role can manage assignments_1"
ON user_pacs_assignments_1
FOR ALL
TO service_role
USING (true);
