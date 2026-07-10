import { useCallback, useEffect, useRef, useState } from 'react'
import { SCENES } from '../data'
import AnimatedBackdrop from './AnimatedBackdrop'

/**
 * Stacks all scene videos absolutely and crossfades to the active one.
 *
 * We stream the videos directly (no blob swap): swapping a video's `src`
 * after it has started aborts autoplay on iOS and freezes it on a single
 * frame. Instead each clip is played programmatically while muted, which
 * iOS permits without a user gesture.
 *
 * If autoplay is still refused (e.g. iOS Low Power Mode), every video is
 * kept hidden and the pure-CSS AnimatedBackdrop shows through — so the hero
 * is animated no matter what.
 */
export default function VideoBackground({ activeIndex }) {
  const refs = useRef([])
  const [playing, setPlaying] = useState(false)

  const tryPlay = useCallback(
    (i) => {
      const el = refs.current[i]
      if (!el) return
      el.muted = true // iOS needs this as a property, not just an attribute
      const p = el.play()
      if (p && typeof p.then === 'function') {
        p.then(() => setPlaying(true)).catch(() => setPlaying(false))
      }
    },
    [],
  )

  // (Re)start the active clip whenever the selection changes.
  useEffect(() => {
    tryPlay(activeIndex)
  }, [activeIndex, tryPlay])

  const showVideo = playing

  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      {/* always-on animated base — visible until (and unless) a video plays */}
      <AnimatedBackdrop activeIndex={activeIndex} />

      {SCENES.map((scene, i) => (
        <video
          key={scene.id}
          ref={(el) => (refs.current[i] = el)}
          src={scene.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => {
            if (i === activeIndex) tryPlay(i)
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === activeIndex && showVideo ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* tint + vignette so the type always reads */}
      <div className="absolute inset-0 z-[1] bg-black/40" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/20 to-black/50" />
    </div>
  )
}
