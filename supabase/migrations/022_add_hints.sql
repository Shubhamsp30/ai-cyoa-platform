-- Refine hints to be cryptic and expand keywords for robustness
-- Story 1: Tanaji Malusare

-- Scene 3: The Impossible Demand
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": ["volunteer", "accept", "will do", "I will go", "let me", "send me", "yes", "tyaar", "swayamsevak", "main jaunga", "mi janar", "ready", "tayyar", "commitment", "duty", "swarajya", "challenge", "shiledar", "mawal", "lead", "command"],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440004",
        "success_message": "🎖️ Your words hang in the air. The decision is made. You will lead this impossible mission!",
        "outcome_type": "success"
    },
    {
        "intent_keywords": ["hesitate", "think", "consider", "difficult", "dangerous", "wait", "sochna", "vichar", "dhokadayak", "fear", "risk", "impossible", "kathin", "vichar karto"],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440004",
        "success_message": "⚡ The weight of the decision is immense, but duty calls. There is no turning back now.",
        "outcome_type": "success"
    }
]'::jsonb,
translations = jsonb_set(
    jsonb_set(
        jsonb_set(
            jsonb_set(
                jsonb_set(translations, '{en,valid_actions_hint}', '"The breath of Swarajya requires a soul that embraces the impossible without a second thought."'::jsonb),
                '{hi,valid_actions_hint}', '"स्वराज्य की पुकार उस आत्मा को खोज रही है जो बिना सोचे समझे असंभव को गले लगा ले।"'::jsonb
            ),
            '{mr,valid_actions_hint}', '"स्वराज्याची हाक अशा जीवाची वाट पाहत आहे जो क्षणाचाही विलंब न लावता असक्य गोष्टीला गवसणी घालेल."'::jsonb
        ),
        '{hi-en,valid_actions_hint}', '"Swarajya ki pukaar us soul ko dhund rahi hai jo bina soche samjhe impossible ko gale laga le."'::jsonb
    ),
    '{mr-en,valid_actions_hint}', '"Swarajyachi haak asha jivachi vat pahat ahe jo kshanachahi vilamb na lavta impossible goshtila gavasni ghalel."'::jsonb
)
WHERE scene_number = 3 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 5: The Vow
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": ["take vow", "accept", "swear", "promise", "pledge", "sinhagad or death", "yes", "vow", "pratigya", "shapath", "vachan", "bond", "resolution", "marayala tayyar", "balidan", "commitment"],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440006",
        "success_message": "🙏 The vow is taken. Your fate is sealed. Now begins the preparation for the impossible mission.",
        "outcome_type": "success"
    }
]'::jsonb,
translations = jsonb_set(
    jsonb_set(
        jsonb_set(
            jsonb_set(
                jsonb_set(translations, '{en,valid_actions_hint}', '"A warrior''s tongue is bound by iron words that even death cannot break."'::jsonb),
                '{hi,valid_actions_hint}', '"एक योद्धा की जुबान लोहे के शब्दों से बंधी होती है जिन्हें मृत्यु भी नहीं तोड़ सकती।"'::jsonb
            ),
            '{mr,valid_actions_hint}', '"एका मावळ्याची जीभ लोखंडी शब्दांनी बांधलेली असते ज्याला मृत्यूही तोडू शकत नाही."'::jsonb
        ),
        '{hi-en,valid_actions_hint}', '"Ek warrior ki zubaan lohe ke shabdon se bandhi hoti hai jinhe maut bhi nahi tod sakti."'::jsonb
    ),
    '{mr-en,valid_actions_hint}', '"Eka mavlyachi jeebh lokhandi shabdanni bandhleli aste jyala maut hi todau shakat nahi."'::jsonb
)
WHERE scene_number = 5 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Story 2: Baji Prabhu
-- Scene 1: The Calling
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": ["accept", "join", "loyal", "loyalty", "swear", "yes", "ho", "ji", "ha", "swikar", "nishtha", "sobat", "dhanya", "prabhu", "deshpande", "mavala", "soldier", "warrior", "ready", "commitment"],
        "next_scene_id": (SELECT id FROM public.scenes WHERE scene_number = 2 AND story_id = (SELECT id FROM public.stories WHERE title = ''Baji Prabhu Deshpande: Pavankhind ki Last Stand'' OR title = ''Baji Prabhu Deshpande: The Last Stand'')),
        "success_message": "⚔️ You pledge your life to Swarajya. The journey begins.",
        "outcome_type": "success"
    }
]'::jsonb,
translations = jsonb_set(
    jsonb_set(
        jsonb_set(
            jsonb_set(
                jsonb_set(translations, '{en,valid_actions_hint}', '"When the King calls for blood and loyalty, only the chosen few answer with their lives."'::jsonb),
                '{hi,valid_actions_hint}', '"जब राजा रक्त और निष्ठा की पुकार करते हैं, तो केवल चुने हुए कुछ ही अपने जीवन से उत्तर देते हैं।"'::jsonb
            ),
            '{mr,valid_actions_hint}', '"जेव्हा राजे रक्ताची आणि निष्ठेची हाक देतात, तेव्हा फक्त निवडक काहीच आपल्या प्राणाने उत्तर देतात."'::jsonb
        ),
        '{hi-en,valid_actions_hint}', '"Jab Raja rakht aur nishtha ki pukaar karte hain, toh sirf chune hue kuch hi apne jeevan se answer dete hain."'::jsonb
    ),
    '{mr-en,valid_actions_hint}', '"Jenvha Raje raktachi ani nishthechi haak detat, tenvha fakt nivdak kahich aplya pranan ne uttar detat."'::jsonb
)
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: Pavankhind ki Last Stand' OR title = 'Baji Prabhu Deshpande: The Last Stand');
