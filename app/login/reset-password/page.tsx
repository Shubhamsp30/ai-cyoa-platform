import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import styles from './page.module.css'

export default function ResetPasswordPage() {
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
                <ResetPasswordForm />
            </div>
        </main>
    )
}
