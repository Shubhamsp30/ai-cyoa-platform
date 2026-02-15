'use client'

import { useLanguage, Language } from '@/contexts/LanguageContext'
import { useState } from 'react'

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🚩' },
    { code: 'hi-en', label: 'Hinglish', flag: '🗣️' },
    { code: 'mr-en', label: 'Marathlish', flag: '🗣️' },
]

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div style={{ position: 'relative', zIndex: 1000 }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50px',
                    padding: '8px 16px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                <span>{LANGUAGES.find(l => l.code === language)?.flag}</span>
                <span style={{ fontWeight: 600 }}>{LANGUAGES.find(l => l.code === language)?.label}</span>
                <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>▼</span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    background: 'rgba(15, 15, 30, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    minWidth: '160px',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code)
                                setIsOpen(false)
                            }}
                            style={{
                                background: language === lang.code ? 'rgba(64, 224, 208, 0.2)' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                color: language === lang.code ? '#40e0d0' : '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                textAlign: 'left',
                                fontSize: '0.95rem',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (language !== lang.code)
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                            }}
                            onMouseLeave={(e) => {
                                if (language !== lang.code)
                                    e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                            <span>{lang.label}</span>
                            {language === lang.code && <span style={{ marginLeft: 'auto' }}>✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
