-- Add available_characters column to stories table
ALTER TABLE public.stories 
ADD COLUMN IF NOT EXISTS available_characters TEXT[] DEFAULT ARRAY['Tanaji Malusare'];

-- 1. Insert/Update Tanaji Story
INSERT INTO public.stories (id, title, description, character_name, total_scenes, is_published, available_characters)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Tanaji Malusare: The Conquest of Sinhagad',
    'Experience the legendary tale of courage and sacrifice. The year is 1670, and the Maratha Empire seeks to reclaim the strategic fort of Sinhagad from Mughal control. Play as Tanaji Malusare, the fearless commander who accepts an impossible mission.',
    'Tanaji Malusare',
    10,
    true,
    ARRAY['Tanaji Malusare', 'Suryaji Malusare']
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    available_characters = EXCLUDED.available_characters;


-- 2. Insert/Update Baji Prabhu Story
INSERT INTO public.stories (id, title, description, character_name, total_scenes, is_published, available_characters)
VALUES (
    '550e8400-e29b-41d4-a716-446655440011', -- New UUID for Baji Prabhu
    'Baji Prabhu Deshpande: The Last Stand',
    'The legendary tale of the "300" Marathas who held the pass against thousands to save their King. Experience the ultimate sacrifice at Pavankhind.',
    'Baji Prabhu Deshpande',
    10,
    true,
    ARRAY['Baji Prabhu Deshpande']
)
ON CONFLICT (title) DO UPDATE SET -- Match by title if ID unknown
    description = EXCLUDED.description,
    available_characters = EXCLUDED.available_characters;
