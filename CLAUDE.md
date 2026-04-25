# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install frontend dependencies
npm install

# Install Cloud Functions dependencies
cd functions && npm install && cd ..

# Start Vite dev server (frontend only)
npm run dev

# Production build
npm run build

# Deploy frontend to Firebase Hosting
npm run deploy

# Deploy Cloud Functions only
cd functions && npm run deploy

# Run Firebase emulators (functions + firestore)
firebase emulators:start
```

There is no test suite yet. There is no linter configured for the frontend.

## Architecture

### State flow

The game has one source of truth per session: a local React state object that is periodically flushed to Firestore. The flow on every user action is:

```
User clicks button
  → handleAction (GameScreen) calls pure fn from gameLogic.js
  → setState(nextState)       ← immediate local update, re-renders UI
  → saveState(nextState)      ← debounced 10s write to Firestore
```

`saveState` (from `useGameState`) buffers the most recent state in a ref and flushes once every 10 seconds. It never writes on every tick. On unmount it fires a final synchronous write.

### Tick loops

There are two concurrent intervals while the app is open:

| Loop | Location | Interval | Skips when |
|---|---|---|---|
| Decay tick | `useDecay` | 3 s | `sleeping === true` |
| Rest tick | `GameScreen` useEffect | 1.5 s | `sleeping === false` |

`useDecay` runs via `setState` updater function (no stale closure issues). It reads `saveState` through a ref so the interval never restarts when `saveState` changes identity. The interval only restarts when `state.alive` changes.

The rest tick runs a separate `setInterval` in `GameScreen`, gated on `state.sleeping`. It counts ticks via `sleepTickRef` and calls `stopRest` after 6 ticks (~9 seconds) or when energy hits 100.

### Offline decay

On every login, `useGameState` reads `lastActive` from Firestore, calls `calculateDecay(data, lastActive)`, and writes the decayed result back before setting local state. This gives immediate accurate state on load without waiting for the first tick.

`calculateDecay` is a **pure function with no Firebase imports** that lives in two identical copies:
- `src/utils/decayCalculator.js` — used by the frontend
- `functions/src/decayCalculator.js` — used by the Cloud Function

**These two files must stay in sync.** If you change the decay formula, update both.

The Cloud Function `onUserLogin` (callable) provides the same logic server-side as an anti-cheat layer. It is not currently called automatically by the client — to enable it, call `httpsCallable(functions, 'onUserLogin')()` from `useGameState` after load and use `data.state` as the initial state.

### Game logic

All action handlers in `src/utils/gameLogic.js` are pure functions `(state) => nextState`. They do not touch Firestore. `GameScreen` is responsible for calling `setState` and `saveState` after each action.

`checkGameOver` returns `'trade'` or `'fatigue'` (or `null`). It is called inside `useDecay` on every tick. Game over sets `alive: false` and `gameOverReason` on the state object; the overlay renders when `!state.alive`.

### Firestore data model

Single collection: `players/{uid}`. One document per user. Key fields:

- `hunger / happiness / energy` — decay over time, 0–100
- `skill` — only increases via training, 0–100
- `score` — cumulative, never decays
- `alive` — false triggers game over overlay
- `sleeping` — gates which tick loop runs
- `lastActive` — Firestore Timestamp, written on every Firestore flush via `serverTimestamp()`
- `gameOverReason` — `'trade'` | `'fatigue'`, set on death

### Styling conventions

All CSS variables are in `src/styles/theme.css`. Components use inline `styles` objects (defined at the bottom of each file). The `.scanlines` CSS class adds the retro overlay effect via `::after`. Character animation classes (`anim-bounce`, `anim-sad`, etc.) are injected via a `<style>` tag inside `CharacterSprite` and driven by the `mood` prop.

Fonts: `var(--font-pixel)` = Press Start 2P (all game labels, scores, titles), `var(--font-body)` = Fredoka (UI prose, buttons, inputs).

### Firebase config

`src/firebase.js` exports `auth`, `db`, `functions`, and `googleProvider`. Config values are placeholders (`YOUR_API_KEY`, etc.) — fill them in from the Firebase console. The Functions SDK (`getFunctions`) is imported but the callable is not yet wired to the client.

### Cloud Functions

Located in `functions/` with its own `package.json` (`"type": "module"`, Node 20). Entry point is `functions/index.js` which calls `initializeApp()` once and re-exports named function handlers. Uses firebase-admin (Admin SDK) — not the client SDK.
