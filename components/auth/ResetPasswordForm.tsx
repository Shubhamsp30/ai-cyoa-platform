'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/create-browser-client'
import styles from './AuthForm.module.css'

export default function ResetPasswordForm() {
    const router = useRouter()
    const supabase = createClient()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleReset(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Passwords don't match")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })
            if (error) throw error
            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (error: any) {
            console.error('Reset password error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className={styles.authCard}>
                <div className={styles.scanline}></div>
                <div className={styles.header}>
                    <h2 className={styles.title}>SUCCESS</h2>
                </div>
                <div className={styles.success}>
                    Password updated successfully! Redirecting you to login...
                </div>
            </div>
        )
    }

    return (
        <div className={styles.authCard}>
            <div className={styles.scanline}></div>
            <div className={styles.header}>
                <h2 className={styles.title}>SET NEW INTEL</h2>
            </div>

            <form onSubmit={handleReset} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>New Password</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Confirm Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    <span className={styles.btnText}>{loading ? 'UPDATING...' : 'UPDATE PASSWORD'}</span>
                </button>
            </form>
        </div>
    )
}
