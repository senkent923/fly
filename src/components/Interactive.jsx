import { useEffect, useRef } from 'react'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Magnetic wrapper — its child eases toward the cursor while hovered and
 * springs back on leave. Great for primary CTAs.
 */
export function Magnetic({ strength = 0.4, className = '', children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    const onLeave = () => {
      el.style.transform = 'translate(0, 0)'
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])
  return (
    <span
      ref={ref}
      className={`inline-block will-change-transform ${className}`}
      style={{ transition: 'transform 0.5s var(--ease-spring)' }}
    >
      {children}
    </span>
  )
}

/**
 * Tilt wrapper — 3D perspective tilt following the cursor, with a subtle
 * glare highlight. Wraps cards; the child keeps its own reveal/hover.
 */
export function Tilt({ max = 7, className = '', children }) {
  const ref = useRef(null)
  const glare = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(1000px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`
      if (glare.current) {
        glare.current.style.opacity = '1'
        glare.current.style.background = `radial-gradient(300px circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(255,255,255,0.12), transparent 60%)`
      }
    }
    const onLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
      if (glare.current) glare.current.style.opacity = '0'
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [max])
  return (
    <div
      ref={ref}
      className={`relative will-change-transform ${className}`}
      style={{ transition: 'transform 0.5s var(--ease-spring)', transformStyle: 'preserve-3d' }}
    >
      {children}
      <div
        ref={glare}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0"
        style={{ transition: 'opacity 0.4s ease' }}
      />
    </div>
  )
}
