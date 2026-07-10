import { useEffect, useState } from 'react'
import { Plane } from 'lucide-react'

/**
 * Light page-load intro: the wordmark blurs in over a filling line, then the
 * curtain lifts to reveal the site. Click to skip; respects reduced motion.
 */
export default function Intro() {
  const [phase, setPhase] = useState('enter') // enter → exit → gone

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('gone')
      return
    }
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setPhase('exit'), 1600)
    const t2 = setTimeout(() => {
      setPhase('gone')
      document.body.style.overflow = ''
    }, 2400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = ''
    }
  }, [])

  const skip = () => {
    if (phase !== 'enter') return
    setPhase('exit')
    setTimeout(() => {
      setPhase('gone')
      document.body.style.overflow = ''
    }, 800)
  }

  if (phase === 'gone') return null

  return (
    <div
      onClick={skip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05060a] ${
        phase === 'exit' ? 'intro-exit' : ''
      }`}
      aria-hidden="true"
    >
      {/* faint drifting plane */}
      <Plane
        size={16}
        className="intro-plane absolute text-white/30"
        strokeWidth={1.5}
      />

      <div className="intro-logo text-[clamp(40px,9vw,96px)] font-medium uppercase leading-none tracking-[-3px]">
        Aether<span className="text-[var(--accent)]">.</span>
      </div>

      <div className="intro-line mt-8 h-px w-[180px] overflow-hidden bg-white/12">
        <span className="block h-full bg-[var(--accent)]" />
      </div>
    </div>
  )
}
