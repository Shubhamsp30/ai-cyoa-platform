-- Updated schema for multi-story support with images
-- No authentication required - simplified for direct gameplay

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stories table
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT, -- Cover image for story selection
    character_name TEXT NOT NULL, -- Main character name
    total_scenes INTEGER NOT NULL,
    starting_scene_id UUID, -- Will be set after scenes are created
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenes table with image support
CREATE TABLE IF NOT EXISTS public.scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    overview TEXT NOT NULL, -- Short description shown before scene
    content TEXT NOT NULL, -- Full narrative text
    image_url TEXT, -- Scene image from Supabase Storage
    valid_paths JSONB NOT NULL DEFAULT '[]'::jsonb, -- Decision paths with AI keywords
    is_ending BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, scene_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scenes_story_id ON public.scenes(story_id);
CREATE INDEX IF NOT EXISTS idx_scenes_scene_number ON public.scenes(story_id, scene_number);

-- Enable Row Level Security (RLS) for public read access
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published stories
CREATE POLICY "Allow public read access to published stories"
ON public.stories FOR SELECT
USING (is_published = true);

-- Allow public read access to scenes of published stories
CREATE POLICY "Allow public read access to scenes"
ON public.scenes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.stories
        WHERE stories.id = scenes.story_id
        AND stories.is_published = true
    )
);

-- Storage bucket for scene images
INSERT INTO storage.buckets (id, name, public)
VALUES ('scene-images', 'scene-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to scene images
CREATE POLICY "Public read access to scene images"
ON storage.objects FOR SELECT
USING (bucket_id = 'scene-images');

-- Allow authenticated uploads (for admin/content management)
CREATE POLICY "Authenticated users can upload scene images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scene-images' AND auth.role() = 'authenticated');

COMMENT ON TABLE public.stories IS 'Stores multiple interactive stories';
COMMENT ON TABLE public.scenes IS 'Stores scenes for each story with images';
COMMENT ON COLUMN public.scenes.valid_paths IS 'JSON array of decision paths with intent keywords and next scene IDs';
COMMENT ON COLUMN public.scenes.image_url IS 'URL to scene image in Supabase Storage';
