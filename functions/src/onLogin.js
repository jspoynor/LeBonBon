import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { calculateDecay } from './decayCalculator.js'

const db = getFirestore()

/**
 * Callable function invoked by the client on every login.
 * Authoritative server-side offline-decay calculation (anti-cheat).
 *
 * Client usage:
 *   import { httpsCallable } from 'firebase/functions'
 *   import { functions } from '../firebase'
 *   const loginFn = httpsCallable(functions, 'onUserLogin')
 *   const { data } = await loginFn()
 */
export const onUserLogin = onCall(async (request) => {
  const uid = request.auth?.uid
  if (!uid) throw new HttpsError('unauthenticated', 'Must be signed in.')

  const ref  = db.collection('players').doc(uid)
  const snap = await ref.get()

  if (!snap.exists) {
    return { status: 'new_user' }
  }

  const data       = snap.data()
  const lastActive = data.lastActive?.toDate?.() ?? new Date()
  const decayed    = calculateDecay(data, lastActive)

  await ref.set(
    { ...decayed, lastActive: FieldValue.serverTimestamp() },
    { merge: true }
  )

  return { status: 'ok', state: decayed }
})
