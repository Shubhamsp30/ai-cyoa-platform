import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client inside handlers to avoid build-time errors

export async function GET(request: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { searchParams } = new URL(request.url)
    const storyId = searchParams.get('storyId')

    if (!storyId) {
        return NextResponse.json({ error: 'Story ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('story_id', storyId)
        .order('score', { ascending: false })
        .limit(10)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await request.json()
    const { storyId, playerName, score, achievedEnding, userId } = body

    if (!storyId || !playerName || !score) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { error } = await supabase
        .from('leaderboard')
        .insert([
            {
                story_id: storyId,
                player_name: playerName,
                user_id: userId || null, // Optional link to auth user
                score,
                achieved_ending: achievedEnding
            }
        ])

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
