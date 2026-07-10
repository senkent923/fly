import { useCountUp } from '../hooks/useCountUp'

const STATS = [
  { end: 42, suffix: '', label: 'направления по миру' },
  { end: 9, suffix: ' мин', label: 'от входа до кресла' },
  { end: 99.4, decimals: 1, suffix: '%', label: 'рейсов вовремя' },
  { end: 100, suffix: '%', label: 'углеродная компенсация' },
]

export default function StatsBand() {
  return (
    <section
      className="border-y border-white/10 bg-white/[0.015]"
      aria-label="Показатели"
    >
      <div className="mx-auto grid max-w-[1340px] grid-cols-4 gap-6 px-[15px] py-20 md-tablet:grid-cols-2 md-tablet:gap-y-14 mobile:grid-cols-2 mobile:gap-y-10 mobile:px-[18px] mobile:py-14">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </section>
  )
}

function Stat({ end, suffix = '', decimals = 0, label }) {
  const [ref, value] = useCountUp(end)
  const shown = decimals ? value.toFixed(decimals) : Math.round(value)
  return (
    <div ref={ref} className="flex flex-col gap-3">
      <span className="text-[64px] font-medium leading-none tracking-[-2px] md-tablet:text-[52px] mobile:text-[44px]">
        {shown}
        <span className="text-[var(--accent)]">{suffix}</span>
      </span>
      <span className="max-w-[180px] text-xs font-medium uppercase leading-4 tracking-[0.14em] text-white/45">
        {label}
      </span>
    </div>
  )
}
