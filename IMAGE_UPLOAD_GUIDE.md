# Image Upload Guide for Stories

This guide explains how to upload scene images to Supabase Storage and add new stories to your AI-powered CYOA platform.

## Prerequisites

- Supabase project set up
- Database schema and seed data already run
- Scene images ready (recommended: 1920x1080 or 16:9 aspect ratio)

## Step 1: Upload Scene Images to Supabase Storage

### Via Supabase Dashboard

1. **Go to Storage**
   - Open your Supabase project dashboard
   - Navigate to **Storage** in the left sidebar

2. **Access scene-images Bucket**
   - Click on the `scene-images` bucket
   - If it doesn't exist, it will be created when you run the schema migration

3. **Upload Images**
   - Click **Upload file**
   - Select your scene images
   - Recommended naming: `story-name/scene-1.jpg`, `story-name/scene-2.jpg`, etc.
   - Example for Tanaji story:
     ```
     tanaji/scene-1.jpg
     tanaji/scene-2.jpg
     tanaji/scene-3.jpg
     ...
     tanaji/scene-10.jpg
     ```

4. **Get Image Paths**
   - After upload, note the path for each image
   - Path format: `tanaji/scene-1.jpg` (not the full URL)

## Step 2: Update Scene Image URLs in Database

### Via Supabase SQL Editor

Run this SQL to update the Tanaji story scenes with image URLs:

```sql
-- Update Scene 1
UPDATE public.scenes
SET image_url = 'tanaji/scene-1.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Update Scene 2
UPDATE public.scenes
SET image_url = 'tanaji/scene-2.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- Update Scene 3
UPDATE public.scenes
SET image_url = 'tanaji/scene-3.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- Continue for all 10 scenes...
UPDATE public.scenes
SET image_url = 'tanaji/scene-10.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440010';

-- Optional: Add story thumbnail
UPDATE public.stories
SET thumbnail_url = 'tanaji/thumbnail.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

## Step 3: Adding a New Story

### 1. Prepare Your Story Data

Create a new SQL file (e.g., `new_story_seed.sql`) with:

```sql
-- Insert new story
INSERT INTO public.stories (id, title, description, character_name, total_scenes, thumbnail_url, is_published)
VALUES (
    'your-unique-uuid-here', -- Generate a new UUID
    'Your Story Title',
    'Story description that will appear on the selection page',
    'Main Character Name',
    10, -- Number of scenes
    'your-story/thumbnail.jpg', -- Upload thumbnail first
    true
);

-- Insert scenes
INSERT INTO public.scenes (id, story_id, scene_number, title, overview, content, image_url, valid_paths, is_ending)
VALUES (
    'scene-uuid-1',
    'your-unique-uuid-here', -- Same as story ID above
    1,
    'Scene 1 Title',
    'Brief overview shown before the scene',
    'Full narrative text for this scene...',
    'your-story/scene-1.jpg',
    '[
        {
            "intent_keywords": ["continue", "next", "proceed"],
            "next_scene_id": "scene-uuid-2",
            "success_message": "Great! Moving to the next scene...",
            "outcome_type": "success"
        }
    ]'::jsonb,
    false
);

-- Repeat for all scenes...

-- Update starting scene
UPDATE public.stories
SET starting_scene_id = 'scene-uuid-1'
WHERE id = 'your-unique-uuid-here';
```

### 2. Upload Story Images

- Upload all scene images to `your-story/` folder in Supabase Storage
- Upload thumbnail image for story selection page

### 3. Run the SQL

- Go to Supabase SQL Editor
- Paste your new story SQL
- Execute

### 4. Test Your Story

- Refresh your app at http://localhost:3000
- Click "Browse Stories"
- Your new story should appear!

## Image Recommendations

### Scene Images
- **Resolution**: 1920x1080 (Full HD) or higher
- **Aspect Ratio**: 16:9
- **Format**: JPG or PNG
- **Size**: Under 500KB (optimize for web)
- **Style**: Consistent visual style across all scenes

### Story Thumbnails
- **Resolution**: 800x450 minimum
- **Aspect Ratio**: 16:9
- **Format**: JPG or PNG
- **Size**: Under 200KB

## Quick Reference: Valid Path Structure

```json
{
    "intent_keywords": ["keyword1", "keyword2", "action"],
    "next_scene_id": "uuid-of-next-scene",
    "success_message": "Feedback shown to player",
    "outcome_type": "success" // or "consequence" or "redirect"
}
```

### Outcome Types

- **success**: Correct decision, positive feedback
- **consequence**: Acceptable but not ideal, warning message
- **redirect**: Wrong path, player should reconsider

## Troubleshooting

**Images not showing?**
- Check the image path in database matches the upload path
- Verify the `scene-images` bucket is public
- Check browser console for errors

**Story not appearing?**
- Ensure `is_published = true`
- Verify all scenes have valid `next_scene_id` references
- Check `starting_scene_id` is set correctly

**Need help with UUIDs?**
- Use online UUID generator: https://www.uuidgenerator.net/
- Or use PostgreSQL: `SELECT uuid_generate_v4();`

## Example: Complete Workflow

1. ✅ Create 10 scene images for your story
2. ✅ Upload to Supabase Storage: `my-story/scene-1.jpg` through `scene-10.jpg`
3. ✅ Create SQL file with story and scene data
4. ✅ Update image_url fields with correct paths
5. ✅ Run SQL in Supabase
6. ✅ Test in browser!

Your new story is now live! 🎉
