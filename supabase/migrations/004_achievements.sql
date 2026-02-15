-- Achievements System Schema
-- Tracks unlockable achievements and player progress

-- 1. Achievements Definition Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL, -- Emoji or icon class
    condition_code TEXT NOT NULL, -- e.g., 'SCENE_5_COMPLETE', 'SCORE_1000'
    xp_reward INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, condition_code)
);

-- 2. Player Achievements (Unlocks)
-- Since we don't have Auth, we track by 'player_name' + 'story_id' or just local storage sync
-- However, if we want a global leaderboard of achievements, we need this.
CREATE TABLE IF NOT EXISTS public.player_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_name TEXT NOT NULL, -- Identify player by name (simple mode)
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_name, achievement_id)
);

-- 3. RLS Policies
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_achievements ENABLE ROW LEVEL SECURITY;

-- Public read access for achievements
CREATE POLICY "Allow public read access to achievements"
ON public.achievements FOR SELECT
USING (true);

-- Allow anyone to insert player_achievements (unsecured for now, consistent with leaderboards)
CREATE POLICY "Allow public insert to player_achievements"
ON public.player_achievements FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read access to player_achievements"
ON public.player_achievements FOR SELECT
USING (true);

-- 4. Initial Seed Data for Tanaji Story
-- Get Story ID for Tanaji (assuming the ID from migration 003)
DO $$
DECLARE
    tanaji_id UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
    VALUES
    (tanaji_id, 'First Steps', 'Complete the first scene.', '🏁', 'SCENE_1_COMPLETE', 50),
    (tanaji_id, 'Diplomat', 'Choose a peaceful resolution.', '🕊️', 'PEACEFUL_CHOICE', 100),
    (tanaji_id, 'Warrior Spirit', 'Choose a brave combat action.', '⚔️', 'WARRIOR_CHOICE', 100),
    (tanaji_id, 'Legendary Commander', 'Complete the story with a high score.', '🏆', 'HIGH_SCORE_2000', 500)
    ON CONFLICT (story_id, condition_code) DO NOTHING;
END $$;
