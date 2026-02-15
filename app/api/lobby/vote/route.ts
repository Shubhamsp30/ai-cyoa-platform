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
        const { proposalId, action } = await request.json() // action: 'VOTE' | 'UNVOTE'
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch current proposal
        const { data: proposal, error: fetchError } = await supabase
            .from('lobby_proposals')
            .select('*')
            .eq('id', proposalId)
            .single()

        if (fetchError || !proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
        }

        let voters = (proposal.voters as string[]) || []
        let voteCount = proposal.vote_count

        if (action === 'VOTE') {
            if (!voters.includes(user.id)) {
                voters.push(user.id)
                voteCount++
            }
        } else if (action === 'UNVOTE') {
            if (voters.includes(user.id)) {
                voters = voters.filter(id => id !== user.id)
                voteCount--
            }
        }

        // Update Proposal
        const { data, error } = await supabase
            .from('lobby_proposals')
            .update({
                voters: voters,
                vote_count: voteCount
            })
            .eq('id', proposalId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, proposal: data })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
