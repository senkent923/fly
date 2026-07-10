import { useEffect, useState } from 'react'

/** Thin gradient bar pinned to the top, tracking page scroll progress. */
export default function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent-3)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
