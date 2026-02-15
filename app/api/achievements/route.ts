
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
    const body = await request.json()
    const { storyId, playerName, conditionCode, userId } = body

    if (!storyId || !conditionCode) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Find the achievement by condition code for this story
    const { data: achievement, error: findError } = await supabase
        .from('achievements')
        .select('*')
        .eq('story_id', storyId)
        .eq('condition_code', conditionCode)
        .single()

    if (findError || !achievement) {
        return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    // 2. Check if player already unlocked it
    let existingUnlock = null

    if (userId) {
        const { data } = await supabase
            .from('player_achievements')
            .select('id')
            .eq('user_id', userId)
            .eq('achievement_id', achievement.id)
            .single()
        existingUnlock = data
    } else if (playerName) {
        const { data } = await supabase
            .from('player_achievements')
            .select('id')
            .eq('player_name', playerName)
            .eq('achievement_id', achievement.id)
            .single()
        existingUnlock = data
    } else {
        return NextResponse.json({ achievement, newUnlock: true })
    }

    if (existingUnlock) {
        return NextResponse.json({ achievement, newUnlock: false })
    }

    // 3. Unlock it
    const { error: unlockError } = await supabase
        .from('player_achievements')
        .insert([
            {
                player_name: playerName || 'Anonymous',
                user_id: userId || null,
                achievement_id: achievement.id
            }
        ])

    if (unlockError) {
        return NextResponse.json({ error: unlockError.message }, { status: 500 })
    }

    return NextResponse.json({ achievement, newUnlock: true })
}
