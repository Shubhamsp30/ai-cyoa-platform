'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { soundManager } from '@/lib/audio/SoundManager'

export default function AudioControls() {
    const [isMuted, setIsMuted] = useState(false)
    const [voiceEnabled, setVoiceEnabled] = useState(true)

    const toggleMute = () => {
        const newState = !isMuted
        setIsMuted(newState)
        soundManager.setMuted(newState)
    }

    const toggleVoice = () => {
        const newState = !voiceEnabled
        setVoiceEnabled(newState)
        soundManager.setVoiceEnabled(newState)
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            gap: '10px'
        }}>
            <button
                onClick={toggleMute}
                style={{
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    color: !isMuted ? '#40e0d0' : '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease'
                }}
                title="Toggle Sound"
            >
                {isMuted ? '🔇' : '🔊'}
            </button>




        </div>
    )
}
