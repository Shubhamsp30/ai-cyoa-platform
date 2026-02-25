-- Migration 018: Add location tracking to player profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_coords TEXT,
ADD COLUMN IF NOT EXISTS last_place_name TEXT;

COMMENT ON COLUMN public.profiles.last_coords IS 'Stores player coordinates as "Lat, Long" for session tracking';
COMMENT ON COLUMN public.profiles.last_place_name IS 'Stores player location name (City, Region) for session tracking';
