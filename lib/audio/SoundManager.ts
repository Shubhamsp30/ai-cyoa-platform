'use client'

class SoundManager {
    private bgm: HTMLAudioElement | null = null
    private sfx: HTMLAudioElement | null = null
    private synth: SpeechSynthesis | null = null
    private voices: SpeechSynthesisVoice[] = []

    private isMuted: boolean = false
    private isVoiceEnabled: boolean = true
    private volume: number = 0.5 // Default reasonable volume

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

    private bgmOscillators: OscillatorNode[] = []
    private bgmGain: GainNode | null = null

    playBGM(filename: string) {
        if (this.isMuted) return

        // Stop ANY existing BGM (file or synthetic)
        this.stopBGM()

        try {
            const ctx = this.getAudioContext()
            if (ctx.state === 'suspended') ctx.resume()

            // Create a dark ambient drone
            const osc1 = ctx.createOscillator()
            const osc2 = ctx.createOscillator()
            const gain = ctx.createGain()

            // Low drone
            osc1.type = 'triangle'
            osc1.frequency.setValueAtTime(55, ctx.currentTime) // A1

            // Subtledetuning
            osc2.type = 'sine'
            osc2.frequency.setValueAtTime(55.5, ctx.currentTime)

            // Low pass filter for "muffled/distant" war sound
            const filter = ctx.createBiquadFilter()
            filter.type = 'lowpass'
            filter.frequency.setValueAtTime(200, ctx.currentTime)

            // Connections
            osc1.connect(filter)
            osc2.connect(filter)
            filter.connect(gain)
            gain.connect(ctx.destination)

            // Fade in
            gain.gain.setValueAtTime(0, ctx.currentTime)
            gain.gain.linearRampToValueAtTime(0.1 * this.volume, ctx.currentTime + 2)

            osc1.start()
            osc2.start()

            this.bgmOscillators = [osc1, osc2]
            this.bgmGain = gain

        } catch (e) {
            console.error('Synthetic BGM failed:', e)
        }
    }

    stopBGM() {
        if (this.bgm) {
            this.fadeOutAndStop(this.bgm)
            this.bgm = null
        }
        // Stop synthetic
        this.bgmOscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect() } catch (e) { }
        })
        this.bgmOscillators = []
        if (this.bgmGain) {
            this.bgmGain.disconnect()
            this.bgmGain = null
        }
    }

    private audioContext: AudioContext | null = null

    private getAudioContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        return this.audioContext
    }

    playTone(type: 'success' | 'error' | 'click' | 'intro' | 'scene_transition') {
        if (this.isMuted) return
        try {
            const ctx = this.getAudioContext()

            // Auto-resume if suspended (browser autoplay policy)
            if (ctx.state === 'suspended') {
                ctx.resume().catch(e => console.warn('Audio resume failed:', e))
            }

            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.connect(gain)
            gain.connect(ctx.destination)

            const now = ctx.currentTime

            if (type === 'success') {
                // VICTORY FANFARE (Arpeggio)
                // C5 -> E5 -> G5 -> C6
                const t = now
                const notes = [523.25, 659.25, 783.99, 1046.50]

                // We need multiple oscillators for a chord/arpeggio, OR fast sequence
                // Let's do a fast sequence with one osc to keep it simple but distinct
                osc.type = 'square' // Square wave cuts through better like an 8-bit game

                osc.frequency.setValueAtTime(notes[0], t)
                osc.frequency.setValueAtTime(notes[1], t + 0.1)
                osc.frequency.setValueAtTime(notes[2], t + 0.2)
                osc.frequency.setValueAtTime(notes[3], t + 0.3)

                gain.gain.setValueAtTime(0.3 * this.volume, t)
                gain.gain.setValueAtTime(0.3 * this.volume, t + 0.3)
                gain.gain.exponentialRampToValueAtTime(0.01, t + 1.0) // Longer tail

                osc.start(t)
                osc.stop(t + 1.0)
            }
            else if (type === 'error') {
                // LOW BUZZ
                osc.type = 'sawtooth'
                osc.frequency.setValueAtTime(150, now)
                osc.frequency.linearRampToValueAtTime(100, now + 0.5)

                gain.gain.setValueAtTime(0.4 * this.volume, now) // Much louder error
                gain.gain.linearRampToValueAtTime(0.01, now + 0.5)

                osc.start(now)
                osc.stop(now + 0.5)
            }
            else if (type === 'click') {
                // Short blip
                osc.type = 'triangle'
                osc.frequency.setValueAtTime(800, now)

                gain.gain.setValueAtTime(0.2 * this.volume, now) // Boosted click
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

                osc.start(now)
                osc.stop(now + 0.1)
            }
            else if (type === 'intro') {
                // Intro sweep
                osc.type = 'sine'
                osc.frequency.setValueAtTime(220, now)
                osc.frequency.exponentialRampToValueAtTime(880, now + 1.0)

                gain.gain.setValueAtTime(0, now)
                gain.gain.linearRampToValueAtTime(0.1 * this.volume, now + 0.5)
                gain.gain.linearRampToValueAtTime(0, now + 1.0)

                osc.start(now)
                osc.stop(now + 1.0)
            }
            else if (type === 'scene_transition') {
                // ... same implementation ...
                osc.type = 'triangle'
                osc.frequency.setValueAtTime(100, now)
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.3)

                gain.gain.setValueAtTime(0, now)
                gain.gain.linearRampToValueAtTime(0.05 * this.volume, now + 0.15)
                gain.gain.linearRampToValueAtTime(0, now + 0.3)

                osc.start(now)
                osc.stop(now + 0.3)
            }
            else if (type === 'click') {
                // ... telex blip ...
                osc.type = 'square'
                osc.frequency.setValueAtTime(1200, now)

                gain.gain.setValueAtTime(0.05 * this.volume, now)
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

                osc.start(now)
                osc.stop(now + 0.05)
            }

        } catch (e) {
            console.error('Web Audio API error:', e)
        }
    }

    playSFX(filename: string) {
        if (this.isMuted) return

        // Map existing filenames to synthetic tones
        if (filename.includes('success')) {
            this.playTone('success')
            return
        }
        if (filename.includes('error')) {
            this.playTone('error')
            return
        }

        // Fallback to file if it exists (for legacy support)
        const effect = new Audio(`/audio/${filename}`)
        effect.volume = Math.min(1, this.volume)
        effect.play().catch(() => {
            // If file missing, fallback to click
            this.playTone('click')
        })
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
        // Selective Speech Filter: Only allow English and Phonetic Latin scripts
        const supportedLanguages = ['en', 'hi-en', 'mr-en'];
        if (!supportedLanguages.includes(language)) {
            console.warn(`SoundManager: Speak blocked. Language [${language}] is not supported for AI narration.`);
            return;
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

    stopSpeaking() {
        if (this.synth) {
            this.synth.cancel()
        }
    }

    get isSpeaking() {
        return this.synth ? this.synth.speaking : false
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
