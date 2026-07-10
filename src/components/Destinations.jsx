import { ArrowUpRight } from 'lucide-react'
import { DESTINATIONS } from '../data'
import { useReveal } from '../hooks/useReveal'

export default function Destinations() {
  const [headRef, headVisible] = useReveal(0.35)

  return (
    <section
      id="routes"
      className="mx-auto max-w-[1340px] px-[15px] py-[140px] mobile:px-[18px] mobile:py-[90px]"
      aria-label="Направления"
    >
      <div ref={headRef} className="mb-16 flex items-end justify-between mobile:flex-col mobile:items-start mobile:gap-4">
        <h2
          className={`reveal-left ${
            headVisible ? 'is-visible' : ''
          } max-w-[760px] text-[56px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[44px] mobile:text-[34px]`}
        >
          Шесть городов.<br />
          <span className="text-white/45">Одно частное небо.</span>
        </h2>
        <span
          className={`reveal-right ${
            headVisible ? 'is-visible' : ''
          } text-xs font-medium uppercase tracking-[0.2em] text-white/50`}
        >
          Прямые — без пересадок — по запросу
        </span>
      </div>

      <ul className="border-t border-white/10">
        {DESTINATIONS.map((d, i) => (
          <DestinationRow key={d.code} d={d} index={i} />
        ))}
      </ul>
    </section>
  )
}

function DestinationRow({ d, index }) {
  const [ref, visible] = useReveal(0.5)
  return (
    <li
      ref={ref}
      style={{ animationDelay: `${index * 0.05}s` }}
      className={`reveal-up ${visible ? 'is-visible' : ''}`}
    >
      <a
        href="#book"
        className="role-link group grid grid-cols-[80px_1fr_auto_auto] items-center gap-6 border-b border-white/10 py-7 mobile:grid-cols-[52px_1fr_auto] mobile:gap-3"
      >
        <span className="text-sm font-medium uppercase tracking-[0.1em] text-[var(--accent)]">
          {d.code}
        </span>
        <span className="text-2xl font-medium tracking-[-0.5px] mobile:text-lg">
          {d.city}
        </span>
        <span className="text-sm font-medium uppercase tracking-[0.1em] text-white/45 mobile:hidden">
          {d.tag}
        </span>
        <span className="flex items-center gap-3 text-sm font-medium text-white/70">
          {d.time}
          <ArrowUpRight
            size={16}
            className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--accent)]"
          />
        </span>
      </a>
    </li>
  )
}
