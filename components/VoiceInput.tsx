import React, { useState, useEffect } from 'react';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    language: string;
    onStateChange?: (isListening: boolean) => void;
}

export default function VoiceInput({ onTranscript, language, onStateChange }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    const callbackRef = React.useRef({ onTranscript, onStateChange });

    useEffect(() => {
        callbackRef.current = { onTranscript, onStateChange };
    }, [onTranscript, onStateChange]);

    useEffect(() => {
        let recognitionInstance: any = null;

        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = false;
                recognitionInstance.interimResults = true;
                recognitionInstance.lang = language || 'en-US';

                recognitionInstance.onstart = () => {
                    setIsListening(true);
                    callbackRef.current.onStateChange?.(true);
                };

                recognitionInstance.onend = () => {
                    setIsListening(false);
                    callbackRef.current.onStateChange?.(false);
                };

                recognitionInstance.onresult = (event: any) => {
                    const result = event.results[event.resultIndex];
                    const transcript = result[0].transcript;

                    if (result.isFinal) {
                        callbackRef.current.onTranscript(transcript);
                    }
                };

                recognitionInstance.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                    callbackRef.current.onStateChange?.(false);
                };

                setRecognition(recognitionInstance);
            }
        }

        return () => {
            if (recognitionInstance) recognitionInstance.abort();
        };
    }, [language]);

    const toggleListening = () => {
        if (!recognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.lang = language || 'en-US';
            try {
                recognition.start();
            } catch (e) {
                console.error(e);
            }
        }
    };

    if (!recognition) return null;

    return (
        <button
            onClick={toggleListening}
            style={{
                background: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                border: isListening ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '1.2rem',
                transition: 'all 0.2s',
                marginLeft: '10px'
            }}
            title={isListening ? "Listening..." : "Click to Speak"}
            className={isListening ? "animate-pulse" : ""}
        >
            {isListening ? '⏹️' : '🎤'}
        </button>
    );
}
