'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/create-browser-client'
import { getStoryById, getSceneById, Story, Scene, getImageUrl } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import AnimatedText from '@/components/ui/AnimatedText'
import styles from './play.module.css'
import AudioControls from '@/components/ui/AudioControls'
import AchievementToast from '@/components/ui/AchievementToast'
import { soundManager } from '@/lib/audio/SoundManager'
import { Language, useLanguage } from '@/contexts/LanguageContext'
import VirtualKeyboard from '@/components/VirtualKeyboard';
import LanguageSelector from '@/components/ui/LanguageSelector'

export default function PlayPage() {
    const router = useRouter()
    const supabase = createClient()
    const [showKeyboard, setShowKeyboard] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [userId, setUserId] = useState<string | null>(null)
    const [story, setStory] = useState<Story | null>(null)
    const [currentScene, setCurrentScene] = useState<Scene | null>(null)
    const [userInput, setUserInput] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [loading, setLoading] = useState(true)
    const [animationClass, setAnimationClass] = useState('')
    const { t, labels, language } = useLanguage()

    // ... (rest of code)



    // Achievement State
    const [unlockedAchievement, setUnlockedAchievement] = useState<any>(null)
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)

    // Leaderboard State
    const [score, setScore] = useState(0)
    const [playerName, setPlayerName] = useState('')
    const [scoreSubmitted, setScoreSubmitted] = useState(false)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUserId(session.user.id)
                // Optionally fetch profile name here if needed, 
                // but we can trust the user to enter their "Warrior Name" or pre-fill it.
                if (session.user.user_metadata?.username) {
                    setPlayerName(session.user.user_metadata.username)
                }
            }
        }
        checkSession()
        loadGameState()
        // Start ambient music
        soundManager.playBGM('bgm_war.mp3')

        return () => {
            soundManager.stopAll()
        }
    }, [])

    // Gameplay State
    const [mistakes, setMistakes] = useState(0)

    useEffect(() => {
        if (currentScene) {
            // Play scene transition sound (except for first load if needed, but 'intro' sounds good)
            // Use a short delay to ensure description starts reading after the sound
            soundManager.playTone('scene_transition')

            if (!currentScene.is_ending) {
                setTimeout(() => {
                    soundManager.speak(t(currentScene, 'content'), language)
                }, 800) // Delayed slightly more to let the transition sound play
            }

            // Ensure score is 0 if we are at the very beginning
            if (story && currentScene.id === story.starting_scene_id) {
                setScore(0)
                setMistakes(0)
                localStorage.removeItem(`story_score_${story.id}`)
            }
        }
    }, [currentScene, story, t, language])

    // ... (rest of code)

    const handleDecision = async () => {
        if (!userInput.trim() || !currentScene || !story) return

        setAnalyzing(true)
        setFeedback(null)
        soundManager.speak('', language)

        try {
            const response = await fetch('/api/analyze-decision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput,
                    validPaths: currentScene.valid_paths,
                    sceneContext: t(currentScene, 'content'),
                }),
            })

            const analysis = await response.json()

            if (analysis.matched_path) {
                const newScore = score + 20
                setScore(newScore)
                soundManager.playTone('success')
                setAnimationClass('pulse-success')
                setTimeout(() => setAnimationClass(''), 500)

                setFeedback({
                    message: analysis.matched_path.success_message || analysis.message,
                    type: 'success'
                })

                // Streak Logic
                const newStreak = consecutiveCorrect + 1
                setConsecutiveCorrect(newStreak)
                if (newStreak === 5) {
                    checkAchievement('STRATEGIC_MIND')
                }

                // ... (Existing achievement checks) ...

                // Scene Specific Achievements (Keep existing logic)
                if (currentScene.scene_number === 1) checkAchievement('SCENE_1_COMPLETE')
                if (currentScene.scene_number === 4 && (userInput.toLowerCase().includes('duty') || userInput.toLowerCase().includes('leave'))) checkAchievement('SWARAJYA_FIRST')
                if (currentScene.scene_number === 6 && (userInput.toLowerCase().includes('ghorpad') || userInput.toLowerCase().includes('yashwanti'))) checkAchievement('CLIFF_CLIMBER')
                if (currentScene.scene_number === 8) checkAchievement('UDAYBHAN_SLAYER')

                if (story.title.includes('Baji')) {
                    if (currentScene.scene_number === 6) checkAchievement('BAJI_VOLUNTEER')
                    if (currentScene.scene_number === 8) checkAchievement('BAJI_IRON_WALL')
                }

                if (userInput.toLowerCase().includes('peace') || userInput.toLowerCase().includes('talk')) checkAchievement('PEACEFUL_CHOICE')
                else if (userInput.toLowerCase().includes('attack') || userInput.toLowerCase().includes('fight')) checkAchievement('WARRIOR_CHOICE')


                setTimeout(async () => {
                    if (currentScene.is_ending) {
                        setFeedback({
                            message: '🏆 You have completed this story! Thank you for playing!',
                            type: 'success'
                        })

                        // Strict Bonus Calculation
                        const perfectRun = mistakes === 0
                        const bonusScore = perfectRun ? 50 : 0

                        // Trigger Confetti
                        import('canvas-confetti').then((confetti) => {
                            confetti.default({
                                particleCount: 150,
                                spread: 70,
                                origin: { y: 0.6 },
                                colors: ['#40e0d0', '#ff0099', '#fbbf24']
                            })
                        })

                        setScore(s => s + bonusScore)

                        // Game Completion Achievements
                        checkAchievement('SINHAGAD_CONQUEROR')

                        if (story.title.includes('Baji')) {
                            checkAchievement('BAJI_VICTORY')
                        }

                        // Check High Score Achievement (adjusted for new scoring if needed, usually 1000 is hard with 50 bonus, but achievable with streaks if implemented later)
                        if (newScore + bonusScore >= 1000) {
                            checkAchievement('HIGH_SCORE_2000')
                        }
                        return
                    }

                    const nextScene = await getSceneById(analysis.matched_path.next_scene_id)
                    if (nextScene) {
                        setCurrentScene(nextScene)
                        saveProgress(nextScene.id, newScore)
                        setUserInput('')
                        setFeedback(null)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                }, 2500)
            } else {
                setMistakes(m => m + 1) // Increment mistakes
                setConsecutiveCorrect(0) // Reset streak

                // ... (existing feedback generation)
                const politeMessages = [
                    "That's a bold choice, but it doesn't fit the path.",
                    "Think like a warrior. What would you do?",
                    "Interesting, but not what the story needs right now.",
                    "Try a different approach."
                ]
                const randomMessage = politeMessages[Math.floor(Math.random() * politeMessages.length)]

                setScore(prev => Math.max(0, prev - 5))
                soundManager.playTone('error')
                setAnimationClass('shake')
                setTimeout(() => setAnimationClass(''), 500)
                setFeedback({ message: randomMessage, type: 'error' })
            }
        } catch (error) {
            console.error('Error analyzing decision:', error)
            setFeedback({
                message: '⚠️ Oops! Something went wrong analyzing your decision.',
                type: 'error'
            })
        } finally {
            setAnalyzing(false)
        }
    }

    const submitScore = async () => {
        if (!playerName.trim() || !story) return
        // Save name for achievements
        localStorage.setItem('player_name', playerName)

        try {
            await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storyId: story.id,
                    playerName: playerName,
                    userId,
                    score: score,
                    achievedEnding: 'Victory'
                })
            })
            setScoreSubmitted(true)
        } catch (error) { console.error(error) }
    }



    const handleVirtualKeyPress = (char: string) => {
        if (char === 'BACKSPACE') {
            setUserInput(prev => prev.slice(0, -1));
        } else if (char === 'SPACE') {
            setUserInput(prev => prev + ' ');
        } else {
            setUserInput(prev => prev + char);
        }
    };

    const handleRestart = () => {
        if (story) {
            localStorage.removeItem(`story_progress_${story.id}`)
            localStorage.removeItem(`story_score_${story.id}`)
            router.push('/game/stories')
        }
    }

    if (loading) {
        return (
            <main className={styles.main}>
                <div className="spinner"></div>
            </main>
        )
    }

    if (!currentScene || !story) {
        return (
            <main className={styles.main}>
                <div className="container">
                    <p>Story not found</p>
                    <Button onClick={() => router.push('/game/stories')}>Back to Stories</Button>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.main}>
            <div style={{ position: 'relative', zIndex: 99999 }}>
                <AchievementToast
                    achievement={unlockedAchievement}
                    onClose={() => setUnlockedAchievement(null)}
                />
            </div>

            <AudioControls />

            {/* Fixed Header */}
            <div className={styles.gameHeader}>


                <div className={styles.headerInfo}>
                    <span className={styles.character}>⚔️ {t(story, 'character_name')}</span>
                    <span className={styles.storyTitle}>{t(story, 'title')}</span>
                    <span className={styles.sceneNumber}>{labels.scene} {currentScene.scene_number} / {story.total_scenes}</span>
                </div>

                {/* Right Side: Score + Restart */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <LanguageSelector />
                    <span style={{ color: '#40e0d0', fontWeight: 'bold' }}>{labels.score}: {score}</span>
                    <Button variant="outline" size="sm" onClick={handleRestart}>
                        {labels.story_select}
                    </Button>
                </div>
            </div>

            {/* Split Screen Content */}
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
                    <h1 className={styles.sceneTitle}>{t(currentScene, 'title')}</h1>

                    <div className={styles.scenarioSection}>
                        <h2 className={styles.sectionLabel}>
                            {labels.situation}
                            <button
                                onClick={() => soundManager.speak(t(currentScene, 'content'), language)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    marginLeft: '10px',
                                    fontSize: '1.1rem'
                                }}
                                title="Replay Narration"
                            >
                                🗣️
                            </button>
                        </h2>
                        <p className={styles.mainText}>
                            <AnimatedText text={t(currentScene, 'content')} delay={50} />
                        </p>
                    </div>

                    {!currentScene.is_ending ? (
                        <>
                            <div className={styles.questionSection}>
                                <h2 className={styles.questionLabel}>{labels.challenge}</h2>
                                <div className={styles.callout}>
                                    <p>
                                        <AnimatedText text={t(currentScene, 'overview')} delay={60} />
                                    </p>
                                </div>
                            </div>

                            {/* Decision Input */}
                            <div className={styles.inputSection}>
                                <p className={styles.hint}>
                                    {t(currentScene, 'valid_actions_hint') ?
                                        `${labels.placeholder} (Hint: ${t(currentScene, 'valid_actions_hint')})` :
                                        labels.placeholder
                                    }
                                </p>

                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder={t(currentScene, 'valid_actions_hint') ?
                                            `${labels.placeholder} (Hint: ${t(currentScene, 'valid_actions_hint')})` :
                                            labels.placeholder}
                                        className={`${styles.decisionInput} ${animationClass}`}
                                        onKeyPress={(e) => e.key === 'Enter' && handleDecision()}
                                        disabled={analyzing}
                                    />

                                    {(language === 'hi' || language === 'mr') && (
                                        <button
                                            className={`${styles.iconButton} ${showKeyboard ? styles.active : ''}`}
                                            onClick={() => setShowKeyboard(!showKeyboard)}
                                            title="Virtual Keyboard"
                                        >
                                            ⌨️
                                        </button>
                                    )}
                                </div>

                                {showKeyboard && (language === 'hi' || language === 'mr') && (
                                    <VirtualKeyboard
                                        language={language as 'hi' | 'mr'}
                                        onKeyPress={handleVirtualKeyPress}
                                        onClose={() => setShowKeyboard(false)}
                                    />
                                )}

                                {feedback && (
                                    <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                                        {feedback.message}
                                    </div>
                                )}

                                <button
                                    className={styles.submitButton}
                                    onClick={handleDecision}
                                    disabled={!userInput.trim() || analyzing}
                                >
                                    {analyzing ? labels.analyzing : labels.submit}
                                </button>

                                <p className={styles.quickAction}>💡 {labels.quick_action}</p>
                            </div>
                        </>
                    ) : (
                        <div className={styles.endingCard}>
                            <h2>🏆 Journey Complete</h2>
                            <p className={styles.endingQuote}>
                                Your legend has been written!
                            </p>

                            <div style={{ margin: '2rem 0', padding: '1.5rem', background: 'rgba(64, 224, 208, 0.1)', borderRadius: '12px', border: '1px solid rgba(64, 224, 208, 0.3)' }}>
                                <h3 style={{ color: '#40e0d0', marginBottom: '0.5rem' }}>Final Score: {score}</h3>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                                    Base Score: {score - (mistakes === 0 ? 50 : 0)}
                                    {mistakes === 0 ? <span style={{ color: '#fbbf24' }}> + 50 PERFECT RUN BONUS!</span> : <span> + 0 Bonus (Mistakes Made: {mistakes})</span>}
                                </div>
                                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>Enter your name to join the Hall of Legends</p>

                                {!scoreSubmitted ? (
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <input
                                            type="text"
                                            placeholder="Warrior Name"
                                            value={playerName}
                                            onChange={(e) => setPlayerName(e.target.value)}
                                            style={{
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(0,0,0,0.5)',
                                                color: '#fff',
                                                outline: 'none'
                                            }}
                                        />
                                        <Button onClick={submitScore} disabled={!playerName.trim()}>
                                            Submit
                                        </Button>
                                    </div>
                                ) : (
                                    <div style={{ color: '#86efac', fontWeight: 'bold' }}>
                                        ✅ Score Submitted!
                                    </div>
                                )}
                            </div>

                            <div className={styles.endingButtons}>
                                <Button size="lg" onClick={() => router.push('/game/leaderboard')}>
                                    🏆 Leaderboard
                                </Button>
                                <Button size="lg" variant="secondary" onClick={() => router.push('/game/profile')}>
                                    👤 Achievements
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => router.push('/game/stories')}>
                                    🎭 New Story
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
