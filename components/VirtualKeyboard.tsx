'use client'
import React, { useState, useEffect } from 'react';

interface VirtualKeyboardProps {
    onKeyPress: (char: string) => void;
    onClose: () => void;
    language: 'hi' | 'mr' | 'en';
}

const ENGLISH_KEYS = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M'
];

const SWAR = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'];
const VYANJAN = [
    'क', 'ख', 'ग', 'घ', 'ङ',
    'च', 'छ', 'ज', 'झ', 'ञ',
    'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म',
    'य', 'र', 'ल', 'व', 'श',
    'ष', 'स', 'ह', 'ळ', 'क्ष', 'ज्ञ'
];
const MATRAS = [
    'ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', '्', '़'
];
const NUMBERS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const NUMBERS_EN = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function VirtualKeyboard({ onKeyPress, onClose, language }: VirtualKeyboardProps) {
    const [activeTab, setActiveTab] = useState<'swar' | 'vyanjan' | 'matra' | 'english'>(
        language === 'en' ? 'english' : 'vyanjan'
    );

    // Sync tab with language changes
    useEffect(() => {
        if (language === 'en') setActiveTab('english');
        else if (activeTab === 'english') setActiveTab('vyanjan');
    }, [language]);

    const handleKeyPress = (char: string) => {
        // Vibrate on mobile/supported devices for feedback
        if (navigator.vibrate) navigator.vibrate(10);
        onKeyPress(char);
    };

    const renderGrid = (chars: string[]) => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
            gap: '8px',
            marginTop: '15px'
        }}>
            {chars.map((char) => (
                <button
                    key={char}
                    onClick={() => handleKeyPress(char)}
                    className="key-button"
                >
                    {char}
                </button>
            ))}
        </div>
    );

    return (
        <div className="virtual-keyboard-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#40e0d0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {language === 'hi' ? 'हिंदी कीबोर्ड' : (language === 'mr' ? 'मराठी कीबोर्ड' : 'ENGLISH KEYBOARD')}
                </h3>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#fff',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    className="hover:bg-red-500/50"
                >
                    ×
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px' }}>
                {language === 'en' ? (
                    <button
                        className="tab-button active"
                        style={{ flex: 1, padding: '10px 0', borderRadius: '8px', border: 'none', background: 'rgba(64, 224, 208, 0.2)', color: '#40e0d0', fontWeight: 'bold' }}
                    >
                        QWERTY
                    </button>
                ) : (
                    ['swar', 'vyanjan', 'matra'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                borderRadius: '8px',
                                border: 'none',
                                background: activeTab === tab ? 'rgba(64, 224, 208, 0.2)' : 'transparent',
                                color: activeTab === tab ? '#40e0d0' : '#9ca3af',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))
                )}
            </div>

            {/* Content Area */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '5px' }} className="custom-scrollbar">
                {activeTab === 'english' && (
                    <>
                        {renderGrid(ENGLISH_KEYS)}
                        <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                            {renderGrid(NUMBERS_EN)}
                        </div>
                    </>
                )}
                {activeTab === 'swar' && (
                    <>
                        {renderGrid(SWAR)}
                        <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '5px' }}>Numbers</div>
                            {renderGrid(NUMBERS)}
                        </div>
                    </>
                )}
                {activeTab === 'vyanjan' && renderGrid(VYANJAN)}
                {activeTab === 'matra' && renderGrid(MATRAS)}
            </div>

            {/* Bottom Controls (Space & Backspace) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '10px',
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <button
                    onClick={() => handleKeyPress('SPACE')}
                    className="key-button space-key"
                >
                    Space
                </button>
                <button
                    onClick={() => handleKeyPress('BACKSPACE')}
                    className="key-button backspace-key"
                    title="Backspace"
                >
                    ⌫
                </button>
            </div>

            <style jsx>{`
                .virtual-keyboard-container {
                    position: fixed !important;
                    bottom: 30px !important;
                    right: 30px !important;
                    width: calc(100% - 60px) !important;
                    max-width: 500px !important;
                    background: #0a0a0f !important;
                    backdrop-filter: blur(40px) !important;
                    -webkit-backdrop-filter: blur(40px);
                    border: 2px solid #40e0d0 !important;
                    border-radius: 20px !important;
                    padding: 24px !important;
                    box-shadow: 0 0 100px rgba(0, 0, 0, 1), 
                                0 0 40px rgba(64, 224, 208, 0.4) !important;
                    z-index: 2147483647 !important; /* MAXIMUM POSSIBLE D-INDEX */
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    color: white !important;
                    pointer-events: auto !important;
                    user-select: none;
                    transform: none !important; /* Force out of perspective */
                }

                @keyframes slideUp {
                    from { transform: translateY(50px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }

                .key-button {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    color: #e5e7eb;
                    font-size: 1.25rem;
                    cursor: pointer;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.1s ease;
                    box-shadow: 0 4px 0 rgba(0,0,0,0.2);
                    position: relative;
                    user-select: none;
                }

                .key-button:active {
                    transform: translateY(3px);
                    box-shadow: 0 1px 0 rgba(0,0,0,0.2);
                    background: rgba(255, 255, 255, 0.08);
                }
                
                .key-button:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .space-key {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #9ca3af;
                }

                .backspace-key {
                    width: 60px;
                    background: rgba(239, 68, 68, 0.15);
                    border-color: rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                }
                
                .backspace-key:hover {
                    background: rgba(239, 68, 68, 0.25);
                }

                /* Custom Scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                @media (max-width: 600px) {
                    .virtual-keyboard-container {
                        bottom: 0;
                        right: 0;
                        left: 0;
                        width: 100%;
                        max-width: 100%;
                        border-radius: 20px 20px 0 0;
                        border-bottom: none;
                        padding-bottom: 30px; /* Safe area */
                    }
                }
            `}</style>
        </div>
    );
}
