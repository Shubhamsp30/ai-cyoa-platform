# Image Troubleshooting Checklist

## Issue: Images not displaying in game

Follow these steps to fix the image display issue:

## Step 1: Verify Image Upload in Supabase

1. **Go to Supabase Dashboard** → **Storage** → **scene-images** bucket
2. **Click on `tanaji` folder**
3. **Check that all 10 images are there**:
   - scene-1.jpg (or .png)
   - scene-2.jpg
   - ... through scene-10.jpg

## Step 2: Check if Bucket is Public

**CRITICAL: The bucket must be public for images to load!**

1. In Supabase Dashboard → **Storage**
2. Find the `scene-images` bucket
3. Click the **three dots (...)** next to the bucket name
4. Click **Edit bucket**
5. **Make sure "Public bucket" is ENABLED** ✅
6. Click **Save**

## Step 3: Verify Image Paths in Database

1. Go to **SQL Editor** in Supabase
2. Run this query:

```sql
SELECT scene_number, title, image_url 
FROM public.scenes 
WHERE story_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY scene_number;
```

3. **Check the output**:
   - All 10 scenes should show
   - `image_url` should be: `tanaji/scene-1.jpg`, `tanaji/scene-2.jpg`, etc.
   - **NOT** full URLs like `https://...`
   - **NOT** null values

## Step 4: Test Image URL Directly

1. Get your Supabase project URL from `.env.local`
2. Build this URL (replace `YOUR_PROJECT_ID`):
   ```
   https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/scene-images/tanaji/scene-1.jpg
   ```
3. **Paste this URL in your browser**
4. **You should see the image**
   - If you see the image: ✅ Storage is working
   - If you get an error: ❌ Bucket is not public or image path is wrong

## Step 5: Check Browser Console

1. Open your game at http://localhost:3001
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Look for errors related to images
5. **Common errors**:
   - `403 Forbidden`: Bucket is not public
   - `404 Not Found`: Image path is wrong
   - CORS errors: Bucket policy issue

## Step 6: Verify .env.local

Make sure your `.env.local` has the correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
```

**Important**: 
- No trailing slashes in the URL
- The anon key should be very long (starts with `eyJ`)

## Quick Fix: Make Bucket Public

If images still don't show, run this SQL in Supabase:

```sql
-- Make sure the bucket exists and is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'scene-images';

-- Verify it worked
SELECT id, name, public FROM storage.buckets WHERE id = 'scene-images';
```

You should see: `public = true`

## Step 7: Restart Dev Server

After making changes:

1. Stop the dev server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Refresh your browser

## Still Not Working?

### Check Image File Names

Make sure your uploaded images are named EXACTLY:
- `scene-1.jpg` (lowercase, hyphen, number)
- NOT `Scene-1.jpg` or `scene_1.jpg` or `scene1.jpg`

### Check Image Format

- Supported: `.jpg`, `.jpeg`, `.png`, `.webp`
- NOT supported: `.heic`, `.bmp`, `.tiff`

### Re-upload Images

If all else fails:
1. Delete all images from `tanaji` folder in Storage
2. Re-upload them one by one
3. Make sure they're named correctly
4. Run the UPDATE SQL again

---

## Expected Result

Once fixed, you should see:
- ✅ Image loads at the top of each scene
- ✅ No broken image icon
- ✅ No errors in browser console

Let me know which step reveals the issue!
