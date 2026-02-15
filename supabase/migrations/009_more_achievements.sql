-- Add More Achievements for Tanaji Story

DO $$
DECLARE
    tanaji_id UUID;
BEGIN
    -- unique title or known ID
    SELECT id INTO tanaji_id FROM public.stories WHERE title LIKE '%Tanaji%' LIMIT 1;

    IF tanaji_id IS NOT NULL THEN
        INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
        VALUES
            (tanaji_id, 'Lion of Sinhagad', 'Complete the Battle of Sinhagad story.', '🦁', 'SINHAGAD_CONQUEROR', 500),
            (tanaji_id, 'Ghorpad Mastery', 'Successfully scale the cliff using Yashwanti.', '🦎', 'CLIFF_CLIMBER', 150),
            (tanaji_id, 'Master Strategist', 'Make 5 consecutive correct decisions.', '🧠', 'STRATEGIC_MIND', 200),
            (tanaji_id, 'Duelist', 'Defeat Udaybhan in single combat.', '⚔️', 'UDAYBHAN_SLAYER', 300),
            (tanaji_id, 'Swarajya First', 'Choose duty over personal safety.', '🚩', 'SWARAJYA_FIRST', 100)
        ON CONFLICT (story_id, condition_code) DO NOTHING;
    END IF;
END $$;
