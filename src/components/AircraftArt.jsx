/**
 * Detailed side-profile aircraft illustrations, drawn with layered gradients,
 * highlights and shading for a realistic, premium look. Two airframes:
 *  - 'airliner'  → A320/A321-style narrowbody (under-wing engine, swept fin)
 *  - 'jet'       → Gulfstream G650-style business jet (aft engines, T-tail)
 */
export default function AircraftArt({ frame = 'airliner', accent = '#F598F2' }) {
  const uid = frame
  return (
    <svg
      viewBox="0 0 820 380"
      className="mx-auto w-full max-w-[600px] overflow-visible transition-transform duration-500 group-hover:scale-[1.02]"
      role="img"
    >
      <defs>
        <linearGradient id={`fus-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="14%" stopColor="#f4f7fc" />
          <stop offset="50%" stopColor="#dbe2ee" />
          <stop offset="80%" stopColor="#aeb8c9" />
          <stop offset="100%" stopColor="#8c96a9" />
        </linearGradient>
        <linearGradient id={`wing-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6ebf4" />
          <stop offset="100%" stopColor="#95a0b4" />
        </linearGradient>
        <linearGradient id={`fin-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cfd7e5" />
          <stop offset="100%" stopColor="#9aa4b7" />
        </linearGradient>
        <radialGradient id={`intake-${uid}`} cx="0.6" cy="0.45" r="0.7">
          <stop offset="0%" stopColor="#39435a" />
          <stop offset="70%" stopColor="#161c28" />
          <stop offset="100%" stopColor="#0b0f18" />
        </radialGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fb4e6" />
          <stop offset="100%" stopColor="#1c2740" />
        </linearGradient>
        <linearGradient id={`nac-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef2f8" />
          <stop offset="55%" stopColor="#c4ccda" />
          <stop offset="100%" stopColor="#7f8a9e" />
        </linearGradient>
      </defs>
      {frame === 'jet' ? <Jet uid={uid} accent={accent} /> : <Airliner uid={uid} accent={accent} />}
    </svg>
  )
}

function TailMark({ x, y, s = 1, color }) {
  // stylised AETHER chevron (paper-plane) mark
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 L34 -13 L20 20 L14 8 L2 12 Z" fill={color} />
      <path d="M14 8 L20 20 L14 12 Z" fill="#000" opacity="0.25" />
    </g>
  )
}

/* ---------------- Conventional airliner ---------------- */
function Airliner({ uid, accent }) {
  const windows = Array.from({ length: 30 }, (_, i) => 250 + i * 12)
  return (
    <g>
      {/* soft shadow */}
      <ellipse cx="430" cy="330" rx="250" ry="16" fill="#000" opacity="0.22" />

      {/* horizontal stabiliser (behind) */}
      <path d="M176 172 L112 150 L120 176 L182 186 Z" fill={`url(#wing-${uid})`} opacity="0.9" />

      {/* vertical fin with livery */}
      <path d="M172 150 L236 60 L266 62 L214 152 Z" fill={`url(#fin-${uid})`} />
      <path d="M214 152 L266 62 L266 152 Z" fill={accent} opacity="0.9" />
      <TailMark x={230} y={95} s={0.7} color="#fff" />

      {/* far wing hint */}
      <path d="M470 206 L322 300 L300 300 L430 208 Z" fill="#aab4c6" opacity="0.55" />

      {/* fuselage */}
      <path
        d="M150 158
           C150 150 158 147 176 146
           L566 150
           C620 152 668 163 704 184
           C668 205 620 216 566 218
           L176 214
           C158 213 150 210 150 202
           C145 188 145 172 150 158 Z"
        fill={`url(#fus-${uid})`}
      />
      {/* belly shadow */}
      <path
        d="M176 214 L566 218 C620 216 668 205 704 184 C660 200 620 206 566 206 L176 206 Z"
        fill="#7a8498"
        opacity="0.55"
      />
      {/* top highlight */}
      <path d="M190 150 L566 152 C610 153 650 160 686 176" stroke="#fff" strokeWidth="3" opacity="0.7" fill="none" />

      {/* nose radome */}
      <path d="M660 165 C680 168 696 175 704 184 C696 193 680 200 660 203 C672 190 672 178 660 165 Z" fill="#c2cad9" />
      {/* anti-glare panel */}
      <path d="M628 158 L664 166 L660 172 L628 166 Z" fill="#2c3448" />
      {/* cockpit windows */}
      <path d="M648 168 Q664 170 672 178 L664 182 Q652 179 646 176 Z" fill={`url(#glass-${uid})`} />

      {/* passenger windows */}
      {windows.map((x) => (
        <rect key={`w${x}`} x={x} y={172} width="6" height="7" rx="3" fill="#28324a" />
      ))}
      {/* door outlines */}
      <rect x="252" y="163" width="9" height="30" rx="3" fill="none" stroke="#9aa4b8" strokeWidth="1" opacity="0.6" />
      <rect x="560" y="164" width="8" height="28" rx="3" fill="none" stroke="#9aa4b8" strokeWidth="1" opacity="0.6" />

      {/* cheatline */}
      <path d="M175 186 L662 188" stroke={accent} strokeWidth="5" opacity="0.9" />
      <path d="M175 194 L648 196" stroke="#c2cad9" strokeWidth="1.5" opacity="0.6" />

      {/* near wing */}
      <path d="M300 300 L286 296 L430 204 L470 204 Z" fill={`url(#wing-${uid})`} />
      <path d="M430 204 L470 204 L360 288 L346 288 Z" fill="#fff" opacity="0.18" />
      {/* sharklet */}
      <path d="M300 300 L292 274 L306 292 Z" fill={`url(#wing-${uid})`} />

      {/* engine */}
      <path d="M420 214 L410 244 L432 244 L442 214 Z" fill="#9aa4b8" />
      <g>
        <ellipse cx="404" cy="258" rx="42" ry="20" fill={`url(#nac-${uid})`} />
        <ellipse cx="440" cy="258" rx="9" ry="18" fill={`url(#intake-${uid})`} />
        <ellipse cx="440" cy="258" rx="9" ry="18" fill="none" stroke="#e9eef6" strokeWidth="2" opacity="0.8" />
        <circle cx="440" cy="258" r="3" fill="#c2cad9" />
      </g>

      {/* registration */}
      <text x="205" y="200" fill="#5a637a" fontSize="11" className="font-sans" opacity="0.55">RA-AE320</text>
    </g>
  )
}

/* ---------------- Business jet (Gulfstream G650-style) ---------------- */
function Jet({ uid, accent }) {
  const windows = Array.from({ length: 9 }, (_, i) => 300 + i * 34)
  return (
    <g>
      {/* soft shadow */}
      <ellipse cx="430" cy="326" rx="240" ry="15" fill="#000" opacity="0.22" />

      {/* T-tail: fin */}
      <path d="M150 150 L206 56 L226 58 L214 150 Z" fill={`url(#fin-${uid})`} />
      <path d="M206 56 L226 58 L220 92 L200 90 Z" fill={accent} opacity="0.9" />
      <TailMark x={196} y={70} s={0.6} color="#fff" />
      {/* horizontal stabiliser on TOP of the fin */}
      <path d="M196 66 L96 50 L104 64 L212 76 Z" fill={`url(#wing-${uid})`} />

      {/* far wing hint */}
      <path d="M470 210 L330 300 L312 300 L438 212 Z" fill="#aab4c6" opacity="0.5" />

      {/* aft engine pod on the rear fuselage */}
      <path d="M196 150 L214 150 L204 128 Z" fill="#9aa4b8" />
      <g>
        <ellipse cx="238" cy="150" rx="46" ry="19" fill={`url(#nac-${uid})`} />
        <ellipse cx="200" cy="150" rx="8" ry="16" fill={`url(#intake-${uid})`} />
        <ellipse cx="200" cy="150" rx="8" ry="16" fill="none" stroke="#e9eef6" strokeWidth="2" opacity="0.8" />
      </g>

      {/* slender fuselage with drooped nose */}
      <path
        d="M150 162 C150 154 158 150 180 149 L594 152 C664 155 716 168 736 184 C720 196 690 200 656 202 L594 210 L180 210 C158 209 150 205 150 198 C146 186 146 174 150 162 Z"
        fill={`url(#fus-${uid})`}
      />
      {/* belly shadow */}
      <path d="M180 210 L594 210 C664 208 716 197 736 184 C700 197 660 202 594 202 L180 202 Z" fill="#7a8498" opacity="0.55" />
      {/* top highlight */}
      <path d="M196 152 L594 155 C650 158 700 168 730 182" stroke="#fff" strokeWidth="3" opacity="0.7" fill="none" />

      {/* drooped nose */}
      <path d="M690 165 C712 170 728 178 736 184 C726 194 706 200 686 202 C702 190 700 177 690 165 Z" fill="#c2cad9" />
      {/* cockpit */}
      <path d="M660 162 Q684 165 700 176 L688 182 Q670 177 660 174 Z" fill={`url(#glass-${uid})`} />
      <path d="M646 158 L672 166 L666 172 L642 165 Z" fill="#2c3448" />

      {/* signature oval windows */}
      {windows.map((x) => (
        <ellipse key={x} cx={x} cy={172} rx="7" ry="5" fill="#28324a" />
      ))}
      {/* Gulfstream cheatline sweeping up to the tail */}
      <path d="M172 190 Q420 188 620 180 L690 176" stroke={accent} strokeWidth="4.5" fill="none" opacity="0.9" />
      <path d="M172 196 Q420 194 620 187 L680 184" stroke="#c2cad9" strokeWidth="1.5" fill="none" opacity="0.55" />

      {/* low swept wing + winglet */}
      <path d="M312 300 L298 296 L438 210 L478 210 Z" fill={`url(#wing-${uid})`} />
      <path d="M438 210 L478 210 L372 292 L358 292 Z" fill="#fff" opacity="0.16" />
      <path d="M312 300 L306 276 L320 294 Z" fill={`url(#wing-${uid})`} />

      <text x="210" y="196" fill="#5a637a" fontSize="11" className="font-sans" opacity="0.55">RA-AE650</text>
    </g>
  )
}
