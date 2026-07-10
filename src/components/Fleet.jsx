import { useReveal } from '../hooks/useReveal'

const SPECS = [
  { k: 'Дальность', v: '11 200', unit: 'км' },
  { k: 'Крейсерская скорость', v: '0.85', unit: 'Маха' },
  { k: 'Кают на борту', v: '12', unit: '' },
  { k: 'Высота полёта', v: '13 100', unit: 'м' },
]

export default function Fleet() {
  const [ref, visible] = useReveal(0.3)

  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-white/[0.02]"
      aria-label="Флот"
    >
      <div className="mx-auto grid max-w-[1340px] grid-cols-2 gap-16 px-[15px] py-[140px] md-tablet:gap-10 mobile:grid-cols-1 mobile:gap-10 mobile:px-[18px] mobile:py-[90px]">
        {/* Left: copy */}
        <div ref={ref} className="flex flex-col justify-center">
          <span
            className={`reveal-up ${
              visible ? 'is-visible' : ''
            } mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]`}
          >
            Флот
          </span>
          <h2
            className={`reveal-up ${
              visible ? 'is-visible' : ''
            } mb-6 text-[52px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[40px] mobile:text-[32px]`}
          >
            AETHER One —<br />
            <span className="text-white/45">тихий сверхдальний джет.</span>
          </h2>
          <p
            className={`reveal-up ${
              visible ? 'is-visible' : ''
            } max-w-[480px] text-base font-medium leading-6 tracking-[-0.16px] text-white/60`}
          >
            Полностью электрифицированная кабина, композитный корпус и двигатели
            на устойчивом авиатопливе. Один борт — двенадцать кают, ноль
            пересадок между континентами.
          </p>
        </div>

        {/* Right: animated aircraft silhouette + specs */}
        <div className="flex flex-col justify-center gap-10">
          <Plane visible={visible} />
          <dl className="grid grid-cols-2 gap-x-8 gap-y-7">
            {SPECS.map((s, i) => (
              <div
                key={s.k}
                className={`reveal-up ${visible ? 'is-visible' : ''} border-t border-white/10 pt-4`}
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                <dt className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                  {s.k}
                </dt>
                <dd className="text-[28px] font-medium tracking-[-0.5px]">
                  {s.v}
                  <span className="ml-1 text-sm text-white/45">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function Plane({ visible }) {
  return (
    <svg viewBox="0 0 600 200" className="w-full" aria-hidden="true">
      <path
        d="M40 118 C120 108 230 100 350 96 L470 92 C520 90 560 96 575 104 C560 110 520 114 470 112 L360 110 C300 128 250 150 210 168 L188 168 C196 146 205 128 214 112 L150 112 C120 124 92 138 66 150 L48 150 C56 136 64 126 40 118 Z"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 2600,
          strokeDashoffset: visible ? 0 : 2600,
          transition: 'stroke-dashoffset 2.2s var(--ease-spring) 0.2s',
        }}
      />
      <path
        d="M40 118 C120 108 230 100 350 96 L470 92 C520 90 560 96 575 104 C560 110 520 114 470 112 L360 110 C300 128 250 150 210 168 L188 168 C196 146 205 128 214 112 L150 112 C120 124 92 138 66 150 L48 150 C56 136 64 126 40 118 Z"
        fill="var(--accent)"
        opacity={visible ? 0.06 : 0}
        style={{ transition: 'opacity 1s ease 1.4s' }}
      />
    </svg>
  )
}
