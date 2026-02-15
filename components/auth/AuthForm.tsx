
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/create-browser-client'
import Button from '@/components/ui/Button'
import styles from './AuthForm.module.css'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                let signInEmail = email

                // If input doesn't look like an email, assume it's a username and try to resolve it
                if (!email.includes('@')) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('email')
                        .ilike('username', email) // Case-insensitive lookup
                        .single()

                    if (profileError || !profile) {
                        throw new Error('Username not found')
                    }
                    signInEmail = profile.email
                }

                const { error } = await supabase.auth.signInWithPassword({
                    email: signInEmail,
                    password,
                })
                if (error) throw error
                router.push('/')
                router.refresh()
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                        data: {
                            username: username
                        }
                    },
                })
                if (error) throw error
                // Auto-confirm should log them in immediately, but if not:
                if (data.session) {
                    router.push('/')
                    router.refresh()
                } else {
                    // Switch to login mode and show success message
                    setIsLogin(true)
                    setError('Account created! Please sign in.')
                }
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

            <form onSubmit={handleAuth} className={styles.form}>
                {!isLogin && (
                    <div className={styles.inputGroup}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="HeroName"
                            required
                        />
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <label>{isLogin ? 'Email or Username' : 'Email'}</label>
                    <input
                        type={isLogin ? "text" : "email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isLogin ? "HeroName or you@example.com" : "you@example.com"}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>
                        Password
                        {!isLogin && <span style={{ fontSize: '0.7rem', color: '#aaa', marginLeft: '8px' }}>(min 6 chars)</span>}
                    </label>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Hide Password" : "Show Password"}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <Button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
            </form>

            <button
                onClick={() => setIsLogin(!isLogin)}
                className={styles.toggleBtn}
            >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
        </div>
    )
}
