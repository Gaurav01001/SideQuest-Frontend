import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SocialButtons, AuthCard, ShootingStars } from '@/components/ui/login-1'
import fullChar from '@/assets/images/full_resister_pg1.png'
import peak5Png from '@/assets/images/peak5.png'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import useAuthStore from '@/store/auth.store'

const STEPS = ['Account', 'Profile', 'Done']

const ROLES = [ 'Student', 'Teacher', 'idk Homo sapiens',]
const INTERESTS = ['Food(i mean who does not like food)', 'Engineering', 'Books', 'RockClimbing', 'others',]

export default function Register() {
    const [step, setStep] = useState(0)
    const [form, setForm] = useState({
        email: '', password: '', confirmPassword: '',
        name: '', username: '', role: '', interests: [],
    })
    const [showPass, setShowPass] = useState(false)
    const [localError, setLocalError] = useState('')
    const navigate = useNavigate()

    const register = useAuthStore(state => state.register)
    const loading = useAuthStore(state => state.loading)
    const storeError = useAuthStore(state => state.error)

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
        setLocalError('')
    }

    const toggleInterest = (val) =>
        setForm((p) => ({
            ...p,
            interests: p.interests.includes(val)
                ? p.interests.filter((i) => i !== val)
                : [...p.interests, val],
        }))

    const validateStep0 = () => {
        if (!form.email || !form.password || !form.confirmPassword) return 'All fields required.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email address.'
        if (form.password.length < 8) return 'Password must be at least 8 characters.'
        if (form.password !== form.confirmPassword) return 'Passwords do not match.'
        return null
    }
    const validateStep1 = () => {
        if (!form.name.trim()) return 'Please enter your name.'
        if (!form.username.trim()) return 'Please enter a username.'
        if (!form.role) return 'Please select a role.'
        return null
    }

    const handleNext = () => {
        console.log('[Register] handleNext called, step:', step, 'form:', form)
        const err = step === 0 ? validateStep0() : validateStep1()
        if (err) { setLocalError(err); return }
        setLocalError('')
        setStep(s => s + 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('[Register] handleSubmit triggered')
        console.log('[Register] form data:', JSON.stringify({
            email: form.email,
            password: '***',
            name: form.name,
            username: form.username,
            role: form.role,
        }))
        try {
            console.log('[Register] calling authStore.register()')
            await register({
                email: form.email,
                password: form.password,
                name: form.name,
                username: form.username,
                role: form.role,
                interests: form.interests
            })
            console.log('[Register] register() succeeded, navigating to /feed')
            navigate('/feed')
        } catch (err) {
            console.error('[Register] register() threw error:', err?.response?.data || err?.message || err)
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

    const strengthPct = form.password.length >= 12 ? '100%' : form.password.length >= 8 ? '60%' : form.password.length >= 4 ? '30%' : '0%'
    const strengthColor = form.password.length >= 12 ? '#22c55e' : form.password.length >= 8 ? '#f59e0b' : '#ef4444'

    // Step 0: character panel. Step 1+: just peak5.png full picture
    const rightPanel = step === 0 ? (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <img
                src={fullChar}
                alt="Character"
                style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    height: '95%', objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.25))', zIndex: 2,
                }}
            />
        </div>
    ) : (
        <div style={{
            position: 'relative', width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <img
                src={peak5Png}
                alt="Mountain peak"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center center',
                    zIndex: 2,
                }}
            />
        </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: 'radial-gradient(ellipse at 60% 40%, #e8eaed 0%, #d8dce3 40%, #cdd2da 100%)' }}>
            <ShootingStars />
            <AuthCard rightPanel={rightPanel}>
                {/* Progress stepper */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                                style={{
                                    background: i <= step ? 'var(--color-text-primary)' : 'var(--color-muted-surface)',
                                    color: i <= step ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                                    border: '1.5px solid var(--color-border)',
                                }}
                            >
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span className="text-xs" style={{ color: i <= step ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>{s}</span>
                            {i < STEPS.length - 1 && (
                                <div className="w-8 h-px mx-1" style={{ background: i < step ? 'var(--color-text-primary)' : 'var(--color-border)' }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Error */}
                {(localError || storeError) && (
                    <div className="text-sm px-3 py-2 rounded-lg mb-4" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                        {localError || storeError}
                    </div>
                )}

                {/* ── Step 0: Account ── */}
                {step === 0 && (
                    <div className="flex flex-col gap-4">
                        <div className="text-center mb-1">
                            <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--color-heading)' }}>
                                Create your account 👋
                            </h1>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Real people, real connections
                            </p>
                        </div>

                        <SocialButtons label="or sign up with email" />

                        <Input name="email" type="email" label="Email" placeholder="you@example.com"
                            value={form.email} onChange={handleChange} autoComplete="email" />

                        <div>
                            <Input name="password" type={showPass ? 'text' : 'password'} label="Password"
                                placeholder="Min 8 characters" value={form.password} onChange={handleChange}
                                icon={<EyeIcon />} />
                            {form.password.length > 0 && (
                                <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                                    <div className="h-full rounded-full transition-all duration-300" style={{ width: strengthPct, background: strengthColor }} />
                                </div>
                            )}
                        </div>

                        <Input name="confirmPassword" type={showPass ? 'text' : 'password'} label="Confirm Password"
                            placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} />

                        <Button
                            onClick={handleNext}
                            type="button"
                            color="#f6f6f6ff"
                            style={{ borderRadius: "20px" }}
                        >
                            Continue →
                        </Button>
                        <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--color-text-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </p>
                    </div>
                )}

                {/* ── Step 1: Profile ── */}
                {step === 1 && (
                    <div className="flex flex-col gap-4">
                        <div className="text-center mb-1">
                            <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--color-heading)' }}>
                                Tell us about you 💼
                            </h1>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Personalise your Link Up experience
                            </p>
                        </div>

                        <Input name="name" type="text" label="Full Name" placeholder="Jane Doe"
                            value={form.name} onChange={handleChange} />
                            
                        <Input name="username" type="text" label="Username" placeholder="janedoe123"
                            value={form.username} onChange={handleChange} />

                        <div>
                            <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                Primary Role
                            </label>
                            <select
                                name="role" value={form.role} onChange={handleChange}
                                style={{
                                    width: '100%', height: '52px', borderRadius: '8px', padding: '0 14px',
                                    background: 'var(--color-surface)', border: '2px solid var(--color-border)',
                                    color: form.role ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    fontSize: '15px', outline: 'none',
                                }}
                            >
                                <option value="">Select your role</option>
                                {ROLES.map(r => <option key={r} value={r} style={{ color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}>{r}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                Interests <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>(pick any)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {INTERESTS.map(interest => (
                                    <button
                                        key={interest} type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                                        style={{
                                            background: form.interests.includes(interest) ? 'var(--color-text-primary)' : 'var(--color-muted-surface)',
                                            color: form.interests.includes(interest) ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button type="button" onClick={() => setStep(0)}
                                className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all"
                                style={{ background: 'var(--color-muted-surface)', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                            >
                                ← Back
                            </button>
                            <div className="flex-1">
<Button
  onClick={handleNext}
  type="button"
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
>
  Continue →
</Button>                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Done ── */}
                {step === 2 && (
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 text-center py-4">
                        <div className="text-6xl">🎉</div>
                        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-heading)' }}>
                            You're all set!
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Welcome to Link Up, <strong style={{ color: 'var(--color-text-primary)' }}>{form.name || 'there'}</strong>.
                            Your account is ready.
                        </p>
                        
                        {/* Error Display for Step 2 */}
                        {(localError || storeError) && (
                            <div className="w-full text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                                {localError || storeError}
                            </div>
                        )}

                        <div className="w-full">
                            <Button type="submit" loading={loading}
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
                            >
                                Go to Dashboard →
                            </Button>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            By joining you agree to our{' '}
                            <a href="#" style={{ color: 'var(--color-text-primary)' }}>Terms</a>{' '}and{' '}
                            <a href="#" style={{ color: 'var(--color-text-primary)' }}>Privacy Policy</a>
                        </p>
                    </form>
                )}
            </AuthCard>
        </div>
    )
}
