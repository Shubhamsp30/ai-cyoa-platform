'use client'

import { useEffect, useState } from 'react'
import { soundManager } from '@/lib/audio/SoundManager'

interface AnimatedTextProps {
    text: string
    delay?: number
}

export default function AnimatedText({ text, delay = 60 }: AnimatedTextProps) {
    const [words, setWords] = useState<string[]>([])

    useEffect(() => {
        setWords(text.split(' '))
    }, [text])

    useEffect(() => {
        if (words.length > 0) {
            // Play a soft typewriter blip for each word
            words.forEach((_, index) => {
                setTimeout(() => {
                    soundManager.playTone('click')
                }, index * delay)
            })
        }
    }, [words, delay])

    return (
        <>
            {words.map((word, index) => (
                <span
                    key={`${word}-${index}`}
                    style={{
                        display: 'inline-block',
                        marginRight: '0.35em',
                        opacity: 0,
                        animation: `fadeInWord 0.5s ease-out ${index * delay}ms forwards`
                    }}
                >
                    {word}
                </span>
            ))}
        </>
    )
}
