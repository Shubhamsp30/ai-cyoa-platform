-- Link Game Data to Auth Users

-- 1. Update Leaderboard Table
ALTER TABLE public.leaderboard 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Update Player Achievements Table
ALTER TABLE public.player_achievements
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Update Policies
-- Allow users to update their own leaderboard entries (if we allow updating high scores)
CREATE POLICY "Users can insert their own scores"
ON public.leaderboard FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
ON public.player_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Optional: Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON public.leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_user_id ON public.player_achievements(user_id);
