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
      className="absolute left-0 will-change-transform"
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
  const body = silhouette ? '#140f1e' : '#0e131f'
  const rim = silhouette ? '#2a2036' : 'rgba(210,224,255,0.35)'
  return (
    <svg viewBox="0 0 160 340" width="160" className="overflow-visible">
      <defs>
        <linearGradient id="ctrail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={trail} stopOpacity="0.9" />
          <stop offset="100%" stopColor={trail} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* twin contrails streaming from the engines, trailing behind (down) */}
      <rect x="60" y="150" width="4" height="180" rx="2" fill="url(#ctrail)" />
      <rect x="96" y="150" width="4" height="180" rx="2" fill="url(#ctrail)" />

      {/* main wings, swept back (tips toward tail) */}
      <path d="M74 96 L14 150 L20 158 L76 118 Z" fill={body} />
      <path d="M86 96 L146 150 L140 158 L84 118 Z" fill={body} />
      {/* winglets */}
      <path d="M14 150 L10 140 L18 146 Z" fill={body} />
      <path d="M146 150 L150 140 L142 146 Z" fill={body} />

      {/* engine pods */}
      <rect x="58" y="112" width="9" height="22" rx="4" fill={silhouette ? '#0c0912' : '#1a2030'} />
      <rect x="93" y="112" width="9" height="22" rx="4" fill={silhouette ? '#0c0912' : '#1a2030'} />

      {/* fuselage */}
      <path d="M80 20 Q90 24 91 60 L92 150 Q90 168 80 172 Q70 168 68 150 L69 60 Q70 24 80 20 Z" fill={body} />
      {/* rim highlight down the spine */}
      <path d="M80 24 L80 168" stroke={rim} strokeWidth="1.4" />
      {/* horizontal stabilisers near tail */}
      <path d="M74 150 L48 172 L52 177 L76 160 Z" fill={body} />
      <path d="M86 150 L112 172 L108 177 L84 160 Z" fill={body} />

      {/* cockpit hint */}
      {!silhouette && <ellipse cx="80" cy="34" rx="5" ry="7" fill="rgba(180,210,255,0.4)" />}

      {/* aviation nav lights: red port, green starboard, white tail strobe */}
      {lit && (
        <>
          <circle cx="16" cy="150" r="3.2" fill="#ff4d4d">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="144" cy="150" r="3.2" fill="#49e07a">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="170" r="2.6" fill={accent} style={{ animation: 'blink 2.4s infinite' }} />
          <circle cx="80" cy="30" r="2.4" fill="#fff" style={{ animation: 'blink 1.3s infinite' }} />
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
