'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllStories, Story } from '@/lib/supabase/client'
import styles from './leaderboard.module.css'

interface LeaderboardEntry {
    id: string
    player_name: string
    score: number
    achieved_ending: string
    created_at: string
}

export default function LeaderboardPage() {
    const router = useRouter()
    const [stories, setStories] = useState<Story[]>([])
    const [selectedStoryId, setSelectedStoryId] = useState<string>('')
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadInitialData()
    }, [])

    useEffect(() => {
        if (selectedStoryId) {
            loadLeaderboard(selectedStoryId)
        }
    }, [selectedStoryId])

    const loadInitialData = async () => {
        const storiesData = await getAllStories()
        setStories(storiesData)
        if (storiesData.length > 0) {
            setSelectedStoryId(storiesData[0].id)
        } else {
            setLoading(false)
        }
    }

    const loadLeaderboard = async (storyId: string) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/leaderboard?storyId=${storyId}`)
            const data = await res.json()
            if (Array.isArray(data)) {
                setLeaderboard(data)
            } else {
                setLeaderboard([])
            }
        } catch (error) {
            console.error('Failed to load leaderboard', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.main}>
            {/* Back Button */}
            <button onClick={() => router.push('/game/stories')} className={styles.backButton}>
                ← Back to Stories
            </button>

            <div className={styles.container}>
                <h1 className={styles.title}>HALL OF LEGENDS 🏆</h1>

                {/* Story Selector (Simple Tabs) */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                    {stories.map(story => (
                        <button
                            key={story.id}
                            onClick={() => setSelectedStoryId(story.id)}
                            style={{
                                padding: '0.8rem 1.5rem',
                                borderRadius: '30px',
                                border: '1px solid ' + (selectedStoryId === story.id ? '#40e0d0' : 'rgba(255,255,255,0.2)'),
                                background: selectedStoryId === story.id ? 'rgba(64, 224, 208, 0.2)' : 'rgba(0,0,0,0.5)',
                                color: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {story.character_name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                    </div>
                ) : (
                    <div className={styles.leaderboardCard}>
                        <div className={styles.tableHeader}>
                            <span>Rank</span>
                            <span>Warrior Name</span>
                            <span>Score</span>
                            <span>Ending</span>
                        </div>

                        {leaderboard.length === 0 ? (
                            <div className={styles.emptyState}>
                                No legends have been recorded yet. Be the first!
                            </div>
                        ) : (
                            leaderboard.map((entry, index) => (
                                <div key={entry.id} className={styles.tableRow}>
                                    <span className={`${styles.rank} ${index < 3 ? styles.topRank : ''}`}>
                                        #{index + 1}
                                    </span>
                                    <span className={styles.playerName}>
                                        {index === 0 && '👑 '}
                                        {entry.player_name}
                                    </span>
                                    <span className={styles.score}>{entry.score}</span>
                                    <span className={styles.ending}>{entry.achieved_ending || 'Unknown Fate'}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}
