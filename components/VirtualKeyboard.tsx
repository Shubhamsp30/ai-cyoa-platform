import React, { useState } from 'react';

interface VirtualKeyboardProps {
    onKeyPress: (char: string) => void;
    onClose: () => void;
    language: 'hi' | 'mr';
}

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

export default function VirtualKeyboard({ onKeyPress, onClose, language }: VirtualKeyboardProps) {
    const [activeTab, setActiveTab] = useState<'swar' | 'vyanjan' | 'matra'>('vyanjan');

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
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {language === 'hi' ? 'हिंदी कीबोर्ड' : 'मराठी कीबोर्ड'}
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
                {['swar', 'vyanjan', 'matra'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        style={{
                            flex: 1,
                            padding: '10px 0',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === tab ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                            color: activeTab === tab ? '#fbbf24' : '#9ca3af',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
                        }}
                    >
                        {tab === 'swar' ? 'Swar' : tab === 'vyanjan' ? 'Vyanjan' : 'Matra'}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '5px' }} className="custom-scrollbar">
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
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: calc(100% - 40px);
                    max-width: 480px;
                    background: rgba(15, 15, 20, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    z-index: 9999;
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    color: white;
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
