-- Update RLS policies to allow PACS admins to edit their own PACS data

-- Drop existing policies that only allow public read
DROP POLICY IF EXISTS "Allow public read access to pacs" ON pacs;
DROP POLICY IF EXISTS "Allow public read access to services" ON pacs_services;
DROP POLICY IF EXISTS "Allow public read access to machinery" ON pacs_machinery;
DROP POLICY IF EXISTS "Allow public read access to gallery" ON pacs_gallery;

-- PACS table policies
CREATE POLICY "Allow public read access to pacs"
  ON pacs
  FOR SELECT
  USING (true);

CREATE POLICY "Allow PACS admins to update their PACS"
  ON pacs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pacs_users
      WHERE pacs_users.pacs_id = pacs.id
      AND pacs_users.user_id = auth.uid()
    )
  );

-- PACS services policies
CREATE POLICY "Allow public read access to services"
  ON pacs_services
  FOR SELECT
  USING (true);

CREATE POLICY "Allow PACS admins to manage services"
  ON pacs_services
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pacs_users
      WHERE pacs_users.pacs_id = pacs_services.pacs_id
      AND pacs_users.user_id = auth.uid()
    )
  );

-- PACS machinery policies
CREATE POLICY "Allow public read access to machinery"
  ON pacs_machinery
  FOR SELECT
  USING (true);

CREATE POLICY "Allow PACS admins to manage machinery"
  ON pacs_machinery
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pacs_users
      WHERE pacs_users.pacs_id = pacs_machinery.pacs_id
      AND pacs_users.user_id = auth.uid()
    )
  );

-- PACS gallery policies
CREATE POLICY "Allow public read access to gallery"
  ON pacs_gallery
  FOR SELECT
  USING (true);

CREATE POLICY "Allow PACS admins to manage gallery"
  ON pacs_gallery
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pacs_users
      WHERE pacs_users.pacs_id = pacs_gallery.pacs_id
      AND pacs_users.user_id = auth.uid()
    )
  );
