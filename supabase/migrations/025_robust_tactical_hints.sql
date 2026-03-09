-- ==========================================
-- ROBUST TACTICAL HINT SYSTEM (COLUMN-BASED)
-- ==========================================

-- 1. Add dedicated column for English/Default hints if not exists
ALTER TABLE public.scenes ADD COLUMN IF NOT EXISTS valid_actions_hint TEXT DEFAULT 'Strategic intuition suggests aligning with the mission objective.';

-- 2. Update TANAJI MALUSARE Story Hints
-- =====================================

-- Scene 1: The Sting of Purandar
UPDATE public.scenes SET valid_actions_hint = 'Acknowledge the weight of this defeat to proceed (e.g., say continue or next).' 
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');

-- Scene 2: The Mother's Gaze
UPDATE public.scenes SET valid_actions_hint = 'Go and meet Rajmata Jijabai in her chambers.' 
WHERE scene_number = 2 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');

-- Scene 3: The Impossible Demand
UPDATE public.scenes SET valid_actions_hint = 'State clearly that you volunteer to lead this mission.' 
WHERE scene_number = 3 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');

-- Scene 4: The Wedding Interrupted (THE SPECIFIC FIX)
UPDATE public.scenes SET valid_actions_hint = 'Duty calls. Tell them you must leave for the mission immediately.' 
WHERE scene_number = 4 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');

-- Scene 5: The Vow
UPDATE public.scenes SET valid_actions_hint = 'Take the sacred vow to win Sinhagad or die trying.' 
WHERE scene_number = 5 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');

-- Scene 6: The Omen
UPDATE public.scenes SET valid_actions_hint = 'Command Yashwanti to climb firmly to overcome the bad omen.' 
WHERE scene_number = 6 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');

-- Scene 7: The Lion's Charge
UPDATE public.scenes SET valid_actions_hint = 'The element of surprise is lost. Give the order to charge and attack!' 
WHERE scene_number = 7 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');

-- Scene 8: The Duel
UPDATE public.scenes SET valid_actions_hint = 'Continue the duel and fight the commander with all your strength.' 
WHERE scene_number = 8 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');

-- Scene 9: Suryaji's Rally
UPDATE public.scenes SET valid_actions_hint = 'Support your men and choose to rally them to finish the fight.' 
WHERE scene_number = 9 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');


-- 3. Update BAJI PRABHU Story Hints
-- =================================

-- Scene 1: The Calling
UPDATE public.scenes SET valid_actions_hint = 'Express your total loyalty to Maharaj and the cause of Swarajya.' 
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Baji Prabhu%');

-- Scene 2: The Trap
UPDATE public.scenes SET valid_actions_hint = 'Suggest a bold plan to escape the siege of Panhala fort.' 
WHERE scene_number = 2 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Baji Prabhu%');

-- Scene 3: The Deception
UPDATE public.scenes SET valid_actions_hint = 'Decide to support Shiva Nhavi''s brave plan to decoy the enemy.' 
WHERE scene_number = 3 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Baji Prabhu%');

-- Scene 4: The Sacrifice
UPDATE public.scenes SET valid_actions_hint = 'The decoy is captured. Run now and make sure his sacrifice counts.' 
WHERE scene_number = 4 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Baji Prabhu%');

-- Scene 5: Race to Ghod Khind
UPDATE public.scenes SET valid_actions_hint = 'Ride through the storm and mud at maximum speed without stopping.' 
WHERE scene_number = 5 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Baji Prabhu%');

-- Scene 6: The Ultimate Volunteer
UPDATE public.scenes SET valid_actions_hint = 'Tell Maharaj that you will stay behind to hold the narrow pass.' 
WHERE scene_number = 6 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Baji Prabhu%');

-- Scene 7: The Stand
UPDATE public.scenes SET valid_actions_hint = 'Focus on the battle: hold the line and fight every wave of enemies.' 
WHERE scene_number = 7 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Baji Prabhu%');

-- Scene 8: Final Push
UPDATE public.scenes SET valid_actions_hint = 'Endure the pain and keep the enemy at bay until the cannon fires.' 
WHERE scene_number = 8 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Baji Prabhu%');


-- 4. Sync Translations (Ensure intermediate keys exist by rebuilding safely)
UPDATE public.scenes SET translations = 
    jsonb_set(
        jsonb_set(
            jsonb_set(
                jsonb_set(translations, '{hi}', (COALESCE(translations->'hi', '{}'::jsonb) || '{"valid_actions_hint": "कर्तव्य पुकार रहा है। कहें कि आपको तुरंत मिशन के लिए निकलना होगा।"}'::jsonb)),
                '{mr}', (COALESCE(translations->'mr', '{}'::jsonb) || '{"valid_actions_hint": "कर्तव्य साद घालत आहे. सांगा की तुम्हाला त्वरित मोहिमेसाठी निघावे लागेल।"}'::jsonb)
            ),
            '{hi-en}', (COALESCE(translations->'hi-en', '{}'::jsonb) || '{"valid_actions_hint": "Duty bula rahi hai. Boliye ki aapko turant mission ke liye nikalna hoga।"}'::jsonb)
        ),
        '{mr-en}', (COALESCE(translations->'mr-en', '{}'::jsonb) || '{"valid_actions_hint": "Duty bolavat ahe. Sanga ki tumhala lagach mission sathi nighave lagel।"}'::jsonb)
    )
WHERE scene_number = 4 AND story_id = (SELECT id FROM public.stories WHERE title LIKE '%Tanaji%');

-- Repeat for others if necessary, but the column `valid_actions_hint` will already fix English which is what the user is seeing.
