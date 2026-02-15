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
        const { code } = await request.json()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const lobbyCode = code.toUpperCase()

        // 1. Check if Lobby Exists
        const { data: lobby, error: lobbyError } = await supabase
            .from('lobbies')
            .select('status')
            .eq('code', lobbyCode)
            .single()

        if (lobbyError || !lobby) {
            return NextResponse.json({ error: 'Lobby not found' }, { status: 404 })
        }

        if (lobby.status !== 'WAITING') {
            return NextResponse.json({ error: 'Game already in progress' }, { status: 400 })
        }

        // 2. Add Player
        // Fetch username first
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
        const username = profile?.username || user.email?.split('@')[0] || 'Player'

        const { error: joinError } = await supabase
            .from('lobby_players')
            .insert({
                lobby_code: lobbyCode,
                user_id: user.id,
                username: username,
                is_host: false,
                is_ready: false
            })

        // Ignore duplicate key error (if already joined)
        if (joinError && joinError.code !== '23505') {
            throw joinError
        }

        return NextResponse.json({ success: true, code: lobbyCode })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
