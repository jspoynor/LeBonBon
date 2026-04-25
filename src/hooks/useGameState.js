import { useState, useEffect, useRef, useCallback } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { DEFAULT_PLAYER_STATE, FIRESTORE_WRITE_INTERVAL_MS } from '../utils/constants'
import { calculateDecay } from '../utils/decayCalculator'

export function useGameState(user) {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)

  const pendingRef  = useRef(null)
  const timerRef    = useRef(null)
  const userRef     = useRef(user)

  useEffect(() => { userRef.current = user }, [user])

  // Load initial state and apply offline decay
  useEffect(() => {
    if (!user) {
      setState(null)
      setLoading(false)
      return
    }

    let active = true
    const ref = doc(db, 'players', user.uid)

    async function load() {
      try {
        const snap = await getDoc(ref)
        if (!active) return

        let initial
        if (!snap.exists()) {
          initial = {
            ...DEFAULT_PLAYER_STATE,
            displayName: user.displayName || user.email?.split('@')[0] || 'Player',
          }
          await setDoc(ref, {
            ...initial,
            lastActive: serverTimestamp(),
            createdAt: serverTimestamp(),
          })
        } else {
          const data = snap.data()
          const lastActive = data.lastActive?.toDate?.() ?? new Date()
          initial = calculateDecay(data, lastActive)
          await setDoc(ref, { ...initial, lastActive: serverTimestamp() }, { merge: true })
        }

        if (active) {
          setState(initial)
          setLoading(false)
        }
      } catch (err) {
        console.error('useGameState load error:', err)
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced Firestore write — buffer locally, flush at most every 10 seconds
  const saveState = useCallback((newState) => {
    pendingRef.current = newState
    if (timerRef.current) return

    timerRef.current = setTimeout(async () => {
      const toSave = pendingRef.current
      const uid    = userRef.current?.uid
      if (toSave && uid) {
        try {
          await setDoc(
            doc(db, 'players', uid),
            { ...toSave, lastActive: serverTimestamp() },
            { merge: true }
          )
        } catch (err) {
          console.error('useGameState save error:', err)
        }
      }
      pendingRef.current = null
      timerRef.current   = null
    }, FIRESTORE_WRITE_INTERVAL_MS)
  }, [])

  // Flush pending write on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      const toSave = pendingRef.current
      const uid    = userRef.current?.uid
      if (toSave && uid) {
        setDoc(doc(db, 'players', uid), { ...toSave, lastActive: serverTimestamp() }, { merge: true })
          .catch(console.error)
      }
    }
  }, [])

  return { state, setState, saveState, loading }
}
