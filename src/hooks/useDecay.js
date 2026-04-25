import { useEffect, useRef } from 'react'
import { TICK_INTERVAL_MS, DECAY_RATES } from '../utils/constants'
import { checkGameOver } from '../utils/gameLogic'

/**
 * Client-side decay loop.
 * Runs a 3-second tick while the player is alive.
 * Sleeping ticks are skipped — rest is handled separately in GameScreen.
 * Game-over is detected here and applied to state via setState.
 */
export function useDecay(state, setState, saveState) {
  // Keep stable refs to avoid restarting the interval on every render
  const saveRef  = useRef(saveState)
  const aliveRef = useRef(state?.alive)

  useEffect(() => { saveRef.current  = saveState      }, [saveState])
  useEffect(() => { aliveRef.current = state?.alive   }, [state?.alive])

  useEffect(() => {
    if (!state?.alive) return

    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev || !prev.alive || prev.sleeping) return prev

        const next = {
          ...prev,
          hunger:    Math.max(0, prev.hunger    - DECAY_RATES.hunger),
          happiness: Math.max(0, prev.happiness - DECAY_RATES.happiness),
          energy:    Math.max(0, prev.energy    - DECAY_RATES.energy),
        }

        const reason = checkGameOver(next)
        if (reason) {
          const dead = {
            ...next,
            alive: false,
            gameOverReason: reason,
          }
          saveRef.current(dead)
          return dead
        }

        saveRef.current(next)
        return next
      })
    }, TICK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [state?.alive, setState])
}
