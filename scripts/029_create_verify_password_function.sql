-- Create a function to verify user passwords using pgcrypto for bcrypt
-- This function is called by the login API to authenticate users

-- First, ensure pgcrypto extension is enabled (for bcrypt support)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing function if it exists to avoid conflicts with different signatures
DROP FUNCTION IF EXISTS verify_password(TEXT, TEXT);

-- Create the verify_password function
CREATE FUNCTION verify_password(email_input TEXT, password_input TEXT)
RETURNS TABLE (
  user_id UUID,
  email VARCHAR,
  full_name VARCHAR,
  role VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    u.role
  FROM users u
  WHERE u.email = email_input
    AND u.is_active = true
    AND u.password = crypt(password_input, u.password);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated;
