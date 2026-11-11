import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api.js'
import { usesSupabaseAuth } from '../services/backendMode.js'
import { isSupabaseConfigured } from '../services/supabase.js'
import {
  getSupabaseSession,
  loadSupabaseAccount,
  loginSupabaseAccount,
  logoutSupabase,
  observeSupabaseSession,
  completeSupabasePasswordRecovery,
  registerSupabaseAccount,
  requestSupabasePasswordRecovery,
  updateSupabaseDisplayName,
} from '../services/supabaseAuth.js'
import { normalizeAppState } from '../utils/appState.js'
import { saveMyPublicProfile } from '../services/supabaseChronicle2.js'
import { AuthContext } from './AuthContextObject.js'

function mapSupabaseUser(user, profile = null) {
  if (!user || user.is_anonymous) {
    return null
  }

  return {
    id: user.id,
    email: user.email || '',
    displayName:
      String(profile?.display_name || user.user_metadata?.display_name || '').trim() ||
      String(user.email || '').split('@')[0] ||
      'Narrador',
    username: profile?.username || '',
    preferredMode: profile?.preferred_mode || 'player',
    needsProfile: !profile,
    authBackend: 'supabase',
  }
}

export function AuthProvider({ children, forceSupabase = false }) {
  const [user, setUser] = useState(null)
  const [serverState, setServerState] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeExperience, setActiveExperience] = useState('gm')
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
  const useSupabase =
    forceSupabase || (usesSupabaseAuth && isSupabaseConfigured)

  useEffect(() => {
    let isMounted = true

    if (useSupabase) {
      const stopObserving = observeSupabaseSession((session, event) => {
        if (!isMounted) {
          return
        }

        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true)
        } else if (event === 'SIGNED_OUT') {
          setIsPasswordRecovery(false)
        }

        loadSupabaseAccount(session)
          .then((account) => {
            if (isMounted) {
              const nextUser = mapSupabaseUser(account.user, account.profile)
              setUser(nextUser)
              setActiveExperience(nextUser?.preferredMode || 'gm')
              setServerState(null)
            }
          })
          .catch(() => {
            if (isMounted) {
              const nextUser = mapSupabaseUser(session?.user)
              setUser(nextUser)
              setActiveExperience(nextUser?.preferredMode || 'gm')
              setServerState(null)
            }
          })
          .finally(() => {
            if (isMounted) {
              setIsAuthReady(true)
            }
          })
      })

      getSupabaseSession()
        .then((session) => loadSupabaseAccount(session))
        .then((account) => {
          if (isMounted) {
            const nextUser = mapSupabaseUser(account.user, account.profile)
            setUser(nextUser)
            setActiveExperience(nextUser?.preferredMode || 'gm')
            setServerState(null)
          }
        })
        .catch(() => {
          if (isMounted) {
            setUser(null)
            setServerState(null)
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsAuthReady(true)
          }
        })

      return () => {
        isMounted = false
        stopObserving()
      }
    }

    api
      .me()
      .then((payload) => {
        if (!isMounted) {
          return
        }

        setUser(payload.user)
        setActiveExperience('gm')
        setServerState(payload.state ? normalizeAppState(payload.state) : null)
      })
      .catch(() => {
        if (isMounted) {
          setUser(null)
          setServerState(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthReady(true)
        }
      })

    return () => {
      isMounted = false
    }
  }, [useSupabase])

  const login = useCallback(async (credentials) => {
    setAuthError('')

    if (useSupabase) {
      const payload = await loginSupabaseAccount(credentials)
      const nextUser = mapSupabaseUser(payload.user, payload.profile)
      setUser(nextUser)
      setActiveExperience(nextUser?.preferredMode || 'player')
      setServerState(null)
      return nextUser
    }

    const payload = await api.login(credentials)
    setUser(payload.user)
    setServerState(normalizeAppState(payload.state))
    return payload.user
  }, [useSupabase])

  const register = useCallback(async (credentials) => {
    setAuthError('')

    if (useSupabase) {
      const payload = await registerSupabaseAccount(credentials)
      const nextUser = mapSupabaseUser(payload.user, payload.profile)

      if (payload.session) {
        setUser(nextUser)
        setActiveExperience(nextUser?.preferredMode || 'player')
      }

      setServerState(null)
      return {
        user: nextUser,
        needsEmailConfirmation: payload.needsEmailConfirmation,
      }
    }

    const payload = await api.register(credentials)
    setUser(payload.user)
    setActiveExperience('gm')
    setServerState(normalizeAppState(payload.state))
    return { user: payload.user, needsEmailConfirmation: false }
  }, [useSupabase])

  const logout = useCallback(async () => {
    if (useSupabase) {
      await logoutSupabase()
    } else {
      await api.logout()
    }

    setUser(null)
    setServerState(null)
    setIsPasswordRecovery(false)
  }, [useSupabase])

  const requestPasswordRecovery = useCallback(async (email) => {
    if (!useSupabase) {
      throw new Error('A recuperação de senha exige o Supabase.')
    }

    await requestSupabasePasswordRecovery({
      email,
      redirectTo: `${window.location.origin}/?recovery=password`,
    })
  }, [useSupabase])

  const completePasswordRecovery = useCallback(async (newPassword) => {
    if (!useSupabase) {
      throw new Error('A recuperação de senha exige o Supabase.')
    }

    const result = await completeSupabasePasswordRecovery(newPassword)
    window.history.replaceState({}, document.title, window.location.pathname)
    return result
  }, [useSupabase])

  const finishPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false)
  }, [])

  const completeProfile = useCallback(async (profileInput) => {
    if (!useSupabase) {
      throw new Error('O perfil publico exige o backend Supabase.')
    }

    const profile = await saveMyPublicProfile(profileInput)
    setUser((current) =>
      current
        ? {
            ...current,
            displayName: profile.display_name,
            username: profile.username,
            preferredMode: profile.preferred_mode,
            needsProfile: false,
          }
        : current,
    )
    setActiveExperience(profile.preferred_mode)
    return profile
  }, [useSupabase])

  const updateDisplayName = useCallback(async (displayName) => {
    if (!useSupabase) {
      throw new Error('As configurações da conta exigem o Supabase.')
    }

    const profile = await updateSupabaseDisplayName(displayName)
    setUser((current) => current
      ? { ...current, displayName: profile.display_name }
      : current)
    return profile
  }, [useSupabase])

  const value = useMemo(
    () => ({
      user,
      serverState,
      isAuthenticated: Boolean(user),
      isAuthReady,
      authError,
      setAuthError,
      setServerState,
      login,
      register,
      logout,
      requestPasswordRecovery,
      completePasswordRecovery,
      finishPasswordRecovery,
      isPasswordRecovery,
      activeExperience,
      setActiveExperience,
      completeProfile,
      updateDisplayName,
      isAccountSettingsOpen,
      openAccountSettings: () => setIsAccountSettingsOpen(true),
      closeAccountSettings: () => setIsAccountSettingsOpen(false),
    }),
    [
      authError,
      activeExperience,
      completeProfile,
      updateDisplayName,
      isAccountSettingsOpen,
      isAuthReady,
      login,
      logout,
      requestPasswordRecovery,
      completePasswordRecovery,
      finishPasswordRecovery,
      isPasswordRecovery,
      register,
      serverState,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
