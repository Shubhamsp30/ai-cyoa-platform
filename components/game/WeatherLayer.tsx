'use client'

import { useEffect, useState } from 'react'
import styles from '@/app/game/play/play.module.css'

interface WeatherLayerProps {
    text: string
}

export default function WeatherLayer({ text }: WeatherLayerProps) {
    const [effect, setEffect] = useState<'none' | 'rain' | 'snow' | 'fog'>('none')

    useEffect(() => {
        const lowerText = text.toLowerCase()
        if (lowerText.includes('rain') || lowerText.includes('storm') || lowerText.includes('thunder')) {
            setEffect('rain')
        } else if (lowerText.includes('snow') || lowerText.includes('cold') || lowerText.includes('freeze') || lowerText.includes('winter')) {
            setEffect('snow')
        } else if (lowerText.includes('fog') || lowerText.includes('mist') || lowerText.includes('smoke') || lowerText.includes('haze')) {
            setEffect('fog')
        } else {
            setEffect('none')
        }
    }, [text])

    if (effect === 'none') return null

    return (
        <div className={`${styles.weatherOverlay} ${styles[effect]}`}>
            {effect === 'rain' && (
                <div className={styles.rainContainer}>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className={styles.raindrop} style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: Math.random() * 0.5 + 0.2
                        }}></div>
                    ))}
                </div>
            )}
            {effect === 'snow' && (
                <div className={styles.snowContainer}>
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className={styles.snowflake} style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 3 + 4}s`,
                            opacity: Math.random() * 0.6 + 0.2
                        }}></div>
                    ))}
                </div>
            )}
            {effect === 'fog' && <div className={styles.fogEffect}></div>}
        </div>
    )
}
