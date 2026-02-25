-- Add Generic Gameplay Achievements for all stories
DO $$
DECLARE
    s_record RECORD;
BEGIN
    FOR s_record IN SELECT id FROM public.stories LOOP
        -- 1. First Response
        INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
        VALUES (s_record.id, 'First Recon', 'Successfully completed your first mission step.', '👁️', 'FIRST_BLOOD', 50)
        ON CONFLICT (story_id, condition_code) DO NOTHING;

        -- 2. Tactical Genius (3 Consecutive)
        INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
        VALUES (s_record.id, 'Tactical Genius', 'Made 3 correct tactical decisions in a row.', '🧠', 'TACTICAL_GENIUS', 150)
        ON CONFLICT (story_id, condition_code) DO NOTHING;

        -- 3. Mission Accomplished (Story Complete)
        INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
        VALUES (s_record.id, 'Mission Accomplished', 'Successfully completed the entire mission.', '🥇', 'LEGEND', 300)
        ON CONFLICT (story_id, condition_code) DO NOTHING;

        -- 4. Perfect Legend (0 Mistakes)
        INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
        VALUES (s_record.id, 'Perfect Legend', 'Complete a story with 0 mistakes.', '💎', 'PERFECT_LEGEND', 500)
        ON CONFLICT (story_id, condition_code) DO NOTHING;

        -- 5. High Scorer (>1000)
        INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
        VALUES (s_record.id, 'High Scorer', 'Achieve a score of over 1000 points in a single run.', '🌟', 'HIGH_SCORE_1000', 200)
        ON CONFLICT (story_id, condition_code) DO NOTHING;
    END LOOP;

    -- Mission Specifics
    DECLARE
        t_id UUID;
        b_id UUID;
    BEGIN
        -- Dynamically resolve IDs to avoid FK violations
        SELECT id INTO t_id FROM public.stories WHERE title ILIKE '%Tanaji%' LIMIT 1;
        SELECT id INTO b_id FROM public.stories WHERE title ILIKE '%Baji%' LIMIT 1;

        -- Tanaji Specifics
        IF t_id IS NOT NULL THEN
            INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
            VALUES 
                (t_id, 'Peaceful Diplomat', 'Choose a non-violent solution when available.', '🕊️', 'PEACEFUL_DIPLOMAT', 100),
                (t_id, 'Warrior Spirit', 'Choose to fight and defend your honor.', '⚔️', 'WARRIOR_SPIRIT', 100)
            ON CONFLICT (story_id, condition_code) DO NOTHING;
        END IF;

        -- Baji Specifics
        IF b_id IS NOT NULL THEN
            INSERT INTO public.achievements (story_id, title, description, icon, condition_code, xp_reward)
            VALUES 
                (b_id, 'Baji''s Volunteer', 'Volunteer for the dangerous rear-guard mission.', '🙋‍♂️', 'BAJI_VOLUNTEER', 150),
                (b_id, 'The Iron Wall', 'Hold the pass at Pavan Khind against all odds.', '🛡️', 'IRON_WALL', 300)
            ON CONFLICT (story_id, condition_code) DO NOTHING;
        END IF;
    END;
END $$;
