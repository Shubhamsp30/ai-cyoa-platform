'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/create-browser-client'
import { getStoryById, getSceneById, Story, Scene, getImageUrl, getAchievementsByStory } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import AnimatedText from '@/components/ui/AnimatedText'
import styles from './play.module.css'
import AudioControls from '@/components/ui/AudioControls'
import AchievementToast from '@/components/ui/AchievementToast'
import WeatherLayer from '@/components/game/WeatherLayer'
import { soundManager } from '@/lib/audio/SoundManager'
import { useLanguage } from '@/contexts/LanguageContext'
import VirtualKeyboard from '@/components/VirtualKeyboard'
import LanguageSelector from '@/components/ui/LanguageSelector'
import { motion, AnimatePresence } from 'framer-motion'

export default function PlayPage() {
    const router = useRouter()
    const supabase = createClient()
    const [showKeyboard, setShowKeyboard] = useState(false)

    // Debug Toggle
    const toggleKeyboard = () => {
        console.log("TACTICAL: Keyboard Toggle Requested. Current State:", !showKeyboard);
        setShowKeyboard(prev => !prev);
    }
    const [userId, setUserId] = useState<string | null>(null)
    const [story, setStory] = useState<Story | null>(null)
    const [currentScene, setCurrentScene] = useState<Scene | null>(null)
    const [userInput, setUserInput] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [loading, setLoading] = useState(true)
    const [animationClass, setAnimationClass] = useState('')
    const { t, labels, language } = useLanguage()

    // Achievement & Leaderboard State
    const [unlockedAchievement, setUnlockedAchievement] = useState<any>(null)
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
    const [score, setScore] = useState(0)
    const [playerName, setPlayerName] = useState('')
    const [scoreSubmitted, setScoreSubmitted] = useState(false)
    const [mistakes, setMistakes] = useState(0)
    const [storyAchievements, setStoryAchievements] = useState<any[]>([])
    const [isSpeaking, setIsSpeaking] = useState(false) // Track AI speech state
    const [playerLocation, setPlayerLocation] = useState<string>('18.2917° N, 73.8567° E') // Default to Sinhagad

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUserId(session.user.id)
                if (session.user.user_metadata?.username) {
                    setPlayerName(session.user.user_metadata.username)
                }
            }
        }
        checkSession()
        loadGameState()
        soundManager.playBGM('bgm_war.mp3')

        // DUAL-MODE GEOLOCATION: GPS Precision with IP Fallback
        const fetchLocation = async () => {
            let latitude: number | null = null;
            let longitude: number | null = null;
            let placeName = "Unknown Sector";

            // 1. Try GPS Intel (High-Precision)
            const getGPSCoords = () => new Promise<GeolocationPosition | null>((resolve) => {
                if (!navigator.geolocation) return resolve(null);
                navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), { timeout: 5000 });
            });

            const gpsData = await getGPSCoords();
            if (gpsData) {
                console.log("MISSION_INTEL: GPS Lock Acquired.");
                latitude = gpsData.coords.latitude;
                longitude = gpsData.coords.longitude;
            }

            try {
                // 2. Fetch IP Intel for City/State context and Fallback Coords
                const ipResponse = await fetch('https://ipapi.co/json/');
                const ipData = await ipResponse.json();

                if (ipData.city && ipData.region) {
                    placeName = `${ipData.city}, ${ipData.region}`;
                    if (latitude === null) {
                        latitude = ipData.latitude;
                        longitude = ipData.longitude;
                        console.log("MISSION_INTEL: Using IP-based Sector Fallback.");
                    }
                }
            } catch (err) {
                console.warn("MISSION_INTEL: IP-context fetch failed.", err);
            }

            if (latitude !== null && longitude !== null) {
                const coordString = `${latitude.toFixed(6)}° ${latitude >= 0 ? 'N' : 'S'}, ${longitude.toFixed(6)}° ${longitude >= 0 ? 'E' : 'W'}`;
                const locationLabel = `${placeName} | ${coordString}`;
                setPlayerLocation(locationLabel);

                // Save to Database
                fetch('/api/user/location', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ coords: coordString, placeName: placeName })
                }).catch(err => console.error("LOCATION_SYNC_FAILED:", err));
            }
        };

        fetchLocation();

        return () => {
            soundManager.stopAll()
        }
    }, [])

    useEffect(() => {
        if (currentScene) {
            soundManager.stopSpeaking() // STOP PREVIOUS SCENE SPEECH
            setIsSpeaking(false)
            soundManager.playTone('scene_transition')
            if (story && currentScene.id === story.starting_scene_id) {
                setScore(0)
                setMistakes(0)
                localStorage.removeItem(`story_score_${story.id}`)
            }
        }
    }, [currentScene, story])

    useEffect(() => {
        // Halt any existing speech if language changes
        soundManager.stopSpeaking()
        setIsSpeaking(false)
    }, [language])

    const loadGameState = async () => {
        const storyId = localStorage.getItem('selected_story_id')
        if (!storyId) {
            router.push('/game/stories')
            return
        }

        const storyData = await getStoryById(storyId)
        if (!storyData) {
            router.push('/game/stories')
            return
        }
        setStory(storyData)

        // Initial check: Try to fetch cloud-synced state if user is logged in
        let savedSceneId = localStorage.getItem(`story_progress_${storyId}`)
        let savedScore = localStorage.getItem(`story_score_${storyId}`)

        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('current_scene_id, current_score, current_story_id')
                .eq('id', session.user.id)
                .single()

            // If the user's cloud profile matches the selected story, prioritize it
            if (profile && profile.current_story_id === storyId) {
                console.log('AUTO-SAVE: Restoring cloud-synced mission state...')
                savedSceneId = profile.current_scene_id || savedSceneId
                savedScore = profile.current_score?.toString() || savedScore
            }
        }

        if (savedScore) setScore(parseInt(savedScore))

        const sceneId = savedSceneId || storyData.starting_scene_id
        const sceneData = await getSceneById(sceneId)
        if (sceneData) setCurrentScene(sceneData)

        // Fetch story achievements from DB
        const achievementData = await getAchievementsByStory(storyId)
        setStoryAchievements(achievementData)

        setLoading(false)
    }

    const saveProgress = async (sceneId: string, newScore: number) => {
        if (story) {
            // Local fallback
            localStorage.setItem(`story_progress_${story.id}`, sceneId)
            localStorage.setItem(`story_score_${story.id}`, newScore.toString())

            // Cloud Sync (Auto-Save)
            if (userId) {
                console.log('AUTO-SAVE: Syncing mission progress to command center...')
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        current_story_id: story.id,
                        current_scene_id: sceneId,
                        current_score: newScore,
                        last_played_at: new Date().toISOString()
                    })
                    .eq('id', userId)

                if (error) console.error('AUTO-SAVE ERROR:', error)
            }
        }
    }

    const checkAchievements = async (newConsecutive: number, isEnding: boolean, sceneNum: number, outcomeType: string | null = null) => {
        if (!story || storyAchievements.length === 0) return

        // Map gameplay state to possible condition codes in DB
        const possibleCodes: string[] = []
        if (newConsecutive === 1) possibleCodes.push('FIRST_BLOOD', 'FIRST_RECON')
        if (newConsecutive === 3) possibleCodes.push('TACTICAL_GENIUS')
        if (newConsecutive >= 5) possibleCodes.push('MASTER_STRATEGIST', 'STRATEGIC_MIND')

        if (isEnding) {
            possibleCodes.push('LEGEND', 'SINHAGAD_CONQUEROR', 'BAJI_VICTORY', 'SENTINEL_OF_SWARAJYA')
            if (mistakes === 0) possibleCodes.push('PERFECT_LEGEND')
        }

        // Scene-Specific Legacy Codes
        if (sceneNum === 1) possibleCodes.push('SCENE_1_COMPLETE')
        if (sceneNum === 6) possibleCodes.push('CLIFF_CLIMBER', 'GHORPAD_MASTERY')
        if (sceneNum === 8) possibleCodes.push('UDAYBHAN_SLAYER', 'DUELIST')
        if (sceneNum === 7 || sceneNum === 8) possibleCodes.push('BAJI_VOLUNTEER', 'ULTIMATE_VOLUNTEER')
        if (sceneNum === 9) possibleCodes.push('BAJI_IRON_WALL', 'IRON_WALL')
        if (sceneNum === 4 || sceneNum === 5) possibleCodes.push('SWARAJYA_FIRST')

        if (sceneNum > 0) possibleCodes.push(`SCENE_${sceneNum}_COMPLETE`)

        if (score >= 1000) possibleCodes.push('HIGH_SCORE_1000')
        if (score >= 2000) possibleCodes.push('HIGH_SCORE_2000', 'LEGENDARY_COMMANDER')

        // Tactical codes based on outcome type
        if (outcomeType === 'redirect') possibleCodes.push('PEACEFUL_DIPLOMAT', 'PEACEFUL_CHOICE', 'DIPLOMAT')
        if (outcomeType === 'success') possibleCodes.push('WARRIOR_SPIRIT', 'WARRIOR_CHOICE')

        // Find matches in our fetched achievements list
        const matches = storyAchievements.filter(a => possibleCodes.includes(a.condition_code))

        for (const achievement of matches) {
            try {
                const response = await fetch('/api/achievements', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        storyId: story.id,
                        playerName,
                        userId,
                        conditionCode: achievement.condition_code
                    })
                })

                const result = await response.json()
                if (result.newUnlock) {
                    setUnlockedAchievement(result.achievement)
                    soundManager.playTone('success')
                }
            } catch (error) {
                console.error('Achievement check failed:', error)
            }
        }
    }

    const handleDecision = async () => {
        if (!userInput.trim() || !currentScene || !story) return

        setAnalyzing(true)
        setFeedback(null)

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

                // MASSIVE VICTORY VOLCANO (Triple-wave sustained celebration)
                import('canvas-confetti').then((confetti) => {
                    const count = 300;
                    const defaults = {
                        origin: { y: 0.8 },
                        spread: 80,
                        ticks: 800,
                        gravity: 1.0,
                        scalar: 1.1,
                        colors: ['#40e0d0', '#ff0099', '#fbbf24', '#ffffff', '#00ff9d']
                    };

                    const fire = (particleRatio: number, opts: any) => {
                        confetti.default({
                            ...defaults,
                            ...opts,
                            particleCount: Math.floor(count * particleRatio)
                        });
                    };

                    fire(0.2, { spread: 30, startVelocity: 60, origin: { x: 0, y: 0.85 }, angle: 60 });
                    fire(0.2, { spread: 30, startVelocity: 60, origin: { x: 1, y: 0.85 }, angle: 120 });

                    setTimeout(() => {
                        fire(0.4, { spread: 100, decay: 0.92, scalar: 1.0, origin: { x: 0.5, y: 0.7 } });
                    }, 300);

                    setTimeout(() => {
                        fire(0.2, { spread: 120, startVelocity: 35, decay: 0.94, scalar: 1.3, origin: { x: 0.5, y: 0.6 } });
                    }, 700);
                });

                setFeedback({
                    message: analysis.matched_path.success_message || analysis.message,
                    type: 'success'
                })

                const newConsecutive = consecutiveCorrect + 1
                setConsecutiveCorrect(newConsecutive)

                // Trigger DB-Driven Achievement Check
                const isEnding = currentScene.is_ending
                const outcomeType = analysis.matched_path.outcome_type

                checkAchievements(newConsecutive, isEnding, currentScene.scene_number, outcomeType)

                setTimeout(async () => {
                    if (currentScene.is_ending) {
                        import('canvas-confetti').then((confetti) => {
                            confetti.default({
                                particleCount: 400, // Maximized finale
                                spread: 100,
                                origin: { y: 0.5 },
                                colors: ['#40e0d0', '#ff0099', '#fbbf24', '#ffffff']
                            })
                        })
                        return
                    }

                    const nextScene = await getSceneById(analysis.matched_path.next_scene_id)
                    if (nextScene) {
                        setCurrentScene(nextScene)
                        saveProgress(nextScene.id, newScore)
                        setUserInput('')
                        setFeedback(null)
                    }
                }, 800) // Calibrated for rapid tactical flow
            } else {
                setMistakes(m => m + 1)
                setConsecutiveCorrect(0)
                setScore(prev => Math.max(0, prev - 5))
                soundManager.playTone('error')
                setAnimationClass('shake')
                setTimeout(() => setAnimationClass(''), 500)

                // MASSIVE ERROR ERUPTION (Ensuring visibility)
                import('canvas-confetti').then((confetti) => {
                    const errorDefaults = {
                        origin: { x: 0.5, y: 0.5 }, // Centered to be seen clearly
                        spread: 120,
                        ticks: 400,
                        gravity: 2.2, // Heavy feeling
                        scalar: 1.3,
                        startVelocity: 45,
                        colors: ['#ff0000', '#770000', '#000000', '#ff4444']
                    };

                    confetti.default({
                        ...errorDefaults,
                        particleCount: 200 // More particles
                    });
                });

                setFeedback({ message: analysis.message || "TACTICAL ERROR: Choice invalid.", type: 'error' })
            }
        } catch (error) {
            console.error('Error analyzing decision:', error)
            setFeedback({ message: 'SYSTEM ERROR: Intel processing failed.', type: 'error' })
        } finally {
            setAnalyzing(false)
        }
    }

    const toggleSpeech = () => {
        if (soundManager.isSpeaking) {
            soundManager.stopSpeaking()
            setIsSpeaking(false)
        } else {
            soundManager.speak(t(currentScene, 'content'), language)
            setIsSpeaking(true)
            // Optional: Listen for end to reset state
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                const checkEnd = setInterval(() => {
                    if (!window.speechSynthesis.speaking) {
                        setIsSpeaking(false)
                        clearInterval(checkEnd)
                    }
                }, 500)
            }
        }
    }

    const submitScore = async () => {
        if (!playerName.trim() || !story) return
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

    const handleAbort = async () => {
        if (story) {
            // 1. Clear Local
            localStorage.removeItem(`story_progress_${story.id}`)
            localStorage.removeItem(`story_score_${story.id}`)

            // 2. Clear Cloud
            if (userId) {
                console.log('ABORT: Purging cloud mission records...')
                await supabase
                    .from('profiles')
                    .update({
                        current_story_id: null,
                        current_scene_id: null,
                        current_score: 0,
                        last_played_at: new Date().toISOString()
                    })
                    .eq('id', userId)
            }

            router.push('/game/stories')
        }
    }

    const handleSwitchMission = () => {
        // Progress is already auto-saved via saveProgress
        router.push('/game/stories')
    }

    const handleKeyboardInput = (key: string) => {
        if (key === 'BACKSPACE') {
            setUserInput(prev => prev.slice(0, -1))
        } else if (key === 'SPACE') {
            setUserInput(prev => prev + ' ')
        } else {
            setUserInput(prev => prev + key)
        }
    }

    if (loading) return (
        <main className={styles.main}>
            <div className={styles.hudGrid}></div>
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <div className={styles.loadingText}>SYNCING FRONTLINE HUD...</div>
            </div>
        </main>
    )

    if (!currentScene || !story) return (
        <main className={styles.main}>
            <div className={styles.container}>
                <p>SIGNAL LOST: MISSION DATA MISSING</p>
                <Button onClick={() => router.push('/game/stories')}>ABORT TO ARCHIVES</Button>
            </div>
        </main>
    )

    return (
        <>
            <main className={styles.main}>
                {/* Cinematic Post-Processing */}
                <div className={styles.vignette}></div>
                <div className={styles.noiseOverlay}></div>

                {/* Global Environment Layers */}
                <div className={styles.hudGrid}></div>
                <div className={styles.emberContainer}>
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className={styles.ember}></div>
                    ))}
                </div>

                <AchievementToast
                    achievement={unlockedAchievement}
                    onClose={() => setUnlockedAchievement(null)}
                />

                <div className={styles.container}>
                    {/* Tech Brackets (Fixed HUD Frames) */}
                    <div className={`${styles.techBracket} ${styles.topLeft}`}></div>
                    <div className={`${styles.techBracket} ${styles.topRight}`}></div>
                    <div className={`${styles.techBracket} ${styles.bottomLeft}`}></div>
                    <div className={`${styles.techBracket} ${styles.bottomRight}`}></div>

                    {/* Tactical Header HUD */}
                    <header className={styles.gameHeader}>
                        <div className={styles.headerInfo}>
                            <div className={styles.character}>[ OPERATIVE: {t(story, 'character_name').toUpperCase()} ]</div>
                            <h1 className={styles.storyTitle}>{t(story, 'title')}</h1>
                            <div className={styles.headerDecor}>
                                <span className={styles.statusPulse}>●</span>
                                <span className={styles.statusText}>SYSTEM ONLINE // INTEL SYNCED</span>
                            </div>
                        </div>

                        <div className={styles.vitalsSection}>
                            <div className={styles.vital}>
                                <span className={styles.vitalLabel}>COMBAT SCORE</span>
                                <span className={`${styles.vitalValue} ${styles.score}`}>{score}</span>
                            </div>
                            <div className={styles.vital}>
                                <span className={styles.vitalLabel}>MISSION PROGRESS</span>
                                <span className={`${styles.vitalValue} ${styles.scene}`}>SCENE {currentScene.scene_number}/{story.total_scenes}</span>
                            </div>
                            <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <LanguageSelector />
                                <button className={styles.profileBtn} onClick={handleSwitchMission} title="Save & Change Story">[ SWITCH ]</button>
                                <button className={styles.profileBtn} onClick={handleAbort} title="Reset Mission Progress" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>[ ABORT ]</button>
                            </div>
                        </div>
                    </header>

                    {/* Main Gameplay HUD */}
                    <div className={styles.gameContent}>
                        {/* Cinematic Viewscreen */}
                        <div className={styles.imagePanel}>
                            <div className={styles.scanline}></div>

                            <WeatherLayer text={t(currentScene, 'content')} />



                            {currentScene.image_url && (
                                <motion.img
                                    key={currentScene.image_url}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={getImageUrl(currentScene.image_url) || ''}
                                    alt={currentScene.title}
                                    className={styles.sceneImage}
                                />
                            )}
                            <div className={styles.imageOverlay}></div>
                        </div>

                        {/* Command Console */}
                        <div className={styles.storyPanel}>
                            <div className={styles.consoleHeader}>
                                <h2 className={styles.sceneTitle}>{t(currentScene, 'title')}</h2>
                                <div className={styles.statusIndicator}>STATUS: SECTOR ANALYZED</div>
                            </div>

                            <div className={styles.narrationBox}>
                                <div className={styles.sectionLabel}>
                                    {['en', 'hi-en', 'mr-en'].includes(language) && (
                                        <button
                                            className={`${styles.audioBtn} ${isSpeaking ? styles.speaking : ''}`}
                                            onClick={toggleSpeech}
                                            title={isSpeaking ? "Stop AI Speech" : "Play AI Speech"}
                                        >
                                            {isSpeaking ? '⏹️' : '🔊'}
                                        </button>
                                    )}
                                </div>
                                <div className={styles.mainText}>
                                    <AnimatedText text={t(currentScene, 'content')} delay={10} />
                                </div>
                            </div>

                            {!currentScene.is_ending ? (
                                <>
                                    <div className={styles.challengeBox}>
                                        <div className={styles.sectionLabel}>[ MISSION CHALLENGE ]</div>
                                        <p className={styles.challengeText}>
                                            <AnimatedText text={t(currentScene, 'overview')} delay={15} />
                                        </p>
                                    </div>

                                    {/* Decision Console */}
                                    <div className={styles.inputSection}>
                                        <div className={`${styles.commandInputWrapper} ${animationClass}`}>
                                            <input
                                                type="text"
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                placeholder="ENTER COMMAND..."
                                                className={styles.decisionInput}
                                                onKeyPress={(e) => e.key === 'Enter' && handleDecision()}
                                                disabled={analyzing}
                                            />
                                            <button
                                                className={styles.keyboardToggle}
                                                onClick={toggleKeyboard}
                                                type="button"
                                                title="Toggle Virtual Keyboard"
                                            >
                                                ⌨️
                                            </button>
                                            <div className={styles.inputDecor}></div>
                                        </div>

                                        {feedback && (
                                            <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                                                {feedback.message.toUpperCase()}
                                            </div>
                                        )}

                                        <button
                                            className={styles.submitBtn}
                                            onClick={handleDecision}
                                            disabled={!userInput.trim() || analyzing}
                                        >
                                            {analyzing ? 'PROCESSING...' : 'EXECUTE CHOICE'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.endingCard}>
                                    <h2>[ MISSION ACCOMPLISHED ]</h2>
                                    <p className={styles.scoreText}>FINAL SCORE: {score}</p>
                                    {!scoreSubmitted ? (
                                        <div className={styles.submitBox}>
                                            <input
                                                type="text"
                                                placeholder="WARRIOR NAME"
                                                value={playerName}
                                                onChange={(e) => setPlayerName(e.target.value)}
                                                className={styles.decisionInput}
                                            />
                                            <button className={styles.submitBtn} onClick={submitScore}>
                                                LOG TO HALL OF LEGENDS
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.successText}>ENTRY LOGGED.</div>
                                    )}
                                    <div className={styles.endingButtons}>
                                        <Button onClick={() => router.push('/game/leaderboard')}>LEADERBOARD</Button>
                                        <Button variant="outline" onClick={() => router.push('/game/stories')}>NEW MISSION</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Root-Level Virtual Keyboard */}
            <AnimatePresence>
                {showKeyboard && (
                    <VirtualKeyboard
                        onKeyPress={handleKeyboardInput}
                        onClose={() => setShowKeyboard(false)}
                        language={(language as 'hi' | 'mr' | 'en') || 'en'}
                    />
                )}
            </AnimatePresence>
        </>
    )
}
