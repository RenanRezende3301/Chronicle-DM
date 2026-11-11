import { lazy, Suspense } from 'react'
import { AppProvider } from './context/AppContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { NPCProvider } from './context/NPCContext.jsx'
import { GalleryProvider } from './context/GalleryContext.jsx'
import { TurnTrackerProvider } from './context/TurnTrackerContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { UserDataProvider } from './context/UserDataContext.jsx'
import { useAuth } from './context/useAuth.js'
import { useUserData } from './context/useUserData.js'
import AuthPage from './components/Auth/AuthPage.jsx'
import ProfileSetupPage from './components/Auth/ProfileSetupPage.jsx'
import AppLayout from './components/Layout/AppLayout.jsx'
import AccountSettingsDialog from './features/account/AccountSettingsDialog.jsx'
import PasswordRecoveryPage from './components/Auth/PasswordRecoveryPage.jsx'

const PlayerDashboard = lazy(
  () => import('./features/account/PlayerDashboard.jsx'),
)
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ToastProvider>
  )
}

function AuthGate() {
  const {
    activeExperience,
    isAuthReady,
    isAuthenticated,
    isAccountSettingsOpen,
    isPasswordRecovery,
    user,
  } = useAuth()

  if (!isAuthReady) {
    return <LoadingScreen label="Abrindo arquivo..." />
  }

  if (isPasswordRecovery) {
    return <PasswordRecoveryPage />
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  if (user?.needsProfile) {
    return <ProfileSetupPage />
  }

  let content

  if (activeExperience === 'player') {
    content = (
      <Suspense fallback={<LoadingScreen label="Abrindo personagens..." />}>
        <PlayerDashboard />
      </Suspense>
    )
  } else {
    content = (
      <UserDataProvider>
        <DataGate />
      </UserDataProvider>
    )
  }

  return (
    <>
      {content}
      {isAccountSettingsOpen ? <AccountSettingsDialog /> : null}
    </>
  )
}

function DataGate() {
  const { isDataReady } = useUserData()

  if (!isDataReady) {
    return <LoadingScreen label="Carregando dossie..." />
  }

  return (
    <AppProvider>
      <NPCProvider>
        <GalleryProvider>
          <TurnTrackerProvider>
            <AppLayout />
          </TurnTrackerProvider>
        </GalleryProvider>
      </NPCProvider>
    </AppProvider>
  )
}

function LoadingScreen({ label }) {
  return (
    <main
      style={{
        display: 'grid',
        minWidth: '1280px',
        minHeight: '100vh',
        placeItems: 'center',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-title)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </main>
  )
}

export default App
