-- Seed data for Tanaji Malusare story
-- This script populates the database with the complete 10-scene story

-- Insert the Tanaji Malusare story
INSERT INTO public.stories (id, title, description, character_name, total_scenes, thumbnail_url, is_published)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Tanaji Malusare: The Conquest of Sinhagad',
    'Experience the legendary tale of courage and sacrifice. The year is 1670, and the Maratha Empire seeks to reclaim the strategic fort of Sinhagad from Mughal control. Play as Tanaji Malusare, the fearless commander who accepts an impossible mission.',
    'Tanaji Malusare',
    10,
    NULL, -- Add thumbnail URL after uploading image
    true
);

-- Insert all 10 scenes
-- Scene 1: The Sting of Purandar
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    1,
    'The Sting of Purandar',
    'The year is 1665. The Treaty of Purandar has just been signed, forcing the Maratha Empire to surrender 23 strategic forts to the Mughal Empire.',
    'The Treaty of Purandar in 1665 was a deeply humiliating event for the Maratha Empire. Shivaji Maharaj was forced to surrender 23 forts, including the strategic and formidable Sinhagad, to the Mughal Empire. The loss of these forts was a severe blow to Maratha pride. You stand in the court at Pratapgad, watching your king sign away the forts. Each signature feels like a dagger to your heart. You have fought for these forts, bled for them. Now they belong to the enemy.',
    NULL, -- Add image URL after upload
    '[
        {
            "intent_keywords": ["continue", "next", "proceed", "understand", "acknowledge", "accept"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440002",
            "success_message": "⚔️ The weight of this defeat settles on your shoulders. But you know this is not the end...",
            "outcome_type": "success"
        }
    ]'::jsonb,
    false
);

-- Scene 2: The Mother's Gaze
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    2,
    'The Mother''s Gaze',
    'From her chambers in Pratapgad, Rajmata Jijabai gazes at the distant Sinhagad fort. The Mughal flag flying over it fills her with burning rage.',
    'From the window of her chambers in Pratapgad, Jijabai would often gaze out at the distant Sinhagad. The sight of the Mughal flag waving over the fort filled her with burning rage and unshakeable resolve. Day after day, she would stand at that window, plotting its recapture. You have been summoned to Pratapgad. As you walk through the corridors, you sense the tension. Rajmata Jijabai has called for you specifically.',
    NULL,
    '[
        {
            "intent_keywords": ["continue", "next", "proceed", "listen", "approach", "meet"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440003",
            "success_message": "🏰 You steel yourself for what is to come. The Rajmata''s determination is legendary...",
            "outcome_type": "success"
        }
    ]'::jsonb,
    false
);

-- Scene 3: The Impossible Demand
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    3,
    'The Impossible Demand',
    'Jijabai summons Shivaji and points to Sinhagad on the map. Her demand is clear: recapture the fort immediately.',
    'Driven by fierce desire, Jijabai summoned Shivaji Maharaj and pointed to Sinhagad on a map, demanding its immediate recapture. Shivaji looked troubled—he knew the fort was impregnable, guarded by fierce garrison and natural defenses. You stand in the chamber as Rajmata makes her demand. You know this mission, impossible as it seems, must be undertaken. If your king needs someone to attempt the impossible, you will volunteer.',
    NULL,
    '[
        {
            "intent_keywords": ["volunteer", "accept", "take mission", "will do", "I will go", "let me", "send me", "yes"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440004",
            "success_message": "🎖️ Your words hang in the air. The decision is made. You will lead this impossible mission!",
            "outcome_type": "success"
        },
        {
            "intent_keywords": ["hesitate", "think", "consider", "difficult", "dangerous", "wait"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440004",
            "success_message": "⚡ The weight of the decision is immense, but duty calls. There is no turning back now.",
            "outcome_type": "success"
        }
    ]'::jsonb,
    false
);

-- Scene 4: The Wedding Interrupted
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440000',
    4,
    'The Wedding Interrupted',
    'You are in your village celebrating your son''s wedding when a royal messenger arrives with an urgent summons.',
    'You are in the midst of your son''s wedding celebration when the royal messenger arrives. The music stops. All eyes turn to you. Your son''s face shows understanding—he has grown up knowing that duty to Swarajya comes first. Your wife touches your hand gently. The messenger bears the king''s seal. Your duty calls.',
    NULL,
    '[
        {
            "intent_keywords": ["leave", "go", "depart", "ride", "travel", "journey", "duty", "yes"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440005",
            "success_message": "🐎 You bid farewell to your family and mount your horse. The road to Raigad awaits.",
            "outcome_type": "success"
        }
    ]'::jsonb,
    false
);

-- Scene 5: The Vow
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440000',
    5,
    'The Vow',
    'At Raigad, you are informed of the mission. Undeterred by the terrifying odds, you must take a solemn vow.',
    'Arriving at Raigad, you are informed of the mission by Jijabai. Scale the impossible cliffs of Sinhagad, defeat the Mughal garrison, and reclaim the fort. You kneel before Rajmata Jijabai and your king. The pan is offered to you—a symbol of the sacred vow. You know the odds. You know this may be your last mission. But you also know that some things are worth dying for. Swarajya is one of them.',
    NULL,
    '[
        {
            "intent_keywords": ["take vow", "accept", "swear", "promise", "pledge", "sinhagad or death", "yes", "vow"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440006",
            "success_message": "🙏 The vow is taken. Your fate is sealed. Now begins the preparation for the impossible mission.",
            "outcome_type": "success"
        }
    ]'::jsonb,
    false
);

-- Scene 6: The Omen at the Cliff
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440000',
    6,
    'The Omen at the Cliff',
    'On a cold, moonless night, you and your Mavala soldiers reach the base of Sinhagad. You must scale a sheer cliff face.',
    'You and your Mavala soldiers reached the base of Sinhagad on a cold, moonless night. You chose a sheer, near-impossible cliff face to climb. Your favorite monitor lizard, Yashwanti, must secure a rope for the ascent. But she refuses to climb, clinging to the rock face—a bad omen. Your men are getting nervous. You must make a decision quickly.',
    NULL,
    '[
        {
            "intent_keywords": ["threaten", "force", "command", "push", "urge", "make it climb", "shout", "order"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440007",
            "success_message": "🦎 Your fierce command works! Yashwanti scurries up the cliff and secures the rope. Your men begin the ascent!",
            "outcome_type": "success"
        },
        {
            "intent_keywords": ["wait", "calm", "gentle", "patience", "soothe", "encourage", "coax"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440007",
            "success_message": "⏰ You try to calm the creature, but precious time is lost. Finally, Yashwanti climbs. You must hurry now!",
            "outcome_type": "consequence"
        }
    ]'::jsonb,
    false
);

-- Scene 7: The Lion's Charge
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440000',
    7,
    'The Lion''s Charge',
    'Only 300 men have scaled the cliff when Mughal guards detect the intrusion. With surprise lost, you must act.',
    'Only 300 men had scaled the cliff when you were detected by the Mughal guards. Alarm bells rang out. With the element of surprise lost, you know hesitation means death. You pull yourself over the rampart and draw your sword. Your war cry tears from your throat: "Har Har Mahadev!" Steel clashes against steel. You fight like a lion unleashed.',
    NULL,
    '[
        {
            "intent_keywords": ["charge", "attack", "fight", "battle", "forward", "har har mahadev", "advance"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440008",
            "success_message": "⚔️ You lead the charge with unstoppable fury! The Mughals fall back before your assault!",
            "outcome_type": "success"
        }
    ]'::jsonb,
    false
);

-- Scene 8: The Duel of Commanders
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440000',
    8,
    'The Duel of Commanders',
    'The battle rages for hours. Exhausted, you face the fresh Mughal commander Uday Bhan in a ferocious duel.',
    'The battle raged for hours. You, exhausted from the long march, the climb, and continuous fighting, now face the fresh Mughal commander, Uday Bhan. A ferocious duel ensues in the fort''s courtyard. Your arms are heavy, your breath comes in gasps. But you cannot fall now. You raise your sword and meet his attack. Each parry sends shocks of pain through your exhausted muscles. You fight on, driven by sheer will...',
    NULL,
    '[
        {
            "intent_keywords": ["continue", "fight", "next", "proceed", "battle", "duel"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440009",
            "success_message": "💔 You fight with everything you have, but Uday Bhan''s blade finds its mark. You fall...",
            "outcome_type": "success"
        }
    ]'::jsonb,
    false
);

-- Scene 9: Suryaji's Rally
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440000',
    9,
    'Suryaji''s Rally',
    'Seeing you fall, the Maratha soldiers panic. Your brother Suryaji makes a desperate move.',
    'You lie on the cold stone, your life bleeding away. Through dimming eyes, you see your men retreating. No... this cannot be how it ends. Then you hear Suryaji''s voice, fierce and commanding. He cuts the ropes at the cliff edge. "There is no retreat!" he roars. "We fight! We win! Or we die avenging Tanaji! Har Har Mahadev!" The Marathas turn back to fight.',
    NULL,
    '[
        {
            "intent_keywords": ["continue", "next", "proceed", "rally", "fight", "avenge"],
            "next_scene_id": "550e8400-e29b-41d4-a716-446655440010",
            "success_message": "🔥 The Marathas, with nowhere to run, fight like cornered lions. Victory is within reach...",
            "outcome_type": "success"
        }
    ]'::jsonb,
    false
);

-- Scene 10: "The Lion is Gone"
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440000',
    10,
    '"The Lion is Gone"',
    'The Marathas rout the Mughal garrison. Sinhagad is captured. But at what cost?',
    'The Marathas, rallied by Suryaji, fought with renewed fury and routed the Mughal garrison. Sinhagad was captured. The Maratha flag rose over the fort as the sun began to rise. Your vision fades as the sounds of victory grow distant. You see Shivaji''s face in your mind, and Jijabai''s proud eyes. You have served Swarajya to your last breath. As darkness takes you, you whisper, "Har Har Mahadev..." Shivaji Maharaj arrived at dawn, eager to congratulate his friend. But he found only your lifeless body. Kneeling in grief, he uttered: "Gad ala pan Sinha gela" - The fort is gained, but the Lion is lost.',
    NULL,
    '[]'::jsonb,
    true
);

-- Update the starting_scene_id for the story
UPDATE public.stories
SET starting_scene_id = '550e8400-e29b-41d4-a716-446655440001'
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Verify the data
SELECT 
    s.title as story_title,
    COUNT(sc.id) as scene_count
FROM public.stories s
LEFT JOIN public.scenes sc ON s.id = sc.story_id
GROUP BY s.id, s.title;
