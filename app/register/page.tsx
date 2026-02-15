'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import styles from '../login/auth.module.css'

export default function RegisterPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Register user
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                    },
                },
            })

            if (signUpError) throw signUpError

            if (data.user) {
                // Profile is auto-created by trigger
                router.push('/game/character-select')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to register')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.authMain}>
            <div className={styles.authContainer}>
                <Card className={styles.authCard}>
                    <h1 className="text-center">Begin Your Journey</h1>
                    <p className={styles.authSubtitle}>
                        Create an account to experience the legend of Tanaji Malusare
                    </p>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleRegister} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Choose a username"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="At least 6 characters"
                                className={styles.input}
                            />
                        </div>

                        <Button type="submit" size="lg" disabled={loading} className={styles.submitBtn}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    <p className={styles.authFooter}>
                        Already have an account?{' '}
                        <a href="/auth/login" className={styles.link}>
                            Login here
                        </a>
                    </p>
                </Card>
            </div>
        </main>
    )
}
