import { useState, useEffect, useRef, useCallback } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useGameState } from '../hooks/useGameState'
import { useDecay } from '../hooks/useDecay'
import Header from './Header'
import CharacterSprite from './CharacterSprite'
import StatBars from './StatBars'
import ActionButtons from './ActionButtons'
import GameOverOverlay from './GameOverOverlay'
import { feed, train, cheer, startRest, stopRest, applyRestTick, getMood } from '../utils/gameLogic'
import {
  ACTION_COOLDOWN_MS,
  REST_TICK_INTERVAL_MS,
  REST_MAX_TICKS,
  DEFAULT_PLAYER_STATE,
} from '../utils/constants'

export default function GameScreen({ user }) {
  const { state, setState, saveState, loading } = useGameState(user)
  useDecay(state, setState, saveState)

  const [cooldowns, setCooldowns]   = useState({})
  const [toast, setToast]           = useState(null)
  const [isTraining, setIsTraining] = useState(false)

  const toastTimerRef  = useRef(null)
  const sleepTickRef   = useRef(0)
  const saveRef        = useRef(saveState)
  useEffect(() => { saveRef.current = saveState }, [saveState])

  // ── Rest / sleep mechanic ──
  useEffect(() => {
    if (!state?.sleeping || !state?.alive) return

    sleepTickRef.current = 0

    const interval = setInterval(() => {
      sleepTickRef.current += 1

      setState((prev) => {
        if (!prev?.sleeping) return prev

        const next = applyRestTick(prev)

        const done = sleepTickRef.current >= REST_MAX_TICKS || next.energy >= 100
        const final = done ? stopRest(next) : next
        saveRef.current(final)
        return final
      })
    }, REST_TICK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [state?.sleeping, state?.alive, setState])

  // ── Toast helper ──
  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(msg)
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  // ── Cooldown helper ──
  function triggerCooldown(key) {
    setCooldowns((prev) => ({ ...prev, [key]: true }))
    setTimeout(() => setCooldowns((prev) => ({ ...prev, [key]: false })), ACTION_COOLDOWN_MS)
  }

  // ── Action handlers ──
  function handleAction(key) {
    if (!state?.alive || state?.sleeping) return

    let nextState
    let toastMsg

    switch (key) {
      case 'feed':
        nextState = feed(state)
        toastMsg  = '🍔 Nom nom! +25 hunger'
        break
      case 'train':
        if (state.energy < 15) { showToast('⚡ Too tired to train!'); return }
        nextState = train(state)
        toastMsg  = '🏋️ Grind! +10 score'
        setIsTraining(true)
        setTimeout(() => setIsTraining(false), 1500)
        break
      case 'rest':
        nextState = startRest(state)
        toastMsg  = '💤 Resting…'
        break
      case 'cheer':
        nextState = cheer(state)
        toastMsg  = '📣 Let\'s go! +20 happiness'
        break
      default:
        return
    }

    setState(nextState)
    saveState(nextState)
    triggerCooldown(key)
    showToast(toastMsg)
  }

  // ── Restart ──
  async function handleRestart() {
    const freshState = {
      ...DEFAULT_PLAYER_STATE,
      displayName:      state.displayName,
      totalRetirements: (state.totalRetirements ?? 0),
      score: 0,
      alive: true,
    }
    setState(freshState)
    await setDoc(
      doc(db, 'players', user.uid),
      { ...freshState, lastActive: serverTimestamp(), createdAt: serverTimestamp() }
    )
  }

  if (loading || !state) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--lcd-green)' }}>
          Loading…
        </p>
      </div>
    )
  }

  const mood = getMood(state)

  return (
    <div style={styles.root}>
      <Header gameState={state} />

      {/* LCD screen area */}
      <div style={styles.screenOuter}>
        <div style={styles.screen} className="scanlines">
          <CharacterSprite mood={isTraining ? 'training' : mood} isTraining={isTraining} />
        </div>

        {/* Mood label */}
        <div style={styles.moodRow}>
          <span style={styles.moodLabel}>
            {state.sleeping ? '💤 Sleeping' : mood === 'happy' ? '😄 Happy' : mood === 'sad' ? '😢 Sad' : '😐 Neutral'}
          </span>
          <span style={styles.ageLabel}>Age {state.age}</span>
        </div>
      </div>

      <div style={styles.statsArea}>
        <StatBars state={state} />
      </div>

      <div style={styles.actionsArea}>
        <ActionButtons state={state} cooldowns={cooldowns} onAction={handleAction} />
      </div>

      {/* Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Game Over overlay */}
      {!state.alive && <GameOverOverlay state={state} onRestart={handleRestart} />}
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--bg-deep)',
    maxWidth: '420px',
    margin: '0 auto',
  },
  screenOuter: {
    padding: '16px 16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  screen: {
    background: 'var(--lcd-screen)',
    borderRadius: 'var(--radius-xl)',
    border: '4px solid #2a1a3a',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3), 0 0 0 2px var(--border-purple)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '220px',
    position: 'relative',
    overflow: 'hidden',
  },
  moodRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 4px',
  },
  moodLabel: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '7px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
  },
  ageLabel: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '7px',
    color: 'var(--text-muted)',
  },
  statsArea: {
    padding: '12px 16px 0',
  },
  actionsArea: {
    padding: '12px 16px 24px',
  },
  toast: {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#2d1f42',
    border: '1px solid var(--purple-light)',
    borderRadius: 'var(--radius-lg)',
    padding: '10px 20px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    animation: 'toast-in 0.25s ease',
    zIndex: 50,
  },
}
