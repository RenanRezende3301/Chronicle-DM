import { useEffect, useState } from 'react'
import { getLibraryPortraitUrl } from '../services/supabaseChronicle2.js'

const portraitUrlCache = new Map()
const CACHE_LIFETIME_MS = 45 * 60 * 1000

function loadPortraitUrl(path) {
  const cached = portraitUrlCache.get(path)
  if (cached && cached.expiresAt > Date.now()) return cached.promise

  const promise = getLibraryPortraitUrl(path).catch((error) => {
    portraitUrlCache.delete(path)
    throw error
  })
  portraitUrlCache.set(path, {
    expiresAt: Date.now() + CACHE_LIFETIME_MS,
    promise,
  })
  return promise
}

export function useLibraryPortraitUrl(portraitPath) {
  const normalizedPath = String(portraitPath || '').trim()
  const [loaded, setLoaded] = useState({ path: '', url: '' })

  useEffect(() => {
    if (!normalizedPath) return undefined

    let isActive = true
    loadPortraitUrl(normalizedPath)
      .then((url) => {
        if (isActive) setLoaded({ path: normalizedPath, url: url || '' })
      })
      .catch(() => {
        if (isActive) setLoaded({ path: normalizedPath, url: '' })
      })

    return () => {
      isActive = false
    }
  }, [normalizedPath])

  return loaded.path === normalizedPath ? loaded.url : ''
}
