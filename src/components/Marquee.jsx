import { MARQUEE } from '../data'

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="marquee-mask relative w-full overflow-hidden border-y border-white/10 py-5">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {items.map((label, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
              {label}
            </span>
            <span
              className="h-[6px] w-[6px] rounded-full bg-[var(--accent)]"
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  )
}
