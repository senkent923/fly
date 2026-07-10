import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SkyScene from './SkyScene'
import { Magnetic } from './Interactive'
import { SCENES } from '../data'
import { useReveal } from '../hooks/useReveal'

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = SCENES[activeIndex]
  const accent = active.accent

  const [nameRef, nameVisible] = useReveal(0.35)
  const [copyRef, copyVisible] = useReveal(0.35)

  const skyRef = useRef(null)
  const contentRef = useRef(null)

  // Scroll parallax: sky drifts slower, content lifts and fades.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      const y = window.scrollY
      if (y > window.innerHeight * 1.3) return
      if (skyRef.current) skyRef.current.style.transform = `translate3d(0, ${y * 0.3}px, 0)`
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${y * 0.14}px, 0)`
        contentRef.current.style.opacity = String(Math.max(0, 1 - y / 650))
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-label="Главный экран"
    >
      <div ref={skyRef} className="pointer-events-none absolute inset-x-0 -top-[12%] h-[124%] will-change-transform">
        <SkyScene activeIndex={activeIndex} />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-[2] mx-auto flex min-h-[100svh] max-w-[1340px] flex-col items-end justify-end gap-[150px] px-[15px] pt-[190px] will-change-transform md-tablet:gap-[110px] mobile:items-start mobile:gap-[72px] mobile:px-[18px] mobile:pt-[140px]">
        {/* Upper: scene switcher + status */}
        <div className="flex w-full items-end justify-between mobile:flex-col mobile:items-start mobile:gap-7">
          {/* Scene switcher */}
          <div className="flex flex-[4] flex-col gap-2">
            <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.24em] opacity-50">
              Фирменные маршруты
            </span>
            {SCENES.map((scene, i) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-pressed={i === activeIndex}
                className={`role-link flex items-baseline gap-3 text-left transition-opacity ${
                  i === activeIndex
                    ? 'opacity-100'
                    : 'opacity-55 hover:opacity-75'
                }`}
              >
                <span className="text-[10px] font-medium uppercase leading-3 tracking-[0.1em] opacity-70">
                  0{i + 1}
                </span>
                <span className="text-sm font-medium uppercase leading-4 tracking-[0.04em]">
                  / {scene.label}
                </span>
                <span className="text-[10px] font-medium uppercase leading-4 tracking-[0.06em] opacity-45">
                  {scene.route}
                </span>
              </button>
            ))}
          </div>

          {/* Availability */}
          <div
            className="flex flex-1 items-center justify-end gap-3 mobile:justify-start"
            role="status"
            aria-label="Статус посадки"
          >
            <span
              className="dot-pulse h-[7px] w-[7px] rounded-full"
              style={{
                background: accent,
                boxShadow: `0 0 12px 2px ${accent}`,
              }}
            />
            <span className="text-xs font-medium uppercase tracking-[0.12em]">
              Посадка открыта · Лето 2026
            </span>
          </div>
        </div>

        {/* Lower: name + CTA */}
        <div className="flex w-full items-end justify-between pb-[60px] md-tablet:pb-[52px] mobile:flex-col mobile:items-start mobile:gap-8 mobile:pb-11">
          {/* Giant wordmark */}
          <div ref={nameRef} className="flex-[2]">
            <h1
              className={`reveal-up ${
                nameVisible ? 'is-visible' : ''
              } text-[200px] font-medium uppercase leading-[81%] tracking-[-6px] md-tablet:text-[129.6px] md-tablet:leading-[113.4px] md-tablet:tracking-[-7.7px] mobile:text-[clamp(68px,21vw,80px)] mobile:leading-[96px] mobile:tracking-[-4.8px]`}
            >
              Aether
              <span style={{ color: accent }}>.</span>
            </h1>
          </div>

          {/* Copy + CTA */}
          <div
            ref={copyRef}
            className="flex flex-1 flex-col gap-6 pl-[50px] md-tablet:pl-6 mobile:pl-0"
          >
            <p
              className={`reveal-right ${
                copyVisible ? 'is-visible' : ''
              } text-base font-medium leading-6 tracking-[-0.16px] text-white/85 mobile:max-w-[420px]`}
            >
              Частная авиакомпания для тех, кто путешествует иначе. Без очередей,
              без терминалов, без компромиссов — только небо, по вашему
              расписанию и на углеродно-нейтральном флоте.
            </p>
            <Magnetic
              strength={0.5}
              className={`reveal-right w-fit ${copyVisible ? 'is-visible' : ''}`}
            >
              <a
                href="#book"
                style={{ animationDelay: '0.08s' }}
                className="fill-btn group inline-flex w-fit items-center gap-2 rounded-full border border-white px-6 py-3 text-sm font-medium tracking-[0.02em]"
              >
                забронировать место
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

    </section>
  )
}
