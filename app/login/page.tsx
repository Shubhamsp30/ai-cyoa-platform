import AuthForm from '@/components/auth/AuthForm'
import styles from './page.module.css'

export default function LoginPage() {
    return (
        <main className={styles.main}>
            {/* Tactical Layer: Hex Grid */}
            <div className={styles.hudGrid}></div>

            {/* Atmospheric Layer: Animated Embers */}
            <div className={styles.emberContainer}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={styles.ember}></div>
                ))}
            </div>

            <div className={styles.content}>
                <AuthForm />
            </div>
        </main>
    )
}
