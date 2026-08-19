import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import groupIllustration from "../../assets/images/Group 2.svg"
import { Particles } from "./particles"
import "./hero.css"

export function HeroSection({
    title1 = "Connect with real people.",
    title2 = "Not bots.",
    description = "IDK why I'm making this but if you like it please give me an Internship",
    primaryButtonText = "Get Started",
    secondaryButtonText = "Learn More",
    secondaryHref = "https://portfolio-1-jade-omega.vercel.app/",
    onPrimaryClick,
    onSecondaryClick,
    className = "",
}) {
    const navigate = useNavigate()
    const cardRef = useRef(null)
    const [cardTransform, setCardTransform] = useState("")

    // Subtle card tilt on mouse move
    useEffect(() => {
        const card = cardRef.current
        if (!card) return
        const handleMove = (e) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            const rotX = -(y / rect.height) * 5
            const rotY = (x / rect.width) * 5
            setCardTransform(`perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`)
        }
        const handleLeave = () => setCardTransform("perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)")
        card.addEventListener("mousemove", handleMove)
        card.addEventListener("mouseleave", handleLeave)
        return () => {
            card.removeEventListener("mousemove", handleMove)
            card.removeEventListener("mouseleave", handleLeave)
        }
    }, [])

    const handlePrimary = () => {
        if (onPrimaryClick) onPrimaryClick()
        else navigate("/feed")
    }
    const handleSecondary = (e) => {
        if (onSecondaryClick) onSecondaryClick(e)
    }

    return (
        <section className={`lu-hero ${className}`}>
            {/* ── Layer 1: Particles animated background ── */}
            <Particles
                className="lu-particles"
                quantity={160}
                ease={80}
                staticity={40}
                size={0.7}
                color="#6d28d9"
                vx={0}
                vy={0}
            />
            {/* ── Layer 2: Gradient overlay for content readability ── */}
            <div className="lu-hero__overlay" aria-hidden="true" />
            {/* ── Layer 3: Soft radial glow behind the illustration ── */}
            <div className="lu-hero__glow" aria-hidden="true" />

            <div className="lu-hero__container">
                {/* ── LEFT: Content ── */}
                <div className="lu-hero__content">

                    {/* Badge */}
                    <div className="lu-badge">
                        <span className="lu-badge__dot" />
                        S!de Quest!
                    </div>

                    {/* Headline */}
                    <h1 className="lu-headline">
                        {title1}<br />
                        <span className="lu-headline__gradient">{title2}</span>
                    </h1>

                    {/* Subtext */}
                    <p className="lu-subtext">{description}</p>

                    {/* CTA Buttons */}
                    <div className="lu-cta">
                        <button className="lu-btn lu-btn--primary" onClick={handlePrimary}>
                            {primaryButtonText}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {secondaryHref ? (
                            <a
                                href={secondaryHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="lu-btn lu-btn--secondary"
                                onClick={handleSecondary}
                            >
                                {secondaryButtonText}
                            </a>
                        ) : (
                            <button className="lu-btn lu-btn--secondary" onClick={handleSecondary}>
                                {secondaryButtonText}
                            </button>
                        )}
                    </div>

                    {/* Trust line */}
                    <p className="lu-trust">
                        <span className="lu-trust__avatars" aria-hidden="true">
                            {["#7c3aed", "#db2777", "#059669", "#d97706"].map((c, i) => (
                                <span key={i} className="lu-avatar" style={{ background: c, zIndex: 4 - i }} />
                            ))}
                        </span>
                        Join <strong>5,000+</strong> Fake users
                    </p>
                </div>

                {/* ── RIGHT: Illustration ── */}
                <div className="lu-hero__visual">
                    <div
                        className="lu-card"
                        ref={cardRef}
                        style={{ transform: cardTransform || "perspective(900px) rotateX(0) rotateY(0)" }}
                    >
                        <img
                            src={groupIllustration}
                            alt="Two people connecting — the LinkUp illustration"
                            className="lu-card__img"
                            draggable="false"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
