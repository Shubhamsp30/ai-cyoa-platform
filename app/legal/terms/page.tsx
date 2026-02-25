'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import styles from './terms.module.css'

export default function TermsPage() {
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
                        <span className={styles.subtitle}>Classification: Top Secret // System Directives</span>
                        <h1 className={styles.title}>Terms & Conditions</h1>
                    </div>
                    <Button variant="outline" onClick={() => router.back()}>
                        [ EXIT_TO_MAIN ]
                    </Button>
                </header>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconBox}>⚖️</div>
                        <h2 className={styles.sectionTitle}>Operative Agreement</h2>
                    </div>

                    <div className={styles.grid}>
                        {TERMS_CARDS.map((card, index) => (
                            <motion.div
                                key={index}
                                className={styles.card}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                            >
                                <span className={styles.watermark}>{index + 1}</span>
                                <h3 className={styles.cardTitle}>
                                    <span>{card.icon}</span> {card.title}
                                </h3>
                                <p className={styles.text}>{card.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <footer className={styles.footer}>
                    LAST_UPDATE // FEB_2026 // ©_AI_ADVENTURE_PLATFORM // ALL_RIGHTS_RESERVED
                </footer>
            </motion.div>
        </main>
    )
}

const TERMS_CARDS = [
    {
        title: "Welcome Aboard",
        icon: "👋",
        content: "By joining our game, you're agreeing to follow these simple rules. We want everyone to have a great time exploring legendary stories!"
    },
    {
        title: "AI & Your Adventure",
        icon: "🤖",
        content: "Our AI creates dynamic stories and images just for you. While we strive for excellence, some content might be unpredictable. We ask for your understanding as we build this future together."
    },
    {
        title: "Play Fair",
        icon: "🤝",
        content: "Respect the platform and other players. Please avoid using hateful language in prompts or trying to exploit the game logic. Let's keep the community positive!"
    },
    {
        title: "Your Data & Privacy",
        icon: "🔒",
        content: "We take your privacy seriously. We only collect basic gameplay info (like scores and locations) to improve your experience. Your data is never sold and is kept safe."
    },
    {
        title: "Ownership",
        icon: "🎨",
        content: "We own the code and the tech, but the memories and the fun are all yours! Feel free to share your adventures with friends."
    }
]
