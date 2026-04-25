import { TRAIN_ENERGY_MIN } from '../utils/constants'

const ACTIONS = [
  { key: 'feed',  label: 'Feed',  icon: '🍔', desc: '+25 hunger' },
  { key: 'train', label: 'Train', icon: '🏋️', desc: '+15 mood, +5 skill' },
  { key: 'rest',  label: 'Rest',  icon: '💤', desc: '+energy over 9s' },
  { key: 'cheer', label: 'Cheer', icon: '📣', desc: '+20 happiness' },
]

export default function ActionButtons({ state, cooldowns, onAction }) {
  function isDisabled(key) {
    if (!state?.alive || state?.sleeping) return true
    if (cooldowns[key]) return true
    if (key === 'train' && state.energy < TRAIN_ENERGY_MIN) return true
    return false
  }

  return (
    <div style={styles.grid}>
      {ACTIONS.map(({ key, label, icon, desc }) => {
        const disabled = isDisabled(key)
        const onCooldown = cooldowns[key]
        return (
          <button
            key={key}
            style={{
              ...styles.btn,
              ...(disabled ? styles.btnDisabled : styles.btnActive),
            }}
            onClick={() => !disabled && onAction(key)}
            disabled={disabled}
            title={desc}
          >
            <span style={styles.icon}>{icon}</span>
            <span style={styles.label}>{label}</span>
            {onCooldown && <span style={styles.cooldownBar} />}
          </button>
        )
      })}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  btn: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '14px 8px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    overflow: 'hidden',
    transition: 'transform 0.1s, opacity 0.2s',
  },
  btnActive: {
    background: 'var(--purple-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--purple-light)',
  },
  btnDisabled: {
    background: 'rgba(85,37,131,0.25)',
    color: 'var(--text-muted)',
    cursor: 'not-allowed',
    border: '1px solid var(--border-purple)',
  },
  icon:  { fontSize: '22px' },
  label: { fontSize: '13px', fontWeight: 600 },
  cooldownBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    width: '100%',
    background: 'var(--gold-primary)',
    animation: 'cooldown-shrink 0.8s linear forwards',
  },
}
