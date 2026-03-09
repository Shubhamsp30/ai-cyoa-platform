-- ==========================================
-- CLEARER TACTICAL HINTS FOR ALL SCENES
-- ==========================================

-- STORY 1: Tanaji Malusare
-- ========================

-- Scene 1: The Sting of Purandar
UPDATE public.scenes 
SET translations = jsonb_set(translations, '{en,valid_actions_hint}', '"You need to acknowledge the weight of this defeat to proceed (e.g., say continue or next)."'::jsonb)
WHERE scene_number = 1 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes 
SET translations = jsonb_set(translations, '{hi,valid_actions_hint}', '"आगे बढ़ने के लिए आपको इस हार को स्वीकार करना होगा (जैसे, ''आगे'' या ''जारी रखें'' कहें)।"'::jsonb)
WHERE scene_number = 1 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes 
SET translations = jsonb_set(translations, '{mr,valid_actions_hint}', '"पुढे जाण्यासाठी तुम्हाला हा पराभव स्वीकारणे आवश्यक आहे (उदा. ''पुढे'' किंवा ''चालू ठेवा'' सांगा)."'::jsonb)
WHERE scene_number = 1 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

-- Scene 3: The Impossible Demand (Clearer)
UPDATE public.scenes
SET translations = jsonb_set(translations, '{en,valid_actions_hint}', '"State clearly that you are ready to volunteer for the mission."'::jsonb)
WHERE scene_number = 3 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes
SET translations = jsonb_set(translations, '{hi,valid_actions_hint}', '"स्पष्ट रूप से कहें कि आप मिशन के लिए स्वयंसेवक होने के लिए तैयार हैं।"'::jsonb)
WHERE scene_number = 3 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes
SET translations = jsonb_set(translations, '{mr,valid_actions_hint}', '"स्पष्टपणे सांगा की तुम्ही या मोहिमेसाठी स्वयंसेवक म्हणून तयार आहात."'::jsonb)
WHERE scene_number = 3 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes
SET translations = jsonb_set(translations, '{hi-en,valid_actions_hint}', '"Clear boliye ki aap mission ke liye volunteer karne ke liye ready hain."'::jsonb)
WHERE scene_number = 3 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes
SET translations = jsonb_set(translations, '{mr-en,valid_actions_hint}', '"Clear sanga ki tumhi mission sathi volunteer mhanun ready ahat."'::jsonb)
WHERE scene_number = 3 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

-- Scene 5: The Vow (Clearer)
UPDATE public.scenes
SET translations = jsonb_set(translations, '{en,valid_actions_hint}', '"Confirm your commitment and take the solemn oath (e.g., say ''I take the vow'')."'::jsonb)
WHERE scene_number = 5 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes
SET translations = jsonb_set(translations, '{hi,valid_actions_hint}', '"अपनी प्रतिबद्धता की पुष्टि करें और पवित्र प्रतिज्ञा लें (जैसे, ''मैं प्रतिज्ञा लेता हूँ'' कहें)।"'::jsonb)
WHERE scene_number = 5 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes
SET translations = jsonb_set(translations, '{mr,valid_actions_hint}', '"तुमची वचनबद्धता निश्चित करा आणि पवित्र शपथ घ्या (उदा. ''मी शपथ घेतो'' सांगा)."'::jsonb)
WHERE scene_number = 5 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

-- Scene 6: The Omen
UPDATE public.scenes
SET translations = jsonb_set(translations, '{en,valid_actions_hint}', '"Decide whether to command the lizard to climb or wait for a better moment."'::jsonb)
WHERE scene_number = 6 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes
SET translations = jsonb_set(translations, '{hi,valid_actions_hint}', '"तय करें कि गोह को चढ़ने का आदेश देना है या बेहतर क्षण की प्रतीक्षा करनी है।"'::jsonb)
WHERE scene_number = 6 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE public.scenes
SET translations = jsonb_set(translations, '{mr,valid_actions_hint}', '"पाल चढण्यासाठी आज्ञा द्यायची की चांगल्या क्षणाची वाट पाहायची हे ठरवा."'::jsonb)
WHERE scene_number = 6 AND story_id = '550e8400-e29b-41d4-a716-446655440000';

-- STORY 2: Baji Prabhu
-- ====================

-- Scene 1: The Calling (Clearer)
UPDATE public.scenes
SET translations = jsonb_set(translations, '{en,valid_actions_hint}', '"Express your total loyalty to the vision of Swarajya (e.g., say I am with you)."'::jsonb)
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title LIKE 'Baji Prabhu%');

UPDATE public.scenes
SET translations = jsonb_set(translations, '{hi,valid_actions_hint}', '"स्वराज्य के विजन के प्रति अपनी पूर्ण निष्ठा व्यक्त करें (जैसे, ''मैं आपके साथ हूं'' कहें)।"'::jsonb)
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title LIKE 'Baji Prabhu%');

UPDATE public.scenes
SET translations = jsonb_set(translations, '{mr,valid_actions_hint}', '"स्वराज्याच्या ध्येयाप्रती तुमची पूर्ण निष्ठा व्यक्त करा (उदा. ''मी तुमच्या सोबत आहे'' सांगा)."'::jsonb)
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title LIKE 'Baji Prabhu%');

-- Scene 6: The Ultimate Volunteer (Clearer)
UPDATE public.scenes
SET translations = jsonb_set(translations, '{en,valid_actions_hint}', '"Offer to stay behind and block the enemy so Maharaj can escape safely."'::jsonb)
WHERE scene_number = 6 AND story_id = (SELECT id FROM public.stories WHERE title LIKE 'Baji Prabhu%');

UPDATE public.scenes
SET translations = jsonb_set(translations, '{hi,valid_actions_hint}', '"दुश्मन को रोकने के लिए पीछे रुकने का प्रस्ताव दें ताकि महाराज सुरक्षित रूप से निकल सकें।"'::jsonb)
WHERE scene_number = 6 AND story_id = (SELECT id FROM public.stories WHERE title LIKE 'Baji Prabhu%');

UPDATE public.scenes
SET translations = jsonb_set(translations, '{mr,valid_actions_hint}', '"शत्रूला रोखण्यासाठी मागे थांबण्याचा प्रस्ताव द्या जेणेकरून महाराज सुरक्षितपणे निसटू शकतील."'::jsonb)
WHERE scene_number = 6 AND story_id = (SELECT id FROM public.stories WHERE title LIKE 'Baji Prabhu%');

-- Scene 8: The Final Push (Clearer)
UPDATE public.scenes
SET translations = jsonb_set(translations, '{en,valid_actions_hint}', '"Keep fighting and endure until you hear the signal of the cannons."'::jsonb)
WHERE scene_number = 8 AND story_id = (SELECT id FROM public.stories WHERE title LIKE 'Baji Prabhu%');

UPDATE public.scenes
SET translations = jsonb_set(translations, '{hi,valid_actions_hint}', '"लड़ते रहें और तब तक डटे रहें जब तक आप तोपों का संकेत न सुन लें।"'::jsonb)
WHERE scene_number = 8 AND story_id = (SELECT id FROM public.stories WHERE title LIKE 'Baji Prabhu%');

UPDATE public.scenes
SET translations = jsonb_set(translations, '{mr,valid_actions_hint}', '"लढत राहा आणि जोपर्यंत तुम्हाला तोफांचा इशारा ऐकू येत नाही तोपर्यंत धीर धरा."'::jsonb)
WHERE scene_number = 8 AND story_id = (SELECT id FROM public.stories WHERE title LIKE 'Baji Prabhu%');
