import { useState } from 'react'
import { Check } from 'lucide-react'
import { CABINS } from '../data'
import { useReveal } from '../hooks/useReveal'
import { Tilt } from './Interactive'
import Modal from './Modal'
import { useApp } from '../store/AppContext'
import { CLASSES } from '../data/airports'

const today = new Date().toISOString().slice(0, 10)

export default function Cabins() {
  const [headRef, headVisible] = useReveal(0.35)
  const [active, setActive] = useState(null)

  return (
    <section
      id="cabins"
      className="border-t border-white/10 bg-white/[0.02]"
      aria-label="Каюты"
    >
      <div className="mx-auto max-w-[1340px] px-[15px] py-[140px] mobile:px-[18px] mobile:py-[90px]">
        <div ref={headRef} className="mb-16">
          <span
            className={`reveal-up ${
              headVisible ? 'is-visible' : ''
            } mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]`}
          >
            Три способа летать
          </span>
          <h2
            className={`reveal-up ${
              headVisible ? 'is-visible' : ''
            } max-w-[860px] text-[56px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[44px] mobile:text-[34px]`}
          >
            Каюта — это не кресло. Это отдельная комната в небе.
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6 md-tablet:grid-cols-1 mobile:grid-cols-1">
          {CABINS.map((c, i) => (
            <CabinCard key={c.n} c={c} index={i} onOpen={() => setActive(c)} />
          ))}
        </div>
      </div>

      <CabinModal cabin={active} onClose={() => setActive(null)} />
    </section>
  )
}

function CabinCard({ c, index, onOpen }) {
  const [ref, visible] = useReveal(0.3)
  return (
    <Tilt className="rounded-2xl">
      <button
        type="button"
        ref={ref}
        onClick={onOpen}
        style={{ animationDelay: `${index * 0.1}s` }}
        className={`reveal-up ${
          visible ? 'is-visible' : ''
        } glow-card group flex h-full w-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.015] p-8 text-left transition-colors duration-500 hover:bg-white/[0.03]`}
      >
        <div className="mb-16 flex items-start justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            {c.detail}
          </span>
          <span className="text-5xl font-medium leading-none text-white/10 transition-colors duration-500 group-hover:text-[var(--accent)]">
            {c.n}
          </span>
        </div>
        <div>
          <h3 className="mb-3 text-3xl font-medium tracking-[-0.8px]">{c.name}</h3>
          <p className="text-base font-medium leading-6 tracking-[-0.16px] text-white/60">
            {c.desc}
          </p>
          <span className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]/60 transition-all duration-500 group-hover:gap-3 group-hover:text-[var(--accent)]">
            Подробнее →
          </span>
        </div>
      </button>
    </Tilt>
  )
}

function CabinModal({ cabin, onClose }) {
  const { startBooking } = useApp()
  if (!cabin) return null
  const cls = CLASSES.find((c) => c.id === cabin.classId)

  return (
    <Modal open={!!cabin} onClose={onClose} title={cabin.name} maxWidth="max-w-[560px]">
      <div className="mb-5 flex items-center gap-3">
        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
          {cabin.detail}
        </span>
        {cls && (
          <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            Класс {cls.label}
          </span>
        )}
      </div>

      <p className="mb-6 text-base font-medium leading-6 tracking-[-0.16px] text-white/70">
        {cabin.long}
      </p>

      <ul className="mb-7 grid grid-cols-2 gap-x-6 gap-y-3">
        {cabin.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-white/70">
            <Check size={15} className="shrink-0 text-[var(--accent)]" />
            {f}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => {
          onClose()
          startBooking({ fromCode: 'SVO', toCode: 'DXB', date: today, pax: 1, round: false })
        }}
        className="fill-btn w-full rounded-full border border-white py-3.5 text-sm font-medium tracking-[0.02em]"
      >
        Забронировать
      </button>
    </Modal>
  )
}
