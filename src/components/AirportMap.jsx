import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

// Real business-aviation airports / FBOs, positioned by true coordinates.
const AIRPORTS = [
  { code: 'VKO', city: 'Москва', name: 'Внуково-3', lon: 37.6, lat: 55.6, hub: true },
  { code: 'LED', city: 'Санкт-Петербург', name: 'Пулково', lon: 30.3, lat: 59.8 },
  { code: 'LBG', city: 'Париж', name: 'Ле-Бурже', lon: 2.4, lat: 49.0 },
  { code: 'FAB', city: 'Лондон', name: 'Фарнборо', lon: -0.8, lat: 51.3 },
  { code: 'GVA', city: 'Женева', name: 'Женева', lon: 6.1, lat: 46.2 },
  { code: 'NCE', city: 'Ницца', name: 'Лазурный берег', lon: 7.2, lat: 43.7 },
  { code: 'DWC', city: 'Дубай', name: 'Аль-Мактум', lon: 55.2, lat: 24.9 },
  { code: 'TEB', city: 'Нью-Йорк', name: 'Тетерборо', lon: -74.1, lat: 40.9 },
  { code: 'VNY', city: 'Лос-Анджелес', name: 'Ван-Найс', lon: -118.5, lat: 34.2 },
  { code: 'HND', city: 'Токио', name: 'Ханэда', lon: 139.8, lat: 35.6 },
  { code: 'MLE', city: 'Мале', name: 'Велана', lon: 73.5, lat: 4.2 },
  { code: 'DPS', city: 'Бали', name: 'Нгурах-Рай', lon: 115.2, lat: -8.8 },
]

// Overlay canvas matches the world-map image aspect (626×417).
const W = 1000
const H = 666
// Geographic bounds of the reference image (calibrated to the artwork).
const LON_MIN = -169
const LON_MAX = 191
const LAT_MAX = 83.5
const LAT_MIN = -58
const proj = (lon, lat) => [
  ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W,
  ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H,
]

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

        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080a10]"
          style={{ aspectRatio: '626 / 417' }}
        >
          {/* real world map, recoloured for the dark theme */}
          <img
            src="/jets/world-map.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'invert(1) brightness(1.9) contrast(0.85)', mixBlendMode: 'screen', opacity: 0.42 }}
          />
          {/* soft vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_40%,transparent_55%,rgba(0,0,0,0.5)_100%)]" />

          {/* nodes + arcs overlay */}
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            {/* arcs from the hub */}
            <g fill="none" stroke="var(--accent)" strokeWidth="1.4" vectorEffect="non-scaling-stroke">
              {AIRPORTS.filter((a) => !a.hub).map((a, i) => {
                const [x, y] = proj(a.lon, a.lat)
                const mx = (hx + x) / 2
                const my = (hy + y) / 2 - Math.abs(x - hx) * 0.16 - 24
                return (
                  <path
                    key={a.code}
                    d={`M${hx},${hy} Q${mx},${my} ${x},${y}`}
                    strokeDasharray="1600"
                    style={{
                      strokeDashoffset: visible ? 0 : 1600,
                      opacity: active && active.code !== a.code ? 0.2 : 0.5,
                      transition: `stroke-dashoffset 1.7s var(--ease-spring) ${0.1 + i * 0.07}s, opacity 0.3s ease`,
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
                  <circle cx={x} cy={y} r="20" fill="transparent" />
                  {a.hub ? (
                    <>
                      <circle cx={x} cy={y} r="6" fill="var(--accent)" />
                      <circle cx={x} cy={y} r="6" fill="none" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
                        <animate attributeName="r" from="6" to="24" dur="2.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" repeatCount="indefinite" />
                      </circle>
                    </>
                  ) : (
                    <>
                      <circle cx={x} cy={y} r={on ? 6 : 3.6} fill="#fff" style={{ transition: 'r 0.2s' }} />
                      <circle cx={x} cy={y} r="3.6" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" vectorEffect="non-scaling-stroke">
                        <animate attributeName="r" from="3.6" to="12" dur="3s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="3s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  {(a.hub || on) && (
                    <text
                      x={x}
                      y={y - 14}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight={a.hub ? 600 : 500}
                      fill="#fff"
                      className="font-sans"
                      style={{ pointerEvents: 'none', paintOrder: 'stroke', stroke: '#000', strokeWidth: 3, strokeOpacity: 0.5 }}
                    >
                      {a.code}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* legend */}
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
