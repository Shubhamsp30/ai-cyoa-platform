-- Achievements for Story 2: Bajiprabhu Deshpande
-- Replace 'STORY_ID_PLACEHOLDER' with the actual ID of the Bajiprabhu story
-- You can find the ID by running: select id from stories where title like '%Baji%';

DO $$
DECLARE
    story_id uuid;
BEGIN
    SELECT id INTO story_id FROM stories WHERE title ILIKE '%Baji%' LIMIT 1;

    IF story_id IS NOT NULL THEN
        -- 1. The Ultimate Volunteer (Entering Scene 7)
        INSERT INTO achievements (story_id, condition_code, title, description, icon_url, created_at)
        VALUES (
            story_id,
            'BAJI_VOLUNTEER',
            'The Ultimate Volunteer',
            'You chose to stay back and hold the pass while the King escapes.',
            'https://api.iconify.design/game-icons:shattered-shield.svg?color=%23ffd700',
            NOW()
        ) ON CONFLICT DO NOTHING;

        -- 2. Iron Wall (Entering Scene 9 - Survived the main battle)
        INSERT INTO achievements (story_id, condition_code, title, description, icon_url, created_at)
        VALUES (
            story_id,
            'BAJI_IRON_WALL',
            'Iron Wall',
            'You held the enemy back against overwhelming odds.',
            'https://api.iconify.design/game-icons:stone-wall.svg?color=%23ffd700',
            NOW()
        ) ON CONFLICT DO NOTHING;

        -- 3. Sentinel of Swarajya (Entering Scene 10 - Finale)
        INSERT INTO achievements (story_id, condition_code, title, description, icon_url, created_at)
        VALUES (
            story_id,
            'BAJI_VICTORY',
            'Sentinel of Swarajya',
            'You fulfilled your vow. The King is safe.',
            'https://api.iconify.design/game-icons:tattered-banner.svg?color=%23ffd700',
            NOW()
        ) ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Achievements for Bajiprabhu added successfully.';
    ELSE
        RAISE NOTICE 'Story not found. Achievements not added.';
    END IF;
END $$;
