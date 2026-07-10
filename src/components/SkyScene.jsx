import { useId } from 'react'

/**
 * 2D sky seen from the ground looking straight up. Three moods crossfade
 * with the hero's route switcher: aurora night, night meridian and a sunset
 * horizon. A jet passes overhead — drawn from below (belly, spread wings,
 * nav lights) — trailing twin contrails as it crosses the sky. Pure SVG/CSS.
 */
export default function SkyScene({ activeIndex }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#05060a]" aria-hidden="true">
      <Scene active={activeIndex === 0}>
        <Aurora />
      </Scene>
      <Scene active={activeIndex === 1}>
        <Meridian />
      </Scene>
      <Scene active={activeIndex === 2}>
        <Sunset />
      </Scene>

      {/* readability overlays */}
      <div className="absolute inset-0 z-[1] bg-black/20" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/25 to-black/40" />
    </div>
  )
}

function Scene({ active, children }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}

/* ---------------- Scene 1 — Northern lights ---------------- */
function Aurora() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#081a30] via-[#0a0f1e] to-[#050509]">
      <Stars count={90} />
      {/* aurora curtains overhead */}
      <div className="absolute inset-x-0 top-0 h-[70%]">
        <div
          className="absolute left-[8%] top-0 h-full w-[46%] rounded-[50%] blur-[70px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(56,232,201,0.5), rgba(122,90,248,0.22) 60%, transparent)',
            animation: 'auroraSway 11s ease-in-out infinite',
          }}
        />
        <div
          className="absolute right-[6%] top-[3%] h-full w-[40%] rounded-[50%] blur-[80px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(245,152,242,0.45), rgba(56,150,232,0.18) 55%, transparent)',
            animation: 'auroraSway 14s ease-in-out infinite reverse',
          }}
        />
      </div>
      <MoonGlow x="74%" y="16%" size={130} color="rgba(220,235,255,0.9)" />
      <Clouds tint="rgba(180,200,230,0.10)" />
      {/* bottom-left → top-right */}
      <Overhead path="flyDiag" rot="46deg" scale={0.6} dur="26s" trail="rgba(210,235,255,0.6)" lit />
    </div>
  )
}

/* ---------------- Scene 2 — Night meridian ---------------- */
function Meridian() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#04060f] via-[#060913] to-[#02030a]">
      <Stars count={130} />
      <MoonGlow x="20%" y="14%" size={110} color="rgba(200,214,255,0.85)" />
      <Clouds tint="rgba(120,150,220,0.07)" />
      {/* left → right (horizontal), upper sky */}
      <Overhead path="flyLTR" rot="90deg" scale={0.58} dur="24s" top="20vh" trail="rgba(150,185,255,0.55)" lit accent="#7a5af8" />
    </div>
  )
}

/* ---------------- Scene 3 — Sunset horizon ---------------- */
function Sunset() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#1c1338] via-[#5a2f63] to-[#e79a6e]">
      <Stars count={26} opacity={0.5} area={40} />
      <MoonGlow x="50%" y="18%" size={150} color="rgba(255,225,180,0.55)" />
      <Clouds tint="rgba(255,190,170,0.28)" big />
      {/* top-left → bottom-right (descending toward the horizon) */}
      <Overhead path="flyTLBR" rot="135deg" scale={0.6} dur="28s" trail="rgba(255,235,215,0.6)" silhouette />
    </div>
  )
}

/* ---------------- Plane seen from below, crossing overhead ---------------- */
function Overhead({ path = 'flyDiag', rot, scale = 1, dur, delay = '0s', left = '0%', top = '0', trail, lit, accent = '#F598F2', silhouette }) {
  return (
    <div
      className="sky-plane absolute left-0 will-change-transform"
      style={{
        top,
        left,
        '--fly-rot': rot,
        '--fly-scale': scale,
        animation: `${path} ${dur} linear ${delay} infinite`,
      }}
    >
      <div style={{ animation: 'swayX 6s ease-in-out infinite' }}>
        <Jet trail={trail} lit={lit} accent={accent} silhouette={silhouette} />
      </div>
    </div>
  )
}

function Jet({ trail, lit, accent, silhouette }) {
  // stable unique gradient ids so multiple jets don't clash
  const uid = useId().replace(/[:]/g, '')
  const topCol = silhouette ? '#241a30' : '#20293b'
  const midCol = silhouette ? '#15101d' : '#111725'
  const botCol = silhouette ? '#0b0812' : '#080b13'
  const rim = silhouette ? 'rgba(120,95,150,0.7)' : 'rgba(200,220,255,0.5)'
  const dark = silhouette ? '#0b0812' : '#161c2b'
  return (
    <svg
      viewBox="0 0 160 350"
      width="150"
      className="overflow-visible"
      style={{
        animation: 'bankRoll 9s ease-in-out infinite',
        filter: silhouette
          ? 'drop-shadow(0 0 6px rgba(255,210,170,0.25))'
          : 'drop-shadow(0 0 6px rgba(180,205,255,0.32))',
      }}
    >
      <defs>
        <linearGradient id={`ctrail-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={trail} stopOpacity="0.9" />
          <stop offset="55%" stopColor={trail} stopOpacity="0.35" />
          <stop offset="100%" stopColor={trail} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={midCol} />
          <stop offset="42%" stopColor={topCol} />
          <stop offset="58%" stopColor={topCol} />
          <stop offset="100%" stopColor={botCol} />
        </linearGradient>
        <linearGradient id={`wing-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={topCol} />
          <stop offset="100%" stopColor={botCol} />
        </linearGradient>
        <radialGradient id={`eglow-${uid}`}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* tapered twin contrails from the aft engines */}
      <polygon points="64,178 70,178 68,346 66,346" fill={`url(#ctrail-${uid})`} />
      <polygon points="90,178 96,178 94,346 92,346" fill={`url(#ctrail-${uid})`} />

      {/* soft engine glow */}
      {lit && (
        <>
          <circle cx="63" cy="182" r="10" fill={`url(#eglow-${uid})`} style={{ animation: 'enginePulse 1.8s ease-in-out infinite' }} />
          <circle cx="97" cy="182" r="10" fill={`url(#eglow-${uid})`} style={{ animation: 'enginePulse 1.8s ease-in-out infinite 0.3s' }} />
        </>
      )}

      {/* swept main wings with raked tips */}
      <path d="M72 104 L12 150 L20 159 L74 126 Z" fill={`url(#wing-${uid})`} />
      <path d="M88 104 L148 150 L140 159 L86 126 Z" fill={`url(#wing-${uid})`} />
      {/* raked winglets */}
      <path d="M12 150 L5 140 L17 149 Z" fill={dark} />
      <path d="M148 150 L155 140 L143 149 Z" fill={dark} />

      {/* aft-mounted engine nacelles */}
      <rect x="57" y="150" width="11" height="32" rx="5.5" fill={dark} />
      <rect x="92" y="150" width="11" height="32" rx="5.5" fill={dark} />
      <ellipse cx="62.5" cy="182" rx="4" ry="2.4" fill={silhouette ? '#060409' : '#05070d'} />
      <ellipse cx="97.5" cy="182" rx="4" ry="2.4" fill={silhouette ? '#060409' : '#05070d'} />

      {/* fuselage with metallic gradient */}
      <path
        d="M80 16
           Q89 26 89 58 L90 150 Q90 176 84 196 L80 206 L76 196 Q70 176 70 150 L71 58 Q71 26 80 16 Z"
        fill={`url(#body-${uid})`}
      />
      {/* spine highlight */}
      <path d="M80 24 L80 190" stroke={rim} strokeWidth="1.4" strokeOpacity="0.8" />

      {/* T-tail horizontal stabiliser */}
      <path d="M78 184 L52 202 L59 207 L80 192 Z" fill={`url(#wing-${uid})`} />
      <path d="M82 184 L108 202 L101 207 L80 192 Z" fill={`url(#wing-${uid})`} />

      {/* cockpit glint */}
      {!silhouette && <ellipse cx="80" cy="30" rx="4.5" ry="7" fill="rgba(150,195,255,0.5)" />}

      {/* nav lights: red port, green starboard, tail + nose strobes */}
      {lit && (
        <>
          <circle cx="12" cy="150" r="3.2" fill="#ff4d4d">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="148" cy="150" r="3.2" fill="#49e07a">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="204" r="2.4" fill={accent} style={{ animation: 'blink 2.4s infinite' }} />
          <circle cx="80" cy="26" r="2.2" fill="#fff" style={{ animation: 'blink 1.3s infinite' }} />
        </>
      )}
    </svg>
  )
}

/* ---------------- Shared atmosphere ---------------- */
function Stars({ count = 60, opacity = 0.9, area = 75 }) {
  const stars = Array.from({ length: count }).map((_, i) => ({
    left: (i * 53) % 100,
    top: (i * 31) % area,
    s: (i % 3) + 1,
    d: (i % 5) + 3,
  }))
  return (
    <div className="absolute inset-0">
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${st.left}%`,
            top: `${st.top}%`,
            width: st.s,
            height: st.s,
            opacity,
            animation: `twinkle ${st.d}s ease-in-out ${i % 4}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function MoonGlow({ x, y, size = 120, color }) {
  return (
    <div
      className="absolute rounded-full blur-[2px]"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0.22) 42%, transparent 68%)`,
      }}
    />
  )
}

/* clouds seen from below, drifting upward across the field of view */
function Clouds({ tint, big }) {
  const rows = big
    ? [
        { left: '12%', d: '34s', scale: 1.2, delay: '0s' },
        { left: '62%', d: '46s', scale: 0.9, delay: '-18s' },
        { left: '38%', d: '54s', scale: 0.7, delay: '-30s' },
      ]
    : [
        { left: '18%', d: '52s', scale: 1, delay: '0s' },
        { left: '68%', d: '64s', scale: 0.75, delay: '-24s' },
        { left: '44%', d: '80s', scale: 0.55, delay: '-40s' },
      ]
  return (
    <div className="absolute inset-0 overflow-hidden">
      {rows.map((r, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{ left: r.left, '--d-scale': r.scale, animation: `driftUp ${r.d} linear ${r.delay} infinite` }}
        >
          <svg viewBox="0 0 300 90" width="300" style={{ filter: 'blur(2px)' }}>
            <g fill={tint}>
              <ellipse cx="70" cy="60" rx="66" ry="20" />
              <ellipse cx="140" cy="48" rx="52" ry="26" />
              <ellipse cx="210" cy="58" rx="74" ry="18" />
              <ellipse cx="250" cy="52" rx="40" ry="20" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  )
}
