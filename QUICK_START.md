# Quick Start: Upload Your Scene Images

Follow these simple steps to upload your Tanaji scene images from your local device to Supabase.

## Step 1: Set Up Supabase (5 minutes)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with GitHub or email

2. **Create New Project**
   - Click "New Project"
   - Choose organization (or create one)
   - Fill in:
     - **Project Name**: `tanaji-game` (or any name)
     - **Database Password**: Create a strong password (save it!)
     - **Region**: Choose closest to you
   - Click "Create new project"
   - Wait ~2 minutes for setup

3. **Get Your API Keys**
   - In your project dashboard, click **Settings** (gear icon)
   - Click **API** in the left menu
   - Copy these two values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon public** key (long string starting with `eyJ...`)

4. **Add to Your .env.local File**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   OPENAI_API_KEY=sk-...
   ```

## Step 2: Run Database Setup (2 minutes)

1. **Open SQL Editor**
   - In Supabase dashboard, click **SQL Editor** in left menu
   - Click **New query**

2. **Run Schema Migration**
   - Open `supabase/migrations/001_initial_schema.sql` in VS Code
   - Copy ALL the content
   - Paste into Supabase SQL Editor
   - Click **Run** (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

3. **Run Seed Data**
   - Click **New query** again
   - Open `supabase/seed.sql` in VS Code
   - Copy ALL the content
   - Paste into Supabase SQL Editor
   - Click **Run**
   - You should see the verification query result showing 1 story with 10 scenes

## Step 3: Upload Your Images (5 minutes)

### Prepare Your Images

Make sure you have 10 scene images ready:
- `scene-1.jpg` (or .png) - The Sting of Purandar
- `scene-2.jpg` - The Mother's Gaze
- `scene-3.jpg` - The Impossible Demand
- `scene-4.jpg` - The Wedding Interrupted
- `scene-5.jpg` - The Vow
- `scene-6.jpg` - The Omen at the Cliff
- `scene-7.jpg` - The Lion's Charge
- `scene-8.jpg` - The Duel of Commanders
- `scene-9.jpg` - Suryaji's Rally
- `scene-10.jpg` - "The Lion is Gone"

### Upload to Supabase Storage

1. **Go to Storage**
   - In Supabase dashboard, click **Storage** in left menu
   - You should see `scene-images` bucket

2. **Create Tanaji Folder**
   - Click on `scene-images` bucket
   - Click **Create folder**
   - Name it: `tanaji`
   - Click **Create**

3. **Upload All Images**
   - Click on the `tanaji` folder
   - Click **Upload file**
   - Select all 10 scene images from your computer
   - Click **Upload**
   - Wait for upload to complete

4. **Verify Upload**
   - You should see all 10 images in the `tanaji` folder
   - Paths will be: `tanaji/scene-1.jpg`, `tanaji/scene-2.jpg`, etc.

## Step 4: Link Images to Scenes (2 minutes)

1. **Go Back to SQL Editor**
   - Click **SQL Editor** in left menu
   - Click **New query**

2. **Run This SQL** (copy and paste):

```sql
-- Update all 10 scenes with image URLs
UPDATE public.scenes SET image_url = 'tanaji/scene-1.jpg' WHERE scene_number = 1;
UPDATE public.scenes SET image_url = 'tanaji/scene-2.jpg' WHERE scene_number = 2;
UPDATE public.scenes SET image_url = 'tanaji/scene-3.jpg' WHERE scene_number = 3;
UPDATE public.scenes SET image_url = 'tanaji/scene-4.jpg' WHERE scene_number = 4;
UPDATE public.scenes SET image_url = 'tanaji/scene-5.jpg' WHERE scene_number = 5;
UPDATE public.scenes SET image_url = 'tanaji/scene-6.jpg' WHERE scene_number = 6;
UPDATE public.scenes SET image_url = 'tanaji/scene-7.jpg' WHERE scene_number = 7;
UPDATE public.scenes SET image_url = 'tanaji/scene-8.jpg' WHERE scene_number = 8;
UPDATE public.scenes SET image_url = 'tanaji/scene-9.jpg' WHERE scene_number = 9;
UPDATE public.scenes SET image_url = 'tanaji/scene-10.jpg' WHERE scene_number = 10;

-- Verify the update
SELECT scene_number, title, image_url FROM public.scenes ORDER BY scene_number;
```

3. **Click Run**
   - You should see all 10 scenes with their image URLs

## Step 5: Test Your Game! 🎮

1. **Make sure dev server is running**
   ```bash
   npm run dev
   ```

2. **Open browser**: http://localhost:3000

3. **Test the flow**:
   - Click "Browse Stories"
   - You should see "Tanaji Malusare: The Conquest of Sinhagad"
   - Click "Begin Story"
   - **Scene 1 should now show your image!** 🎉

## Troubleshooting

**Images not showing?**

1. Check if images uploaded correctly:
   - Go to Storage → scene-images → tanaji
   - All 10 images should be there

2. Check if image URLs are correct:
   - Go to SQL Editor
   - Run: `SELECT scene_number, image_url FROM scenes ORDER BY scene_number;`
   - All should show `tanaji/scene-X.jpg`

3. Check if bucket is public:
   - Go to Storage → scene-images
   - Click settings (three dots)
   - Ensure "Public bucket" is enabled

**Still having issues?**
- Check browser console (F12) for errors
- Verify `.env.local` has correct Supabase URL and key
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

## Optional: Add Story Thumbnail

If you have a thumbnail image for the story selection page:

1. Upload `thumbnail.jpg` to `tanaji` folder in Storage
2. Run this SQL:
```sql
UPDATE public.stories 
SET thumbnail_url = 'tanaji/thumbnail.jpg' 
WHERE title LIKE '%Tanaji%';
```

---

## Summary Checklist

- [ ] Create Supabase project
- [ ] Copy API keys to `.env.local`
- [ ] Run schema migration SQL
- [ ] Run seed data SQL
- [ ] Upload 10 scene images to Storage
- [ ] Run image URL update SQL
- [ ] Test in browser

**Total time: ~15 minutes** ⏱️

Once done, your game will have beautiful images for each scene! 🎨
