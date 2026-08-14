// particles.jsx — converted from TSX for Vite + React (JSX) projects.
// Removed: "use client", TypeScript interfaces, next-themes.
// Works as a canvas-based animated particle field; mouse-reactive.

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

/* ── Mouse position hook ── */
function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    useEffect(() => {
        const handle = (e) => setMousePosition({ x: e.clientX, y: e.clientY })
        window.addEventListener("mousemove", handle)
        return () => window.removeEventListener("mousemove", handle)
    }, [])
    return mousePosition
}

/* ── Hex → [r, g, b] ── */
function hexToRgb(hex) {
    hex = hex.replace("#", "")
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("")
    const int = parseInt(hex, 16)
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

/* ─────────────────────────────────────────────────
   Particles component
   Props:
     className   — extra classes on the wrapper div
     quantity    — number of particles (default 120)
     staticity   — lower = more mouse pull (default 50)
     ease        — smoothing of mouse pull (default 50)
     size        — base particle radius (default 0.4)
     refresh     — toggle to re-init (default false)
     color       — hex color of particles (default #ffffff)
     vx / vy     — constant drift velocity
───────────────────────────────────────────────── */
export function Particles({
    className = "",
    quantity = 120,
    staticity = 50,
    ease = 50,
    size = 0.4,
    refresh = false,
    color = "#ffffff",
    vx = 0,
    vy = 0,
}) {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const ctx = useRef(null)
    const circles = useRef([])
    const mousePosition = useMousePosition()
    const mouse = useRef({ x: 0, y: 0 })
    const canvasSize = useRef({ w: 0, h: 0 })
    const animId = useRef(null)
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1

    // ── Init & resize ──────────────────────────────
    const resizeCanvas = () => {
        if (!containerRef.current || !canvasRef.current || !ctx.current) return
        circles.current = []
        canvasSize.current.w = containerRef.current.offsetWidth
        canvasSize.current.h = containerRef.current.offsetHeight
        canvasRef.current.width = canvasSize.current.w * dpr
        canvasRef.current.height = canvasSize.current.h * dpr
        canvasRef.current.style.width = `${canvasSize.current.w}px`
        canvasRef.current.style.height = `${canvasSize.current.h}px`
        ctx.current.scale(dpr, dpr)
    }

    const circleParams = () => {
        const { w, h } = canvasSize.current
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            translateX: 0,
            translateY: 0,
            size: Math.floor(Math.random() * 2) + size,
            alpha: 0,
            targetAlpha: parseFloat((Math.random() * 0.55 + 0.2).toFixed(2)),
            dx: (Math.random() - 0.5) * 0.1,
            dy: (Math.random() - 0.5) * 0.1,
            magnetism: 0.1 + Math.random() * 4,
        }
    }

    const rgb = hexToRgb(color)

    const drawCircle = (c, update = false) => {
        if (!ctx.current) return
        ctx.current.translate(c.translateX, c.translateY)
        ctx.current.beginPath()
        ctx.current.arc(c.x, c.y, c.size, 0, 2 * Math.PI)
        ctx.current.fillStyle = `rgba(${rgb.join(",")},${c.alpha})`
        ctx.current.fill()
        ctx.current.setTransform(dpr, 0, 0, dpr, 0, 0)
        if (!update) circles.current.push(c)
    }

    const clearCtx = () => {
        if (ctx.current)
            ctx.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h)
    }

    const drawParticles = () => {
        clearCtx()
        for (let i = 0; i < quantity; i++) drawCircle(circleParams())
    }

    const remap = (v, s1, e1, s2, e2) => {
        const r = ((v - s1) * (e2 - s2)) / (e1 - s1) + s2
        return r > 0 ? r : 0
    }

    const animate = () => {
        clearCtx()
        circles.current.forEach((c, i) => {
            // fade based on distance to nearest edge
            const edge = [
                c.x + c.translateX - c.size,
                canvasSize.current.w - c.x - c.translateX - c.size,
                c.y + c.translateY - c.size,
                canvasSize.current.h - c.y - c.translateY - c.size,
            ]
            const closest = edge.reduce((a, b) => Math.min(a, b))
            const factor = parseFloat(remap(closest, 0, 20, 0, 1).toFixed(2))
            if (factor > 1) {
                c.alpha = Math.min(c.alpha + 0.02, c.targetAlpha)
            } else {
                c.alpha = c.targetAlpha * factor
            }

            // drift + mouse pull
            c.x += c.dx + vx
            c.y += c.dy + vy
            c.translateX += (mouse.current.x / (staticity / c.magnetism) - c.translateX) / ease
            c.translateY += (mouse.current.y / (staticity / c.magnetism) - c.translateY) / ease

            drawCircle(c, true)

            // recycle out-of-bounds particles
            if (
                c.x < -c.size || c.x > canvasSize.current.w + c.size ||
                c.y < -c.size || c.y > canvasSize.current.h + c.size
            ) {
                circles.current.splice(i, 1)
                drawCircle(circleParams())
            }
        })
        animId.current = window.requestAnimationFrame(animate)
    }

    useEffect(() => {
        if (canvasRef.current) ctx.current = canvasRef.current.getContext("2d")
        resizeCanvas()
        drawParticles()
        animId.current = window.requestAnimationFrame(animate)
        window.addEventListener("resize", () => { resizeCanvas(); drawParticles() })
        return () => {
            window.removeEventListener("resize", resizeCanvas)
            if (animId.current) cancelAnimationFrame(animId.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color])

    useEffect(() => {
        if (!canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()
        const { w, h } = canvasSize.current
        const x = mousePosition.x - rect.left - w / 2
        const y = mousePosition.y - rect.top - h / 2
        if (x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2) {
            mouse.current.x = x
            mouse.current.y = y
        }
    }, [mousePosition.x, mousePosition.y])

    useEffect(() => {
        resizeCanvas()
        drawParticles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])

    return (
        <div
            ref={containerRef}
            className={cn("pointer-events-none", className)}
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="size-full" />
        </div>
    )
}
