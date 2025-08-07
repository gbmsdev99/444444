/*
  # Create Admin User

  1. Admin User Setup
    - Creates an admin user profile
    - Sets up admin role and permissions
  
  2. Security
    - Admin user with proper role assignment
*/

-- Insert admin user profile (you'll need to sign up with this email first)
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- This will be replaced with actual user ID after signup
  'admin@etailor.com',
  'Admin User',
  'admin',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  updated_at = now();

-- Note: After running this migration, you need to:
-- 1. Sign up with email: admin@etailor.com and password: admin123456
-- 2. Update the profile ID with the actual user ID from auth.users table