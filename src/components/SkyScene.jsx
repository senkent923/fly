/**
 * Fully 2D animated sky background (replaces the video). Three moods
 * crossfade with the hero's route switcher: aurora night, deep-night
 * meridian, and a sunset horizon. Each has a hand-built airliner gliding
 * across with a contrail, drifting clouds and a star field — all SVG/CSS,
 * so it always animates and never depends on external media.
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
      <div className="absolute inset-0 z-[1] bg-black/25" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/25 to-black/45" />
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
    <div className="absolute inset-0 bg-gradient-to-b from-[#071427] via-[#0a0f1e] to-[#050509]">
      <Stars count={70} />
      {/* aurora bands */}
      <div className="absolute inset-x-0 top-[6%] h-[55%]">
        <div
          className="absolute left-[6%] top-0 h-full w-[42%] rounded-[50%] blur-[60px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(56,232,201,0.55), rgba(122,90,248,0.25) 60%, transparent)',
            animation: 'auroraSway 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute right-[10%] top-[4%] h-full w-[38%] rounded-[50%] blur-[70px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(245,152,242,0.5), rgba(56,150,232,0.2) 55%, transparent)',
            animation: 'auroraSway 13s ease-in-out infinite reverse',
          }}
        />
      </div>
      <MoonGlow x="78%" y="20%" color="rgba(220,235,255,0.9)" />
      <Clouds tint="rgba(180,200,230,0.12)" />
      <PlaneLayer y="34%" dur="26s" scale={1}>
        <Airliner body="#0d1220" trim="#e9f0ff" window="#8fe9dd" lights accent="#F598F2" />
      </PlaneLayer>
      <PlaneLayer y="62%" dur="38s" scale={0.5} delay="-8s">
        <Airliner body="#0b0f1a" trim="#9fb0cc" window="#5b6b86" />
      </PlaneLayer>
      <Ridge color="#04060c" />
    </div>
  )
}

/* ---------------- Scene 2 — Night meridian ---------------- */
function Meridian() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#04060f] via-[#060913] to-[#02030a]">
      <Stars count={110} />
      <MoonGlow x="22%" y="18%" color="rgba(200,214,255,0.85)" />
      {/* city-light grid glow near the ground */}
      <div
        className="absolute inset-x-0 bottom-0 h-[34%] opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(rgba(120,170,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,255,0.14) 1px, transparent 1px)',
          backgroundSize: '64px 64px, 64px 64px',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
          transform: 'perspective(400px) rotateX(60deg)',
          transformOrigin: 'bottom',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[26%]"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 100%, rgba(90,140,255,0.35), transparent 70%)',
        }}
      />
      <Clouds tint="rgba(120,150,220,0.08)" />
      <PlaneLayer y="30%" dur="30s" scale={0.95}>
        <Airliner body="#0a0e1a" trim="#cdd8ee" window="#7fa8ff" lights accent="#7a5af8" />
      </PlaneLayer>
    </div>
  )
}

/* ---------------- Scene 3 — Sunset horizon ---------------- */
function Sunset() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#241a3a] via-[#7c3f74] to-[#ffb27a]">
      <Stars count={30} opacity={0.5} area={45} />
      {/* sun */}
      <div
        className="absolute left-1/2 top-[52%] h-[220px] w-[220px] -translate-x-1/2 rounded-full blur-[6px]"
        style={{
          background:
            'radial-gradient(circle, #fff4d6 0%, #ffcf8a 35%, rgba(255,150,110,0.5) 60%, transparent 72%)',
          animation: 'sunPulse 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-x-0 top-[58%] h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,220,180,0.6), transparent)' }}
      />
      <Clouds tint="rgba(255,190,170,0.35)" big />
      <PlaneLayer y="30%" dur="28s" scale={1}>
        <Airliner body="#1a1226" trim="#3a2a45" window="#0f0a18" silhouette />
      </PlaneLayer>
      <PlaneLayer y="54%" dur="44s" scale={0.45} delay="-10s">
        <Airliner body="#241a2e" trim="#3a2a45" window="#0f0a18" silhouette />
      </PlaneLayer>
    </div>
  )
}

/* ---------------- Shared pieces ---------------- */
function PlaneLayer({ y, dur, scale = 1, delay = '0s', children }) {
  return (
    <div
      className="absolute left-0 w-[240px]"
      style={{
        top: y,
        transform: `scale(${scale})`,
        animation: `flyAcross ${dur} linear ${delay} infinite`,
      }}
    >
      <div style={{ animation: 'bob 7s ease-in-out infinite' }}>{children}</div>
    </div>
  )
}

function Airliner({ body, trim, window: win, lights, accent, silhouette }) {
  return (
    <svg viewBox="0 0 240 96" className="w-full overflow-visible">
      {/* contrail */}
      <rect
        x="-140"
        y="45"
        width="160"
        height="4"
        rx="2"
        fill="url(#trail)"
        opacity={silhouette ? 0.25 : 0.5}
      />
      <defs>
        <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* horizontal stabiliser */}
      <path d="M8 46 L44 42 L48 47 L18 52 Z" fill={body} />
      {/* vertical tail fin */}
      <path d="M12 47 L26 18 L40 22 L44 47 Z" fill={body} />
      <path d="M20 34 L30 22 L37 25 L33 35 Z" fill={trim} opacity="0.5" />
      {/* wing (far, swept back) */}
      <path d="M96 52 L150 52 L120 78 L104 78 Z" fill={body} opacity="0.85" />
      {/* fuselage */}
      <path
        d="M28 40 Q120 30 206 42 Q222 45 224 48 Q222 51 206 54 Q120 62 28 52 Q22 46 28 40 Z"
        fill={body}
      />
      {/* nose highlight */}
      <path d="M206 42 Q222 45 224 48 Q222 51 206 54 Q214 48 206 42 Z" fill={trim} opacity="0.4" />
      {/* belly trim line */}
      <path d="M40 53 Q120 60 200 52" stroke={trim} strokeWidth="1.2" fill="none" opacity="0.35" />
      {/* cockpit windows */}
      <path d="M198 45 Q206 44 210 47 L206 49 Q200 48 198 47 Z" fill={win} opacity="0.9" />
      {/* window row */}
      {!silhouette &&
        Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={62 + i * 6.6} cy={46 + (i > 15 ? (i - 15) * 0.5 : 0)} r="1.4" fill={win} opacity="0.85" />
        ))}
      {/* engine under wing */}
      <ellipse cx="120" cy="60" rx="14" ry="6" fill={body} />
      <ellipse cx="132" cy="60" rx="3" ry="5" fill={trim} opacity="0.5" />
      {/* nav lights */}
      {lights && (
        <>
          <circle cx="224" cy="48" r="2" fill={accent}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="12" cy="47" r="1.8" fill="#ff5a5a" style={{ animation: 'blink 2s infinite' }} />
        </>
      )}
    </svg>
  )
}

function Stars({ count = 60, opacity = 0.9, area = 70 }) {
  const stars = Array.from({ length: count }).map((_, i) => ({
    left: (i * 47) % 100,
    top: ((i * 29) % area),
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

function MoonGlow({ x, y, color }) {
  return (
    <div
      className="absolute h-[120px] w-[120px] rounded-full blur-[2px]"
      style={{
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0.25) 40%, transparent 66%)`,
      }}
    />
  )
}

function Clouds({ tint, big }) {
  const rows = big
    ? [
        { top: '46%', h: 34, dur: '60s', o: 0.9 },
        { top: '64%', h: 26, dur: '48s', o: 0.7 },
      ]
    : [
        { top: '20%', h: 20, dur: '80s', o: 0.6 },
        { top: '44%', h: 26, dur: '64s', o: 0.5 },
        { top: '70%', h: 22, dur: '52s', o: 0.4 },
      ]
  return (
    <div className="absolute inset-0 overflow-hidden">
      {rows.map((r, i) => (
        <div
          key={i}
          className="absolute left-0 flex w-[220%] items-center"
          style={{ top: r.top, opacity: r.o, animation: `cloudPan ${r.dur} linear infinite` }}
        >
          {[0, 1].map((k) => (
            <svg key={k} viewBox="0 0 300 60" className="w-1/2 shrink-0" style={{ height: r.h * 3 }}>
              <g fill={tint}>
                <ellipse cx="60" cy="40" rx="60" ry="18" />
                <ellipse cx="120" cy="32" rx="46" ry="22" />
                <ellipse cx="180" cy="40" rx="70" ry="16" />
                <ellipse cx="240" cy="36" rx="40" ry="18" />
              </g>
            </svg>
          ))}
        </div>
      ))}
    </div>
  )
}

function Ridge({ color }) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-[22%] w-full"
    >
      <path
        d="M0 200 V120 L120 90 L260 130 L400 70 L560 120 L720 60 L900 120 L1080 80 L1260 130 L1440 90 V200 Z"
        fill={color}
      />
    </svg>
  )
}
