import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { getTitle } from '../utils/gameLogic'

export default function Header({ gameState }) {
  const score = gameState?.score ?? 0
  const title = getTitle(score)
  const name  = gameState?.displayName ?? '…'

  async function handleLogout() {
    await signOut(auth)
  }

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={styles.logo}>🏀</span>
        <span style={styles.gameName}>LeBonBon</span>
      </div>

      <div style={styles.center}>
        <span style={styles.playerName}>{name}</span>
        <span style={styles.titleBadge}>{title}</span>
      </div>

      <button style={styles.logoutBtn} onClick={handleLogout} title="Log out">
        ⏻
      </button>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-purple)',
    gap: '8px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  },
  logo: { fontSize: '20px' },
  gameName: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '9px',
    color: 'var(--gold-primary)',
    letterSpacing: '0.5px',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    flex: 1,
  },
  playerName: {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '15px',
    color: 'var(--text-primary)',
  },
  titleBadge: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '7px',
    color: 'var(--gold-primary)',
    background: 'rgba(253,185,39,0.12)',
    borderRadius: '4px',
    padding: '2px 6px',
    letterSpacing: '0.3px',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid var(--border-purple)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontSize: '16px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'color 0.2s, border-color 0.2s',
  },
}
