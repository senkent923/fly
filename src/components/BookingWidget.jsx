import { useMemo, useState } from 'react'
import { ArrowLeftRight, Minus, Plus, Search } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useReveal } from '../hooks/useReveal'
import {
  AIRPORTS,
  CLASSES,
  findAirport,
  distanceKm,
  flightDuration,
  priceFor,
  formatRub,
} from '../data/airports'

const today = new Date().toISOString().slice(0, 10)

export default function BookingWidget() {
  const { startBooking } = useApp()
  const [ref, visible] = useReveal(0.25)

  const [fromCode, setFromCode] = useState('SVO')
  const [toCode, setToCode] = useState('DXB')
  const [date, setDate] = useState(today)
  const [pax, setPax] = useState(1)

  const from = findAirport(fromCode)
  const to = findAirport(toCode)
  const same = fromCode === toCode

  const km = useMemo(() => Math.round(distanceKm(from, to)), [from, to])
  const dur = useMemo(() => flightDuration(km), [km])

  const swap = () => {
    setFromCode(toCode)
    setToCode(fromCode)
  }

  const search = () => {
    if (same) return
    startBooking({ fromCode, toCode, date, pax })
  }

  return (
    <section
      id="book"
      className="mx-auto max-w-[1340px] px-[15px] py-[130px] mobile:px-[18px] mobile:py-[90px]"
      aria-label="Поиск рейса"
    >
      <div className="mb-10 flex items-end justify-between mobile:flex-col mobile:items-start mobile:gap-4">
        <div>
          <span className="mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]">
            Бронирование
          </span>
          <h2 className="text-[56px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[44px] mobile:text-[34px]">
            Куда летим?
          </h2>
        </div>
        <span className="max-w-[280px] text-sm text-white/45 mobile:max-w-none">
          Выберите маршрут — покажем время в пути и цену по классам.
        </span>
      </div>

      <div
        ref={ref}
        className={`reveal-up ${
          visible ? 'is-visible' : ''
        } glow-card rounded-3xl border border-white/12 bg-white/[0.03] p-6 backdrop-blur-sm md-tablet:p-6 mobile:p-5`}
      >
        {/* fields */}
        <div className="flex items-stretch gap-3 mobile:flex-col">
          <AirportField label="Откуда" value={fromCode} onChange={setFromCode} />

          <button
            type="button"
            onClick={swap}
            aria-label="Поменять местами"
            className="flex items-center justify-center rounded-2xl border border-white/12 px-4 text-white/70 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] mobile:py-3"
          >
            <ArrowLeftRight size={18} className="mobile:rotate-90" />
          </button>

          <AirportField label="Куда" value={toCode} onChange={setToCode} />

          <Field label="Дата">
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-base font-medium text-white outline-none [color-scheme:dark]"
            />
          </Field>

          <Field label="Пассажиры">
            <div className="flex items-center justify-between gap-2">
              <Stepper onClick={() => setPax((p) => Math.max(1, p - 1))} disabled={pax <= 1}>
                <Minus size={14} />
              </Stepper>
              <span className="min-w-[20px] text-center text-base font-medium">{pax}</span>
              <Stepper onClick={() => setPax((p) => Math.min(9, p + 1))} disabled={pax >= 9}>
                <Plus size={14} />
              </Stepper>
            </div>
          </Field>
        </div>

        {/* preview + action */}
        <div className="mt-5 flex items-center justify-between gap-6 rounded-2xl border border-white/8 bg-black/30 p-5 mobile:flex-col mobile:items-stretch mobile:gap-4">
          {same ? (
            <p className="text-sm text-[#ffb4b4]">Выберите два разных аэропорта.</p>
          ) : (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.14em] text-white/40">
                  В пути
                </span>
                <span className="text-lg font-medium">~{dur.label}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.14em] text-white/40">
                  Расстояние
                </span>
                <span className="text-lg font-medium">{km.toLocaleString('ru-RU')} км</span>
              </div>
              <div className="flex gap-4">
                {CLASSES.map((c) => (
                  <div key={c.id} className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-white/40">
                      {c.label}
                    </span>
                    <span className="text-lg font-medium">
                      {formatRub(priceFor(km, c.id, pax))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={search}
            disabled={same}
            className="fill-btn group flex shrink-0 items-center justify-center gap-2 rounded-full border border-white px-8 py-4 text-sm font-medium tracking-[0.02em] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Search size={16} />
            Подобрать тариф
          </button>
        </div>
      </div>
    </section>
  )
}

function AirportField({ label, value, onChange }) {
  return (
    <Field label={label} grow>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none bg-transparent text-base font-medium text-white outline-none"
      >
        {AIRPORTS.map((a) => (
          <option key={a.code} value={a.code} className="bg-[#0b0b0d] text-white">
            {a.city} · {a.code}
          </option>
        ))}
      </select>
    </Field>
  )
}

function Field({ label, children, grow }) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-2xl border border-white/12 bg-white/[0.02] px-4 py-3 transition-colors focus-within:border-[var(--accent)] ${
        grow ? 'flex-1' : ''
      }`}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
        {label}
      </span>
      {children}
    </div>
  )
}

function Stepper({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30"
    >
      {children}
    </button>
  )
}
