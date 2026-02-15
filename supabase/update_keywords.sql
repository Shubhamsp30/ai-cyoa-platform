-- ==========================================
-- MASTER KEYWORD UPDATE SCRIPT
-- COVERS: English, Marathi (Devanagari), Hindi (Devanagari), Marathi-English (Manglish), Hindi-English (Hinglish)
-- ==========================================

-- ==========================================
-- STORY 1: TANAJI MALUSARE
-- ==========================================

-- Scene 1: The Sting of Purandar (Accept/Understand)
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": [
            "continue", "next", "proceed", "understand", "acknowledge", "accept", "ok", "yes",
            "samajla", "ho", "pudhe", "chal", "manya", "thik ahe",
            "samjha", "haan", "aage", "chalo", "thik hai",
            "समजले", "हो", "पुढे", "चल", "मान्य", "ठीक आहे",
            "समझा", "हाँ", "आगे", "चलो", "ठीक है"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440002",
        "success_message": "⚔️ The weight of this defeat settles on your shoulders. But you know this is not the end...",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 2: The Mother's Gaze (Meet Rajmata)
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": [
            "continue", "next", "proceed", "listen", "approach", "meet", "yes", "go",
            "aai", "ma", "mata", "rajmata", "aagya", "aadesh", "hukma", "paya", "charan", "namaskar", "pranam", "vachan", "jato", "bhet",
            "maa", "milne", "jayenge", "ji",
            "आई", "मा", "माता", "राजमाता", "आज्ञा", "आदेश", "हुकूम", "पाया", "चरण", "नमस्कार", "प्रणाम", "वचन", "जातो", "भेट",
            "माँ", "मिलने", "जाएंगे", "जी"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440003",
        "success_message": "🏰 You steel yourself for what is to come. The Rajmata''s determination is legendary...",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 2 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 3: The Impossible Demand (Volunteer vs Hesitate)
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": [
            "volunteer", "accept", "take mission", "will do", "I will go", "let me", "send me", "yes", "ready",
            "ho", "mi jato", "mi jain", "patva", "tayar", "mohim", "swarajya", "kondhana", "killa", "sath", "kartavya", "jababdari", "aadesh", "manjur",
            "haan", "main jaunga", "bhejo", "taiyar", "zimmedari",
            "हो", "मी जातो", "मी जाईन", "पाठवा", "तयार", "मोहीम", "स्वराज्य", "कोंढाणा", "किल्ला", "साथ", "कर्तव्य", "जबाबदारी", "आदेश", "मंजूर",
            "हाँ", "मैं जाऊंगा", "भेजो", "तैयार", "जिम्मेदारी"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440004",
        "success_message": "🎖️ Your words hang in the air. The decision is made. You will lead this impossible mission!",
        "outcome_type": "success"
    },
    {
        "intent_keywords": [
            "hesitate", "think", "consider", "difficult", "dangerous", "wait", "no",
            "nako", "thamba", "vichar", "kathin", "dhoka", "avghad", "nahi", "ashakya",
            "ruko", "socho", "mushkil", " khatra", "nahi", "asambhav",
            "नको", "थांबा", "विचार", "कठीण", "धोका", "अवघड", "नाही", "अशक्य",
            "रुको", "सोचो", "मुश्किल", "खतरा", "नहीं", "असंभव"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440004",
        "success_message": "⚡ The weight of the decision is immense, but duty calls. There is no turning back now.",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 3 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 4: The Wedding Interrupted (Leave/Duty)
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": [
            "leave", "go", "depart", "ride", "travel", "journey", "duty", "yes",
            "nighato", "jato", "kartavya", "lagna", "postpone", "cancel", "swarajya", "aadhi", "pahile", "raigad", "yeto", "aagya", "sodun", "tyag",
            "nikalta hun", "tayar", "shaadi", "wadhu", "chhod",
            "निघतो", "जातो", "कर्तव्य", "लग्न", "स्वराज्य", "आधी", "पहिले", "रायगड", "येतो", "आज्ञा", "सोडून", "त्याग",
            "निकलता हूँ", "तैयार", "शादी", "वधू", "छोड़"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440005",
        "success_message": "🐎 You bid farewell to your family and mount your horse. The road to Raigad awaits.",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 4 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 5: The Vow (Take Oath)
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": [
            "take vow", "accept", "swear", "promise", "pledge", "sinhagad or death", "yes", "vow",
            "shapath", "vachan", "pratignya", "rakt", "marne", "pran", "jeev", "swarajya", "maharaj", "jijabai", "pratidnya",
            "kasam", "waada", "saugandh", "khoon", "jaan",
            "शपथ", "वचन", "प्रतिज्ञा", "रक्त", "मरणे", "प्राण", "जीव", "स्वराज्य", "महाराज", "जिजाबाई",
            "कसम", "वादा", "सौगंध", "खून", "जान"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440006",
        "success_message": "🙏 The vow is taken. Your fate is sealed. Now begins the preparation for the impossible mission.",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 5 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 6: The Omen at the Cliff (Force vs Wait)
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": [
            "threaten", "force", "command", "push", "urge", "make it climb", "shout", "order", "climb", "up",
            "chadh", "varcha", "darda", "orda", "yashwanti", "ghorpad", "bhet", "maar", "zep", "nigh",
            "chadh", "upar", "daanto", "maaro", 
            "चढ", "वरचा", "दर्डा", "ओरडा", "यशवंती", "घोरपड", "भेट", "मार", "झेप", "निघ",
            "चढ़", "ऊपर", "डांटो", "मारो"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440007",
        "success_message": "🦎 Your fierce command works! Yashwanti scurries up the cliff and secures the rope. Your men begin the ascent!",
        "outcome_type": "success"
    },
    {
        "intent_keywords": [
            "wait", "calm", "gentle", "patience", "soothe", "encourage", "coax", "slow",
            "shant", "prem", "samjav", "manav", "halu", "bhiti", "nako", "thamba",
            "shant", "pyar", "samjhao", "dheere", "daro mat", "ruko",
            "शांत", "प्रेम", "समजव", "मानव", "हळू", "भीती", "नको", "थांबा",
            "प्यार", "समझाओ", "धीरे", "डरो मत", "रुको"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440007",
        "success_message": "⏰ You try to calm the creature, but precious time is lost. Finally, Yashwanti climbs. You must hurry now!",
        "outcome_type": "consequence"
    }
]'::jsonb
WHERE scene_number = 6 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 7: The Lion''s Charge (Attack)
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": [
            "charge", "attack", "fight", "battle", "forward", "har har mahadev", "advance", "kill", "war",
            "hamla", "akramon", "mar", "yuddha", "ladha", "talwar", "jai bhavani", "jai shivaji", "pudhe", "chala", "ghusa", "tutun", "pad",
            "hamla", "aakraman", "maaro", "ladho", "aage", "ghuso",
            "हल्ला", "आक्रमण", "मार", "युद्ध", "लढा", "तलवार", "जय भवानी", "जय शिवाजी", "पुढे", "चाला", "घुसा", "तुटून", "पड",
            "हमला", "मारो", "लड़ो", "आगे", "घुसो"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440008",
        "success_message": "⚔️ You lead the charge with unstoppable fury! The Mughals fall back before your assault!",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 7 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 8: The Duel of Commanders (Duel)
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": [
            "continue", "fight", "next", "proceed", "battle", "duel", "kill", "face", "war",
            "ladh", "mar", "samna", "udaybhan", "yuddha", "talwar", "dhal", "khatam",
            "ladho", "maaro", "saamna", "khatam",
            "लढ", "मार", "सामना", "उदयभान", "युद्ध", "तलवार", "ढाल", "खतम",
            "लड़ो", "मारो", "खत्म"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440009",
        "success_message": "💔 You fight with everything you have, but Uday Bhan''s blade finds its mark. You fall...",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 8 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 9: Suryaji''s Rally (Rise/Fight)
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": [
            "continue", "next", "proceed", "rally", "fight", "avenge", "win", "rise",
            "ladha", "himmat", "utha", "badla", "tanaji", "suryaji", "jinka", "vijay", "har har mahadev",
            "ladho", "himmat", "utho", "badla", "jeeto",
            "लढा", "हिंमत", "उठा", "बदला", "तानाजी", "सूर्याजी", "जिंका", "विजय", "हर हर महादेव",
            "लड़ो", "हिम्मत", "उठो", "जीत"
        ],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440010",
        "success_message": "🔥 The Marathas, with nowhere to run, fight like cornered lions. Victory is within reach...",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 9 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');


-- ==========================================
-- STORY 2: BAJI PRABHU DESHPANDE
-- ==========================================
-- Note: Using JSON append logic safely since UUIDs may vary

-- Scene 1: Accept Mission
UPDATE public.scenes
SET valid_paths = (
  SELECT jsonb_set(
    valid_paths, 
    '{0, intent_keywords}', 
    (valid_paths->0->'intent_keywords') || '["accept", "take", "sword", "talwar", "yes", "loyalty", "pledge", "vachan", "ho", "swikar", "jababdari", "nishtha", "haan", "zimmedari", "स्वीकार", "जबाबदारी", "निष्ठा", "वचन", "तलवार", "हो", "हाँ", "जिम्मेदारी"]'::jsonb
  )
)
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');

-- Scene 2: The Trap (Surrender path - usually index 0/Consequence)
UPDATE public.scenes
SET valid_paths = (
  SELECT jsonb_set(
    valid_paths, 
    '{0, intent_keywords}', 
    (valid_paths->0->'intent_keywords') || '["surrender", "give up", "run", "escape", "sharan", "sola", "mafi", "pala", "haar", "maafi", "bhaago", "शरण", "सोडा", "माफी", "पळा", "हार", "भागो"]'::jsonb
  )
)
WHERE scene_number = 2 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind')
AND valid_paths->0->>'outcome_type' = 'consequence';

-- Scene 2: The Trap (Fight/Third Way path - usually index 1/Success)
UPDATE public.scenes
SET valid_paths = (
  SELECT jsonb_set(
    valid_paths, 
    '{1, intent_keywords}', 
    (valid_paths->1->'intent_keywords') || '["fight", "break out", "attack", "escape plan", "third way", "ladha", "fodun", "nigha", "raasta", "marg", "yuddha", "rasta", "tod", "लढा", "फोडून", "निघा", "रस्ता", "मार्ग", "युद्ध", "तोड़"]'::jsonb
  )
)
WHERE scene_number = 2 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind')
AND jsonb_array_length(valid_paths) > 1;

-- Scene 3: Grand Deception (Support Plan)
UPDATE public.scenes
SET valid_paths = (
  SELECT jsonb_set(
    valid_paths, 
    '{0, intent_keywords}', 
    (valid_paths->0->'intent_keywords') || '["support", "agree", "yes", "plan", "sacrifice", "risk", "ok", "ho", "mannya", "balidan", "dhoka", "pathimba", "haan", "samarthan", "khatra", "हो", "मान्य", "बलिदान", "धोका", "पाठिंबा", "हाँ", "समर्थन", "खतरा"]'::jsonb
  )
)
WHERE scene_number = 3 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');

-- Scene 4: Decoy's Sacrifice (Run/Escape)
-- Note: Need to verify if this exists in valid_paths. Assuming standard success path.
UPDATE public.scenes
SET valid_paths = (
  SELECT jsonb_set(
    valid_paths, 
    '{0, intent_keywords}', 
    (valid_paths->0->'intent_keywords') || '["run", "escape", "leave", "go", "pala", "nigha", "bhaago", "niklo", "पळा", "निघा", "भागो", "निकलो"]'::jsonb
  )
)
WHERE scene_number = 4 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');

-- Scene 5: Race to Ghod Khind (Ride Fast)
UPDATE public.scenes
SET valid_paths = (
  SELECT jsonb_set(
    valid_paths, 
    '{0, intent_keywords}', 
    (valid_paths->0->'intent_keywords') || '["ride", "fast", "run", "gallop", "speed", "go", "pala", "veg", "ghoda", "dauda", "chal", "jau", "tez", "chalo", "पळा", "वेग", "घोडा", "दौडा", "चल", "जाऊ", "तेज़", "चलो"]'::jsonb
  )
)
WHERE scene_number = 5 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');

-- Scene 6: Ultimate Volunteer (Stay & Fight)
UPDATE public.scenes
SET valid_paths = (
  SELECT jsonb_set(
    valid_paths, 
    '{0, intent_keywords}', 
    (valid_paths->0->'intent_keywords') || '["volunteer", "stay", "stop", "hold", "fight here", "thamba", "rokh", "mi thambto", "baji", "prabhu", "khind", "ruko", "main rukunga", "thaamba", "रोख", "मी थांबतो", "बाजी", "प्रभू", "खिंड", "रुको", "मैं रुकूंगा"]'::jsonb
  )
)
WHERE scene_number = 6 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');

-- Scene 7: Towering Stand (Hold Line)
UPDATE public.scenes
SET valid_paths = (
  SELECT jsonb_set(
    valid_paths, 
    '{0, intent_keywords}', 
    (valid_paths->0->'intent_keywords') || '["hold", "fight", "kill", "block", "har har mahadev", "rokh", "ladh", "mar", "kap", "talwar", "dhal", "mawale", "maaro", "kato", "रोख", "लढ", "मार", "काप", "तलवार", "ढाल", "मावळे", "हर हर महादेव", "मारो", "काटो"]'::jsonb
  )
)
WHERE scene_number = 7 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');

-- Scene 8: Final Push (Wait/Hold)
UPDATE public.scenes
SET valid_paths = (
  SELECT jsonb_set(
    valid_paths, 
    '{0, intent_keywords}', 
    (valid_paths->0->'intent_keywords') || '["wait", "listen", "sound", "cannon", "hold on", "not yet", "alive", "thamba", "aika", "tof", "aawaz", "jivant", "ruko", "suno", "zinda", "thaamba", "ऐका", "तोफ", "आवाज", "जीवंत", "रुको", "सुनो", "जिंदा"]'::jsonb
  )
)
WHERE scene_number = 8 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');

-- Scene 9: Victory (Ending - usually no input, but just in case)
-- (No keyword update needed for purely narrative ending, but good to be safe)
