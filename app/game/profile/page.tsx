
'use client'


import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/create-browser-client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import styles from './profile.module.css'

export default function ProfilePage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [achievements, setAchievements] = useState<any[]>([])
    const [matches, setMatches] = useState<any[]>([])

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/login')
                return
            }

            setUser(session.user)

            // 1. Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()
            setProfile(profileData)

            // 2. Fetch Unlocked Achievements
            const { data: achievementData } = await supabase
                .from('player_achievements')
                .select(`
                    id, 
                    unlocked_at,
                    achievement:achievements (title, description, icon, xp_reward)
                `)
                .eq('user_id', session.user.id)
                .order('unlocked_at', { ascending: false })

            if (achievementData) {
                setAchievements(achievementData)
            }

            // 3. Fetch Match History
            const { data: matchData } = await supabase
                .from('leaderboard')
                .select(`
                    *,
                    story:stories (title)
                `)
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(10)

            if (matchData) {
                setMatches(matchData)
            }

            setLoading(false)
        }

        loadProfile()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) return <div className="spinner"></div>

    return (
        <main className={styles.main}>
            {/* Header / Nav */}
            <div className={styles.header}>
                <Button variant="outline" onClick={() => router.push('/game/stories')}>← Back to Game</Button>
                <h1 className={styles.pageTitle}>Warrior Profile</h1>
                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
            </div>

            <div className={styles.grid}>
                {/* Left Column: Stats & Info */}
                <div className={styles.colLeft}>
                    <div className={styles.card}>
                        <div className={styles.avatar}>
                            {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className={styles.username}>{profile?.username || 'Unknown Warrior'}</h2>
                        <p className={styles.email}>{user?.email}</p>

                        <div className={styles.statsRow}>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>{achievements.length}</span>
                                <span className={styles.statLabel}>Achievements</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>{matches.length}</span>
                                <span className={styles.statLabel}>Stories Played</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3>Recent Matches</h3>
                        {matches.length === 0 ? (
                            <p className={styles.empty}>No matches recorded yet.</p>
                        ) : (
                            <ul className={styles.matchList}>
                                {matches.map((match: any) => (
                                    <li key={match.id} className={styles.matchItem}>
                                        <div className={styles.matchInfo}>
                                            <span className={styles.matchTitle}>{match.story?.title || 'Unknown Story'}</span>
                                            <span className={styles.matchDate}>
                                                {new Date(match.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className={styles.matchScore}>
                                            {match.score} pts
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Right Column: Achievements */}
                <div className={styles.colRight}>
                    <h2 className={styles.sectionTitle}>🏆 Trophy Cabinaet</h2>

                    {achievements.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No achievements unlocked yet. Go play some stories!</p>
                            <Button onClick={() => router.push('/game/stories')}>Start Adventure</Button>
                        </div>
                    ) : (
                        <div className={styles.achievementGrid}>
                            {achievements.map((item: any) => (
                                <div key={item.id} className={styles.achievementCard}>
                                    <div className={styles.icon}>{item.achievement?.icon || '🏆'}</div>
                                    <div className={styles.info}>
                                        <h4>{item.achievement?.title}</h4>
                                        <p>{item.achievement?.description}</p>
                                        <span className={styles.xp}>+{item.achievement?.xp_reward} XP</span>
                                    </div>
                                    <span className={styles.date}>
                                        {new Date(item.unlocked_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
