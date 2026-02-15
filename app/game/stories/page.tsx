'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/create-browser-client'
import { getAllStories, Story, getImageUrl } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import styles from './stories.module.css'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/ui/LanguageSelector'
import { soundManager } from '@/lib/audio/SoundManager'

export default function StoriesPage() {
    const router = useRouter()
    const supabase = createClient()
    const [stories, setStories] = useState<Story[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const { t, labels } = useLanguage()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
        }

        const loadStories = async () => {
            const data = await getAllStories()
            setStories(data)
            setLoading(false)
        }

        checkUser()
        loadStories()
    }, [supabase])



    // ...

    const handleSelectStory = (storyId: string) => {
        soundManager.playTone('click') // Audio Feedback
        console.log('Selected Story:', storyId)
        localStorage.setItem('selected_story_id', storyId)
        localStorage.removeItem(`story_progress_${storyId}`)
        router.push('/game/play')
    }

    if (loading) {
        return (
            <main className={styles.main}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>{labels.loading}</p>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.main}>
            {/* Animated Background */}
            <div className={styles.bgAnimation}></div>

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.authNav}>
                        {user ? (
                            <Button variant="outline" size="sm" onClick={() => router.push('/game/profile')}>
                                👤 Profile
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                                🔐 Login
                            </Button>
                        )}
                        <div style={{ marginLeft: '1rem' }}>
                            <LanguageSelector />
                        </div>
                    </div>

                    <div className={styles.decorativeTop}>
                        <span className={styles.ornament}>⚔️</span>
                        <div className={styles.divider}></div>
                        <span className={styles.ornament}>⚔️</span>
                    </div>

                    <h1 className={styles.mainTitle}>{labels.choose_adventure}</h1>

                    <div className={styles.taglineContainer}>
                        <div className={styles.taglineLine}></div>
                        <p className={styles.subtitle}>{labels.select_story_subtitle}</p>
                        <div className={styles.taglineLine}></div>
                    </div>
                </div>

                {/* Stories Grid */}
                <div className={styles.storiesGrid}>
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            className={styles.storyCard}
                            onClick={() => handleSelectStory(story.id)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleSelectStory(story.id)
                                }
                            }}
                        >
                            {/* Cover Image */}
                            <div className={styles.coverImage}>
                                <img
                                    src={story.thumbnail_url ? getImageUrl(story.thumbnail_url, 'story-covers') || '/images/stories/default-cover.png' : '/images/stories/default-cover.png'}
                                    alt={story.title}
                                />
                                <div className={styles.imageOverlay}></div>
                            </div>

                            {/* Story Info */}
                            <div className={styles.storyInfo}>
                                <h2 className={styles.storyTitle}>{t(story, 'title')}</h2>
                                <p className={styles.character}>⚔️ {t(story, 'character_name')}</p>
                                <p className={styles.description}>{t(story, 'description')}</p>

                                <div className={styles.meta}>
                                    <span className={styles.scenes}>📖 {story.total_scenes} {labels.epic_scenes}</span>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent double triggers
                                        handleSelectStory(story.id)
                                    }}
                                    className={styles.playButton}
                                >
                                    <span className={styles.buttonIcon}>⚡</span>
                                    {labels.begin_story}
                                    <span className={styles.buttonIcon}>⚡</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {stories.length === 0 && (
                    <div className={styles.empty}>
                        <p>🎭 {labels.no_adventures}</p>
                    </div>
                )}
            </div>
        </main>
    )
}
