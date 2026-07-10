import { useEffect, useState } from 'react'
import { SCENES } from '../data'

/**
 * Stacks all scene videos absolutely and crossfades to the active one.
 * On mount every clip is fetched as a blob and swapped to an object URL so
 * switching is instant with no network stall.
 */
export default function VideoBackground({ activeIndex }) {
  const [sources, setSources] = useState(() => SCENES.map((s) => s.video))

  useEffect(() => {
    let cancelled = false
    const created = []

    Promise.all(
      SCENES.map(async (scene) => {
        try {
          const res = await fetch(scene.video)
          if (!res.ok) throw new Error('bad response')
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          created.push(url)
          return url
        } catch {
          return scene.video // graceful fallback to the original URL
        }
      }),
    ).then((resolved) => {
      if (!cancelled) setSources(resolved)
    })

    return () => {
      cancelled = true
      created.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      {sources.map((src, i) => (
        <video
          key={SCENES[i].id}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* tint + vignette so the type always reads */}
      <div className="absolute inset-0 z-[1] bg-black/40" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/20 to-black/50" />
    </div>
  )
}
