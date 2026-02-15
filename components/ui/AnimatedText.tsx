'use client'

import { useEffect, useState } from 'react'

interface AnimatedTextProps {
    text: string
    delay?: number
}

export default function AnimatedText({ text, delay = 60 }: AnimatedTextProps) {
    const [words, setWords] = useState<string[]>([])

    useEffect(() => {
        setWords(text.split(' '))
    }, [text])

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
