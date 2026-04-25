import { useAuth } from './hooks/useAuth'
import AuthGate from './components/AuthGate'
import GameScreen from './components/GameScreen'

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <p className="pixel-text">Loading...</p>
    </div>
  )
}

export default function App() {
  const user = useAuth()

  if (user === undefined) return <LoadingScreen />
  if (!user) return <AuthGate />
  return <GameScreen user={user} />
}
