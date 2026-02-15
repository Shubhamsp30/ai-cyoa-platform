
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './AchievementToast.module.css'

interface Achievement {
    title: string
    description: string
    icon: string
    xp_reward: number
}

interface AchievementToastProps {
    achievement: Achievement | null
    onClose: () => void
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
    useEffect(() => {
        if (achievement) {
            const timer = setTimeout(() => {
                onClose()
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [achievement, onClose])

    return (
        <AnimatePresence>
            {achievement && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className={styles.toast}
                >
                    <div className={styles.icon}>{achievement.icon}</div>
                    <div className={styles.content}>
                        <h4 className={styles.title}>Achievement Unlocked!</h4>
                        <p className={styles.name}>{achievement.title}</p>
                        <span className={styles.xp}>+{achievement.xp_reward} XP</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
