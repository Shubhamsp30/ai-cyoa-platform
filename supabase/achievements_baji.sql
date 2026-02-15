-- Achievements for Story 2: Bajiprabhu Deshpande
-- Replace 'STORY_ID_PLACEHOLDER' with the actual ID of the Bajiprabhu story
-- You can find the ID by running: select id from stories where title like '%Baji%';

DO $$
DECLARE
    target_story_id uuid;
BEGIN
    SELECT id INTO target_story_id FROM stories WHERE title ILIKE '%Baji%' LIMIT 1;

    IF target_story_id IS NOT NULL THEN
        -- 1. The Ultimate Volunteer (Entering Scene 7)
        INSERT INTO achievements (story_id, condition_code, title, description, icon, xp_reward, created_at)
        VALUES (
            target_story_id,
            'BAJI_VOLUNTEER',
            'The Ultimate Volunteer',
            'You chose to stay back and hold the pass while the King escapes.',
            '🛡️',
            100,
            NOW()
        ) ON CONFLICT (story_id, condition_code) DO UPDATE 
        SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon;

        -- 2. Iron Wall (Entering Scene 9 - Survived the main battle)
        INSERT INTO achievements (story_id, condition_code, title, description, icon, xp_reward, created_at)
        VALUES (
            target_story_id,
            'BAJI_IRON_WALL',
            'Iron Wall',
            'You held the enemy back against overwhelming odds.',
            '🧱',
            150,
            NOW()
        ) ON CONFLICT (story_id, condition_code) DO UPDATE 
        SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon;

        -- 3. Sentinel of Swarajya (Entering Scene 10 - Finale)
        INSERT INTO achievements (story_id, condition_code, title, description, icon, xp_reward, created_at)
        VALUES (
            target_story_id,
            'BAJI_VICTORY',
            'Sentinel of Swarajya',
            'You fulfilled your vow. The King is safe.',
            '🚩',
            300,
            NOW()
        ) ON CONFLICT (story_id, condition_code) DO UPDATE 
        SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon;
        
        RAISE NOTICE 'Achievements for Bajiprabhu_v2 added successfully.';
    ELSE
        RAISE NOTICE 'Story not found. Achievements not added.';
    END IF;
END $$;
