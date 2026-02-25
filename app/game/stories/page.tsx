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

    const handleSelectStory = (storyId: string) => {
        soundManager.playTone('click')
        localStorage.setItem('selected_story_id', storyId)
        // Progress is now persistent (Cloud + Local)
        router.push('/game/play')
    }

    if (loading) {
        return (
            <main className={styles.main}>
                <div className={styles.hudGrid}></div>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>INITIALIZING ARCHIVES...</p>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.main}>
            {/* Tactical Layer: Hex Grid */}
            <div className={styles.hudGrid}></div>

            {/* Atmospheric Layer: Animated Embers */}
            <div className={styles.emberContainer}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={styles.ember}></div>
                ))}
            </div>

            <div className={styles.container}>
                {/* Tactical Header */}
                <header className={styles.header}>
                    <div className={styles.authNav}>
                        <div className={styles.tacticalLink} onClick={() => router.push('/')}>
                            [ BACK TO COMMAND ]
                        </div>
                        <div className={styles.navRight}>
                            {user ? (
                                <button className={styles.profileBtn} onClick={() => router.push('/game/profile')}>
                                    WARRIOR ID: {user.email?.split('@')[0].toUpperCase()}
                                </button>
                            ) : (
                                <button className={styles.profileBtn} onClick={() => router.push('/login')}>
                                    [ DEPLOYMENT LOGIN ]
                                </button>
                            )}
                            <LanguageSelector />
                        </div>
                    </div>

                    <div className={styles.headerContent}>
                        <div className={styles.archiveStamp}>WAR ARCHIVES // v2.4.0</div>
                        <h1 className={styles.mainTitle}>{labels.choose_adventure}</h1>
                        <div className={styles.dataReadout}>
                            <span className={styles.readoutItem}>SECTOR: SINHAGAD</span>
                            <span className={styles.readoutSeparator}>|</span>
                            <span className={styles.readoutItem}>INTEL: {stories.length} ACTIVE MISSIONS</span>
                        </div>
                    </div>
                </header>

                {/* Stories Grid: Dossier Style */}
                <div className={styles.storiesGrid}>
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            className={styles.storyCard}
                            onClick={() => handleSelectStory(story.id)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className={styles.cornerBracket + ' ' + styles.tl}></div>
                            <div className={styles.cornerBracket + ' ' + styles.br}></div>

                            <div className={styles.scanline}></div>

                            {/* Cover Image / Tactical Map */}
                            <div className={styles.coverImage}>
                                <img
                                    src={story.thumbnail_url ? getImageUrl(story.thumbnail_url, 'story-covers') || '/images/stories/default-cover.png' : '/images/stories/default-cover.png'}
                                    alt={story.title}
                                />
                                <div className={styles.imageOverlay}></div>
                                <div className={styles.mapStatus}>STORY MAP // READY</div>
                            </div>

                            {/* Story Intel */}
                            <div className={styles.storyInfo}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.storyTitle}>{t(story, 'title')}</h2>
                                    <div className={styles.dossierSerial}>ID: {story.id.substring(0, 8).toUpperCase()}</div>
                                </div>

                                <p className={styles.character}>
                                    <span className={styles.charIcon}>⚔️</span>
                                    WARRIOR: {t(story, 'character_name').toUpperCase()}
                                </p>

                                <p className={styles.description}>{t(story, 'description')}</p>

                                <div className={styles.meta}>
                                    <span className={styles.scenes}>
                                        <span className={styles.metaLabel}>CHAPTERS:</span> {story.total_scenes}
                                    </span>
                                    <div className={styles.difficultyLevel}>
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className={styles.diffDot}></div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className={styles.playButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectStory(story.id)
                                    }}
                                >
                                    INITIALIZE MISSION
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {stories.length === 0 && (
                    <div className={styles.empty}>
                        <p>[ NO ACTIVE MISSIONS IN THIS SECTOR ]</p>
                    </div>
                )}
            </div>
        </main>
    )
}
