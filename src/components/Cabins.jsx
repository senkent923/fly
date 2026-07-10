import { CABINS } from '../data'
import { useReveal } from '../hooks/useReveal'

export default function Cabins() {
  const [headRef, headVisible] = useReveal(0.35)

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
            <CabinCard key={c.n} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CabinCard({ c, index }) {
  const [ref, visible] = useReveal(0.3)
  return (
    <article
      ref={ref}
      style={{ animationDelay: `${index * 0.1}s` }}
      className={`reveal-up ${
        visible ? 'is-visible' : ''
      } glow-card group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.015] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/[0.03]`}
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
        <span className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-white/0 transition-all duration-500 group-hover:text-[var(--accent)]">
          Подробнее →
        </span>
      </div>
    </article>
  )
}
