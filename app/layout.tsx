import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'AI CYOA Platform - Interactive Storytelling',
    description: 'Experience immersive interactive storytelling with AI-powered adventures. Create your own legend.',
}

import { LanguageProvider } from '@/contexts/LanguageContext'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    )
}
