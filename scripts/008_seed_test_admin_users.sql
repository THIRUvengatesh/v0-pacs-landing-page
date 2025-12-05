-- Create test admin users for demo purposes
-- NOTE: In production, users should sign up through the UI

-- First, we need to manually create users in Supabase Auth dashboard
-- Then link them to PACS here

-- For demo: Creating association for any authenticated user to manage Rajnagar PACS
-- You can update this after creating your actual user accounts

-- Example: Link user to Rajnagar PACS (replace with actual user_id from Supabase Auth)
-- INSERT INTO pacs_users (user_id, pacs_id, role)
-- SELECT 
--   'YOUR_USER_ID_HERE'::uuid,
--   id,
--   'admin'
-- FROM pacs WHERE slug = 'rajnagar-pacs';

-- For testing purposes, you'll need to:
-- 1. Sign up a user through the UI at /auth/sign-up
-- 2. Get the user_id from Supabase dashboard
-- 3. Run the above INSERT statement with the actual user_id
-- 4. Or create a helper function to auto-assign PACS to new users

-- Helper function to assign PACS to a user (can be called from admin panel later)
CREATE OR REPLACE FUNCTION assign_pacs_to_user(
  p_user_id UUID,
  p_pacs_slug TEXT,
  p_role TEXT DEFAULT 'admin'
)
RETURNS UUID AS $$
DECLARE
  v_pacs_id UUID;
  v_result_id UUID;
BEGIN
  -- Get PACS ID from slug
  SELECT id INTO v_pacs_id FROM pacs WHERE slug = p_pacs_slug;
  
  IF v_pacs_id IS NULL THEN
    RAISE EXCEPTION 'PACS with slug % not found', p_pacs_slug;
  END IF;
  
  -- Insert or update the association
  INSERT INTO pacs_users (user_id, pacs_id, role)
  VALUES (p_user_id, v_pacs_id, p_role)
  ON CONFLICT (user_id, pacs_id) 
  DO UPDATE SET role = p_role, updated_at = NOW()
  RETURNING id INTO v_result_id;
  
  RETURN v_result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
