import { nanoid } from 'nanoid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NPCContext } from './NPCContextObject.js'
import { CATEGORY_COLORS } from '../data/categoryColors.js'
import { applyNPCUpdates, normalizeNPC } from '../utils/npcUtils.js'
import { useUserData } from './useUserData.js'
import { useAuth } from './useAuth.js'
import { isSupabaseConfigured } from '../services/supabase.js'
import { api } from '../services/api.js'
import { getImage as getLocalNpcImage } from '../utils/imageStorage.js'
import {
  listMyNpcLibrary,
  removeLibraryPortrait,
  removeLibraryPortraitIfUnused,
  removeNpcCategory,
  removeNpcSheet,
  saveNpcCategory,
  saveNpcSheet,
  subscribeToMyNpcLibrary,
  uploadNpcPortrait,
} from '../services/supabaseChronicle2.js'

export function NPCProvider({ children }) {
  const { appState, isDataReady, updateAppState } = useUserData()
  const { user } = useAuth()
  const [remoteLibraryUserId, setRemoteLibraryUserId] = useState('')
  const usesRemoteLibrary = Boolean(isSupabaseConfigured && user?.authBackend === 'supabase' && user?.id)
  // While a Supabase account is being hydrated, never render the previous
  // browser user's local NPC cache. The canonical library is account-owned.
  const isRemoteLibraryReady = !usesRemoteLibrary || remoteLibraryUserId === user?.id
  const categories = useMemo(
    () => (isRemoteLibraryReady ? appState.categories : []),
    [appState.categories, isRemoteLibraryReady],
  )
  const npcs = useMemo(
    () => (isRemoteLibraryReady ? appState.npcs : []),
    [appState.npcs, isRemoteLibraryReady],
  )
  const refreshTimerRef = useRef(0)
  const localLibraryRef = useRef({ categories, npcs })
  const pendingNpcSavesRef = useRef(new Map())
  const npcSaveChainsRef = useRef(new Map())
  const legacyPortraitMigrationRef = useRef('')

  useEffect(() => {
    localLibraryRef.current = { categories, npcs }
  }, [categories, npcs])

  const applyRemoteLibrary = useCallback((library, ownerId) => {
    const remoteCategories = (library.categories || []).map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      createdAt: category.created_at,
    }))
    const remoteNpcs = (library.sheets || []).map((sheet) => {
      const pending = pendingNpcSavesRef.current.get(sheet.id)
      return pending || normalizeNPC({
        ...sheet.npc_data,
        id: sheet.id,
        categoryId: sheet.category_id,
        portraitPath: sheet.portrait_path || sheet.npc_data?.portraitPath || '',
        createdAt: sheet.created_at,
        updatedAt: sheet.updated_at,
      })
    })
    localLibraryRef.current = { categories: remoteCategories, npcs: remoteNpcs }
    updateAppState((current) => ({
      ...current,
      categories: remoteCategories,
      npcs: remoteNpcs,
    }))
    setRemoteLibraryUserId(ownerId || '')
  }, [updateAppState])

  const refreshRemoteLibrary = useCallback(async () => {
    if (!usesRemoteLibrary) return
    applyRemoteLibrary(await listMyNpcLibrary(), user?.id)
  }, [applyRemoteLibrary, user?.id, usesRemoteLibrary])

  useEffect(() => {
    if (!usesRemoteLibrary || !isDataReady) return undefined
    let cancelled = false

    async function hydrate() {
      const library = await listMyNpcLibrary()
      if (cancelled) return
      // A legacy local cache belongs to the browser, not to whichever account
      // happened to sign in next. Importing it must always be an explicit
      // action, never an automatic first-login side effect.
      applyRemoteLibrary(library, user.id)
      if (legacyPortraitMigrationRef.current !== user.id) {
        legacyPortraitMigrationRef.current = user.id
        for (const sheet of library.sheets || []) {
          if (cancelled) break
          if (sheet.portrait_path || sheet.npc_data?.portraitPath || sheet.npc_data?.imageUrl) {
            continue
          }

          let blob = await api.getImage(sheet.id).catch(() => null)
          if (!['image/png', 'image/jpeg', 'image/webp'].includes(blob?.type)) {
            blob = await getLocalNpcImage(sheet.id).catch(() => null)
          }
          if (!blob) continue

          let uploadedPath = ''
          try {
            uploadedPath = await uploadNpcPortrait({ npcId: sheet.id, file: blob })
            await saveNpcSheet({
              id: sheet.id,
              categoryId: sheet.category_id,
              npcData: { ...sheet.npc_data, portraitPath: uploadedPath },
              portraitPath: uploadedPath,
            })
          } catch (error) {
            if (uploadedPath) void removeLibraryPortrait(uploadedPath).catch(() => {})
            console.warn('Nao foi possivel migrar um retrato antigo de NPC.', {
              npcId: sheet.id,
              error: error?.message,
            })
          }
        }
      }
    }

    hydrate().catch((error) => console.error('Nao foi possivel sincronizar a biblioteca de NPCs.', error))
    const stop = subscribeToMyNpcLibrary({
      userId: user.id,
      onChange: () => {
        window.clearTimeout(refreshTimerRef.current)
        refreshTimerRef.current = window.setTimeout(() => {
          refreshRemoteLibrary().catch(() => {})
        }, 80)
      },
    })
    return () => {
      cancelled = true
      window.clearTimeout(refreshTimerRef.current)
      stop()
    }
  }, [applyRemoteLibrary, isDataReady, refreshRemoteLibrary, user?.id, usesRemoteLibrary])

  const addCategory = useCallback((category) => {
    const now = new Date().toISOString()
    const newCategory = {
      id: nanoid(),
      name: category.name,
      color: category.color ?? CATEGORY_COLORS[0],
      createdAt: now,
    }

    updateAppState((currentState) => ({
      ...currentState,
      categories: [...currentState.categories, newCategory],
    }))
    if (usesRemoteLibrary) void saveNpcCategory(newCategory).catch(console.error)
    return newCategory
  }, [updateAppState, usesRemoteLibrary])

  const updateCategory = useCallback((categoryId, updates) => {
    updateAppState((currentState) => ({
      ...currentState,
      categories: currentState.categories.map((category) =>
        category.id === categoryId ? { ...category, ...updates } : category,
      ),
    }))
    if (usesRemoteLibrary) {
      const current = categories.find((category) => category.id === categoryId)
      if (current) void saveNpcCategory({ ...current, ...updates }).catch(console.error)
    }
  }, [categories, updateAppState, usesRemoteLibrary])

  const deleteCategory = useCallback((categoryId) => {
    updateAppState((currentState) => ({
      ...currentState,
      categories: currentState.categories.filter((category) => category.id !== categoryId),
      npcs: currentState.npcs.map((npc) =>
        npc.categoryId === categoryId ? { ...npc, categoryId: null } : npc,
      ),
    }))
    if (usesRemoteLibrary) void removeNpcCategory(categoryId).catch(console.error)
  }, [updateAppState, usesRemoteLibrary])

  const addNPC = useCallback((npc) => {
    const newNPC = normalizeNPC(npc)
    updateAppState((currentState) => ({
      ...currentState,
      npcs: [...currentState.npcs, newNPC],
    }))
    if (usesRemoteLibrary) void saveNpcSheet({ id: newNPC.id, categoryId: newNPC.categoryId, npcData: newNPC, portraitPath: newNPC.portraitPath }).catch(console.error)
    return newNPC
  }, [updateAppState, usesRemoteLibrary])

  const updateNPC = useCallback((npcId, updates) => {
    const currentNPC = localLibraryRef.current.npcs.find((npc) => npc.id === npcId)
    const updatedNPC = applyNPCUpdates(currentNPC, updates)
    if (!updatedNPC) return null

    const nextNpcs = localLibraryRef.current.npcs.map((npc) => (
      npc.id === npcId ? updatedNPC : npc
    ))
    localLibraryRef.current = { ...localLibraryRef.current, npcs: nextNpcs }
    updateAppState((currentState) => ({ ...currentState, npcs: nextNpcs }))

    if (usesRemoteLibrary) {
      pendingNpcSavesRef.current.set(npcId, updatedNPC)
      const previousSave = npcSaveChainsRef.current.get(npcId) || Promise.resolve()
      const nextSave = previousSave
        .catch(() => undefined)
        .then(() => saveNpcSheet({
          id: updatedNPC.id,
          categoryId: updatedNPC.categoryId,
          npcData: updatedNPC,
          portraitPath: updatedNPC.portraitPath,
        }))
      npcSaveChainsRef.current.set(npcId, nextSave)
      void nextSave
        .catch((error) => console.error('Nao foi possivel salvar a ficha de NPC.', error))
        .finally(() => {
          if (npcSaveChainsRef.current.get(npcId) === nextSave) {
            npcSaveChainsRef.current.delete(npcId)
          }
          if (pendingNpcSavesRef.current.get(npcId) === updatedNPC) {
            pendingNpcSavesRef.current.delete(npcId)
          }
        })
    }
    return updatedNPC
  }, [updateAppState, usesRemoteLibrary])

  const deleteNPC = useCallback((npcId) => {
    const portraitPath = localLibraryRef.current.npcs.find((npc) => npc.id === npcId)?.portraitPath
    updateAppState((currentState) => ({
      ...currentState,
      npcs: currentState.npcs.filter((npc) => npc.id !== npcId),
    }))
    if (usesRemoteLibrary) {
      void removeNpcSheet(npcId)
        .then(() => portraitPath ? removeLibraryPortraitIfUnused(portraitPath) : false)
        .catch(console.error)
    }
  }, [updateAppState, usesRemoteLibrary])

  const deleteNPCs = useCallback(async (npcIds) => {
    const ids = [...new Set((npcIds || []).filter(Boolean))]
    if (!ids.length) return 0

    const idSet = new Set(ids)
    const deletedNpcs = localLibraryRef.current.npcs.filter((npc) => idSet.has(npc.id))
    if (!deletedNpcs.length) return 0

    const nextNpcs = localLibraryRef.current.npcs.filter((npc) => !idSet.has(npc.id))
    localLibraryRef.current = { ...localLibraryRef.current, npcs: nextNpcs }
    updateAppState((currentState) => ({ ...currentState, npcs: nextNpcs }))

    if (!usesRemoteLibrary) return deletedNpcs.length

    try {
      await Promise.all(deletedNpcs.map((npc) => removeNpcSheet(npc.id)))
      await Promise.all(
        deletedNpcs
          .map((npc) => npc.portraitPath)
          .filter(Boolean)
          .map((portraitPath) => removeLibraryPortraitIfUnused(portraitPath)),
      )
      return deletedNpcs.length
    } catch (error) {
      // Rehydrate from the canonical library if a network failure leaves a
      // partial batch, rather than pretending every deletion succeeded.
      refreshRemoteLibrary().catch(() => {})
      throw error
    }
  }, [refreshRemoteLibrary, updateAppState, usesRemoteLibrary])

  const importNPCs = useCallback(async (incomingNPCs) => {
    const normalizedNPCs = incomingNPCs.map((npc) => normalizeNPC(npc))
    if (usesRemoteLibrary) {
      for (const npc of normalizedNPCs) {
        await saveNpcSheet({
          id: npc.id,
          categoryId: npc.categoryId,
          npcData: npc,
          portraitPath: npc.portraitPath,
        })
      }
    }

    const nextNpcs = [...localLibraryRef.current.npcs, ...normalizedNPCs]
    localLibraryRef.current = { ...localLibraryRef.current, npcs: nextNpcs }
    updateAppState((currentState) => ({ ...currentState, npcs: nextNpcs }))
    return normalizedNPCs
  }, [updateAppState, usesRemoteLibrary])

  const value = useMemo(
    () => ({
      npcs,
      categories,
      addNPC,
      updateNPC,
      deleteNPC,
      deleteNPCs,
      importNPCs,
      refreshNPCs: refreshRemoteLibrary,
      addCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      addCategory,
      addNPC,
      categories,
      deleteCategory,
      deleteNPC,
      deleteNPCs,
      importNPCs,
      refreshRemoteLibrary,
      npcs,
      updateCategory,
      updateNPC,
    ],
  )

  return <NPCContext.Provider value={value}>{children}</NPCContext.Provider>
}
