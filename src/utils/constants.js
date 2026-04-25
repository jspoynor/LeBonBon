export const DECAY_RATES = {
  hunger: 3,
  happiness: 2,
  energy: 1.5,
}

export const TICK_INTERVAL_MS = 3000
export const FIRESTORE_WRITE_INTERVAL_MS = 10000
export const MAX_OFFLINE_TICKS = 28800 // 24 hours worth of 3-second ticks

export const STAT_CAPS = { hunger: 100, happiness: 100, energy: 100, skill: 100 }
export const STAT_FLOORS = { hunger: 0, happiness: 0, energy: 0, skill: 0 }

export const TITLES = [
  { min: 0,   label: 'Rookie' },
  { min: 50,  label: 'Starter' },
  { min: 150, label: 'All-Star' },
  { min: 400, label: 'MVP' },
  { min: 800, label: 'GOAT' },
]

export const ACTION_COOLDOWN_MS = 800

export const REST_ENERGY_PER_TICK = 8
export const REST_HUNGER_PER_TICK = 2
export const REST_TICK_INTERVAL_MS = 1500
export const REST_MAX_TICKS = 6 // 6 * 1.5s = 9 seconds

export const TRAIN_ENERGY_MIN = 15

export const DEFAULT_PLAYER_STATE = {
  hunger: 100,
  happiness: 100,
  energy: 100,
  skill: 20,
  age: 0,
  score: 0,
  alive: true,
  sleeping: false,
  totalRetirements: 0,
}
