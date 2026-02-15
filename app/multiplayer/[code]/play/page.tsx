'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/create-browser-client'
import { getStoryById, getSceneById, Story, Scene, getImageUrl } from '@/lib/supabase/client'
import { useLobby } from '@/hooks/useLobby'
import Button from '@/components/ui/Button'
import AnimatedText from '@/components/ui/AnimatedText'
import styles from '@/app/game/play/play.module.css' // Reuse styles
import { soundManager } from '@/lib/audio/SoundManager'

export default function MPGamePage({ params }: { params: { code: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const { lobby, players, currentUser, updateLobbyScene } = useLobby(params.code)

    const [story, setStory] = useState<Story | null>(null)
    const [currentScene, setCurrentScene] = useState<Scene | null>(null)
    const [userInput, setUserInput] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [animationClass, setAnimationClass] = useState('')

    // Local score state (synced to DB eventually)
    const [myScore, setMyScore] = useState(0)

    useEffect(() => {
        if (!lobby) return

        // Load Story Data
        const loadStory = async () => {
            const storyData = await getStoryById(lobby.story_id)
            if (storyData) {
                setStory(storyData)

                // If lobby has no scene yet, set it to start
                if (!lobby.current_scene_id && currentUser?.id === lobby.host_id) {
                    updateLobbyScene(storyData.starting_scene_id)
                }
            }
        }

        if (!story) loadStory()

    }, [lobby, currentUser])

    // Sync Scene
    useEffect(() => {
        const syncScene = async () => {
            if (lobby?.current_scene_id) {
                const scene = await getSceneById(lobby.current_scene_id)
                setCurrentScene(scene)
            } else if (story) {
                // Fallback for non-host clients initially
                const scene = await getSceneById(story.starting_scene_id)
                setCurrentScene(scene)
            }
        }
        syncScene()
    }, [lobby?.current_scene_id, story])

    useEffect(() => {
        if (currentScene && !currentScene.is_ending) {
            // Speak
            setTimeout(() => {
                soundManager.speak(currentScene.content)
            }, 500)
        }
    }, [currentScene])

    const [successfulMoves, setSuccessfulMoves] = useState(0)

    const checkAchievement = async (conditionCode: string) => {
        if (!story || !currentUser) return

        // Map generic codes to story-specific ones if needed
        let finalCode = conditionCode
        if (conditionCode === 'MP_VICTORY') {
            if (story.title.includes('Tanaji')) finalCode = 'MP_VICTORY_TANAJI'
            else if (story.title.includes('Baji')) finalCode = 'MP_VICTORY_BAJI'
            else finalCode = 'MP_VICTORY_GENERIC'
        }
        if (conditionCode === 'MP_MVP') {
            if (story.title.includes('Tanaji')) finalCode = 'MP_MVP_TANAJI'
            else if (story.title.includes('Baji')) finalCode = 'MP_MVP_BAJI'
            else finalCode = 'MP_MVP_GENERIC'
        }

        try {
            await fetch('/api/achievements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storyId: story.id, // Use story.id, likely generic from lobby
                    playerName: currentUser.user_metadata?.username || currentUser.email,
                    userId: currentUser.id,
                    conditionCode: finalCode
                })
            })
            // Toast notification could look nice here too, but simple for now
        } catch (e) {
            console.error('Achievement check failed', e)
        }
    }

    const handleSubmitDecision = async () => {
        if (!userInput.trim() || !currentScene || !story) return

        setAnalyzing(true)
        setFeedback(null)
        soundManager.speak('')

        try {
            const response = await fetch('/api/analyze-decision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput,
                    validPaths: currentScene.valid_paths,
                    sceneContext: currentScene.content,
                }),
            })

            const analysis = await response.json()

            if (analysis.matched_path) {
                const newScore = myScore + 20
                setMyScore(newScore)
                const newScore = myScore + 20
                setMyScore(newScore)
                soundManager.playTone('success')
                setAnimationClass('pulse-success')
                setTimeout(() => setAnimationClass(''), 500)

                setFeedback({
                    message: analysis.matched_path.success_message || analysis.message,
                    type: 'success'
                })

                // Track MVP progress locally
                const newMoves = successfulMoves + 1
                setSuccessfulMoves(newMoves)
                if (newMoves === 5) {
                    checkAchievement('MP_MVP')
                }

                // Update my score in DB
                if (currentUser) {
                    await supabase
                        .from('lobby_players')
                        .update({ score: newScore })
                        .eq('lobby_code', lobby?.code)
                        .eq('user_id', currentUser.id)
                }

                // Advance Scene for EVERYONE
                setTimeout(async () => {
                    if (currentScene.is_ending) {
                        setFeedback({
                            message: '🏆 Journey Complete!',
                            type: 'success'
                        })
                        checkAchievement('MP_VICTORY')
                        return
                    }

                    // Perform the update
                    updateLobbyScene(analysis.matched_path.next_scene_id)
                    setUserInput('')
                    setFeedback(null)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                }, 2000)

            } else {
                setMyScore(prev => Math.max(0, prev - 5))
                setMyScore(prev => Math.max(0, prev - 5))
                soundManager.playTone('error')
                setAnimationClass('shake')
                setTimeout(() => setAnimationClass(''), 500)
                setFeedback({ message: "The party fails to utilize that action. Try again.", type: 'error' })
            }
        } catch (error) {
            console.error('Error analyzing decision:', error)
        } finally {
            setAnalyzing(false)
        }
    }

    if (!story || !currentScene) return <div className={styles.main}><div className="spinner"></div></div>

    return (
        <main className={styles.main}>
            {/* Minimal Header */}
            <div className={styles.gameHeader}>
                <div className={styles.headerInfo}>
                    <span className={styles.storyTitle}>{story.title}</span>
                    <span className={styles.sceneNumber}>Multiplayer • Scene {currentScene.scene_number}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ color: '#40e0d0' }}>My Score: {myScore}</span>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/multiplayer/${params.code}`)}>
                        Lobby
                    </Button>
                </div>
            </div>

            <div className={styles.gameContent}>
                <div className={styles.imagePanel}>
                    {currentScene.image_url && (
                        <img
                            src={getImageUrl(currentScene.image_url) || ''}
                            alt={currentScene.title}
                            className={styles.sceneImage}
                        />
                    )}
                </div>

                <div className={styles.storyPanel}>
                    <h1 className={styles.sceneTitle}>{currentScene.title}</h1>

                    <div className={styles.scenarioSection}>
                        <p className={styles.mainText}>
                            <AnimatedText text={currentScene.content} delay={30} />
                        </p>
                    </div>

                    {!currentScene.is_ending ? (
                        <>
                            <div className={styles.questionSection}>
                                <div className={styles.callout}>
                                    <p><AnimatedText text={currentScene.overview} delay={40} /></p>
                                </div>
                            </div>

                            <div className={styles.inputSection}>
                                <div className={styles.inputWrapper}>
                                    <textarea
                                        className={`${styles.decisionInput} ${animationClass}`}
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder="Propose an action..."
                                        rows={3}
                                        disabled={analyzing}
                                    />
                                    {feedback && (
                                        <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                                            {feedback.message}
                                        </div>
                                    )}
                                    <button
                                        className={styles.submitButton}
                                        onClick={handleSubmitDecision}
                                        disabled={!userInput.trim() || analyzing}
                                    >
                                        {analyzing ? 'Analysis...' : 'Act for Party'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.endingCard}>
                            <h2>🎉 Victory!</h2>
                            <p>The party has completed the journey.</p>
                            <Button size="lg" onClick={() => router.push(`/multiplayer/${params.code}`)}>
                                Return to Lobby
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Player List Overlay */}
            <div style={{ position: 'fixed', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '10px', zIndex: 100 }}>
                <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Party Members</p>
                {players.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                        <span>{p.username}</span>
                        <span style={{ color: '#4ade80' }}>{p.score || 0} pts</span>
                    </div>
                ))}
            </div>
        </main>
    )
}
