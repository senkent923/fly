import { ArrowUpRight, Plane } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

export default function BookCta() {
  const [ref, visible] = useReveal(0.3)

  return (
    <section
      className="mx-auto max-w-[1340px] px-[15px] pt-[150px] mobile:px-[18px] mobile:pt-[100px]"
      aria-label="Приглашение"
    >
      <div className="mb-14 text-center">
        <span className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          <span className="dot-pulse h-[7px] w-[7px] rounded-full bg-[var(--accent)] shadow-[0_0_12px_2px_var(--accent)]" />
          Открыт набор в клуб · Лето 2026
        </span>
        <h2 className="mx-auto max-w-[1000px] text-[clamp(40px,8vw,120px)] font-medium uppercase leading-[0.9] tracking-[-4px] text-shimmer">
          Летайте частно.
        </h2>
      </div>

      {/* boarding pass */}
      <div
        ref={ref}
        className={`reveal-up ${
          visible ? 'is-visible' : ''
        } glow-card mx-auto flex max-w-[880px] overflow-hidden rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-sm mobile:flex-col`}
      >
        {/* main stub */}
        <div className="flex-[2] p-9 mobile:p-7">
          <div className="mb-10 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.28em]">
              AETHER
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
              Посадочный талон
            </span>
          </div>

          <div className="mb-10 flex items-center gap-5">
            <div className="flex flex-col">
              <span className="text-[44px] font-medium leading-none tracking-[-1px] mobile:text-[34px]">
                SVO
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/45">
                Москва
              </span>
            </div>
            <div className="relative flex-1">
              <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/40 to-white/20" />
              <Plane
                size={16}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-[var(--accent)] float-slow"
              />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[44px] font-medium leading-none tracking-[-1px] mobile:text-[34px]">
                MLE
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/45">
                Мальдивы
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ['Каюта', 'Ателье'],
              ['Место', '01A'],
              ['Посадка', '18:40'],
            ].map(([k, v]) => (
              <div key={k}>
                <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                  {k}
                </span>
                <span className="text-base font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* perforated tear + action stub */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-5 border-l border-dashed border-white/15 bg-gradient-to-br from-[var(--accent)]/10 to-transparent p-9 mobile:border-l-0 mobile:border-t">
          {/* notches */}
          <span className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-black mobile:hidden" />
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/50">
            Ваше место ждёт
          </span>
          <a
            href="mailto:concierge@flyaether.ru"
            className="fill-btn group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white px-6 py-4 text-sm font-medium tracking-[0.02em]"
          >
            запросить приглашение
            <ArrowUpRight
              size={16}
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
