-- Fix Multiplayer Realtime and Permissions

-- 1. Enable Realtime for Lobbies and Players
-- This ensures that the useLobby hook receives updates
BEGIN;
  -- Check if they are already added to avoid errors (though 'add table' usually handles it, better safe)
  -- The simplest way is just to run it; if it's already there, it might throw a warning or error depending on Postgres version.
  -- We'll just run it. If it fails, it means it's already there (or publication missing).
  ALTER PUBLICATION supabase_realtime ADD TABLE lobbies;
  ALTER PUBLICATION supabase_realtime ADD TABLE lobby_players;
COMMIT;

-- 2. Update RLS Policy for Lobbies
-- Previously, only the Host could update the lobby (e.g. change scene).
-- In Co-op mode, ANY player might trigger a scene change (Act for Party).
-- We need to allow any player in the lobby to update it.

DROP POLICY IF EXISTS "Host update lobbies" ON public.lobbies;

CREATE POLICY "Lobby members update lobbies"
ON public.lobbies
FOR UPDATE
USING (
    auth.uid() = host_id -- Host can update
    OR
    auth.uid() IN ( -- OR any player in the lobby
        SELECT user_id FROM public.lobby_players WHERE lobby_code = lobbies.code
    )
);

-- 3. Verify Player RLS
-- Players need to be able to finish their own turn/score updates.
-- "Self update lobby_players" exists and should be sufficient.
