import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.3l7.8 6C12.1 13 17.6 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 2.9-2.2 5.4-4.7 7l7.3 5.7c4.3-4 6.7-9.8 7.2-16.7z"/>
    <path fill="#FBBC05" d="M10.3 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l7.8-5.9z"/>
    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.3-5.7c-2 1.4-4.6 2.2-7.9 2.2-6.4 0-11.9-4.3-13.8-10.3l-7.8 5.9C6.5 42.6 14.6 48 24 48z"/>
  </svg>
)

export default function AuthGate() {
  const [mode, setMode]       = useState('login') // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function friendlyError(code) {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential': return 'Incorrect email or password.'
      case 'auth/email-already-in-use': return 'An account with that email already exists.'
      case 'auth/weak-password':  return 'Password must be at least 6 characters.'
      case 'auth/invalid-email':  return 'Invalid email address.'
      default: return 'Something went wrong. Please try again.'
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() })
      }
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(friendlyError(err.code))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        {/* Logo area */}
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>🏀</div>
          <h1 style={styles.title}>LeBonBon</h1>
          <p style={styles.subtitle}>Raise a basketball legend</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <input
              style={styles.input}
              type="text"
              placeholder="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Loading…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine} />
        </div>

        <button style={styles.btnGoogle} onClick={handleGoogle} disabled={loading}>
          {GOOGLE_SVG}
          <span>Continue with Google</span>
        </button>

        <p style={styles.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            style={styles.linkBtn}
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    background: 'var(--bg-deep)',
  },
  card: {
    width: '100%',
    maxWidth: '360px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-purple)',
    padding: '36px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logoArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  logoIcon: { fontSize: '48px' },
  title: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '18px',
    color: 'var(--gold-primary)',
    letterSpacing: '1px',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: 400,
  },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: {
    background: '#2d1f42',
    border: '1px solid var(--border-purple)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    padding: '12px 16px',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
  },
  error: {
    color: 'var(--stat-red)',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
    textAlign: 'center',
  },
  btnPrimary: {
    background: 'var(--purple-primary)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '13px',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: '4px',
  },
  btnGoogle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    background: '#fff',
    color: '#222',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--border-purple)',
    display: 'block',
  },
  dividerText: {
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
  },
  toggle: {
    textAlign: 'center',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--gold-primary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    fontWeight: 600,
    padding: 0,
  },
}
