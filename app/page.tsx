'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import styles from './page.module.css'
import { soundManager } from '@/lib/audio/SoundManager'

import LanguageSelector from '@/components/ui/LanguageSelector'

export default function Home() {
  const router = useRouter()

  return (
    <main className={styles.main}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <LanguageSelector />
      </div>

      {/* Animated Background */}
      <div className={styles.bgAnimation}></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Decorative Top Element */}
          <div className={styles.decorativeTop}>
            <span className={styles.ornament}>⚔️</span>
            <div className={styles.divider}></div>
            <span className={styles.ornament}>⚔️</span>
          </div>

          <h1 className={styles.mainTitle}>
            <span className={styles.titleWord}>EPIC</span>
            <span className={styles.titleWord}>ADVENTURES</span>
            <span className={styles.titleWord}>AWAIT</span>
          </h1>

          <div className={styles.taglineContainer}>
            <div className={styles.taglineLine}></div>
            <h2 className={styles.tagline}>Your Choices. Your Legend.</h2>
            <div className={styles.taglineLine}></div>
          </div>

          <div className={styles.ctaSection}>
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <Button
                size="lg"
                onClick={() => {
                  soundManager.playTone('intro')
                  router.push('/game/stories')
                }}
                className={styles.mainCta}
              >
                <span className={styles.ctaIcon}>⚡</span>
                SOLO ADVENTURE
                <span className={styles.ctaIcon}>⚡</span>
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  soundManager.playTone('click')
                  router.push('/multiplayer')
                }}
                className={styles.mainCta}
                style={{ background: 'rgba(64, 224, 208, 0.2)', borderColor: '#40e0d0', color: '#40e0d0' }}
              >
                <span className={styles.ctaIcon}>🤝</span>
                MULTIPLAYER PARTY
                <span className={styles.ctaIcon}>🤝</span>
              </Button>
            </div>

            <div className={styles.authButtons}>
              <Button
                variant="outline"
                onClick={() => router.push('/game/profile')}
                className={styles.authBtn}
              >
                My Profile
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        textAlign: 'center',
        zIndex: 10,
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.4)',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem'
      }}>
        <a href="/game/rules" className={styles.footerLink}>Rules & Guide</a>
        <a href="/legal/terms" className={styles.footerLink}>Terms & Conditions</a>
        <span>© 2026 AI Adventures</span>
      </footer>
    </main>
  )
}
