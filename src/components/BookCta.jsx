import { ArrowUpRight } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

export default function BookCta() {
  const [ref, visible] = useReveal(0.35)

  return (
    <section
      id="book"
      className="mx-auto max-w-[1340px] px-[15px] py-[160px] text-center mobile:px-[18px] mobile:py-[110px]"
      aria-label="Бронирование"
    >
      <div ref={ref} className="flex flex-col items-center gap-8">
        <span
          className={`reveal-up ${
            visible ? 'is-visible' : ''
          } flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/50`}
        >
          <span className="dot-pulse h-[7px] w-[7px] rounded-full bg-[var(--accent)] shadow-[0_0_12px_2px_var(--accent)]" />
          Открыт набор в клуб · Лето 2026
        </span>
        <h2
          className={`reveal-up ${
            visible ? 'is-visible' : ''
          } max-w-[1100px] text-[clamp(44px,9vw,140px)] font-medium uppercase leading-[0.9] tracking-[-4px]`}
        >
          Летайте частно<span className="text-[var(--accent)]">.</span>
        </h2>
        <a
          href="mailto:concierge@flyaether.ru"
          className="fill-btn group inline-flex w-fit items-center gap-2 rounded-full border border-white px-8 py-4 text-base font-medium tracking-[0.02em]"
        >
          запросить приглашение
          <ArrowUpRight
            size={18}
            className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </section>
  )
}
