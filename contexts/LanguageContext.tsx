'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'hi' | 'mr' | 'hi-en' | 'mr-en'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (obj: any, field: string) => string
    labels: Record<string, string>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const UI_LABELS: Record<Language, Record<string, string>> = {
    'en': {
        'start': 'Start Adventure',
        'continue': 'Continue Journey',
        'loading': 'Loading...',
        'story_select': 'Select a Story',
        'scene': 'Scene',
        'score': 'Score',
        'submit': 'Submit',
        'analyzing': 'Analyzing...',
        'situation': 'The Situation',
        'challenge': 'Your Challenge',
        'placeholder': 'Think like a warrior. What would you do?',
        'quick_action': 'Quick Action: Press Ctrl+Enter',
        'victory': 'Journey Complete',
        'choose_adventure': 'CHOOSE YOUR ADVENTURE',
        'select_story_subtitle': 'Select a story to begin your legendary journey',
        'epic_scenes': 'Epic Scenes',
        'begin_story': 'BEGIN STORY',
        'no_adventures': 'No adventures available yet. Check back soon!',
    },
    'hi': {
        'start': 'साहसिक कार्य शुरू करें',
        'continue': 'यात्रा जारी रखें',
        'loading': 'लोड हो रहा है...',
        'story_select': 'एक कहानी चुनें',
        'scene': 'दृश्य',
        'score': 'स्कोर',
        'submit': 'जमा करें',
        'analyzing': 'विश्लेषण कर रहा है...',
        'situation': 'स्थिति',
        'challenge': 'आपकी चुनौती',
        'placeholder': 'एक योद्धा की तरह सोचें। आप क्या करेंगे?',
        'quick_action': 'त्वरित कार्रवाई: Ctrl+Enter दबाएं',
        'victory': 'यात्रा पूरी हुई',
        'choose_adventure': 'अपना साहसिक कार्य चुनें',
        'select_story_subtitle': 'अपनी पौराणिक यात्रा शुरू करने के लिए एक कहानी चुनें',
        'epic_scenes': 'महाकाव्य दृश्य',
        'begin_story': 'कहानी शुरू करें',
        'no_adventures': 'कोई रोमांच उपलब्ध नहीं है। जल्द ही वापस देखें!',
    },
    'mr': {
        'start': 'साहस सुरू करा',
        'continue': 'प्रवास सुरू ठेवा',
        'loading': 'लोड होत आहे...',
        'story_select': 'एक कथा निवडा',
        'scene': 'दृश्य',
        'score': 'गुण',
        'submit': 'सादर करा',
        'analyzing': 'विश्लेषण करत आहे...',
        'situation': 'परिस्थिती',
        'challenge': 'तुमचे आव्हान',
        'placeholder': 'एका मावळ्याप्रमाणे विचार करा. तुम्ही काय कराल?',
        'quick_action': 'जलद कृती: Ctrl+Enter दाबा',
        'victory': 'प्रवास पूर्ण झाला',
        'choose_adventure': 'तुमचे साहस निवडा',
        'select_story_subtitle': 'तुमचा पौराणिक प्रवास सुरू करण्यासाठी एक कथा निवडा',
        'epic_scenes': 'महाकाव्य दृश्ये',
        'begin_story': 'कथा सुरू करा',
        'no_adventures': 'अद्याप कोणतीही कथा उपलब्ध नाही. लवकरच परत तपासा!',
    },
    'hi-en': { // Hinglish
        'start': 'Adventure Shuru Karein',
        'continue': 'Journey Jari Rakhein',
        'loading': 'Loading...',
        'story_select': 'Ek Kahani Chunein',
        'scene': 'Scene',
        'score': 'Score',
        'submit': 'Submit Karein',
        'analyzing': 'Analyzing...',
        'situation': 'Situation',
        'challenge': 'Aapka Challenge',
        'placeholder': 'Ek warrior ki tarah sochein. Aap kya karenge?',
        'quick_action': 'Quick Action: Ctrl+Enter dabayein',
        'victory': 'Journey Complete',
        'choose_adventure': 'APNA ADVENTURE CHUNEIN',
        'select_story_subtitle': 'Apni legendary journey shuru karne ke liye ek story chunein',
        'epic_scenes': 'Epic Scenes',
        'begin_story': 'STORY SHURU KAREIN',
        'no_adventures': 'Koi adventure abhi available nahi hai. Jaldi wapas aayen!',
    },
    'mr-en': { // Marathlish
        'start': 'Adventure Suru Kara',
        'continue': 'Journey Chalu Theva',
        'loading': 'Loading...',
        'story_select': 'Ek Story Nivda',
        'scene': 'Scene',
        'score': 'Score',
        'submit': 'Submit Kara',
        'analyzing': 'Analyzing...',
        'situation': 'Situation',
        'challenge': 'Tumcha Challenge',
        'placeholder': 'Eka mavlya pramane vichar kara. Tumhi kay karal?',
        'quick_action': 'Quick Action: Ctrl+Enter daba',
        'victory': 'Journey Complete',
        'choose_adventure': 'TUMCHA ADVENTURE NIVDA',
        'select_story_subtitle': 'Tumchi legendary journey suru karnyasathi ek story nivda',
        'epic_scenes': 'Epic Scenes',
        'begin_story': 'STORY SURU KARA',
        'no_adventures': 'Ajun konta adventure available nahi. Lavkarach parat check kara!',
    }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    // Persist language choice
    useEffect(() => {
        const saved = localStorage.getItem('app_language') as Language
        if (saved) setLanguage(saved)
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('app_language', lang)
    }

    // Helper to get translated content from an object (Story/Scene)
    // Falls back to base field (usually English) if translation missing
    const t = (obj: any, field: string): string => {
        if (!obj) return ''

        // Check if translations exist and have the current language
        if (obj.translations && obj.translations[language] && obj.translations[language][field]) {
            return obj.translations[language][field]
        }

        // Fallback to direct field (English)
        return obj[field] || ''
    }

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage: handleSetLanguage,
            t,
            labels: UI_LABELS[language]
        }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
