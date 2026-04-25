export default function GameOverOverlay({ state, onRestart }) {
  const reason = state?.gameOverReason === 'trade'
    ? 'He demanded a trade 😤'
    : 'He retired due to fatigue 😔'

  const retirements = state?.totalRetirements ?? 0

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.emoji}>💔</div>
        <h2 style={styles.heading}>Career Over</h2>
        <p style={styles.reason}>{reason}</p>

        <div style={styles.statsRow}>
          <Stat label="Final Score" value={state?.score ?? 0} />
          <Stat label="Total Retirements" value={retirements} />
        </div>

        <button style={styles.restartBtn} onClick={onRestart}>
          🔄 Start Over
        </button>
        <p style={styles.hint}>Stats reset — legacy lives on</p>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={statStyles.box}>
      <span style={statStyles.label}>{label}</span>
      <span style={statStyles.value}>{value.toLocaleString()}</span>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(10,5,20,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '24px',
  },
  modal: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-purple)',
    borderRadius: 'var(--radius-xl)',
    padding: '36px 28px 28px',
    maxWidth: '340px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
    textAlign: 'center',
  },
  emoji:   { fontSize: '52px' },
  heading: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '14px',
    color: 'var(--gold-primary)',
    letterSpacing: '1px',
  },
  reason: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--text-secondary)',
    fontWeight: 400,
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginTop: '4px',
  },
  restartBtn: {
    background: 'var(--purple-primary)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '14px 32px',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    width: '100%',
    marginTop: '4px',
  },
  hint: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
}

const statStyles = {
  box: {
    flex: 1,
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'center',
    border: '1px solid var(--border-purple)',
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  value: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '11px',
    color: 'var(--gold-primary)',
  },
}
