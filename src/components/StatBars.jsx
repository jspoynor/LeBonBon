function barLevel(pct) {
  if (pct > 60) return 'high'
  if (pct > 30) return 'mid'
  return 'low'
}

function StatBar({ label, value, max = 100, icon }) {
  const pct   = Math.round((value / max) * 100)
  const level = barLevel(pct)

  const trackColor = {
    high: 'rgba(74,222,128,0.15)',
    mid:  'rgba(250,204,21,0.15)',
    low:  'rgba(248,113,113,0.15)',
  }[level]

  return (
    <div style={styles.row}>
      <span style={styles.icon}>{icon}</span>
      <span style={styles.label}>{label}</span>
      <div style={{ ...styles.track, background: trackColor }}>
        <div
          className={`bar-fill ${level}`}
          style={{ ...styles.fill, width: `${pct}%` }}
        />
      </div>
      <span style={{ ...styles.value, color: level === 'low' ? 'var(--stat-red)' : 'var(--text-secondary)' }}>
        {Math.round(value)}
      </span>
    </div>
  )
}

export default function StatBars({ state }) {
  if (!state) return null
  return (
    <div style={styles.container}>
      <StatBar label="Hunger"    value={state.hunger}    icon="🍔" />
      <StatBar label="Happiness" value={state.happiness} icon="😄" />
      <StatBar label="Energy"    value={state.energy}    icon="⚡" />
      <StatBar label="Skill"     value={state.skill} max={100} icon="🏀" />
      <div style={styles.score}>
        <span style={styles.scoreLabel}>Score</span>
        <span style={styles.scoreValue}>{state.score.toLocaleString()}</span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-purple)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  icon: { fontSize: '14px', width: '20px', textAlign: 'center' },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    width: '72px',
    flexShrink: 0,
  },
  track: {
    flex: 1,
    height: '10px',
    borderRadius: '99px',
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.06)',
  },
  fill: {
    height: '100%',
    borderRadius: '99px',
    minWidth: '2px',
  },
  value: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 600,
    width: '26px',
    textAlign: 'right',
    flexShrink: 0,
  },
  score: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
    paddingTop: '10px',
    borderTop: '1px solid var(--border-purple)',
  },
  scoreLabel: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '7px',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
  scoreValue: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '10px',
    color: 'var(--gold-primary)',
  },
}
