
import AuthForm from '@/components/auth/AuthForm'
import styles from './page.module.css'

export default function LoginPage() {
    return (
        <main className={styles.main}>
            {/* Background Animation */}
            <div className={styles.background}>
                <div className={styles.orb1}></div>
                <div className={styles.orb2}></div>
            </div>

            <div className={styles.content}>
                <AuthForm />
            </div>
        </main>
    )
}
