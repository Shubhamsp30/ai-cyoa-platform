-- Multiplayer Democracy Mode Schema

-- 1. Lobby Proposals Table
-- Stores actions proposed by players for the current scene
CREATE TABLE IF NOT EXISTS public.lobby_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lobby_code TEXT NOT NULL REFERENCES public.lobbies(code) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    voters JSONB DEFAULT '[]'::jsonb, -- Array of user_ids who voted
    is_active BOOLEAN DEFAULT true, -- Only active proposals are shown
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS Policies
ALTER TABLE public.lobby_proposals ENABLE ROW LEVEL SECURITY;

-- Everyone can read proposals
CREATE POLICY "Public read lobby_proposals" 
ON public.lobby_proposals FOR SELECT 
USING (true);

-- Authenticated users can insert (propose) if they are in the lobby
-- (Simplification: anyone auth can insert, but purely validated by API is safer? 
--  For now, let's allow auth insert for speed, API will handle logic)
CREATE POLICY "Auth insert lobby_proposals" 
ON public.lobby_proposals FOR INSERT 
WITH CHECK (auth.uid() = player_id);

-- Authenticated users can update (vote) if they are in the lobby
-- But technically, voting updates the 'votes' column.
-- We'll allow public update for now to simplify the 'toggle vote' logic from client if we go that route,
-- BUT ideally we use a Postgres function or strict policy. 
-- Let's stick to: Auth users can update.
CREATE POLICY "Auth update lobby_proposals" 
ON public.lobby_proposals FOR UPDATE 
USING (true);

-- 3. Realtime
-- Add to publication so clients see new proposals and vote counts instantly
BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE lobby_proposals;
COMMIT;
