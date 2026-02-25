import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { coords, placeName } = await req.json()
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
            return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                last_coords: coords,
                last_place_name: placeName
            })
            .eq('id', session.user.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('LOCATION_UPDATE_ERROR:', error)
        return NextResponse.json({ error: 'SYSTEM_ERROR' }, { status: 500 })
    }
}
