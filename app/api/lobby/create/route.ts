import { createClient } from '@/lib/supabase/create-browser-client'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function POST(request: NextRequest) {
    const cookieStore = cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    )

    try {
        const { storyId } = await request.json()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Generate 4-letter code
        const code = Math.random().toString(36).substring(2, 6).toUpperCase()

        // 1. Create Lobby
        const { error: lobbyError } = await supabase
            .from('lobbies')
            .insert({
                code,
                host_id: user.id,
                story_id: storyId,
                status: 'WAITING'
            })

        if (lobbyError) throw lobbyError

        // 2. Add Host as Player
        // Fetch username first
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
        const username = profile?.username || user.email?.split('@')[0] || 'Host'

        const { error: playerError } = await supabase
            .from('lobby_players')
            .insert({
                lobby_code: code,
                user_id: user.id,
                username: username,
                is_host: true,
                is_ready: true
            })

        if (playerError) throw playerError

        return NextResponse.json({ code })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
