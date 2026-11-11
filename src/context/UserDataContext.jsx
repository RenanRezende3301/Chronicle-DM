import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../services/api.js'
import {
  hasUserContent,
  normalizeAppState,
  readLocalAppState,
  writeLocalAppState,
} from '../utils/appState.js'
import { useAuth } from './useAuth.js'
import { UserDataContext } from './UserDataContextObject.js'

export function UserDataProvider({ children }) {
  const { user, serverState, setServerState, isAuthReady } = useAuth()
  const [appState, setAppState] = useState(() => readLocalAppState())
  const [isDataReady, setIsDataReady] = useState(false)
  const [syncState, setSyncState] = useState('idle')
  const lastSavedStateRef = useRef('')
  const loadedUserIdRef = useRef(null)

  useEffect(() => {
    let isCancelled = false

    function applyLoadedState(nextState, lastSavedState, userId) {
      queueMicrotask(() => {
        if (isCancelled) {
          return
        }

        setAppState(nextState)
        setIsDataReady(true)
        lastSavedStateRef.current = lastSavedState
        loadedUserIdRef.current = userId
      })
    }

    if (!isAuthReady) {
      return () => {
        isCancelled = true
      }
    }

    if (!user) {
      const localState = readLocalAppState()
      applyLoadedState(localState, JSON.stringify(localState), null)
      return () => {
        isCancelled = true
      }
    }

    if (loadedUserIdRef.current === user.id) {
      return () => {
        isCancelled = true
      }
    }

    const localState = readLocalAppState()
    const remoteState = normalizeAppState(serverState ?? {})
    // Supabase accounts are canonical and account-scoped. Never promote a
    // browser cache into a newly created Supabase account: the same browser
    // can legitimately be used by more than one person. Legacy/local account
    // migration remains available only in the legacy backend flow.
    const shouldMigrateLocalData =
      user.authBackend !== 'supabase' &&
      !hasUserContent(remoteState) &&
      hasUserContent(localState)
    const nextState = shouldMigrateLocalData ? localState : remoteState

    applyLoadedState(
      nextState,
      shouldMigrateLocalData ? '' : JSON.stringify(nextState),
      user.id,
    )

    return () => {
      isCancelled = true
    }
  }, [isAuthReady, serverState, user])

  useEffect(() => {
    if (!isDataReady) {
      return undefined
    }

    const normalizedState = normalizeAppState(appState)
    const serializedState = JSON.stringify(normalizedState)

    writeLocalAppState(normalizedState)

    // Supabase-backed domains persist their canonical data through their own
    // account-scoped services (NPC library, characters, etc.). Sending
    // this browser snapshot to the old /api endpoint can only reintroduce
    // stale state, especially after switching accounts in one browser.
    if (
      !user ||
      user.authBackend === 'supabase' ||
      serializedState === lastSavedStateRef.current
    ) {
      return undefined
    }

    setSyncState('saving')

    const timeoutId = window.setTimeout(() => {
      api
        .saveState(normalizedState)
        .then((payload) => {
          const savedState = normalizeAppState(payload.state)
          lastSavedStateRef.current = JSON.stringify(savedState)
          setServerState(savedState)
          setSyncState('saved')
        })
        .catch(() => {
          setSyncState('error')
        })
    }, 700)

    return () => window.clearTimeout(timeoutId)
  }, [appState, isDataReady, setServerState, user])

  const updateAppState = useCallback((updater) => {
    setAppState((currentState) =>
      normalizeAppState(
        typeof updater === 'function' ? updater(normalizeAppState(currentState)) : updater,
      ),
    )
  }, [])

  const value = useMemo(
    () => ({
      appState,
      isDataReady,
      syncState,
      updateAppState,
    }),
    [appState, isDataReady, syncState, updateAppState],
  )

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  )
}
