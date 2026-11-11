import { CATEGORY_COLORS } from '../data/categoryColors.js'
import { STORAGE_KEYS, readStorage, writeStorage } from './storage.js'

export const defaultCategories = [
  {
    id: 'cat-camarilla',
    name: 'Camarilla',
    color: CATEGORY_COLORS[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-anarchs',
    name: 'Anarquistas',
    color: CATEGORY_COLORS[1],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-uncategorized',
    name: 'Sem Categoria',
    color: CATEGORY_COLORS[10],
    createdAt: new Date().toISOString(),
  },
]

export const defaultGalleryCategories = [
  {
    id: 'cat-maps',
    name: 'Mapas',
    color: CATEGORY_COLORS[2],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-places',
    name: 'Locais',
    color: CATEGORY_COLORS[6],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-portraits',
    name: 'Retratos',
    color: CATEGORY_COLORS[9],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-uncategorized',
    name: 'Sem Categoria',
    color: CATEGORY_COLORS[10],
    createdAt: new Date().toISOString(),
  },
]

export const defaultScene = {
  participants: [],
  currentTurnIndex: 0,
  round: 1,
  isMinimized: false,
}

export function normalizeScene(scene) {
  const participants = Array.isArray(scene?.participants) ? scene.participants : []
  const requestedIndex = Number(scene?.currentTurnIndex)
  const requestedRound = Number(scene?.round)
  return {
    ...defaultScene,
    ...(scene ?? {}),
    participants,
    currentTurnIndex: Number.isInteger(requestedIndex)
      ? Math.min(Math.max(requestedIndex, 0), Math.max(participants.length - 1, 0))
      : 0,
    round: Number.isInteger(requestedRound) ? Math.max(requestedRound, 1) : 1,
  }
}

export function normalizeAppState(state = {}) {
  return {
    categories: Array.isArray(state.categories) ? state.categories : defaultCategories,
    npcs: Array.isArray(state.npcs) ? state.npcs : [],
    sceneCurrent: normalizeScene(state.sceneCurrent),
    sceneSaved: Array.isArray(state.sceneSaved) ? state.sceneSaved : [],
    notes: Array.isArray(state.notes) ? state.notes : [],
    settings: state.settings && typeof state.settings === 'object' ? state.settings : {},
    gallery: Array.isArray(state.gallery) ? state.gallery : [],
    galleryCategories: Array.isArray(state.galleryCategories) ? state.galleryCategories : defaultGalleryCategories,
  }
}

export function readLocalAppState() {
  return normalizeAppState({
    categories: readStorage(STORAGE_KEYS.categories, defaultCategories),
    npcs: readStorage(STORAGE_KEYS.npcs, []),
    sceneCurrent: readStorage(STORAGE_KEYS.sceneCurrent, defaultScene),
    sceneSaved: readStorage(STORAGE_KEYS.sceneSaved, []),
    notes: readStorage(STORAGE_KEYS.notes, []),
    settings: readStorage(STORAGE_KEYS.settings, {}),
    gallery: readStorage(STORAGE_KEYS.gallery, []),
    galleryCategories: readStorage(STORAGE_KEYS.galleryCategories, defaultGalleryCategories),
  })
}

export function writeLocalAppState(state) {
  const normalizedState = normalizeAppState(state)

  writeStorage(STORAGE_KEYS.categories, normalizedState.categories)
  writeStorage(STORAGE_KEYS.npcs, normalizedState.npcs)
  writeStorage(STORAGE_KEYS.sceneCurrent, normalizedState.sceneCurrent)
  writeStorage(STORAGE_KEYS.sceneSaved, normalizedState.sceneSaved)
  writeStorage(STORAGE_KEYS.notes, normalizedState.notes)
  writeStorage(STORAGE_KEYS.settings, normalizedState.settings)
  writeStorage(STORAGE_KEYS.gallery, normalizedState.gallery)
  writeStorage(STORAGE_KEYS.galleryCategories, normalizedState.galleryCategories)
}

export function hasUserContent(state) {
  const normalizedState = normalizeAppState(state)

  return (
    normalizedState.npcs.length > 0 ||
    normalizedState.sceneSaved.length > 0 ||
    normalizedState.notes.length > 0 ||
    normalizedState.sceneCurrent.participants.length > 0 ||
    normalizedState.gallery.length > 0
  )
}
