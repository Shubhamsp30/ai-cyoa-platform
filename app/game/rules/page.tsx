'use client'

import React from 'react'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function RulesPage() {
    const router = useRouter()

    return (
        <main style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #0f172a, #000)',
            color: '#fff',
            padding: '4rem 2rem',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', color: '#40e0d0', margin: 0 }}>Game Rules & Guide</h1>
                    <Button variant="outline" onClick={() => router.back()}>← Back</Button>
                </div>

                {/* How to Play Section */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ color: '#fbbf24', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📜</span> How to Play
                    </h2>

                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                        <div>
                            <h3 style={{ color: '#40e0d0', marginBottom: '0.5rem' }}>1. Choose Your Path</h3>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                                Every scene presents a challenge. Type your action or choice into the box.
                                The AI analyzes your intent and decides the outcome.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ color: '#40e0d0', marginBottom: '0.5rem' }}>2. Scoring & Streaks</h3>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                                +20 Points for every correct decision.<br />
                                -5 Points for mistakes.<br />
                                <strong>+50 Bonus Points</strong> for a "Perfect Run" (0 mistakes).
                            </p>
                        </div>
                        <div>
                            <h3 style={{ color: '#40e0d0', marginBottom: '0.5rem' }}>3. Multiplayer</h3>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                                Join a lobby with a friend. Vote on decisions together.
                                Majority wins, or the Host decides in a tie!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div>
                    <h2 style={{ color: '#fbbf24', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🏆</span> Achievements
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                        Prove your worth by unlocking these legendary titles.
                    </p>

                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {ACHIEVEMENTS.map((ach) => (
                            <div key={ach.id} style={{
                                background: 'rgba(64, 224, 208, 0.05)',
                                padding: '1.5rem',
                                borderRadius: '0.8rem',
                                border: '1px solid rgba(64, 224, 208, 0.2)',
                                transition: 'transform 0.2s'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{ach.icon}</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#fff' }}>{ach.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{ach.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

const ACHIEVEMENTS = [
    { id: 1, title: 'Strategic Mind', icon: '🧠', desc: 'Make 5 correct choices in a row.' },
    { id: 2, title: 'Sinhagad Conqueror', icon: '🏰', desc: 'Successfully complete the Siege of Sinhagad story.' },
    { id: 3, title: 'Peaceful Diplomat', icon: '🕊️', desc: 'Choose a non-violent solution when available.' },
    { id: 4, title: 'Warrior\'s Spirit', icon: '⚔️', desc: 'Choose to fight and defend your honor.' },
    { id: 5, title: 'Cliff Climber', icon: '🦎', desc: 'Scale the steep cliffs using the Ghorpad strategy.' },
    { id: 6, title: 'Udaybhan Slayer', icon: '💀', desc: 'Defeat the heavily armored Udaybhan Rathod.' },
    { id: 7, title: 'High Scorer', icon: '🌟', desc: 'Achieve a score of over 1000 points in a single run.' },
    { id: 8, title: 'Baji\'s Volunteer', icon: '🙋‍♂️', desc: 'Volunteer for the dangerous rear-guard mission.' },
    { id: 9, title: 'The Iron Wall', icon: '🛡️', desc: 'Hold the pass at Pavan Khind against all odds.' },
    { id: 10, title: 'Perfect Legend', icon: '💎', desc: 'Complete a story with 0 mistakes.' },
]
