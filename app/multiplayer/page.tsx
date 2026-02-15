'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/create-browser-client'
import { getAllStories, Story } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import styles from './multiplayer.module.css'

export default function MultiplayerPage() {
    const router = useRouter()
    const supabase = createClient()

    const [view, setView] = useState<'MENU' | 'HOST' | 'JOIN'>('MENU')
    const [stories, setStories] = useState<Story[]>([])
    const [loading, setLoading] = useState(false)
    const [joinCode, setJoinCode] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Load stories when switching to HOST view
        if (view === 'HOST' && stories.length === 0) {
            loadStories()
        }
    }, [view])

    const loadStories = async () => {
        setLoading(true)
        const data = await getAllStories()
        setStories(data)
        setLoading(false)
    }

    const handleCreateLobby = async (storyId: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/lobby/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storyId })
            })
            const data = await response.json()

            if (!response.ok) throw new Error(data.error)

            router.push(`/multiplayer/${data.code}`)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleJoinLobby = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/lobby/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: joinCode })
            })
            const data = await response.json()

            if (!response.ok) throw new Error(data.error)

            router.push(`/multiplayer/${data.code}`)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.container}>
            {/* Back Button */}
            <div className={styles.backButton}>
                <Button variant="outline" onClick={() => {
                    if (view === 'MENU') router.push('/')
                    else setView('MENU')
                }}>
                    ← Back
                </Button>
            </div>

            <div className={styles.glassCard}>
                <h1 className={styles.title}>MULTIPLAYER</h1>
                <p className={styles.subtitle}>Co-op Adventure Mode</p>

                {error && <div className={styles.error}>{error}</div>}

                {view === 'MENU' && (
                    <div className={styles.buttonGroup}>
                        <Button size="lg" onClick={() => setView('HOST')}>
                            👑 HOST GAME
                        </Button>
                        <div className={styles.orDivider}>OR</div>
                        <Button size="lg" variant="outline" onClick={() => setView('JOIN')}>
                            👋 JOIN PARTY
                        </Button>
                    </div>
                )}

                {view === 'JOIN' && (
                    <form onSubmit={handleJoinLobby} className={styles.buttonGroup}>
                        <h3 style={{ textAlign: 'center' }}>Enter Room Code</h3>
                        <input
                            type="text"
                            className={styles.codeInput}
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            maxLength={4}
                            placeholder="ABCD"
                            autoFocus
                        />
                        <Button size="lg" disabled={joinCode.length !== 4 || loading}>
                            {loading ? 'JOINING...' : 'ENTER ROOM'}
                        </Button>
                    </form>
                )}

                {view === 'HOST' && (
                    <div className={styles.buttonGroup}>
                        <h3 style={{ textAlign: 'center' }}>Select an Adventure</h3>
                        {loading && <p style={{ textAlign: 'center' }}>Loading stories...</p>}

                        {stories.map(story => (
                            <Button
                                key={story.id}
                                variant="secondary"
                                onClick={() => handleCreateLobby(story.id)}
                                disabled={loading}
                            >
                                {story.title}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
