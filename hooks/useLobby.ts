import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/create-browser-client'
import { useRouter } from 'next/navigation'

export interface Lobby {
    code: string
    host_id: string
    story_id: string
    status: 'WAITING' | 'PLAYING' | 'FINISHED'
    current_scene_id?: string
}

export interface LobbyPlayer {
    id: string
    lobby_code: string
    user_id: string
    username: string
    is_ready: boolean
    is_host: boolean
}

export function useLobby(lobbyCode: string) {
    const supabase = createClient()
    const router = useRouter()

    const [lobby, setLobby] = useState<Lobby | null>(null)
    const [players, setPlayers] = useState<LobbyPlayer[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)

    // Store subscription references to clean up
    const channelRef = useRef<any>(null)

    useEffect(() => {
        if (!lobbyCode) return

        const fetchLobbyData = async () => {
            try {
                setLoading(true)
                const { data: { user } } = await supabase.auth.getUser()
                setCurrentUser(user)

                if (!user) {
                    setError('User not authenticated')
                    setLoading(false)
                    return
                }

                // 1. Fetch Lobby
                const { data: lobbyData, error: lobbyError } = await supabase
                    .from('lobbies')
                    .select('*')
                    .eq('code', lobbyCode)
                    .single()

                if (lobbyError) throw lobbyError
                setLobby(lobbyData)

                // 2. Fetch Players
                const { data: playersData, error: playersError } = await supabase
                    .from('lobby_players')
                    .select('*')
                    .eq('lobby_code', lobbyCode)

                if (playersError) throw playersError
                setPlayers(playersData || [])

                // 3. Subscribe to Changes
                subscribeToLobby(lobbyCode)

            } catch (err: any) {
                console.error('Error fetching lobby:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchLobbyData()

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
            }
        }
    }, [lobbyCode])

    const subscribeToLobby = (code: string) => {
        if (channelRef.current) return

        const channel = supabase
            .channel(`lobby:${code}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'lobbies',
                filter: `code=eq.${code}`
            }, (payload: any) => {
                if (payload.eventType === 'UPDATE') {
                    setLobby(payload.new)
                }
            })
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'lobby_players',
                filter: `lobby_code=eq.${code}`
            }, (payload: any) => {
                if (payload.eventType === 'INSERT') {
                    setPlayers(prev => [...prev, payload.new])
                } else if (payload.eventType === 'UPDATE') {
                    setPlayers(prev => prev.map(p => p.id === payload.new.id ? payload.new : p))
                } else if (payload.eventType === 'DELETE') {
                    setPlayers(prev => prev.filter(p => p.id !== payload.old.id))
                }
            })
            .subscribe()

        channelRef.current = channel
    }

    const toggleReady = async () => {
        if (!currentUser || !lobby) return

        const currentPlayer = players.find(p => p.user_id === currentUser.id)
        if (!currentPlayer) return

        await supabase
            .from('lobby_players')
            .update({ is_ready: !currentPlayer.is_ready })
            .eq('id', currentPlayer.id)
    }

    const leaveLobby = async () => {
        if (!currentUser || !lobby) return

        await supabase
            .from('lobby_players')
            .delete()
            .eq('lobby_code', lobby.code)
            .eq('user_id', currentUser.id)

        router.push('/')
    }

    const startGame = async () => {
        // Only host can start
        if (!currentUser || !lobby) return

        // Update status to PLAYING
        await supabase
            .from('lobbies')
            .update({ status: 'PLAYING' })
            .eq('code', lobby.code)
    }

    const updateLobbyScene = async (sceneId: string) => {
        if (!lobby) return
        await supabase
            .from('lobbies')
            .update({ current_scene_id: sceneId })
            .eq('code', lobby.code)
    }

    return {
        lobby,
        players,
        loading,
        error,
        currentUser,
        toggleReady,
        leaveLobby,
        startGame,
        updateLobbyScene
    }
}
