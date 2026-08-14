import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SocialButtons, AuthCard, ShootingStars } from '@/components/ui/login-1'
import fullChar from '@/assets/images/full_resister_pg1.png'
import peak5Png from '@/assets/images/peak5.png'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import useAuthStore from '@/store/auth.store'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [localError, setLocalError] = useState('')
    const [showPeak, setShowPeak] = useState(false)
    const navigate = useNavigate()

    const login = useAuthStore(state => state.login)
    const loading = useAuthStore(state => state.loading)
    const storeError = useAuthStore(state => state.error)

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
        setLocalError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) {
            setLocalError('Please fill in all fields.')
            return
        }
        
        try {
            await login({ email: form.email, password: form.password })
            navigate('/feed')
        } catch (err) {
            // error is handled by the store, but we can catch to prevent navigation
        }
    }

    const EyeIcon = () => (
        <button type="button" onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {showPass ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            )}
        </button>
    )

    const rightPanel = !showPeak ? (
        <div 
            onClick={() => setShowPeak(true)}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                cursor: 'pointer',
            }}
        >
            <img
                src={fullChar}
                alt="Character"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: '95%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.55))',
                    zIndex: 2,
                }}
            />
        </div>
    ) : (
        <div 
            onClick={() => setShowPeak(false)}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '24px',
            }}
        >
            <img
                src={peak5Png}
                alt="Mount Dhaulagiri"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center center',
                    zIndex: 2,
                    borderRadius: '12px',
                    filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.35))',
                }}
            />
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3,
                background: 'rgba(20, 20, 18, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '8px 20px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
            }}>
                <span style={{
                    color: '#F0EEE9',
                    fontSize: '15px',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                }}>
                    Mount Dhaulagiri
                </span>
            </div>
        </div>
    )

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 relative"
            style={{
                background: 'radial-gradient(ellipse at 60% 40%, #e8eaed 0%, #d8dce3 40%, #cdd2da 100%)',
            }}
        >
            <ShootingStars />
            <AuthCard rightPanel={rightPanel}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    {/* Header */}
                    <div className="text-center mb-2">
                        <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-heading)' }}>
                            Hi, Welcome Back! 👋
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            Login to continue to Link Up
                        </p>
                    </div>

                    {/* Social */}
                    <SocialButtons label="or sign in with email" />

                    {/* Error */}
                    {(localError || storeError) && (
                        <div className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                            {localError || storeError}
                        </div>
                    )}

                    {/* Fields */}
                    <Input
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                    <Input
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        label="Password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        icon={<EyeIcon />}
                    />

                    {/* Forgot */}
                    <div className="text-right -mt-2">
                        <Link to="/forgot-password" className="text-sm" style={{ color: 'var(--color-text-secondary)' }}
                            onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
                            onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <Button
                      color="#64978b"
  style={{
    background: "linear-gradient(135deg, #64978b, #4f7d72)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(100, 151, 139, 0.3)",
    transition: "all 0.2s ease",
  }}

                    type="submit" loading={loading} variant="primary">
                        Sign In
                    </Button>

                    {/* Switch */}
                    <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--color-text-primary)', fontWeight: 600, textDecoration: 'none' }}>
                            Sign Up
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </div>
    )
}
