-- FIX: Create missing Leaderboard table and link Auth

-- 1. Create Leaderboard Table (if missing)
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    achieved_ending TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add user_id to Leaderboard
ALTER TABLE public.leaderboard 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Add user_id to Player Achievements (in case 005 failed completely)
ALTER TABLE public.player_achievements
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Enable RLS
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Public read access to leaderboard"
ON public.leaderboard FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own scores"
ON public.leaderboard FOR INSERT
WITH CHECK (true); -- Allow all inserts for now to support guests, or refine restricted to auth.uid() if strictly enforced

-- Refined Policy for Auth Users
CREATE POLICY "Auth users insert own score"
ON public.leaderboard FOR INSERT
WITH CHECK (auth.role() = 'anon' OR auth.uid() = user_id);

-- Optional: Index for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard(score DESC);
