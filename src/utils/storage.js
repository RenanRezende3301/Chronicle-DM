export const STORAGE_PREFIX = 'vtm:'

export const STORAGE_KEYS = {
  categories: `${STORAGE_PREFIX}categories`,
  npcs: `${STORAGE_PREFIX}npcs`,
  sceneCurrent: `${STORAGE_PREFIX}scene-current`,
  sceneSaved: `${STORAGE_PREFIX}scenes-saved`,
  notes: `${STORAGE_PREFIX}notes`,
  settings: `${STORAGE_PREFIX}settings`,
  gallery: `${STORAGE_PREFIX}gallery`,
  galleryCategories: `${STORAGE_PREFIX}gallery-categories`,
}

export function readStorage(key, fallbackValue) {
  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallbackValue
  } catch (error) {
    console.warn(`Nao foi possivel ler ${key} do LocalStorage.`, error)
    return fallbackValue
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Nao foi possivel salvar ${key} no LocalStorage.`, error)
    return false
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Nao foi possivel remover ${key} do LocalStorage.`, error)
    return false
  }
}
