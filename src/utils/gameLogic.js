import { STAT_CAPS, STAT_FLOORS, TRAIN_ENERGY_MIN } from './constants.js'

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

/**
 * All action handlers are pure functions: (state) => nextState
 * They do NOT write to Firestore — callers handle persistence.
 */

export function feed(state) {
  return {
    ...state,
    hunger:    clamp(state.hunger + 25, STAT_FLOORS.hunger, STAT_CAPS.hunger),
    energy:    clamp(state.energy + 5,  STAT_FLOORS.energy, STAT_CAPS.energy),
    score:     state.score + 2,
  }
}

export function train(state) {
  if (state.energy < TRAIN_ENERGY_MIN) return state
  return {
    ...state,
    energy:    clamp(state.energy    - 20, STAT_FLOORS.energy,    STAT_CAPS.energy),
    hunger:    clamp(state.hunger    - 10, STAT_FLOORS.hunger,    STAT_CAPS.hunger),
    happiness: clamp(state.happiness + 15, STAT_FLOORS.happiness, STAT_CAPS.happiness),
    skill:     clamp(state.skill     + 5,  STAT_FLOORS.skill,     STAT_CAPS.skill),
    score:     state.score + 10,
  }
}

export function cheer(state) {
  return {
    ...state,
    happiness: clamp(state.happiness + 20, STAT_FLOORS.happiness, STAT_CAPS.happiness),
    score:     state.score + 5,
  }
}

export function startRest(state) {
  return { ...state, sleeping: true }
}

export function stopRest(state) {
  return { ...state, sleeping: false }
}

export function applyRestTick(state) {
  return {
    ...state,
    energy: clamp(state.energy + 8,  STAT_FLOORS.energy, STAT_CAPS.energy),
    hunger: clamp(state.hunger - 2,  STAT_FLOORS.hunger, STAT_CAPS.hunger),
  }
}

export function getTitle(score) {
  if (score >= 800) return 'GOAT'
  if (score >= 400) return 'MVP'
  if (score >= 150) return 'All-Star'
  if (score >= 50)  return 'Starter'
  return 'Rookie'
}

export function checkGameOver(state) {
  if (!state.alive) return null
  if (state.hunger <= 0 && state.happiness <= 0) return 'trade'
  if (state.energy <= 0 && state.hunger <= 0)    return 'fatigue'
  return null
}

export function getMood(state) {
  const avg = (state.hunger + state.happiness + state.energy) / 3
  if (state.sleeping)  return 'sleeping'
  if (avg >= 65)       return 'happy'
  if (avg >= 35)       return 'neutral'
  return 'sad'
}
