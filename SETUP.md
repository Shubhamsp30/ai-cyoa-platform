# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for project to be ready (~2 minutes)

### Step 2: Run Database Setup

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run**
5. Create another new query
6. Copy and paste contents of `supabase/seed.sql`
7. Click **Run**

### Step 3: Get API Keys

**Supabase:**
- In Supabase dashboard, go to **Settings** → **API**
- Copy **Project URL** and **anon public** key

**OpenAI:**
- Go to [platform.openai.com](https://platform.openai.com)
- Sign up or login
- Go to **API Keys**
- Create new secret key

### Step 4: Configure Environment

1. In project root, copy `.env.local.example` to `.env.local`
2. Fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
```

### Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ You're Ready!

1. Click **Begin Your Journey**
2. Register an account
3. Choose a character (Tanaji, Suryaji, or Shivaji)
4. Start playing!

## 🎮 How to Play

- Read each scene's overview and story
- Type what you would do in natural language
- AI analyzes your decision and advances the story
- Complete all 10 scenes to reach the epic conclusion

## 🆘 Troubleshooting

**"Story not found"**
- Make sure you ran the seed.sql file in Supabase

**"Failed to analyze decision"**
- Check your OpenAI API key is correct
- Ensure you have credits in your OpenAI account

**Authentication errors**
- Verify Supabase URL and anon key are correct
- Check Supabase project is active

## 📖 Full Documentation

See [README.md](file:///d:/VS%20Code/Game/README.md) for complete documentation.
