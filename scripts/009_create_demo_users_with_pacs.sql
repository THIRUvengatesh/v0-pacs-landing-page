-- Create demo users with PACS assignments
-- This script provides SQL to manually create users in the database

-- IMPORTANT: For production use, users should sign up through /auth/sign-up
-- However, for demo/testing, you can use these credentials

-- Demo Users to Create:
-- 1. Email: admin@rajnagar-pacs.local | Password: RajnagarAdmin123!
-- 2. Email: admin@basavakalyan-pacs.local | Password: BasavakalyanAdmin123!

-- After creating these users through the sign-up page, 
-- use the following SQL to assign them to their respective PACS

-- Step 1: First, sign up users through the UI at /auth/sign-up
-- Step 2: Get their user_id from Supabase dashboard > Authentication > Users
-- Step 3: Run the assignment function below

-- For convenience, here's a function to list all auth users:
CREATE OR REPLACE FUNCTION get_auth_users_for_assignment()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id::uuid,
    email::text,
    created_at
  FROM auth.users
  WHERE email IS NOT NULL
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Quick setup function - assigns user to PACS by email
CREATE OR REPLACE FUNCTION quick_assign_pacs_by_email(
  p_user_email TEXT,
  p_pacs_slug TEXT,
  p_role TEXT DEFAULT 'admin'
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_pacs_id UUID;
  v_result_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_user_email;
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'User with email ' || p_user_email || ' not found'
    );
  END IF;
  
  -- Get PACS ID from slug
  SELECT id INTO v_pacs_id FROM pacs WHERE slug = p_pacs_slug;
  
  IF v_pacs_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'PACS with slug ' || p_pacs_slug || ' not found'
    );
  END IF;
  
  -- Insert or update the association
  INSERT INTO pacs_users (user_id, pacs_id, role)
  VALUES (v_user_id, v_pacs_id, p_role)
  ON CONFLICT (user_id, pacs_id) 
  DO UPDATE SET role = p_role, updated_at = NOW()
  RETURNING id INTO v_result_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Successfully assigned ' || p_user_email || ' to ' || p_pacs_slug,
    'user_id', v_user_id,
    'pacs_id', v_pacs_id,
    'assignment_id', v_result_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage examples (run AFTER creating users through sign-up):
-- SELECT quick_assign_pacs_by_email('admin@rajnagar-pacs.local', 'rajnagar-pacs', 'admin');
-- SELECT quick_assign_pacs_by_email('admin@basavakalyan-pacs.local', 'basavakalyan-pacs', 'admin');

-- View all current assignments:
CREATE OR REPLACE VIEW user_pacs_assignments AS
SELECT 
  au.email,
  au.id as user_id,
  p.name as pacs_name,
  p.slug as pacs_slug,
  pu.role,
  pu.created_at as assigned_at
FROM pacs_users pu
JOIN auth.users au ON au.id = pu.user_id
JOIN pacs p ON p.id = pu.pacs_id
ORDER BY pu.created_at DESC;

-- Check assignments:
-- SELECT * FROM user_pacs_assignments;
