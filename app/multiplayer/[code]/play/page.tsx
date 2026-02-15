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

type GamePhase = 'PROPOSING' | 'VOTING' | 'RESOLVING'

interface Proposal {
    id: string
    player_id: string
    content: string
    vote_count: number
    voters: string[]
}

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

    // Democracy State
    const [gamePhase, setGamePhase] = useState<GamePhase>('PROPOSING')
    const [proposals, setProposals] = useState<Proposal[]>([])

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

    // Subscription for Proposals
    useEffect(() => {
        if (!params.code) return

        // Initial fetch
        const fetchProposals = async () => {
            const { data } = await supabase
                .from('lobby_proposals')
                .select('*')
                .eq('lobby_code', params.code)
                .eq('is_active', true)

            if (data) setProposals(data)
        }
        fetchProposals()

        const channel = supabase
            .channel(`proposals:${params.code}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'lobby_proposals',
                filter: `lobby_code=eq.${params.code}`
            }, (payload: any) => {
                if (payload.eventType === 'INSERT') {
                    setProposals(prev => [...prev, payload.new])
                } else if (payload.eventType === 'UPDATE') {
                    setProposals(prev => prev.map(p => p.id === payload.new.id ? payload.new : p))
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [params.code])

    // Sync Scene
    useEffect(() => {
        const syncScene = async () => {
            if (lobby?.current_scene_id) {
                const scene = await getSceneById(lobby.current_scene_id)
                setCurrentScene(scene)
                // New scene? Reset phase and clear proposals (in a real app we'd archive them)
                setGamePhase('PROPOSING')
                setProposals([])
                setFeedback(null)
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

    const handlePropose = async () => {
        if (!userInput.trim()) return

        try {
            await fetch('/api/lobby/propose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lobbyCode: params.code,
                    content: userInput
                })
            })
            setUserInput('')
        } catch (e) {
            console.error(e)
        }
    }

    const handleVote = async (proposalId: string) => {
        if (!currentUser) return
        // Check if already voted
        const proposal = proposals.find(p => p.id === proposalId)
        const hasVoted = proposal?.voters.includes(currentUser.id)
        const action = hasVoted ? 'UNVOTE' : 'VOTE'

        try {
            await fetch('/api/lobby/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proposalId, action })
            })
        } catch (e) {
            console.error(e)
        }
    }

    const handleExecuteWinningProposal = async () => {
        if (!currentUser || !lobby || proposals.length === 0) return

        // 1. Find Winner
        const sorted = [...proposals].sort((a, b) => b.vote_count - a.vote_count)
        const winner = sorted[0]

        setAnalyzing(true)
        setGamePhase('RESOLVING')

        // 2. Analyze
        try {
            const response = await fetch('/api/analyze-decision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput: winner.content,
                    validPaths: currentScene?.valid_paths,
                    sceneContext: currentScene?.content,
                })
            })
            const analysis = await response.json()

            if (analysis.matched_path) {
                // Success!
                setFeedback({
                    message: `Verified: "${winner.content}" - ${analysis.matched_path.success_message}`,
                    type: 'success'
                })
                soundManager.playTone('success')
                setAnimationClass('pulse-success')

                // Update Scene
                setTimeout(() => {
                    updateLobbyScene(analysis.matched_path.next_scene_id)
                    // Clean up proposals for next round could be done via DB trigger or manual API
                }, 3000)

            } else {
                // Failure
                setFeedback({
                    message: `Failed: "${winner.content}" - The party stumbles!`,
                    type: 'error'
                })
                soundManager.playTone('error')
                setAnimationClass('shake')
                setAnalyzing(false)
                setGamePhase('PROPOSING')
            }

        } catch (e) {
            console.error(e)
            setAnalyzing(false)
        }
    }

    if (!story || !currentScene) return <div className={styles.main}><div className="spinner"></div></div>

    const isHost = currentUser?.id === lobby?.host_id

    return (
        <main className={styles.main}>
            {/* Minimal Header */}
            <div className={styles.gameHeader}>
                <div className={styles.headerInfo}>
                    <span className={styles.storyTitle}>{story.title}</span>
                    <span className={styles.sceneNumber}>Multiplayer • Scene {currentScene.scene_number}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span className={styles.phaseBadge}>{gamePhase} PHASE</span>
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
                            {/* FEEDBACK AREA */}
                            {feedback && (
                                <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                                    {feedback.message}
                                </div>
                            )}

                            {/* PROPOSAL LIST */}
                            <div className={styles.proposalList}>
                                <h3>Proposals ({proposals.length})</h3>
                                {proposals.map(p => (
                                    <div key={p.id} className={styles.proposalItem} style={{
                                        padding: '10px',
                                        margin: '5px 0',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: p.voters.includes(currentUser?.id) ? '1px solid var(--neon-green)' : '1px solid transparent'
                                    }}>
                                        <span>"{p.content}"</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>{p.vote_count} 🗳️</span>
                                            <Button size="sm" variant="secondary" onClick={() => handleVote(p.id)}>
                                                {p.voters.includes(currentUser?.id) ? 'Retract' : 'Vote'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* HOST CONTROLS */}
                            {isHost && proposals.length > 0 && gamePhase === 'PROPOSING' && (
                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <Button onClick={handleExecuteWinningProposal} disabled={analyzing}>
                                        {analyzing ? 'Resolving...' : '👑 Execute Winning Action'}
                                    </Button>
                                </div>
                            )}

                            {/* INPUT SECTION */}
                            <div className={styles.inputSection}>
                                <div className={styles.inputWrapper}>
                                    <textarea
                                        className={`${styles.decisionInput} ${animationClass}`}
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder="Propose an action..."
                                        rows={2}
                                        disabled={analyzing || gamePhase === 'RESOLVING'}
                                    />
                                    <button
                                        className={styles.submitButton}
                                        onClick={handlePropose}
                                        disabled={!userInput.trim() || analyzing}
                                    >
                                        Propose
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
                        {p.is_host && <span title="Host">👑</span>}
                    </div>
                ))}
            </div>
        </main>
    )
}
