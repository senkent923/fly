/**
 * Pure-CSS animated background, one mood per scene. Always visible, so the
 * hero has motion even when the external videos are blocked or slow. The
 * video crossfade layers on top of this and simply covers it once loaded.
 */
export default function AnimatedBackdrop({ activeIndex }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]" aria-hidden="true">
      <Aurora active={activeIndex === 0} />
      <Meridian active={activeIndex === 1} />
      <Tunnel active={activeIndex === 2} />

      {/* fine star field shared across scenes */}
      <Stars />

      {/* subtle film grain / vignette to sit type on */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
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

/* 01 — Northern lights: drifting coloured blobs */
function Aurora({ active }) {
  return (
    <Scene active={active}>
      <div className="absolute inset-0 animate-[hueDrift_14s_ease-in-out_infinite]">
        <div
          className="absolute -left-[10%] top-[8%] h-[70vh] w-[70vh] rounded-full blur-[90px] opacity-70"
          style={{
            background:
              'radial-gradient(circle, #F598F2 0%, rgba(122,90,248,0.5) 45%, transparent 70%)',
            animation: 'auroraDrift 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute right-[2%] top-[20%] h-[65vh] w-[65vh] rounded-full blur-[100px] opacity-60"
          style={{
            background:
              'radial-gradient(circle, #38e8c9 0%, rgba(56,150,232,0.45) 50%, transparent 72%)',
            animation: 'auroraDrift2 22s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[-15%] left-[30%] h-[55vh] w-[80vh] rounded-full blur-[110px] opacity-50"
          style={{
            background:
              'radial-gradient(circle, rgba(245,152,242,0.7) 0%, transparent 68%)',
            animation: 'auroraDrift 26s ease-in-out infinite reverse',
          }}
        />
      </div>
    </Scene>
  )
}

/* 02 — Night meridian: scrolling perspective grid */
function Meridian({ active }) {
  return (
    <Scene active={active}>
      <div className="absolute inset-0 bg-[#04060f]" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(120,170,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,255,0.2) 1px, transparent 1px)',
          backgroundSize: '90px 90px, 90px 90px',
          animation: 'gridPan 12s linear infinite',
          maskImage:
            'radial-gradient(120% 90% at 50% 40%, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(120% 90% at 50% 40%, black 30%, transparent 80%)',
        }}
      />
      <div
        className="absolute left-1/2 top-1/3 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(90,140,255,0.5) 0%, transparent 70%)',
        }}
      />
    </Scene>
  )
}

/* 03 — Light tunnel: pulsing concentric rings */
function Tunnel({ active }) {
  return (
    <Scene active={active}>
      <div className="absolute inset-0 bg-[#0a0605]" />
      <div
        className="absolute left-1/2 top-1/2 h-[140vh] w-[140vh] -translate-x-1/2 -translate-y-1/2"
        style={{ animation: 'spinSlow 60s linear infinite' }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'repeating-radial-gradient(circle at center, rgba(255,190,140,0.14) 0px, rgba(255,190,140,0.14) 2px, transparent 2px, transparent 34px)',
          }}
        />
      </div>
      <div
        className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,196,150,0.6) 0%, rgba(245,120,90,0.25) 45%, transparent 72%)',
          animation: 'tunnelPulse 5s ease-in-out infinite',
        }}
      />
    </Scene>
  )
}

/* shared drifting stars */
function Stars() {
  return (
    <div
      className="absolute inset-0 opacity-40 animate-[twinkle_6s_ease-in-out_infinite]"
      style={{
        backgroundImage:
          'radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 60%, #fff, transparent), radial-gradient(1px 1px at 40% 80%, #fff, transparent), radial-gradient(1.5px 1.5px at 85% 25%, #fff, transparent), radial-gradient(1px 1px at 55% 15%, #fff, transparent), radial-gradient(1px 1px at 10% 70%, #fff, transparent)',
        backgroundSize: '100% 100%',
      }}
    />
  )
}
