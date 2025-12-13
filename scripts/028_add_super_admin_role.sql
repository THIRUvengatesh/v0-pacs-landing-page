-- Add super_admin role support
-- Update users table to support super_admin role if not already present

-- Update existing admin users or create a default super admin
-- You can manually update a user's role to 'super_admin' in the database
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@example.com' AND role = 'admin';

-- Add comment for clarity
COMMENT ON COLUMN users.role IS 'User role: super_admin, admin, or user';
