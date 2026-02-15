'use client'

class SoundManager {
    private bgm: HTMLAudioElement | null = null
    private sfx: HTMLAudioElement | null = null
    private synth: SpeechSynthesis | null = null
    private voices: SpeechSynthesisVoice[] = []

    private isMuted: boolean = false
    private isVoiceEnabled: boolean = true
    private volume: number = 1.0 // Increased from 0.5 to 1.0

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis
            // Load voices
            if (this.synth) {
                this.voices = this.synth.getVoices()
                if (this.voices.length === 0) {
                    this.synth.onvoiceschanged = () => {
                        this.voices = this.synth!.getVoices()
                    }
                }
            }
        }
    }

    setMuted(muted: boolean) {
        this.isMuted = muted
        if (this.bgm) this.bgm.muted = muted
        if (this.synth) {
            if (muted) this.synth.cancel()
        }
    }

    setVoiceEnabled(enabled: boolean) {
        this.isVoiceEnabled = enabled
        if (!enabled && this.synth) {
            this.synth.cancel()
        }
    }

    playBGM(filename: string) {
        if (this.isMuted) return

        // Stop previous BGM if different
        if (this.bgm && !this.bgm.src.includes(filename)) {
            this.fadeOutAndStop(this.bgm)
        }

        // Create new BGM if not exists or different
        if (!this.bgm || !this.bgm.src.includes(filename)) {
            this.bgm = new Audio(`/audio/${filename}`)
            this.bgm.loop = true
            this.bgm.volume = 0
            this.bgm.play().catch(e => console.log('Autoplay prevented:', e))
            this.fadeIn(this.bgm)
        }
    }

    playSFX(filename: string) {
        if (this.isMuted) return

        const effect = new Audio(`/audio/${filename}`)
        effect.volume = Math.min(1, this.volume) // Max volume 1.0
        effect.play().catch(e => console.log('SFX Play failed:', e))
    }

    speak(text: string, language: string = 'en') {
        if (this.isMuted) {
            console.warn('SoundManager: Speak blocked because muted.')
            return
        }
        if (!this.isVoiceEnabled) {
            console.warn('SoundManager: Speak blocked because voice disabled.')
            return
        }
        if (!this.synth) {
            console.error('SoundManager: No SpeechSynthesis available.')
            return
        }

        // Retry getting voices if empty
        if (this.voices.length === 0) {
            this.voices = this.synth.getVoices()
            // Log available voices to console for debugging
            console.log("SoundManager: Available voices:", this.voices.map(v => `${v.name} (${v.lang})`))
        }

        console.log(`SoundManager: Speaking [${language}]...`, text.substring(0, 20) + '...')
        this.synth.cancel() // Stop previous speech

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.volume = this.volume
        utterance.rate = 1.0 // slightly slower for non-native languages if needed? No, 1.0 is standard.
        utterance.pitch = 1.0

        // Map short codes to locales
        let targetLocale = 'en-US'
        if (language === 'hi') targetLocale = 'hi-IN'
        if (language === 'mr') targetLocale = 'mr-IN' // Try Marathi first, fallback to Hindi if needed

        utterance.lang = targetLocale

        // Try to find a voice that matches the locale
        let voice = this.voices.find(v => v.lang === targetLocale || v.lang.replace('_', '-') === targetLocale)
            || this.voices.find(v => v.name.toLowerCase().includes(language === 'hi' ? 'hindi' : (language === 'mr' ? 'marathi' : 'english')))
            || this.voices.find(v => v.lang.startsWith(language))

        // Specifically for Marathi/Hindi fallback if perfect match fails
        if (!voice && (language === 'mr' || language === 'hi')) {
            // Fallback: Use *any* Indian voice (often Hindi can read Marathi script reasonably well)
            voice = this.voices.find(v => v.lang === 'hi-IN' || v.lang === 'mr-IN' || v.name.includes('India'))
        }

        // Default English fallback ONLY if we are requesting English
        if (!voice && language === 'en') {
            voice = this.voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft David')) || this.voices[0]
        }
        // If language is Hindi/Marathi and NO voice found, let browser use default for that locale (utterance.lang)
        // Do NOT force English voice, as it cannot read Devanagari script.

        if (voice) {
            utterance.voice = voice
            console.log('SoundManager: Using voice:', voice.name, voice.lang)
        } else {
            console.warn('SoundManager: No specific voice found, using system default for locale:', targetLocale)
        }

        utterance.onstart = () => console.log('SoundManager: Speech started')
        utterance.onend = () => console.log('SoundManager: Speech ended')
        utterance.onerror = (e) => console.error('SoundManager: Speech error', e)

        this.synth.speak(utterance)
    }

    stopAll() {
        if (this.bgm) {
            this.bgm.pause()
            this.bgm = null
        }
        if (this.synth) {
            this.synth.cancel()
        }
    }

    private fadeIn(audio: HTMLAudioElement) {
        let vol = 0
        const interval = setInterval(() => {
            if (vol < this.volume) {
                vol += 0.05
                audio.volume = Math.min(vol, this.volume)
            } else {
                clearInterval(interval)
            }
        }, 100)
    }

    private fadeOutAndStop(audio: HTMLAudioElement) {
        let vol = audio.volume
        const interval = setInterval(() => {
            if (vol > 0) {
                vol -= 0.05
                audio.volume = Math.max(0, vol)
            } else {
                clearInterval(interval)
                audio.pause()
            }
        }, 100)
    }
}

// Singleton instance
export const soundManager = new SoundManager()
