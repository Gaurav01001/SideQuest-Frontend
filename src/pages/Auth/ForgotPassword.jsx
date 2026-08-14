import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthCard, ShootingStars } from '@/components/ui/login-1'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { forgotPassword } from '@/services/auth.service'
import fullChar from '@/assets/images/full_resister_pg1.png'

const FORGOT_RIGHT_PANEL = (
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

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) {
            setError('Please enter your email address.')
            setSuccess('')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const data = await forgotPassword(email)
            setSuccess(data.message || 'If a matching account is found, a password reset link has been sent to your email.')
            setEmail('')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 relative"
            style={{
                background: 'radial-gradient(ellipse at 60% 40%, #e8eaed 0%, #d8dce3 40%, #cdd2da 100%)',
            }}
        >
            <ShootingStars />
            <AuthCard rightPanel={FORGOT_RIGHT_PANEL}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    {/* Header */}
                    <div className="text-center mb-2">
                        <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-heading)' }}>
                            Forgot Password? 🔑
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            Enter your email and we'll send you a password reset link.
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
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess('') }}
                        autoComplete="email"
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
                    >
                        Send Reset Link
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
