'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import styles from './rules.module.css'

export default function RulesPage() {
    const router = useRouter()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.05
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" } as any
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.vignette}></div>

            <motion.div
                className={styles.container}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Tactical Header */}
                <header className={styles.header}>
                    <div className={styles.titleWrapper}>
                        <span className={styles.subtitle}>Classification: Top Secret // Operative Guidelines</span>
                        <h1 className={styles.title}>Rules & Achievements</h1>
                    </div>
                    <Button variant="outline" onClick={() => router.back()}>
                        [ EXIT_TO_MAIN ]
                    </Button>
                </header>

                {/* Rules Section */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconBox}>📜</div>
                        <h2 className={styles.sectionTitle}>Mission Protocol</h2>
                    </div>

                    <div className={styles.rulesGrid}>
                        {RULES.map((rule, index) => (
                            <motion.div
                                key={index}
                                className={styles.ruleCard}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                            >
                                <span className={styles.ruleNumber}>{index + 1}</span>
                                <h3 className={styles.ruleTitle}>{rule.title}</h3>
                                <p className={styles.ruleText}>{rule.text}</p>
                                {rule.bonus && <div className={styles.scoreBonus}>{rule.bonus}</div>}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Achievements Section */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconBox}>🏆</div>
                        <h2 className={styles.sectionTitle}>Hall of Legends</h2>
                    </div>

                    <div className={styles.achievementGrid}>
                        {ACHIEVEMENTS.map((ach) => (
                            <motion.div
                                key={ach.id}
                                className={styles.achievementCard}
                                variants={itemVariants}
                                whileHover={{ x: 10 }}
                            >
                                <div className={styles.achIcon}>{ach.icon}</div>
                                <div className={styles.achInfo}>
                                    <h3 className={styles.achTitle}>{ach.title}</h3>
                                    <p className={styles.achDesc}>{ach.desc}</p>
                                    <div className={styles.xpBadge}>+{ach.xp} XP REWARD</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </motion.div>
        </main>
    )
}

const RULES = [
    {
        title: 'Tactical Intent',
        text: 'Every scene presents a narrative challenge. Type your intent into the console. The AI specializes in "generous matching"—it understands your semantic meaning regardless of the language (Hindi, Marathi, or English).',
        bonus: null
    },
    {
        title: 'Combat Scoring',
        text: 'Each successful tactical decision yields +20 points. Incorrect decisions or "mistakes" result in a -5 point deduction. Precision is everything on the battlefield.',
        bonus: '+50 PERFECT RUN BONUS'
    },
    {
        title: 'Multiplayer Synergy',
        text: 'Deploy to the mission zone with allies. All participants vote on the best tactical path. Majority consensus drives the narrative, ensuring collective strategic success.',
        bonus: 'BATTLE WITH ALLIES'
    },
    {
        title: 'Legendary Status',
        text: 'Complete missions and make decisive tactical strikes to earn XP. High-performance operatives unlock permanent titles in the global Trophy Cabinet.',
        bonus: 'EARN XP REWARDS'
    }
]

const ACHIEVEMENTS = [
    { id: 1, title: 'Strategic Mind', icon: '🧠', desc: 'Maintain a 5-move correct decision streak.', xp: 200 },
    { id: 2, title: 'Sinhagad Conqueror', icon: '🏰', desc: 'Secure the fortress and complete the Tanaji mission.', xp: 500 },
    { id: 3, title: 'Peaceful Diplomat', icon: '🕊️', desc: 'Secure an objective without shedding blood.', xp: 150 },
    { id: 4, title: 'Warrior\'s Spirit', icon: '⚔️', desc: 'Neutralize threats through direct combat excellence.', xp: 150 },
    { id: 5, title: 'Ghorpad Mastery', icon: '🦎', desc: 'Scale the vertical cliffs of Sinhagad with Yashwanti.', xp: 150 },
    { id: 6, title: 'Udaybhan Slayer', icon: '💀', desc: 'Defeat the Mughal commander in single combat.', xp: 300 },
    { id: 7, title: 'High Scorer', icon: '🌟', desc: 'Achieve a mission score exceeding 1000 points.', xp: 200 },
    { id: 8, title: 'Baji\'s Volunteer', icon: '🙋‍♂️', desc: 'Accept the suicide mission to hold Pavankhind.', xp: 250 },
    { id: 9, title: 'The Iron Wall', icon: '🛡️', desc: 'Hold the pass at Pavan Khind against the Bijapuri tide.', xp: 400 },
    { id: 10, title: 'Perfect Legend', icon: '💎', desc: 'Complete an entire mission with Zero mistakes.', xp: 750 },
]
