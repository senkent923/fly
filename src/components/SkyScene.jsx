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
        <div
          className="absolute left-[34%] top-[6%] h-full w-[34%] rounded-[50%] blur-[90px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(120,220,255,0.32), rgba(122,90,248,0.14) 60%, transparent)',
            animation: 'auroraSway 17s ease-in-out infinite',
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
  const edge = silhouette ? '#0d0912' : '#0a0f1a'
  const mid = silhouette ? '#221830' : '#26324a'
  const hi = silhouette ? '#3a2c48' : '#5f7196'
  const dark = silhouette ? '#0a0710' : '#121826'
  return (
    <svg
      viewBox="0 0 160 350"
      width="152"
      className="overflow-visible"
      style={{
        animation: 'bankRoll 9s ease-in-out infinite',
        filter: silhouette
          ? 'drop-shadow(0 1px 8px rgba(255,205,160,0.28))'
          : 'drop-shadow(0 1px 8px rgba(175,205,255,0.35))',
      }}
    >
      <defs>
        <linearGradient id={`ct-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={trail} stopOpacity="0.95" />
          <stop offset="50%" stopColor={trail} stopOpacity="0.3" />
          <stop offset="100%" stopColor={trail} stopOpacity="0" />
        </linearGradient>
        {/* metallic fuselage: dark edge → bright specular → dark edge */}
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={edge} />
          <stop offset="34%" stopColor={mid} />
          <stop offset="48%" stopColor={hi} />
          <stop offset="60%" stopColor={mid} />
          <stop offset="100%" stopColor={edge} />
        </linearGradient>
        <linearGradient id={`wingL-${uid}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor={edge} />
          <stop offset="80%" stopColor={mid} />
          <stop offset="100%" stopColor={hi} />
        </linearGradient>
        <linearGradient id={`wingR-${uid}`} x1="1" y1="0" x2="0" y2="0.3">
          <stop offset="0%" stopColor={edge} />
          <stop offset="80%" stopColor={mid} />
          <stop offset="100%" stopColor={hi} />
        </linearGradient>
        <radialGradient id={`eg-${uid}`}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <filter id={`soft-${uid}`} x="-50%" y="-20%" width="200%" height="160%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>

      {/* soft tapering twin contrails */}
      <g filter={`url(#soft-${uid})`}>
        <polygon points="63,180 69,180 67.5,344 64.5,344" fill={`url(#ct-${uid})`} />
        <polygon points="91,180 97,180 95.5,344 92.5,344" fill={`url(#ct-${uid})`} />
      </g>

      {/* engine glow */}
      {lit && (
        <>
          <circle cx="62" cy="184" r="11" fill={`url(#eg-${uid})`} style={{ animation: 'enginePulse 1.8s ease-in-out infinite' }} />
          <circle cx="98" cy="184" r="11" fill={`url(#eg-${uid})`} style={{ animation: 'enginePulse 1.8s ease-in-out infinite 0.3s' }} />
        </>
      )}

      {/* main wings — graceful swept leading edge, curved */}
      <path d="M74 100 C58 112 32 132 12 151 L21 161 C44 147 64 132 76 121 Z" fill={`url(#wingL-${uid})`} />
      <path d="M86 100 C102 112 128 132 148 151 L139 161 C116 147 96 132 84 121 Z" fill={`url(#wingR-${uid})`} />
      {/* upturned winglets */}
      <path d="M12 151 L6 138 L16 148 Z" fill={hi} />
      <path d="M148 151 L154 138 L144 148 Z" fill={hi} />

      {/* aft engine nacelles */}
      <rect x="56" y="150" width="12" height="34" rx="6" fill={dark} />
      <rect x="92" y="150" width="12" height="34" rx="6" fill={dark} />
      <ellipse cx="62" cy="184" rx="4.4" ry="2.6" fill="#04060b" />
      <ellipse cx="98" cy="184" rx="4.4" ry="2.6" fill="#04060b" />

      {/* fuselage with metallic gradient */}
      <path
        d="M80 14
           C86 22 88 44 88 70 L89 150 C89 176 85 194 82 200 L80 206 L78 200 C75 194 71 176 71 150 L72 70 C72 44 74 22 80 14 Z"
        fill={`url(#body-${uid})`}
      />
      {/* specular highlight streak */}
      <path d="M78 24 C76 60 76 130 79 190" stroke={hi} strokeWidth="1.4" strokeOpacity="0.7" fill="none" />

      {/* T-tail stabiliser */}
      <path d="M78 184 L50 202 L58 208 L80 192 Z" fill={`url(#wingL-${uid})`} />
      <path d="M82 184 L110 202 L102 208 L80 192 Z" fill={`url(#wingR-${uid})`} />

      {/* cockpit glint */}
      {!silhouette && <ellipse cx="80" cy="28" rx="4.5" ry="7.5" fill="rgba(160,205,255,0.55)" />}

      {/* nav lights */}
      {lit && (
        <>
          <circle cx="11" cy="151" r="3.3" fill="#ff4d4d">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="149" cy="151" r="3.3" fill="#49e07a">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="205" r="2.5" fill={accent} style={{ animation: 'blink 2.4s infinite' }} />
          <circle cx="80" cy="24" r="2.3" fill="#fff" style={{ animation: 'blink 1.3s infinite' }} />
        </>
      )}
    </svg>
  )
}

/* ---------------- Shared atmosphere ---------------- */
function Stars({ count = 60, opacity = 0.9, area = 75 }) {
  const stars = Array.from({ length: count }).map((_, i) => {
    const big = i % 11 === 0
    return {
      left: (i * 53) % 100,
      top: (i * 31) % area,
      s: big ? 2.5 : (i % 3) + 1,
      d: (i % 5) + 3,
      big,
    }
  })
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
            boxShadow: st.big ? '0 0 6px 1px rgba(255,255,255,0.8)' : 'none',
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
