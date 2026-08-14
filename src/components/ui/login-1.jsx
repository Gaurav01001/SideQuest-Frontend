// login-1.jsx — converted from TSX; removed: next/image, 'use client', TypeScript types
// Exposes: AppInput, AuthCard, SocialButtons, AuthDivider, ShootingStars

import { useState } from 'react'

/* ── Shooting star dots for the auth page background ── */
// Pre-seeded positions so they never scramble on re-render
const STARS = [
    { top: '8%', left: '12%', delay: '0s', dur: '1.8s', size: 3 },
    { top: '22%', left: '55%', delay: '0.5s', dur: '2.1s', size: 2.5 },
    { top: '5%', left: '80%', delay: '1.1s', dur: '1.6s', size: 2 },
    { top: '40%', left: '5%', delay: '1.7s', dur: '2.0s', size: 3 },
    { top: '60%', left: '30%', delay: '0.3s', dur: '1.9s', size: 2.5 },
    { top: '75%', left: '70%', delay: '2.2s', dur: '1.7s', size: 2 },
    { top: '15%', left: '40%', delay: '2.8s', dur: '2.2s', size: 3 },
    { top: '50%', left: '88%', delay: '0.9s', dur: '1.5s', size: 2 },
    { top: '85%', left: '20%', delay: '1.4s', dur: '2.0s', size: 2.5 },
    { top: '30%', left: '62%', delay: '3.1s', dur: '1.8s', size: 2 },
    { top: '70%', left: '45%', delay: '0.7s', dur: '2.3s', size: 3 },
    { top: '92%', left: '78%', delay: '2.5s', dur: '1.6s', size: 2.5 },
    { top: '48%', left: '18%', delay: '1.9s', dur: '2.1s', size: 2 },
    { top: '18%', left: '95%', delay: '3.5s', dur: '1.7s', size: 3 },
]

export function ShootingStars() {
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            <style>{`
                @keyframes shootStar {
                    0%   { transform: translate(0, 0) scaleX(1);   opacity: 0; }
                    8%   { opacity: 1; }
                    100% { transform: translate(220px, 160px) scaleX(12); opacity: 0; }
                }
            `}</style>
            {STARS.map((s, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        top: s.top,
                        left: s.left,
                        width: s.size,
                        height: s.size,
                        borderRadius: '50%',
                        background: 'rgba(45, 55, 72, 0.72)',
                        boxShadow: '0 0 3px rgba(45,55,72,0.35)',
                        transformOrigin: 'left center',
                        animation: `shootStar ${s.dur} ${s.delay} linear infinite`,
                    }}
                />
            ))}
        </div>
    )
}

/* ── Mouse-reactive input with edge glow ── */
export function AppInput({ label, placeholder, icon, className = '', ...rest }) {
    const [mouseX, setMouseX] = useState(0)
    const [hovering, setHovering] = useState(false)

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMouseX(e.clientX - rect.left)
    }

    return (
        <div className={`w-full relative ${className}`}>
            {label && (
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {label}
                </label>
            )}
            <div className="relative w-full">
                <input
                    placeholder={placeholder}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        border: '2px solid var(--color-border)',
                        height: '52px',
                        width: '100%',
                        borderRadius: '8px',
                        background: 'var(--color-surface)',
                        padding: '0 16px',
                        fontWeight: 300,
                        outline: 'none',
                        color: 'var(--color-text-primary)',
                        transition: 'background 0.2s',
                        fontSize: '15px',
                    }}
                    onFocus={(e) => { e.target.style.background = 'var(--color-bg)' }}
                    onBlur={(e) => { e.target.style.background = 'var(--color-surface)' }}
                    {...rest}
                />
                {/* Top edge glow */}
                {hovering && (
                    <>
                        <div
                            className="absolute pointer-events-none top-0 left-0 right-0 rounded-t-lg overflow-hidden"
                            style={{
                                height: '2px', zIndex: 20,
                                background: `radial-gradient(30px circle at ${mouseX}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
                            }}
                        />
                        <div
                            className="absolute pointer-events-none bottom-0 left-0 right-0 rounded-b-lg overflow-hidden"
                            style={{
                                height: '2px', zIndex: 20,
                                background: `radial-gradient(30px circle at ${mouseX}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
                            }}
                        />
                    </>
                )}
                {icon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ zIndex: 20, color: 'var(--color-text-secondary)' }}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}

/* ── Social sign-in icon buttons ── */
export function SocialButtons({ label = 'or use your account' }) {
    const socials = [
        {
            label: 'Instagram',
            href: '#',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                </svg>
            ),
        },
        {
            label: 'LinkedIn',
            href: '#',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
                </svg>
            ),
        },
        {
            label: 'Facebook',
            href: '#',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396z" />
                </svg>
            ),
        },
    ]

    return (
        <div className="flex flex-col items-center gap-3">
            <ul className="flex gap-3">
                {socials.map((s) => (
                    <li key={s.label} className="list-none">
                        <a
                            href={s.href}
                            aria-label={s.label}
                            className="group relative overflow-hidden w-11 h-11 rounded-full flex items-center justify-center"
                            style={{
                                background: 'var(--color-muted-surface)',
                                border: '1.5px solid var(--color-border)',
                                color: 'var(--color-text-secondary)',
                                transition: 'color 0.2s, border-color 0.2s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = 'var(--color-text-primary)'
                                e.currentTarget.style.borderColor = 'var(--color-text-secondary)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = 'var(--color-text-secondary)'
                                e.currentTarget.style.borderColor = 'var(--color-border)'
                            }}
                        >
                            {s.icon}
                        </a>
                    </li>
                ))}
            </ul>
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
        </div>
    )
}

/* ── Shimmer CTA button ── */
export function ShimmerButton({ children, type = 'button', disabled = false, onClick, className = '' }) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`group/btn relative inline-flex justify-center items-center overflow-hidden rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed w-full ${className}`}
            style={{
                background: 'var(--color-border)',
                boxShadow: '0 0 0 0 transparent',
            }}
            onMouseEnter={e => { if (!disabled) e.currentTarget.style.boxShadow = '0 4px 20px rgba(199,209,219,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 0 transparent' }}
        >
            <span className="relative z-10">{children}</span>
            {/* sheen sweep */}
            <div
                className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/btn:duration-700 group-hover/btn:[transform:skew(-13deg)_translateX(100%)]"
                aria-hidden="true"
            >
                <div className="relative h-full w-10 bg-white/20" />
            </div>
        </button>
    )
}

/* ── Auth layout card: dark side + image side ── */
export function AuthCard({ children, imageSrc, rightPanel }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [hovering, setHovering] = useState(false)

    const handleMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top })
    }

    return (
        <div
            className="flex w-full max-w-6xl rounded-2xl overflow-hidden"
            style={{
                background: 'var(--color-surface)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
                minHeight: '620px',
            }}
        >
            {/* Left: form – 45% */}
            <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{ width: '45%', flexShrink: 0 }}
                onMouseMove={handleMove}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                {/* mouse-follow glow blob */}
                <div
                    aria-hidden="true"
                    className="absolute pointer-events-none w-[440px] h-[440px] rounded-full blur-3xl transition-opacity duration-300"
                    style={{
                        background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(219,39,119,0.08) 60%, transparent 100%)',
                        transform: `translate(${mousePos.x - 220}px, ${mousePos.y - 220}px)`,
                        opacity: hovering ? 1 : 0,
                        transition: 'transform 0.1s ease-out, opacity 0.3s',
                    }}
                />
                <div className="relative z-10 w-full px-8 md:px-12 py-10">
                    {children}
                </div>
            </div>

            {/* Right: custom panel or single image (hidden on mobile) */}
            {rightPanel ? (
                <div
                    className="hidden lg:flex relative overflow-hidden items-center justify-center auth-right-panel"
                    style={{
                        flex: 1,
                        background: 'linear-gradient(140deg, #dde1e7 0%, #eff1f4 40%, #e2e5ea 70%, #d6dae1 100%)',
                    }}
                >
                    <style>{`
                        .auth-right-panel::before {
                            content: '';
                            position: absolute;
                            inset: 0;
                            background: linear-gradient(
                                110deg,
                                transparent 0%,
                                transparent 30%,
                                rgba(255,255,255,0.28) 50%,
                                transparent 70%,
                                transparent 100%
                            );
                            background-size: 250% 100%;
                            background-position: 200% 0;
                            transition: background-position 0.7s ease;
                            pointer-events: none;
                            z-index: 10;
                        }
                        .auth-right-panel:hover::before {
                            background-position: -50% 0;
                        }
                    `}</style>
                    {rightPanel}
                </div>
            ) : imageSrc ? (
                <div className="hidden lg:block w-1/2 relative overflow-hidden">
                    <img
                        src={imageSrc}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover"
                        style={{ opacity: 0.35 }}
                    />
                    {/* gradient overlay on image */}
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to right, var(--color-surface) 0%, transparent 30%)' }}
                    />
                </div>
            ) : null}
        </div>
    )
}
