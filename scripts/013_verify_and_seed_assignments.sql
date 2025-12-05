-- Verify existing data and ensure test users have proper assignments

-- First, let's check if we have users in the users table
-- If not, we'll create them

DO $$
DECLARE
  rajnagar_user_id UUID;
  basavakalyan_user_id UUID;
  rajnagar_pacs_id UUID;
  basavakalyan_pacs_id UUID;
BEGIN
  -- Get or create user for Rajnagar PACS admin
  SELECT id INTO rajnagar_user_id FROM users WHERE email = 'admin@rajnagar.com';
  
  IF rajnagar_user_id IS NULL THEN
    -- Create user with hashed password for "password123"
    INSERT INTO users (id, email, password, full_name, role, is_active)
    VALUES (
      gen_random_uuid(),
      'admin@rajnagar.com',
      crypt('password123', gen_salt('bf')),
      'Rajnagar Admin',
      'pacs_admin',
      true
    )
    RETURNING id INTO rajnagar_user_id;
    
    RAISE NOTICE 'Created Rajnagar admin user with ID: %', rajnagar_user_id;
  ELSE
    RAISE NOTICE 'Rajnagar admin user already exists with ID: %', rajnagar_user_id;
  END IF;

  -- Get or create user for Basavakalyan PACS admin
  SELECT id INTO basavakalyan_user_id FROM users WHERE email = 'admin@basavakalyan.com';
  
  IF basavakalyan_user_id IS NULL THEN
    INSERT INTO users (id, email, password, full_name, role, is_active)
    VALUES (
      gen_random_uuid(),
      'admin@basavakalyan.com',
      crypt('password123', gen_salt('bf')),
      'Basavakalyan Admin',
      'pacs_admin',
      true
    )
    RETURNING id INTO basavakalyan_user_id;
    
    RAISE NOTICE 'Created Basavakalyan admin user with ID: %', basavakalyan_user_id;
  ELSE
    RAISE NOTICE 'Basavakalyan admin user already exists with ID: %', basavakalyan_user_id;
  END IF;

  -- Get PACS IDs
  SELECT id INTO rajnagar_pacs_id FROM pacs WHERE slug = 'rajnagar-pacs';
  SELECT id INTO basavakalyan_pacs_id FROM pacs WHERE slug = 'basavakalyan-pacs';

  -- Clear existing assignments for these users to avoid duplicates
  DELETE FROM user_pacs_assignments WHERE user_id IN (rajnagar_user_id, basavakalyan_user_id);

  -- Create assignment for Rajnagar admin
  IF rajnagar_pacs_id IS NOT NULL THEN
    INSERT INTO user_pacs_assignments (user_id, email, pacs_slug, pacs_name, role)
    VALUES (
      rajnagar_user_id,
      'admin@rajnagar.com',
      'rajnagar-pacs',
      'Rajnagar PACS',
      'admin'
    );
    
    RAISE NOTICE 'Created assignment for Rajnagar admin';
  END IF;

  -- Create assignment for Basavakalyan admin
  IF basavakalyan_pacs_id IS NOT NULL THEN
    INSERT INTO user_pacs_assignments (user_id, email, pacs_slug, pacs_name, role)
    VALUES (
      basavakalyan_user_id,
      'admin@basavakalyan.com',
      'basavakalyan-pacs',
      'Basavakalyan PACS',
      'admin'
    );
    
    RAISE NOTICE 'Created assignment for Basavakalyan admin';
  END IF;

END $$;

-- Display the current assignments for verification
SELECT 
  u.email,
  u.full_name,
  upa.pacs_name,
  upa.pacs_slug,
  upa.role,
  u.id as user_id
FROM users u
LEFT JOIN user_pacs_assignments upa ON u.id = upa.user_id
WHERE u.email IN ('admin@rajnagar.com', 'admin@basavakalyan.com');
