/**
 * SVG pixel-art basketball player.
 * Purple (#552583) & gold (#FDB927) jersey, #23 on chest, brown skin.
 * Animation class is driven by mood prop: 'happy' | 'neutral' | 'sad' | 'sleeping' | 'training'
 */
export default function CharacterSprite({ mood = 'neutral', isTraining = false }) {
  const animClass = {
    happy:    'anim-bounce',
    sad:      'anim-sad',
    sleeping: 'anim-sleep',
    training: 'anim-dribble',
    neutral:  '',
  }[mood] ?? ''

  return (
    <div style={styles.wrapper}>
      <style>{css}</style>

      {/* Basketball — visible during training */}
      {isTraining && (
        <div style={styles.ballWrap} className="anim-ball">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="13" fill="#F77F00" stroke="#c96200" strokeWidth="1.2"/>
            <path d="M14 1 Q17 8 17 14 Q17 20 14 27" stroke="#7a3500" strokeWidth="1" fill="none"/>
            <path d="M1 14 Q8 11 14 11 Q20 11 27 14" stroke="#7a3500" strokeWidth="1" fill="none"/>
            <path d="M1 14 Q8 17 14 17 Q20 17 27 14" stroke="#7a3500" strokeWidth="1" fill="none"/>
          </svg>
        </div>
      )}

      {/* Z's during sleep */}
      {mood === 'sleeping' && (
        <>
          <span style={{ ...styles.zzz, top: '4px', right: '22px', fontSize: '12px', animationDelay: '0s' }}>z</span>
          <span style={{ ...styles.zzz, top: '-4px', right: '14px', fontSize: '16px', animationDelay: '0.5s' }}>z</span>
          <span style={{ ...styles.zzz, top: '-14px', right: '4px', fontSize: '20px', animationDelay: '1s' }}>Z</span>
        </>
      )}

      {/* Main character SVG */}
      <svg
        width="100"
        height="148"
        viewBox="0 0 100 148"
        className={animClass}
        style={styles.svg}
        aria-label="Basketball player #23"
      >
        {/* ── HAIR ── */}
        <ellipse cx="50" cy="18" rx="16" ry="11" fill="#1a1a1a"/>

        {/* ── HEAD ── */}
        <ellipse cx="50" cy="22" rx="14" ry="13" fill="#8B5A2B"/>

        {/* ── HEADBAND ── */}
        <rect x="36" y="16" width="28" height="5" rx="2" fill="#FDB927"/>

        {/* ── EYES ── */}
        <circle cx="44" cy="23" r="2.2" fill="#fff"/>
        <circle cx="56" cy="23" r="2.2" fill="#fff"/>
        <circle cx="44.8" cy="23.5" r="1.2" fill="#222"/>
        <circle cx="56.8" cy="23.5" r="1.2" fill="#222"/>

        {/* ── MOUTH ── */}
        {mood === 'happy' || mood === 'training' ? (
          <path d="M44 31 Q50 36 56 31" stroke="#5c2e0a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        ) : mood === 'sad' ? (
          <path d="M44 34 Q50 30 56 34" stroke="#5c2e0a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        ) : (
          <line x1="45" y1="32" x2="55" y2="32" stroke="#5c2e0a" strokeWidth="1.5" strokeLinecap="round"/>
        )}

        {/* ── NECK ── */}
        <rect x="45" y="34" width="10" height="6" fill="#8B5A2B"/>

        {/* ── JERSEY BODY ── */}
        <rect x="30" y="38" width="40" height="42" rx="4" fill="#552583"/>

        {/* Jersey white collar */}
        <rect x="44" y="38" width="12" height="5" rx="2" fill="#e8e8e8"/>

        {/* Jersey number "23" */}
        <text x="50" y="67" textAnchor="middle" fontSize="16" fontWeight="bold"
              fontFamily="Arial, sans-serif" fill="#FDB927" letterSpacing="1">23</text>

        {/* Purple side stripes on jersey */}
        <rect x="30" y="44" width="6" height="30" rx="2" fill="#6B2FA0"/>
        <rect x="64" y="44" width="6" height="30" rx="2" fill="#6B2FA0"/>

        {/* ── LEFT ARM ── */}
        <rect x="18" y="40" width="13" height="30" rx="6" fill="#8B5A2B"/>
        {/* left hand */}
        <ellipse cx="24" cy="72" rx="6" ry="5" fill="#7a4e25"/>

        {/* ── RIGHT ARM ── */}
        <rect x="69" y="40" width="13" height="30" rx="6" fill="#8B5A2B"/>
        {/* right hand */}
        <ellipse cx="76" cy="72" rx="6" ry="5" fill="#7a4e25"/>

        {/* ── GOLD SHORTS ── */}
        <rect x="30" y="78" width="40" height="30" rx="4" fill="#FDB927"/>

        {/* Shorts purple stripe */}
        <rect x="30" y="78" width="40" height="5" fill="#552583"/>

        {/* Shorts center line */}
        <line x1="50" y1="83" x2="50" y2="108" stroke="#e8a800" strokeWidth="1.5"/>

        {/* ── LEFT LEG ── */}
        <rect x="32" y="106" width="14" height="24" rx="5" fill="#8B5A2B"/>

        {/* ── RIGHT LEG ── */}
        <rect x="54" y="106" width="14" height="24" rx="5" fill="#8B5A2B"/>

        {/* ── LEFT SNEAKER ── */}
        <rect x="28" y="127" width="20" height="11" rx="4" fill="#E53E3E"/>
        <rect x="28" y="127" width="20" height="4"  rx="2" fill="#c53030"/>
        <rect x="31" y="131" width="14" height="2"  rx="1" fill="#fff" opacity="0.7"/>
        <rect x="28" y="135" width="20" height="3"  rx="2" fill="#fff" opacity="0.4"/>

        {/* ── RIGHT SNEAKER ── */}
        <rect x="52" y="127" width="20" height="11" rx="4" fill="#E53E3E"/>
        <rect x="52" y="127" width="20" height="4"  rx="2" fill="#c53030"/>
        <rect x="55" y="131" width="14" height="2"  rx="1" fill="#fff" opacity="0.7"/>
        <rect x="52" y="135" width="20" height="3"  rx="2" fill="#fff" opacity="0.4"/>
      </svg>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '200px',
  },
  svg:  { display: 'block' },
  ballWrap: {
    position: 'absolute',
    bottom: '60px',
    right: '50px',
  },
  zzz: {
    position: 'absolute',
    right: 0,
    fontFamily: 'var(--font-pixel)',
    color: 'var(--lcd-dark)',
    animation: 'z-float 2s ease-out infinite',
    pointerEvents: 'none',
    userSelect: 'none',
  },
}

const css = `
  .anim-bounce  { animation: bounce 0.7s ease-in-out infinite; }
  .anim-sad     { animation: sad-shake 0.4s ease-in-out infinite; }
  .anim-sleep   { animation: sleep-bob 2s ease-in-out infinite; }
  .anim-dribble { animation: dribble-body 0.5s ease-in-out infinite; }
  .anim-ball    { animation: ball-bounce 0.5s ease-in-out infinite; }
`
