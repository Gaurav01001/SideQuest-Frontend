import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthCard, ShootingStars } from '@/components/ui/login-1'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { resetPassword } from '@/services/auth.service'
import fullChar from '@/assets/images/full_resister_pg1.png'

const RESET_RIGHT_PANEL = (
    <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
    }}>
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
)

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()

    const [form, setForm] = useState({ password: '', confirmPassword: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (!token) {
            setError('Reset token is missing or invalid. Please request a new link.')
        }
    }, [token])

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!token) {
            setError('Reset token is missing or invalid. Please request a new link.')
            return
        }
        if (!form.password || !form.confirmPassword) {
            setError('Please fill in all fields.')
            return
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            await resetPassword(token, form.password)
            setSuccess('Password has been reset successfully. Redirecting you to login...')
            setForm({ password: '', confirmPassword: '' })
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
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

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 relative"
            style={{
                background: 'radial-gradient(ellipse at 60% 40%, #e8eaed 0%, #d8dce3 40%, #cdd2da 100%)',
            }}
        >
            <ShootingStars />
            <AuthCard rightPanel={RESET_RIGHT_PANEL}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    {/* Header */}
                    <div className="text-center mb-2">
                        <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-heading)' }}>
                            Reset Password 🔒
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            Choose a secure new password for your account.
                        </p>
                    </div>

                    {/* Status Messages */}
                    {error && (
                        <div className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                            {success}
                        </div>
                    )}

                    {/* Fields */}
                    <Input
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        label="New Password"
                        placeholder="At least 6 characters"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        icon={<EyeIcon />}
                        disabled={!token}
                    />
                    <Input
                        name="confirmPassword"
                        type={showPass ? 'text' : 'password'}
                        label="Confirm New Password"
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        disabled={!token}
                    />

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
                        type="submit"
                        loading={loading}
                        variant="primary"
                        disabled={!token}
                    >
                        Reset Password
                    </Button>

                    {/* Switch */}
                    <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Remember your password?{' '}
                        <Link to="/login" style={{ color: 'var(--color-text-primary)', fontWeight: 600, textDecoration: 'none' }}>
                            Back to Login
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </div>
    )
}
