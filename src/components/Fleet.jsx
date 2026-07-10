import { useState } from 'react'
import { ArrowUpRight, Eye, Plane } from 'lucide-react'
import { FLEET } from '../data/fleet'
import { useReveal } from '../hooks/useReveal'
import { useApp } from '../store/AppContext'

const today = new Date().toISOString().slice(0, 10)

export default function Fleet() {
  const [ref, visible] = useReveal(0.2)
  const { startBooking } = useApp()
  const [idx, setIdx] = useState(1)
  const [view, setView] = useState('exterior') // 'exterior' | 'cabin'
  const ac = FLEET[idx]

  const pick = (i) => {
    setIdx(i)
    setView('exterior')
  }

  return (
    <section
      id="fleet"
      className="relative overflow-hidden border-b border-white/10 bg-white/[0.02]"
      aria-label="Флот"
    >
      <div className="mx-auto max-w-[1340px] px-[15px] py-[140px] mobile:px-[18px] mobile:py-[90px]">
        {/* heading + tier tabs */}
        <div ref={ref} className="mb-12 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
          <div>
            <span
              className={`reveal-up ${visible ? 'is-visible' : ''} mb-4 block text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]`}
            >
              Флот
            </span>
            <h2
              className={`reveal-up ${visible ? 'is-visible' : ''} text-[52px] font-medium leading-[0.98] tracking-[-2px] md-tablet:text-[40px] mobile:text-[32px]`}
            >
              Три борта — <span className="text-white/45">три способа летать.</span>
            </h2>
          </div>

          <div className="flex rounded-full border border-white/10 p-1">
            {FLEET.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => pick(i)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  i === idx ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                {f.tier}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1.1fr] gap-14 md-tablet:gap-8 mobile:grid-cols-1 mobile:gap-10">
          {/* Left: model info */}
          <div className="flex flex-col">
            <div className="mb-1 flex items-baseline gap-3">
              <h3 className="text-4xl font-medium tracking-[-1px]">{ac.model}</h3>
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                {ac.tier}
              </span>
            </div>
            <span className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-white/35">
              {ac.ref}
            </span>
            <p className="mb-8 max-w-[440px] text-base font-medium leading-6 tracking-[-0.16px] text-white/60">
              {ac.tagline}
            </p>

            <dl className="mb-8 grid grid-cols-2 gap-x-8 gap-y-6">
              {ac.specs.map((s) => (
                <div key={s.k} className="border-t border-white/10 pt-3">
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

            {/* seat model (side profile) */}
            <div className="mb-8 flex items-center gap-5 rounded-2xl border border-white/10 bg-black/30 p-5">
              <SeatProfile type={ac.seatProfile} accent={ac.accent} />
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-white/40">
                  Модель кресла
                </div>
                <p className="max-w-[280px] text-sm text-white/70">{ac.seatNote}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => startBooking({ fromCode: 'SVO', toCode: 'DXB', date: today, pax: 1 })}
              className="fill-btn group inline-flex w-fit items-center gap-2 rounded-full border border-white px-6 py-3.5 text-sm font-medium tracking-[0.02em]"
            >
              Забронировать {ac.tier.toLowerCase()}
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Right: interactive aircraft */}
          <div className="glow-card relative flex flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 mobile:p-5">
            {/* view toggle */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex rounded-full border border-white/10 p-1 text-xs">
                {[
                  ['exterior', 'Снаружи', Plane],
                  ['cabin', 'Салон', Eye],
                ].map(([id, label, Icon]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setView(id)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-medium transition-colors ${
                      view === id ? 'bg-white text-black' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                {view === 'exterior' ? 'нажмите на борт →' : 'схема салона'}
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center py-4">
              {view === 'exterior' ? (
                <button
                  type="button"
                  onClick={() => setView('cabin')}
                  aria-label="Показать салон"
                  className="group w-full"
                  title="Показать салон"
                >
                  <AircraftSide frame={ac.frame} accent={ac.accent} />
                </button>
              ) : (
                <SeatMap cabin={ac.cabin} accent={ac.accent} tier={ac.tier} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Exterior: realistic side profile ---------- */
function AircraftSide({ frame, accent }) {
  const gid = `body-${frame}`
  return (
    <svg
      viewBox="0 0 360 170"
      className="mx-auto w-full max-w-[560px] overflow-visible transition-transform duration-500 group-hover:scale-[1.03]"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6f8fc" />
          <stop offset="52%" stopColor="#ccd4e3" />
          <stop offset="100%" stopColor="#828da3" />
        </linearGradient>
      </defs>
      {frame === 'jet' ? <BizJet gid={gid} accent={accent} /> : <Airliner gid={gid} accent={accent} />}
      {/* ground shadow */}
      <ellipse cx="185" cy="158" rx="120" ry="7" fill="#000" opacity="0.28" />
    </svg>
  )
}

/* Conventional airliner (A320/A321-style): under-wing engines, swept fin */
function Airliner({ gid, accent }) {
  const url = `url(#${gid})`
  return (
    <g>
      {/* vertical stabiliser (tail fin) at left */}
      <path d="M40 78 L58 26 L82 30 L74 80 Z" fill={url} />
      <path d="M52 44 L64 34 L72 37 L66 50 Z" fill={accent} opacity="0.5" />
      {/* horizontal stabiliser */}
      <path d="M52 84 L16 72 L20 86 L58 92 Z" fill={url} />
      {/* far wing hint */}
      <path d="M196 96 L150 118 L164 118 L214 100 Z" fill="#9aa6bc" opacity="0.55" />
      {/* fuselage */}
      <path
        d="M44 92 Q50 70 84 68 L286 66 Q322 68 336 84 Q322 98 286 100 L84 100 Q50 100 44 92 Z"
        fill={url}
      />
      {/* nose cap */}
      <path d="M322 76 Q338 84 322 92 Q330 84 322 76 Z" fill="#eef2f8" />
      {/* cockpit windows */}
      <path d="M300 76 Q314 77 320 82 L314 86 Q304 85 300 83 Z" fill="#28324a" />
      {/* window row */}
      {Array.from({ length: 26 }).map((_, i) => (
        <circle key={i} cx={96 + i * 8} cy="82" r="2" fill="#28324a" opacity="0.8" />
      ))}
      {/* cheatline */}
      <path d="M60 90 L320 88" stroke={accent} strokeWidth="3" opacity="0.85" />
      {/* near wing + engine */}
      <path d="M188 96 L150 132 L168 132 L214 100 Z" fill={url} />
      <g>
        <ellipse cx="176" cy="116" rx="17" ry="8" fill="#3a4256" />
        <ellipse cx="190" cy="116" rx="4" ry="6" fill="#20283a" />
      </g>
    </g>
  )
}

/* Business jet (Gulfstream G650-style): aft-fuselage engines, T-tail,
   oval windows, winglet — redrawn from the real jet's silhouette. */
function BizJet({ gid, accent }) {
  const url = `url(#${gid})`
  return (
    <g>
      {/* T-tail: vertical fin at left */}
      <path d="M44 84 L60 26 L74 28 L72 84 Z" fill={url} />
      {/* horizontal stabiliser mounted on TOP of the fin */}
      <path d="M40 30 L8 22 L12 32 L56 36 Z" fill={url} />
      {/* far wing hint */}
      <path d="M210 96 L168 120 L180 120 L226 100 Z" fill="#9aa6bc" opacity="0.5" />
      {/* slender fuselage with a slightly drooped nose */}
      <path
        d="M52 88 Q58 70 92 68 L280 66 Q318 67 340 82 Q343 85 340 88 Q318 96 280 96 L92 96 Q58 98 52 88 Z"
        fill={url}
      />
      {/* drooped nose cap */}
      <path d="M326 78 Q344 84 330 93 Q336 85 326 80 Z" fill="#eef2f8" />
      {/* cockpit */}
      <path d="M300 74 Q316 75 324 81 L318 86 Q306 84 300 82 Z" fill="#26304a" />
      {/* signature oval windows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse key={i} cx={132 + i * 20} cy="80" rx="6" ry="4.5" fill="#26304a" opacity="0.85" />
      ))}
      {/* Gulfstream cheatline sweeping up toward the tail */}
      <path d="M70 90 Q200 88 300 84 L316 82" stroke={accent} strokeWidth="3" fill="none" opacity="0.9" />
      {/* aft-mounted engine pod on the rear fuselage */}
      <g>
        <path d="M78 62 Q104 56 120 62 Q120 74 104 76 Q86 76 78 72 Z" fill="#3a4256" />
        <ellipse cx="80" cy="67" rx="3.5" ry="6" fill="#20283a" />
      </g>
      {/* low swept wing + winglet */}
      <path d="M196 94 L150 126 L166 126 L220 98 Z" fill={url} />
      <path d="M150 126 L146 114 L156 121 Z" fill={url} />
    </g>
  )
}

/* ---------- Interior: top-down seat map ---------- */
function SeatMap({ cabin, accent, tier }) {
  const { rows, layout, seatW, seatH, gap } = cabin
  const cols = layout.length
  const padX = 34
  const padTop = 54
  const padBottom = 30
  const w = padX * 2 + cols * (seatW + gap) - gap
  const h = padTop + padBottom + rows * (seatH + gap) - gap
  const cx = w / 2

  let seatNo = 0
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto h-full max-h-[360px] w-auto">
      {/* fuselage shell with nose */}
      <path
        d={`M12 ${padTop - 8}
            Q${cx} 4 ${w - 12} ${padTop - 8}
            L${w - 12} ${h - 14}
            Q${cx} ${h - 2} 12 ${h - 14} Z`}
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.5"
      />
      {/* nose window / cockpit */}
      <ellipse cx={cx} cy={padTop - 26} rx="16" ry="9" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" />
      <text x={cx} y={h - 20} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" className="font-sans uppercase" letterSpacing="2">
        {tier}
      </text>

      {Array.from({ length: rows }).map((_, r) => {
        let x = padX
        return layout.map((cell, c) => {
          const y = padTop + r * (seatH + gap)
          if (cell === 'a') {
            x += seatW + gap
            return null
          }
          const sx = x
          x += seatW + gap
          seatNo += 1
          const delay = (r * cols + c) * 0.02
          return (
            <g key={`${r}-${c}`} style={{ opacity: 0, animation: `videoFadeIn 0.4s ease ${delay}s forwards` }}>
              {/* seat base */}
              <rect x={sx} y={y} width={seatW} height={seatH} rx={Math.min(6, seatW / 4)}
                fill={accent} fillOpacity="0.16" stroke={accent} strokeOpacity="0.7" strokeWidth="1.2" />
              {/* headrest */}
              <rect x={sx + seatW * 0.2} y={y + 2} width={seatW * 0.6} height={Math.max(4, seatH * 0.22)} rx="2"
                fill={accent} fillOpacity="0.5" />
            </g>
          )
        })
      })}
    </svg>
  )
}

/* ---------- Seat side profile per class ---------- */
function SeatProfile({ type, accent }) {
  return (
    <svg viewBox="0 0 130 96" className="h-[92px] w-[120px] shrink-0">
      <g stroke={accent} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {type === 'economy' && (
          <>
            {/* upright seat */}
            <path d="M40 20 L40 56 L86 56 L86 66 L96 66" fill={accent} fillOpacity="0.08" />
            <path d="M40 20 Q38 20 38 24 L38 54 Q40 58 46 58 L84 58" />
            <path d="M40 58 L40 76 M84 58 L84 76" />
            <path d="M42 24 L42 52" strokeOpacity="0.4" />
          </>
        )}
        {type === 'business' && (
          <>
            {/* reclined lie-flat pod */}
            <path d="M24 44 L96 40 L104 44 L104 54 L26 58 Z" fill={accent} fillOpacity="0.1" />
            <path d="M24 44 L96 40" />
            <path d="M20 34 Q24 32 30 34 L34 46" />
            <path d="M24 58 L24 72 M104 54 L104 72" />
            <path d="M100 30 L110 30" strokeOpacity="0.5" />
          </>
        )}
        {type === 'lux' && (
          <>
            {/* private suite with bed */}
            <rect x="20" y="30" width="90" height="44" rx="6" fill={accent} fillOpacity="0.08" />
            <path d="M26 58 L104 58" />
            <path d="M30 58 L30 48 Q30 44 36 44 L52 44" />
            <circle cx="40" cy="50" r="5" strokeOpacity="0.7" />
            <path d="M20 30 L20 74 M110 30 L110 74" strokeOpacity="0.5" />
          </>
        )}
      </g>
    </svg>
  )
}
