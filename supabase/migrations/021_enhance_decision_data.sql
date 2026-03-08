-- Enhance decision data for better AI matching accuracy
-- Story 1: Tanaji Malusare

-- Scene 3: The Impossible Demand
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": ["volunteer", "accept", "will do", "I will go", "let me", "send me", "yes", "tyaar", "swayamsevak", "main jaunga", "mi janar"],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440004",
        "success_message": "🎖️ Your words hang in the air. The decision is made. You will lead this impossible mission!",
        "outcome_type": "success"
    },
    {
        "intent_keywords": ["hesitate", "think", "consider", "difficult", "dangerous", "wait", "sochna", "vichar", "dhokadayak"],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440004",
        "success_message": "⚡ The weight of the decision is immense, but duty calls. There is no turning back now.",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 3 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 5: The Vow
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": ["take vow", "accept", "swear", "promise", "pledge", "sinhagad or death", "yes", "vow", "pratigya", "shapath", "vachan"],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440006",
        "success_message": "🙏 The vow is taken. Your fate is sealed. Now begins the preparation for the impossible mission.",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 5 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Scene 6: The Omen
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": ["threaten", "force", "command", "push", "urge", "make it climb", "shout", "order", "dhaki", "force", "chadh", "order"],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440007",
        "success_message": "🦎 Your fierce command works! Yashwanti scurries up the cliff and secures the rope. Your men begin the ascent!",
        "outcome_type": "success"
    },
    {
        "intent_keywords": ["wait", "calm", "gentle", "patience", "soothe", "encourage", "coax", "shanti", "prem", "himmat"],
        "next_scene_id": "550e8400-e29b-41d4-a716-446655440007",
        "success_message": "⏰ You try to calm the creature, but precious time is lost. Finally, Yashwanti climbs. You must hurry now!",
        "outcome_type": "consequence"
    }
]'::jsonb
WHERE scene_number = 6 AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

-- Story 2: Baji Prabhu
-- Scene 1: The Calling
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": ["accept", "join", "loyal", "loyalty", "swear", "yes", "ho", "ji", "ha", "swikar", "nishtha"],
        "next_scene_id": (SELECT id FROM public.scenes WHERE scene_number = 2 AND story_id = (SELECT id FROM public.stories WHERE title = ''Baji Prabhu Deshpande: The Last Stand at Pavankhind'')),
        "success_message": "⚔️ You pledge your life to Swarajya. The journey begins.",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');

-- Scene 3: The Deception
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": ["support", "allow", "yes", "plan", "let him", "sacrifice", "manya", "ho", "ji", "yojana"],
        "next_scene_id": (SELECT id FROM public.scenes WHERE scene_number = 4 AND story_id = (SELECT id FROM public.stories WHERE title = ''Baji Prabhu Deshpande: The Last Stand at Pavankhind'')),
        "success_message": "🛡️ The heavy plan is set into motion. Shiva Nhavi prepares for his ultimate sacrifice.",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 3 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');

-- Scene 7: Hold the line
UPDATE public.scenes
SET valid_paths = '[
    {
        "intent_keywords": ["fight", "hold", "battle", "stop them", "protect", "defend", "ladha", "thamba", "rok", "suraksha"],
        "next_scene_id": (SELECT id FROM public.scenes WHERE scene_number = 8 AND story_id = (SELECT id FROM public.stories WHERE title = ''Baji Prabhu Deshpande: The Last Stand at Pavankhind'')),
        "success_message": "⚔️ You stand like an immovable rock! The enemy cannot pass Pavankhind!",
        "outcome_type": "success"
    }
]'::jsonb
WHERE scene_number = 7 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand at Pavankhind');
