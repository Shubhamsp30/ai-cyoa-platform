-- Manually confirm the user's email for development
-- Run this in the Supabase SQL Editor

UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'shubhampatil30@gmail.com';

-- Optional: Disable email confirmation requirement for future signups
-- (This setting is usually in the Dashboard > Authentication > Providers > Email, 
-- but this SQL update fixes the current user immediately)
