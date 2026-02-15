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
        const { lobbyCode, content } = await request.json()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!content || !content.trim()) {
            return NextResponse.json({ error: 'Proposal content cannot be empty' }, { status: 400 })
        }

        // Check if user is in lobby
        const { data: player } = await supabase
            .from('lobby_players')
            .select('id')
            .eq('lobby_code', lobbyCode)
            .eq('user_id', user.id)
            .single()

        if (!player) {
            return NextResponse.json({ error: 'You are not in this lobby' }, { status: 403 })
        }

        // Insert Proposal
        const { data, error } = await supabase
            .from('lobby_proposals')
            .insert({
                lobby_code: lobbyCode,
                player_id: user.id,
                content: content.trim(),
                vote_count: 0,
                voters: []
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, proposal: data })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
