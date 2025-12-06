-- Temporarily disable RLS on tables that admins manage through API
-- Since we're using custom table-based auth (not Supabase Auth), 
-- RLS policies that depend on auth.uid() won't work
-- We're doing authorization checks in the API routes instead

-- Disable RLS on pacs table for admin updates
ALTER TABLE pacs DISABLE ROW LEVEL SECURITY;

-- Disable RLS on pacs_services table for admin management
ALTER TABLE pacs_services DISABLE ROW LEVEL SECURITY;

-- Disable RLS on pacs_machinery table for admin management
ALTER TABLE pacs_machinery DISABLE ROW LEVEL SECURITY;

-- Disable RLS on pacs_loan_schemes table for admin management
ALTER TABLE pacs_loan_schemes DISABLE ROW LEVEL SECURITY;

-- Disable RLS on pacs_deposit_schemes table for admin management
ALTER TABLE pacs_deposit_schemes DISABLE ROW LEVEL SECURITY;

-- Disable RLS on pacs_fertilizers table for admin management
ALTER TABLE pacs_fertilizers DISABLE ROW LEVEL SECURITY;

-- Disable RLS on pacs_procurement table for admin management
ALTER TABLE pacs_procurement DISABLE ROW LEVEL SECURITY;

-- Disable RLS on pacs_gallery table for admin management
ALTER TABLE pacs_gallery DISABLE ROW LEVEL SECURITY;

-- Note: We keep RLS enabled on users and user_pacs_assignments tables
-- for security, as those are only accessed through specific functions
