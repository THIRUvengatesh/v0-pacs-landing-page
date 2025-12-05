-- Seed users with login credentials
-- Password for all users: "password123" (hashed as MD5)

INSERT INTO users (email, password, full_name, role, is_active) VALUES
  ('admin@rajnagar.com', md5('password123'), 'Rajnagar Admin', 'admin', true),
  ('admin@basavakalyan.com', md5('password123'), 'Basavakalyan Admin', 'admin', true),
  ('superadmin@pacs.com', md5('admin123'), 'Super Admin', 'superadmin', true)
ON CONFLICT (email) DO UPDATE 
  SET password = EXCLUDED.password,
      full_name = EXCLUDED.full_name,
      updated_at = NOW();

-- Assign users to their respective PACS
-- First, get or insert user IDs, then assign to PACS
DO $$
DECLARE
  rajnagar_user_id UUID;
  basavakalyan_user_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO rajnagar_user_id FROM users WHERE email = 'admin@rajnagar.com';
  SELECT id INTO basavakalyan_user_id FROM users WHERE email = 'admin@basavakalyan.com';

  -- Delete existing assignments to avoid duplicates
  DELETE FROM user_pacs_assignments WHERE email IN ('admin@rajnagar.com', 'admin@basavakalyan.com');

  -- Assign Rajnagar admin to Rajnagar PACS
  INSERT INTO user_pacs_assignments (user_id, email, pacs_slug, pacs_name, role)
  VALUES 
    (rajnagar_user_id, 'admin@rajnagar.com', 'rajnagar-pacs', 'Rajnagar PACS', 'admin'),
    (basavakalyan_user_id, 'admin@basavakalyan.com', 'basavakalyan-pacs', 'Basavakalyan PACS', 'admin');
END $$;
