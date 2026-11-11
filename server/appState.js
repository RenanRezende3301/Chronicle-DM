export function createEmptyAppState() {
  return {
    categories: null,
    npcs: [],
    sceneCurrent: null,
    sceneSaved: [],
    notes: [],
    settings: {},
    gallery: [],
    galleryCategories: null,
  }
}

export function normalizeAppState(state) {
  const source = state && typeof state === 'object' ? state : {}
  return Object.fromEntries(
    Object.entries(createEmptyAppState()).map(([key, fallback]) => [
      key,
      Object.hasOwn(source, key) ? source[key] : fallback,
    ]),
  )
}
