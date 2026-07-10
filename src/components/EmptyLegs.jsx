import { ArrowRight } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { useApp } from '../store/AppContext'
import { findAirport, distanceKm, priceFor, formatRub } from '../data/airports'

const fmtDate = (iso) =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date(iso))
const plusDays = (d) => {
  const t = new Date()
  t.setDate(t.getDate() + d)
  return t.toISOString().slice(0, 10)
}

// Repositioning ("empty leg") flights — a signature private-aviation deal.
const RAW = [
  { from: 'SVO', to: 'CDG', in: 3, aircraft: 'Challenger 3500', seats: 8, off: 0.62 },
  { from: 'DXB', to: 'MLE', in: 5, aircraft: 'Gulfstream G650ER', seats: 12, off: 0.58 },
  { from: 'LED', to: 'LHR', in: 6, aircraft: 'Challenger 3500', seats: 9, off: 0.65 },
  { from: 'HND', to: 'DPS', in: 8, aircraft: 'Gulfstream G650ER', seats: 12, off: 0.6 },
  { from: 'IST', to: 'SVO', in: 2, aircraft: 'Challenger 3500', seats: 8, off: 0.55 },
  { from: 'JFK', to: 'LHR', in: 9, aircraft: 'Gulfstream G650ER', seats: 14, off: 0.63 },
]

const LEGS = RAW.map((l) => {
  const a = findAirport(l.from)
  const b = findAirport(l.to)
  const km = Math.round(distanceKm(a, b))
  const was = priceFor(km, 'business', 1)
  const now = Math.round((was * (1 - l.off)) / 100) * 100
  return { ...l, fromCity: a.city, toCity: b.city, date: plusDays(l.in), was, now }
})

export default function EmptyLegs() {
  const [ref, visible] = useReveal(0.2)

  return (
    <section
      id="empty-legs"
      className="relative overflow-hidden border-b border-white/10"
      aria-label="Пустые рейсы"
    >
      <div className="mx-auto max-w-[1340px] px-[15px] py-[140px] mobile:px-[18px] mobile:py-[90px]">
        <div ref={ref} className="mb-12 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
          <div>
            <span className={`reveal-up ${visible ? 'is-visible' : ''} mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]`}>
              Пустые рейсы
            </span>
            <h2 className={`reveal-up ${visible ? 'is-visible' : ''} text-[52px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[40px] mobile:text-[32px]`}>
              Перегоночные рейсы <span className="text-white/45">со скидкой до 65%.</span>
            </h2>
          </div>
          <span className={`reveal-up ${visible ? 'is-visible' : ''} max-w-[300px] text-sm text-white/45`}>
            Борт уже летит в нужную сторону — вы платите только за своё место в нём.
          </span>
        </div>

        <ul className="border-t border-white/10">
          {LEGS.map((leg, i) => (
            <LegRow key={`${leg.from}-${leg.to}`} leg={leg} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function LegRow({ leg, index }) {
  const [ref, visible] = useReveal(0.5)
  const { startBooking } = useApp()

  return (
    <li ref={ref} style={{ animationDelay: `${index * 0.05}s` }} className={`reveal-up ${visible ? 'is-visible' : ''}`}>
      <button
        type="button"
        onClick={() => startBooking({ fromCode: leg.from, toCode: leg.to, date: leg.date, pax: 1, round: false })}
        className="group relative grid w-full grid-cols-[1.4fr_1fr_1fr_auto] items-center gap-6 overflow-hidden border-b border-white/10 py-6 text-left md-tablet:grid-cols-[1.4fr_1fr_auto] mobile:grid-cols-1 mobile:gap-2 mobile:py-5"
      >
        <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-white/[0.06] to-transparent transition-transform duration-700 ease-[var(--ease-spring)] group-hover:scale-x-100" />

        {/* route */}
        <div className="relative flex items-center gap-3 text-2xl font-medium tracking-[-0.5px] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-2 mobile:text-xl">
          <span>{leg.from}</span>
          <ArrowRight size={18} className="text-[var(--accent)]" />
          <span>{leg.to}</span>
          <span className="ml-1 text-sm font-normal text-white/40">
            {leg.fromCity} — {leg.toCity}
          </span>
        </div>

        {/* date + aircraft */}
        <div className="relative text-sm text-white/55 md-tablet:hidden">
          <div className="font-medium text-white/80">{fmtDate(leg.date)}</div>
          <div className="text-xs">{leg.aircraft} · {leg.seats} мест</div>
        </div>

        {/* seats mobile/tablet */}
        <div className="relative hidden text-sm text-white/55 md-tablet:block mobile:block">
          <span className="text-white/80">{fmtDate(leg.date)}</span> · {leg.aircraft}
        </div>

        {/* price */}
        <div className="relative flex items-center justify-end gap-3 mobile:justify-start">
          <span className="text-sm text-white/35 line-through">{formatRub(leg.was)}</span>
          <span className="text-xl font-medium text-[var(--accent)]">{formatRub(leg.now)}</span>
          <ArrowRight size={16} className="text-white/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-[var(--accent)] mobile:hidden" />
        </div>
      </button>
    </li>
  )
}
