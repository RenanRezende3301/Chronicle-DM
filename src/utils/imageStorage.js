import { openDB } from 'idb'

const DB_NAME = 'vtm-images'
const DB_VERSION = 1
const STORE_NAME = 'npc-images'

async function getImageDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    },
  })
}

export async function saveImage(npcId, imageBlob) {
  if (!npcId || !(imageBlob instanceof Blob)) {
    throw new Error('Imagem invalida para salvar no IndexedDB.')
  }

  const database = await getImageDB()
  await database.put(STORE_NAME, imageBlob, npcId)
  return npcId
}

export async function getImage(npcId) {
  if (!npcId) {
    return null
  }

  const database = await getImageDB()
  return database.get(STORE_NAME, npcId)
}

export async function deleteImage(npcId) {
  if (!npcId) {
    return false
  }

  const database = await getImageDB()
  await database.delete(STORE_NAME, npcId)
  return true
}

export async function imageToObjectUrl(npcId) {
  const blob = await getImage(npcId)
  return blob ? URL.createObjectURL(blob) : ''
}
