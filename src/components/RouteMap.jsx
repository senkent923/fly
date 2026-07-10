import { useReveal } from '../hooks/useReveal'

const HUB = { x: 210, y: 250, name: 'МОСКВА' }

// path = quadratic arc from hub to the node; node = endpoint + label
const ROUTES = [
  { d: 'M210,250 Q285,60 360,90', x: 360, y: 90, name: 'Санкт-Петербург' },
  { d: 'M210,250 Q300,430 410,380', x: 410, y: 380, name: 'Сочи' },
  { d: 'M210,250 Q330,520 520,470', x: 520, y: 470, name: 'Стамбул' },
  { d: 'M210,250 Q480,470 780,360', x: 780, y: 360, name: 'Дубай' },
  { d: 'M210,250 Q520,560 940,480', x: 940, y: 480, name: 'Мальдивы' },
  { d: 'M210,250 Q600,540 1090,430', x: 1090, y: 430, name: 'Бали' },
]

// the arc the animated plane rides along
const PLANE_PATH = 'M210,250 Q480,470 780,360'

export default function RouteMap() {
  const [ref, visible] = useReveal(0.25)

  return (
    <section
      className="relative overflow-hidden border-b border-white/10"
      aria-label="Сеть маршрутов"
    >
      <div className="mx-auto max-w-[1340px] px-[15px] py-[140px] mobile:px-[18px] mobile:py-[90px]">
        <div className="mb-12 flex items-end justify-between mobile:flex-col mobile:items-start mobile:gap-4">
          <div>
            <span className="mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]">
              Сеть маршрутов
            </span>
            <h2 className="max-w-[720px] text-[56px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[44px] mobile:text-[34px]">
              Одна точка отправления.<br />
              <span className="text-white/45">Весь мир на связи.</span>
            </h2>
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
            Хаб — Москва (SVO)
          </span>
        </div>

        <div ref={ref} className="relative">
          <svg
            viewBox="0 0 1200 560"
            className="w-full"
            role="img"
            aria-label="Карта маршрутов из Москвы"
          >
            <defs>
              <linearGradient id="routeLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F598F2" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#F598F2" stopOpacity="0.9" />
              </linearGradient>
              <radialGradient id="hubGlow">
                <stop offset="0%" stopColor="#F598F2" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F598F2" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* flight paths draw in on reveal */}
            {ROUTES.map((r, i) => (
              <path
                key={r.name}
                d={r.d}
                fill="none"
                stroke="url(#routeLine)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                style={{
                  strokeDashoffset: visible ? 0 : 1600,
                  strokeDasharray: visible ? '6 6' : 1600,
                  transition: `stroke-dashoffset 1.6s var(--ease-spring) ${
                    0.1 + i * 0.12
                  }s`,
                }}
              />
            ))}

            {/* destination nodes */}
            {ROUTES.map((r, i) => (
              <g
                key={`n-${r.name}`}
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.6 + i * 0.12}s`,
                }}
              >
                <circle cx={r.x} cy={r.y} r="10" fill="#F598F2" opacity="0.12" />
                <circle cx={r.x} cy={r.y} r="3.5" fill="#fff" />
                <text
                  x={r.x + 14}
                  y={r.y + 4}
                  fill="rgba(255,255,255,0.7)"
                  fontSize="15"
                  fontWeight="500"
                  className="font-sans"
                >
                  {r.name}
                </text>
              </g>
            ))}

            {/* hub */}
            <circle cx={HUB.x} cy={HUB.y} r="60" fill="url(#hubGlow)" />
            <circle cx={HUB.x} cy={HUB.y} r="6" fill="#F598F2" />
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r="6"
              fill="none"
              stroke="#F598F2"
              strokeWidth="1.5"
            >
              <animate
                attributeName="r"
                from="6"
                to="26"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.9"
                to="0"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={HUB.x - 4}
              y={HUB.y - 22}
              fill="#fff"
              fontSize="17"
              fontWeight="600"
              letterSpacing="1"
              className="font-sans"
            >
              {HUB.name}
            </text>

            {/* plane travelling the Dubai arc */}
            <g>
              <path
                transform="translate(-9,-9) scale(0.75)"
                d="M2.5 12 22 4l-6.2 8L22 20 2.5 12zm0 0L9 12"
                fill="#fff"
              />
              <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" path={PLANE_PATH} />
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
