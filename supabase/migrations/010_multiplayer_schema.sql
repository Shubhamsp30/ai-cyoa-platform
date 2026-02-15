-- Multiplayer System Schema

-- 1. Lobbies Table
CREATE TABLE IF NOT EXISTS public.lobbies (
    code TEXT PRIMARY KEY, -- 4-letter code e.g., 'ABCD'
    host_id UUID NOT NULL REFERENCES auth.users(id),
    story_id UUID NOT NULL REFERENCES public.stories(id),
    status TEXT NOT NULL DEFAULT 'WAITING', -- 'WAITING', 'PLAYING', 'FINISHED'
    current_scene_id UUID, -- For Co-op sync
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Lobby Players Table
CREATE TABLE IF NOT EXISTS public.lobby_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lobby_code TEXT NOT NULL REFERENCES public.lobbies(code) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    username TEXT NOT NULL,
    is_ready BOOLEAN DEFAULT false,
    is_host BOOLEAN DEFAULT false,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lobby_code, user_id)
);

-- 3. RLS Policies
ALTER TABLE public.lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_players ENABLE ROW LEVEL SECURITY;

-- Lobbies: Everyone can read, Authenticated can insert/update
CREATE POLICY "Public read lobbies" ON public.lobbies FOR SELECT USING (true);
CREATE POLICY "Auth insert lobbies" ON public.lobbies FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Host update lobbies" ON public.lobbies FOR UPDATE USING (auth.uid() = host_id);

-- Lobby Players: Everyone can read, Authenticated can insert (join)
CREATE POLICY "Public read lobby_players" ON public.lobby_players FOR SELECT USING (true);
CREATE POLICY "Auth insert lobby_players" ON public.lobby_players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Self update lobby_players" ON public.lobby_players FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Self delete lobby_players" ON public.lobby_players FOR DELETE USING (auth.uid() = user_id);
