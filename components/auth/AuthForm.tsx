'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/create-browser-client'
import styles from './AuthForm.module.css'

export default function AuthForm() {
    const router = useRouter()
    const supabase = createClient()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    async function handleAuth(e: React.FormEvent) {
        e.preventDefault()
        console.log('Starting handleAuth...', { isLogin, email, username: !isLogin ? username : 'N/A' })
        setLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            if (isLogin) {
                console.log('Attempting Login...')
                let signInEmail = email

                // Handle username login resolution
                if (!email.includes('@')) {
                    console.log('Login with username detected, looking up email...')
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('email')
                        .ilike('username', email)
                        .single()

                    if (profileError || !profile) {
                        console.error('Username resolution error:', profileError)
                        throw new Error('Username not found')
                    }
                    console.log('Username resolved to email:', profile.email)
                    signInEmail = profile.email
                }

                const { data: signInData, error } = await supabase.auth.signInWithPassword({
                    email: signInEmail,
                    password,
                })
                console.log('SignIn Response:', { user: signInData.user, session: !!signInData.session, error })
                if (error) throw error

                // Hard redirect for session reliability
                window.location.href = '/'
            } else {
                console.log('Attempting SignUp...')
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: {
                            username: username
                        }
                    },
                })
                console.log('SignUp Response:', { user: data.user, session: !!data.session, error })
                if (error) throw error

                if (data.session) {
                    window.location.href = '/'
                } else if (data.user && !data.session) {
                    setIsLogin(true)
                    setSuccessMessage('Account created! Please check your email inbox to verify your account before you can sign in.')
                }
            }
        } catch (error: any) {
            console.error('handleAuth caught error:', error)
            if (error.message === 'Invalid login credentials') {
                setError('Invalid credentials. If you just signed up, please make sure you verified your email link first.')
            } else {
                setError(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.authCard}>
            <div className={styles.scanline}></div>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {isLogin ? 'Welcome Warrior' : 'Join the Resistance'}
                </h2>
            </div>

            <form onSubmit={handleAuth} className={styles.form}>
                {!isLogin && (
                    <div className={styles.inputGroup}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your warrior name"
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
                        placeholder={isLogin ? "Warrior ID or Email" : "your@email.com"}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Password {!isLogin && '(Min 6 chars)'}</label>
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

                {error && <div className={styles.error}>{error}</div>}
                {successMessage && <div className={styles.success}>{successMessage}</div>}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    <span className={styles.btnText}>{loading ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'SIGN UP')}</span>
                </button>
            </form>

            <div className={styles.footer}>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className={styles.toggleBtn}
                >
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span className={styles.toggleHighlight}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </span>
                </button>
            </div>
        </div>
    )
}
