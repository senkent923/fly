import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

// Real business-aviation airports / FBOs, positioned by true coordinates.
const AIRPORTS = [
  { code: 'VKO', city: 'Москва', name: 'Внуково-3', lon: 37.27, lat: 55.6, hub: true },
  { code: 'LED', city: 'Санкт-Петербург', name: 'Пулково', lon: 30.26, lat: 59.8 },
  { code: 'LBG', city: 'Париж', name: 'Ле-Бурже', lon: 2.44, lat: 48.97 },
  { code: 'FAB', city: 'Лондон', name: 'Фарнборо', lon: -0.78, lat: 51.28 },
  { code: 'GVA', city: 'Женева', name: 'Женева', lon: 6.11, lat: 46.24 },
  { code: 'NCE', city: 'Ницца', name: 'Лазурный берег', lon: 7.22, lat: 43.66 },
  { code: 'DWC', city: 'Дубай', name: 'Аль-Мактум', lon: 55.16, lat: 24.9 },
  { code: 'TEB', city: 'Нью-Йорк', name: 'Тетерборо', lon: -74.06, lat: 40.85 },
  { code: 'VNY', city: 'Лос-Анджелес', name: 'Ван-Найс', lon: -118.49, lat: 34.21 },
  { code: 'HND', city: 'Токио', name: 'Ханэда', lon: 139.78, lat: 35.55 },
  { code: 'MLE', city: 'Мале', name: 'Велана', lon: 73.53, lat: 4.19 },
  { code: 'DPS', city: 'Бали', name: 'Нгурах-Рай', lon: 115.17, lat: -8.75 },
]

// Rough continent outlines (lon/lat) for a subtle land hint.
const CONTINENTS = [
  [[-168, 66], [-95, 72], [-52, 58], [-58, 45], [-80, 26], [-98, 17], [-112, 24], [-125, 40], [-158, 58]],
  [[-80, 9], [-52, 3], [-35, -6], [-38, -22], [-56, -34], [-72, -52], [-71, -30], [-78, -5]],
  [[-10, 58], [28, 60], [45, 48], [30, 40], [10, 36], [-9, 37], [-10, 48]],
  [[-16, 34], [10, 36], [33, 31], [52, 11], [48, -15], [26, -34], [15, -20], [8, 3], [-16, 18]],
  [[30, 60], [60, 66], [110, 72], [145, 62], [142, 35], [122, 22], [100, 8], [75, 22], [48, 38], [35, 48]],
  [[113, -13], [132, -11], [148, -18], [152, -34], [128, -33], [115, -25]],
]

const W = 1000
const H = 500
const proj = (lon, lat) => [((lon + 180) / 360) * W, ((90 - lat) / 180) * H]

const hub = AIRPORTS.find((a) => a.hub)

export default function AirportMap() {
  const [ref, visible] = useReveal(0.2)
  const [active, setActive] = useState(null)

  const [hx, hy] = proj(hub.lon, hub.lat)

  return (
    <section
      id="airports"
      className="relative overflow-hidden border-b border-white/10"
      aria-label="Карта аэропортов"
    >
      <div className="mx-auto max-w-[1340px] px-[15px] py-[140px] mobile:px-[18px] mobile:py-[90px]">
        <div className="mb-10 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
          <div>
            <span className="mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]">
              Карта аэропортов
            </span>
            <h2 className="text-[52px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[40px] mobile:text-[32px]">
              Терминалы бизнес-авиации<br />
              <span className="text-white/45">по всему миру.</span>
            </h2>
          </div>
          {/* live caption reacting to hover */}
          <div className="min-h-[44px] text-right mobile:text-left" aria-live="polite">
            {active ? (
              <>
                <div className="text-lg font-medium">
                  {active.code} · {active.name}
                </div>
                <div className="text-sm text-white/45">{active.city}</div>
              </>
            ) : (
              <div className="max-w-[280px] text-sm text-white/45 mobile:max-w-none">
                {AIRPORTS.length} частных терминалов. Наведите на точку.
              </div>
            )}
          </div>
        </div>

        <div ref={ref} className="rounded-3xl border border-white/10 bg-[#06070c] p-4 mobile:p-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Мировая карта аэропортов">
            {/* graticule */}
            <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
              {Array.from({ length: 11 }, (_, i) => -150 + i * 30).map((lon) => {
                const x = proj(lon, 0)[0]
                return <line key={`v${lon}`} x1={x} y1="0" x2={x} y2={H} />
              })}
              {Array.from({ length: 5 }, (_, i) => -60 + i * 30).map((lat) => {
                const y = proj(0, lat)[1]
                return <line key={`h${lat}`} x1="0" y1={y} x2={W} y2={y} />
              })}
            </g>
            {/* equator a touch brighter */}
            <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* subtle continents */}
            <g fill="rgba(150,170,210,0.07)">
              {CONTINENTS.map((poly, i) => (
                <polygon key={i} points={poly.map(([lo, la]) => proj(lo, la).join(',')).join(' ')} />
              ))}
            </g>

            {/* arcs from the hub */}
            <g fill="none" stroke="var(--accent)" strokeWidth="1.4">
              {AIRPORTS.filter((a) => !a.hub).map((a, i) => {
                const [x, y] = proj(a.lon, a.lat)
                const mx = (hx + x) / 2
                const my = (hy + y) / 2 - Math.abs(x - hx) * 0.12 - 20
                const d = `M${hx},${hy} Q${mx},${my} ${x},${y}`
                return (
                  <path
                    key={a.code}
                    d={d}
                    strokeDasharray="1400"
                    style={{
                      strokeDashoffset: visible ? 0 : 1400,
                      opacity: active && active.code !== a.code && active.code !== 'VKO' ? 0.25 : 0.55,
                      transition: `stroke-dashoffset 1.6s var(--ease-spring) ${0.1 + i * 0.08}s, opacity 0.3s ease`,
                    }}
                  />
                )
              })}
            </g>

            {/* nodes */}
            {AIRPORTS.map((a, i) => {
              const [x, y] = proj(a.lon, a.lat)
              const on = active?.code === a.code
              return (
                <g
                  key={a.code}
                  style={{ opacity: visible ? 1 : 0, transition: `opacity 0.5s ease ${0.5 + i * 0.06}s`, cursor: 'pointer' }}
                  onMouseEnter={() => setActive(a)}
                  onMouseLeave={() => setActive(null)}
                >
                  {/* larger invisible hit area */}
                  <circle cx={x} cy={y} r="16" fill="transparent" />
                  {a.hub ? (
                    <>
                      <circle cx={x} cy={y} r="7" fill="var(--accent)" />
                      <circle cx={x} cy={y} r="7" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                        <animate attributeName="r" from="7" to="22" dur="2.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" repeatCount="indefinite" />
                      </circle>
                    </>
                  ) : (
                    <>
                      <circle cx={x} cy={y} r={on ? 6 : 4} fill="#fff" style={{ transition: 'r 0.2s' }} />
                      <circle cx={x} cy={y} r="4" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1">
                        <animate attributeName="r" from="4" to="12" dur="3s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="3s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  {(a.hub || on) && (
                    <text
                      x={x}
                      y={y - 14}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight={a.hub ? 600 : 500}
                      fill="#fff"
                      className="font-sans"
                      style={{ pointerEvents: 'none' }}
                    >
                      {a.code}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* legend: full list of terminals */}
        <ul className="mt-8 grid grid-cols-4 gap-x-6 gap-y-3 md-tablet:grid-cols-3 mobile:grid-cols-2">
          {AIRPORTS.map((a) => (
            <li
              key={a.code}
              onMouseEnter={() => setActive(a)}
              onMouseLeave={() => setActive(null)}
              className="flex items-baseline gap-2 border-t border-white/10 pt-2 text-sm"
            >
              <span className={`font-medium ${a.hub ? 'text-[var(--accent)]' : 'text-white/80'}`}>{a.code}</span>
              <span className="text-white/40">·</span>
              <span className="truncate text-white/55">{a.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
