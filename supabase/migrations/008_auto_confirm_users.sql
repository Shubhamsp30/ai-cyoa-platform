-- Auto-Confirm Users (Disable Email Verification Requirement in Database)

-- 1. Create a function to automatically set email_confirmed_at
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger to fire BEFORE a new user is inserted
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.auto_confirm_user();

-- 3. IMMEDIATELY confirm all existing users who are unconfirmed
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
