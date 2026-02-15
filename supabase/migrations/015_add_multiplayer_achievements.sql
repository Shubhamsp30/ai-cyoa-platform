-- Add Multiplayer Achievements for Tanaji and Baji Prabhu stories

DO $$
DECLARE
    tanaji_id UUID;
    baji_id UUID;
BEGIN
    -- Get Story IDs
    SELECT id INTO tanaji_id FROM public.stories WHERE title = 'Tanaji Malusare: The Lion of Sinhagad';
    SELECT id INTO baji_id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand';

    -- Tanaji Multiplayer Achievements
    IF tanaji_id IS NOT NULL THEN
        INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
        VALUES
        (tanaji_id, 'Brotherhood in Arms', 'Complete the story in Multiplayer mode.', '🤝', 'MP_VICTORY_TANAJI', 200),
        (tanaji_id, 'Vanguard', 'Successfully lead the party (5+ moves) in a single Multiplayer game.', '🚩', 'MP_MVP_TANAJI', 150)
        ON CONFLICT (story_id, condition_code) DO NOTHING;
    END IF;

    -- Baji Prabhu Multiplayer Achievements
    IF baji_id IS NOT NULL THEN
        INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
        VALUES
        (baji_id, 'United Stand', 'Complete the story in Multiplayer mode.', '🛡️', 'MP_VICTORY_BAJI', 200),
        (baji_id, 'Last Man Standing', 'Successfully lead the party (5+ moves) in a single Multiplayer game.', '⚡', 'MP_MVP_BAJI', 150)
        ON CONFLICT (story_id, condition_code) DO NOTHING;
    END IF;

END $$;
