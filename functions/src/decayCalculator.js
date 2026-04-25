/**
 * Pure function — no Firebase deps.
 * MUST stay in sync with src/utils/decayCalculator.js on the frontend.
 */
const MAX_OFFLINE_TICKS = 28800 // 24 hours of 3-second ticks

export function calculateDecay(state, lastActive) {
  const now = new Date()
  const elapsedSeconds = (now - lastActive) / 1000

  const rawTicks  = Math.floor(elapsedSeconds / 3)
  const decayTicks = Math.min(rawTicks, MAX_OFFLINE_TICKS)

  if (decayTicks <= 0) return state

  return {
    ...state,
    hunger:    Math.max(0, state.hunger    - decayTicks * 3),
    happiness: Math.max(0, state.happiness - decayTicks * 2),
    energy:    Math.max(0, state.energy    - decayTicks * 1.5),
  }
}
