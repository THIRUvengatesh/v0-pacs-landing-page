-- Create users table for simple table-based authentication
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Store hashed password
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX idx_users_email ON users(email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read users (for login verification)
CREATE POLICY "Allow login verification" ON users
  FOR SELECT
  USING (true);

-- Update user_pacs_assignments to reference new users table
ALTER TABLE user_pacs_assignments 
  DROP COLUMN IF EXISTS user_id,
  ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create a function to hash passwords (simple MD5 for demo)
CREATE OR REPLACE FUNCTION hash_password(plain_password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN md5(plain_password);
END;
$$ LANGUAGE plpgsql;

-- Cast VARCHAR columns to TEXT to match function return type
CREATE OR REPLACE FUNCTION verify_password(email_input TEXT, password_input TEXT)
RETURNS TABLE(user_id UUID, email TEXT, full_name TEXT, role TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email::TEXT, u.full_name::TEXT, u.role::TEXT
  FROM users u
  WHERE u.email = email_input 
    AND u.password = md5(password_input)
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
