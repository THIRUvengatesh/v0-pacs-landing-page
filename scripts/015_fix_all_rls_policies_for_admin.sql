-- Fix RLS policies to work with user_pacs_assignments table
-- This allows PACS admins to manage their data based on user_pacs_assignments

-- Helper function to check if user is admin for a PACS
CREATE OR REPLACE FUNCTION is_pacs_admin(user_uuid uuid, pacs_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_pacs_assignments upa
    JOIN pacs p ON p.slug = upa.pacs_slug
    WHERE upa.user_id = user_uuid
    AND p.id = pacs_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update PACS table policies
DROP POLICY IF EXISTS "Allow PACS admins to update their PACS" ON pacs;
CREATE POLICY "Allow PACS admins to update their PACS" ON pacs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_pacs_assignments upa
      WHERE upa.user_id = auth.uid()
      AND upa.pacs_slug = pacs.slug
    )
  );

-- Update pacs_services policies
DROP POLICY IF EXISTS "Allow PACS admins to manage services" ON pacs_services;
CREATE POLICY "Allow PACS admins to manage services" ON pacs_services
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_pacs_assignments upa
      JOIN pacs p ON p.slug = upa.pacs_slug
      WHERE upa.user_id = auth.uid()
      AND p.id = pacs_services.pacs_id
    )
  );

-- Update pacs_machinery policies
DROP POLICY IF EXISTS "Allow PACS admins to manage machinery" ON pacs_machinery;
CREATE POLICY "Allow PACS admins to manage machinery" ON pacs_machinery
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_pacs_assignments upa
      JOIN pacs p ON p.slug = upa.pacs_slug
      WHERE upa.user_id = auth.uid()
      AND p.id = pacs_machinery.pacs_id
    )
  );

-- Update pacs_loan_schemes policies
DROP POLICY IF EXISTS "Allow PACS admins to manage loan schemes" ON pacs_loan_schemes;
CREATE POLICY "Allow PACS admins to manage loan schemes" ON pacs_loan_schemes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_pacs_assignments upa
      JOIN pacs p ON p.slug = upa.pacs_slug
      WHERE upa.user_id = auth.uid()
      AND p.id = pacs_loan_schemes.pacs_id
    )
  );

-- Update pacs_deposit_schemes policies
DROP POLICY IF EXISTS "Allow PACS admins to manage deposit schemes" ON pacs_deposit_schemes;
CREATE POLICY "Allow PACS admins to manage deposit schemes" ON pacs_deposit_schemes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_pacs_assignments upa
      JOIN pacs p ON p.slug = upa.pacs_slug
      WHERE upa.user_id = auth.uid()
      AND p.id = pacs_deposit_schemes.pacs_id
    )
  );

-- Update pacs_fertilizers policies
DROP POLICY IF EXISTS "Allow PACS admins to manage fertilizers" ON pacs_fertilizers;
CREATE POLICY "Allow PACS admins to manage fertilizers" ON pacs_fertilizers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_pacs_assignments upa
      JOIN pacs p ON p.slug = upa.pacs_slug
      WHERE upa.user_id = auth.uid()
      AND p.id = pacs_fertilizers.pacs_id
    )
  );

-- Update pacs_procurement policies
DROP POLICY IF EXISTS "Allow PACS admins to manage procurement" ON pacs_procurement;
CREATE POLICY "Allow PACS admins to manage procurement" ON pacs_procurement
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_pacs_assignments upa
      JOIN pacs p ON p.slug = upa.pacs_slug
      WHERE upa.user_id = auth.uid()
      AND p.id = pacs_procurement.pacs_id
    )
  );

-- Update pacs_gallery policies
DROP POLICY IF EXISTS "Allow PACS admins to manage gallery" ON pacs_gallery;
CREATE POLICY "Allow PACS admins to manage gallery" ON pacs_gallery
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_pacs_assignments upa
      JOIN pacs p ON p.slug = upa.pacs_slug
      WHERE upa.user_id = auth.uid()
      AND p.id = pacs_gallery.pacs_id
    )
  );
