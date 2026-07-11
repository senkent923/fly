import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { useApp } from '../store/AppContext'
import { findAirport, distanceKm, flightDuration, priceFor, formatRub } from '../data/airports'

const hhmm = (ts) =>
  new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Moscow',
  }).format(new Date(ts))

// Pool of routes (all codes exist in AIRPORTS); flights are drawn from it.
const POOL = [
  ['SVO', 'DXB'], ['LED', 'CDG'], ['SVO', 'AER'], ['DXB', 'MLE'], ['IST', 'SVO'],
  ['HND', 'DPS'], ['JFK', 'LHR'], ['SVO', 'LED'], ['SVO', 'IST'], ['CDG', 'SVO'],
  ['SVX', 'SVO'], ['KZN', 'SVO'], ['LHR', 'JFK'], ['MLE', 'DXB'], ['SVO', 'BKK'],
  ['AER', 'SVO'], ['DXB', 'IST'], ['LED', 'LHR'],
]

// Status by minutes-until-departure — the real lifecycle of a flight:
// scheduled → check-in → boarding → departing → airborne.
function statusFor(mins, delayed) {
  if (delayed && mins > -15) return { label: 'Задержка', tone: 'text-[#ffb15a] bg-[#ffb15a]/12' }
  if (mins > 90) return { label: 'По расписанию', tone: 'text-white/55 bg-white/5' }
  if (mins > 30) return { label: 'Регистрация', tone: 'text-white bg-white/10' }
  if (mins > 5) return { label: 'Посадка', tone: 'text-[var(--accent)] bg-[var(--accent)]/12' }
  if (mins > -15) return { label: 'Вылет', tone: 'text-[#49e07a] bg-[#49e07a]/12' }
  return { label: 'В пути', tone: 'text-[#49e07a] bg-[#49e07a]/12' }
}

function buildFlight(seq, dep) {
  const [from, to] = POOL[Math.floor(Math.random() * POOL.length)]
  const a = findAirport(from)
  const b = findAirport(to)
  const km = Math.round(distanceKm(a, b))
  const dur = flightDuration(km)
  return {
    no: 'AE' + seq,
    from,
    to,
    fromCity: a.city,
    toCity: b.city,
    dep,
    arr: dep + dur.hours * 3600000,
    durLabel: dur.label,
    price: priceFor(km, 'business', 1),
    delayed: Math.random() < 0.12,
  }
}

export default function LiveBoard() {
  const [ref, visible] = useReveal(0.2)
  const { startBooking } = useApp()
  const seq = useRef(100)

  const [inAir, setInAir] = useState(26)
  const [nowTs, setNowTs] = useState(Date.now())
  const [flights, setFlights] = useState(() => {
    const now = Date.now()
    // one just departing, the rest upcoming at ~15–40 min gaps
    return [-6, 10, 26, 45, 70, 100, 135, 175].map((o) => {
      seq.current += 7
      return buildFlight(seq.current, now + o * 60000)
    })
  })

  useEffect(() => {
    // clock ticks every 20s so statuses evolve by real flight time; once a
    // flight has been airborne ~20 min it leaves the board and a new one
    // is scheduled at the bottom.
    const clock = setInterval(() => {
      const now = Date.now()
      setNowTs(now)
      setFlights((prev) => {
        let list = prev
        let changed = false
        while (list.length && now - list[0].dep > 20 * 60000) {
          const lastDep = list[list.length - 1].dep
          seq.current += 7
          const gap = (24 + Math.floor(Math.random() * 18)) * 60000
          list = [...list.slice(1), buildFlight(seq.current, lastDep + gap)]
          changed = true
        }
        return changed ? list : prev
      })
    }, 20000)

    // planes in the air drift slowly — a small change every ~12 minutes
    const air = setInterval(() => {
      setInAir((n) => Math.min(34, Math.max(17, n + (Math.floor(Math.random() * 3) - 1))))
    }, 12 * 60000)

    return () => {
      clearInterval(clock)
      clearInterval(air)
    }
  }, [])

  const todayCount = 48

  return (
    <section id="board" className="relative overflow-hidden border-b border-white/10" aria-label="Табло рейсов">
      <div className="mx-auto max-w-[1340px] px-[15px] py-[140px] mobile:px-[18px] mobile:py-[90px]">
        <div ref={ref} className="mb-10 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
          <div>
            <span className={`reveal-up ${visible ? 'is-visible' : ''} mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]`}>
              Табло
            </span>
            <h2 className={`reveal-up ${visible ? 'is-visible' : ''} text-[52px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[40px] mobile:text-[32px]`}>
              В небе <span className="text-white/45">прямо сейчас.</span>
            </h2>
          </div>
          <div className="flex gap-10 mobile:gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="dot-pulse h-[7px] w-[7px] rounded-full bg-[var(--accent)] shadow-[0_0_10px_2px_var(--accent)]" />
                <span className="text-[40px] font-medium leading-none tracking-[-1px] tabular-nums">{inAir}</span>
              </div>
              <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
                бортов в воздухе
              </div>
            </div>
            <div>
              <span className="text-[40px] font-medium leading-none tracking-[-1px] tabular-nums">{todayCount}</span>
              <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
                вылетов сегодня
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[90px_1.6fr_90px_90px_100px_130px_130px] items-center gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-white/40 mobile:hidden">
            <span>Рейс</span>
            <span>Маршрут</span>
            <span>Вылет</span>
            <span>Прилёт</span>
            <span>В пути</span>
            <span className="text-right">Цена</span>
            <span className="text-right">Статус</span>
          </div>

          {flights.map((f) => {
            const mins = (f.dep - nowTs) / 60000
            const st = statusFor(mins, f.delayed)
            return (
              <button
                key={f.no}
                type="button"
                onClick={() => startBooking({ fromCode: f.from, toCode: f.to, date: new Date(f.dep).toISOString().slice(0, 10), pax: 1, round: false })}
                className="group grid w-full grid-cols-[90px_1.6fr_90px_90px_100px_130px_130px] items-center gap-4 border-b border-white/8 px-6 py-4 text-left transition-colors last:border-b-0 hover:bg-white/[0.03] mobile:grid-cols-2 mobile:gap-y-1 mobile:px-4"
              >
                <span className="font-mono text-sm text-white/50 mobile:order-1">{f.no}</span>
                <span className="flex items-center gap-2 text-base font-medium mobile:order-3 mobile:col-span-2 mobile:text-sm">
                  {f.from}
                  <ArrowRight size={14} className="text-[var(--accent)]" />
                  {f.to}
                  <span className="ml-1 text-xs font-normal text-white/40">{f.fromCity} — {f.toCity}</span>
                </span>
                <span className="font-mono text-sm tabular-nums mobile:order-4">{hhmm(f.dep)}</span>
                <span className="font-mono text-sm tabular-nums text-white/70 mobile:order-5">{hhmm(f.arr)}</span>
                <span className="text-sm text-white/55 mobile:order-6">{f.durLabel}</span>
                <span className="text-right text-sm font-medium mobile:order-2 mobile:text-right">{formatRub(f.price)}</span>
                <span className="flex justify-end mobile:order-7 mobile:col-span-2 mobile:justify-start">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${st.tone}`}>{st.label}</span>
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-xs text-white/35">
          Время в пути, время прилёта и цены рассчитываются автоматически по расстоянию. Нажмите на рейс, чтобы забронировать.
        </p>
      </div>
    </section>
  )
}
