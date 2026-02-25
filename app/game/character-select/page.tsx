'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Story } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from './character-select.module.css'

export default function CharacterSelectPage() {
    const router = useRouter()
    const [story, setStory] = useState<Story | null>(null)
    const [selectedCharacter, setSelectedCharacter] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadStory()
    }, [])

    const loadStory = async () => {
        try {
            const { data } = await supabase
                .from('stories')
                .select('*')
                .single()

            if (data) {
                setStory(data)
            }
        } catch (error) {
            console.error('Error loading story:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStartGame = async () => {
        if (!selectedCharacter || !story) return

        setSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/auth/login')
                return
            }

            // Start navigation immediately after triggering update for snappy response
            const updatePromise = supabase
                .from('profiles')
                .update({
                    current_story_id: story.id,
                    current_scene_id: story.starting_scene_id,
                    character_role: selectedCharacter,
                    current_score: 0,
                    last_played_at: new Date().toISOString()
                })
                .eq('id', user.id)

            router.push('/game/play')
            await updatePromise // Ensure it finishes in background if needed
        } catch (error) {
            console.error('Error starting game:', error)
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <main className={styles.main}>
                <div className="spinner"></div>
            </main>
        )
    }

    if (!story) {
        return (
            <main className={styles.main}>
                <p>Story not found</p>
            </main>
        )
    }

    const characters = story.available_characters || []

    const characterDescriptions: Record<string, string> = {
        'Tanaji Malusare': 'The Lion of Sinhagad. Lead the impossible mission from the front. Feel the weight of every decision as the commander.',
        'Suryaji Malusare': 'Tanaji\'s loyal brother. Support your brother through the perilous journey. Experience the story from a different perspective.',
        'Shivaji Maharaj': 'The visionary king. Send your best friend on a dangerous mission. Bear the burden of leadership and sacrifice.',
    }

    return (
        <main className={styles.main}>
            <div className="container">
                <div className={styles.content}>
                    <h1 className="text-center fade-in">Choose Your Character</h1>
                    <p className={styles.subtitle}>
                        Each character experiences the conquest of Sinhagad from a unique perspective
                    </p>

                    <div className={styles.characters}>
                        {characters.map((character) => (
                            <Card
                                key={character}
                                className={`${styles.characterCard} ${selectedCharacter === character ? styles.selected : ''
                                    }`}
                                hover
                            >
                                <button
                                    className={styles.characterButton}
                                    onClick={() => setSelectedCharacter(character)}
                                >
                                    <h3>{character}</h3>
                                    <p>{characterDescriptions[character] || 'Experience the story as this character'}</p>
                                    {selectedCharacter === character && (
                                        <div className={styles.selectedBadge}>Selected</div>
                                    )}
                                </button>
                            </Card>
                        ))}
                    </div>

                    <div className={styles.actions}>
                        <Button
                            size="lg"
                            onClick={handleStartGame}
                            disabled={!selectedCharacter || saving}
                        >
                            {saving ? 'Starting...' : 'Begin Adventure'}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}
