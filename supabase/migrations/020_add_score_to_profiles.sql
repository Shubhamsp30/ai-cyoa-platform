-- Add current_score and current_story_metadata to profiles for ultra-persistent auto-save
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS current_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

COMMENT ON COLUMN public.profiles.current_score IS 'Real-time score tracking for auto-save feature.';
