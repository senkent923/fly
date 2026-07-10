import { ArrowUpRight } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { useApp } from '../store/AppContext'

const today = new Date().toISOString().slice(0, 10)

const SPECS = [
  { k: 'Дальность', v: '13 890', unit: 'км' },
  { k: 'Крейсерская скорость', v: '0.90', unit: 'Маха' },
  { k: 'Высота полёта', v: '15 500', unit: 'м' },
  { k: 'Мест на борту', v: '14', unit: '' },
]

export default function Fleet() {
  const [ref, visible] = useReveal(0.25)
  const { startBooking } = useApp()

  return (
    <section
      id="fleet"
      className="relative overflow-hidden border-b border-white/10 bg-white/[0.02]"
      aria-label="Флот"
    >
      <div className="mx-auto grid max-w-[1340px] grid-cols-2 items-center gap-14 px-[15px] py-[140px] md-tablet:gap-8 mobile:grid-cols-1 mobile:gap-10 mobile:px-[18px] mobile:py-[90px]">
        {/* copy */}
        <div ref={ref} className="flex flex-col">
          <span
            className={`reveal-up ${visible ? 'is-visible' : ''} mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]`}
          >
            Флот
          </span>
          <h2
            className={`reveal-up ${visible ? 'is-visible' : ''} mb-6 text-[52px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[40px] mobile:text-[32px]`}
          >
            AETHER One —<br />
            <span className="text-white/45">тихий сверхдальний джет.</span>
          </h2>
          <p
            className={`reveal-up ${visible ? 'is-visible' : ''} mb-8 max-w-[460px] text-base font-medium leading-6 tracking-[-0.16px] text-white/60`}
          >
            Полностью электрифицированная кабина, композитный корпус и двигатели
            на устойчивом авиатопливе. Один борт соединяет континенты без
            пересадок — тихо, ровно и без следа.
          </p>

          <dl className="mb-9 grid grid-cols-2 gap-x-8 gap-y-6">
            {SPECS.map((s, i) => (
              <div
                key={s.k}
                className={`reveal-up ${visible ? 'is-visible' : ''} border-t border-white/10 pt-3`}
                style={{ animationDelay: `${0.15 + i * 0.08}s` }}
              >
                <dt className="mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                  {s.k}
                </dt>
                <dd className="text-2xl font-medium tracking-[-0.5px]">
                  {s.v}
                  <span className="ml-1 text-sm text-white/45">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={() => startBooking({ fromCode: 'SVO', toCode: 'DXB', date: today, pax: 1, round: false })}
            className="fill-btn group inline-flex w-fit items-center gap-2 rounded-full border border-white px-6 py-3.5 text-sm font-medium tracking-[0.02em]"
          >
            Забронировать борт
            <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* line-art jet */}
        <JetLineArt visible={visible} />
      </div>
    </section>
  )
}

/* Detailed single-line business jet, drawn in the accent colour and
   revealed by animating stroke-dashoffset when it scrolls into view. */
function JetLineArt({ visible }) {
  // paths drawn in order with a staggered draw-in
  const draw = (len, delay) => ({
    strokeDasharray: len,
    strokeDashoffset: visible ? 0 : len,
    transition: `stroke-dashoffset 1.6s var(--ease-spring) ${delay}s`,
  })

  return (
    <div className="flex items-center justify-center mobile:mt-2">
      <svg
        viewBox="0 0 660 300"
        className="w-full max-w-[620px] overflow-visible"
        role="img"
        aria-label="Иллюстрация джета AETHER One"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* faint accent glow fill under the outline */}
        <path
          d="M80 150 C80 138 92 131 116 130 L470 124 C548 126 600 138 622 152 C600 166 548 178 470 180 L116 174 C92 173 80 166 80 154 Z"
          fill="var(--accent)"
          fillOpacity={visible ? 0.05 : 0}
          stroke="none"
          style={{ transition: 'fill-opacity 1s ease 0.9s' }}
        />

        {/* fuselage */}
        <path
          d="M80 150 C80 138 92 131 116 130 L470 124 C548 126 600 138 622 152 C600 166 548 178 470 180 L116 174 C92 173 80 166 80 154 Z"
          style={draw(1700, 0)}
        />
        {/* drooped nose accent */}
        <path d="M588 138 C606 142 618 148 622 152 C618 156 606 162 588 166" style={draw(120, 0.5)} />
        {/* cockpit windscreen */}
        <path d="M556 136 C572 137 586 142 596 150" style={draw(90, 0.6)} />
        <path d="M556 136 L548 146" style={draw(30, 0.65)} strokeOpacity="0.7" />

        {/* cheatline */}
        <path d="M96 158 L588 156" style={draw(500, 0.35)} strokeOpacity="0.7" />

        {/* oval cabin windows */}
        {Array.from({ length: 9 }, (_, i) => 250 + i * 32).map((x, i) => (
          <ellipse
            key={x}
            cx={x}
            cy="146"
            rx="7"
            ry="5"
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity 0.4s ease ${1 + i * 0.05}s`,
            }}
          />
        ))}

        {/* T-tail: vertical fin */}
        <path d="M104 130 L150 58 L172 60 L142 132" style={draw(260, 0.15)} />
        {/* horizontal stabiliser on top of the fin */}
        <path d="M150 62 L96 48 L104 60 L160 70" style={draw(180, 0.4)} />

        {/* aft-mounted engine on the rear fuselage */}
        <path d="M126 128 C120 112 150 104 176 110 C196 114 196 128 182 132" style={draw(200, 0.55)} />
        <ellipse cx="132" cy="120" rx="4" ry="9" style={draw(45, 0.9)} strokeOpacity="0.8" />

        {/* main swept wing + winglet */}
        <path d="M360 176 L250 250 L268 251 L404 182" style={draw(360, 0.5)} />
        <path d="M250 250 L244 232 L260 246" style={draw(60, 0.85)} />

        {/* subtle ground shadow */}
        <ellipse cx="360" cy="270" rx="180" ry="9" fill="var(--accent)" fillOpacity={visible ? 0.06 : 0} stroke="none" style={{ transition: 'fill-opacity 1s ease 1.2s' }} />
      </svg>
    </div>
  )
}
