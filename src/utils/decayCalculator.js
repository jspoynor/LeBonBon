import { MAX_OFFLINE_TICKS } from './constants.js'

/**
 * Pure function — no Firebase deps.
 * Given saved state + the lastActive Date, returns state with offline decay applied.
 * Identical logic lives in functions/src/decayCalculator.js.
 */
export function calculateDecay(state, lastActive) {
  const now = new Date()
  const elapsedSeconds = (now - lastActive) / 1000

  const rawTicks = Math.floor(elapsedSeconds / 3)
  const decayTicks = Math.min(rawTicks, MAX_OFFLINE_TICKS)

  if (decayTicks <= 0) return state

  return {
    ...state,
    hunger:    Math.max(0, state.hunger    - decayTicks * 3),
    happiness: Math.max(0, state.happiness - decayTicks * 2),
    energy:    Math.max(0, state.energy    - decayTicks * 1.5),
  }
}
