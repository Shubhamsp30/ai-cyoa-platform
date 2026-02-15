-- Add translations column to stories table
ALTER TABLE public.stories 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Add translations column to scenes table
ALTER TABLE public.scenes 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.stories.translations IS 'Stores translations for title, description, etc. Keyed by language code (hi, mr, hi-en, mr-en).';
COMMENT ON COLUMN public.scenes.translations IS 'Stores translations for title, overview, content, etc. Keyed by language code.';
