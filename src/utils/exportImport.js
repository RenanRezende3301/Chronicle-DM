import { nanoid } from 'nanoid'
import {
  getLibraryPortraitUrl,
  removeLibraryPortrait,
  removeLibraryPortraitIfUnused,
  saveNpcCategory,
  saveNpcSheet,
  uploadNpcPortrait,
} from '../services/supabaseChronicle2.js'
import { normalizeNPC } from './npcUtils.js'

const NPC_EXPORT_VERSION = 1

async function loadZipLibrary() {
  const module = await import('jszip')
  return module.default
}

function slugify(value) {
  return String(value || 'sem-nome')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function normalizedName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('pt-BR')
}

function indexByName(npcs) {
  return (npcs || []).reduce((index, npc) => {
    const key = normalizedName(npc?.name)
    if (!key) return index
    const matches = index.get(key) || []
    matches.push(npc)
    index.set(key, matches)
    return index
  }, new Map())
}

function portraitExtension(blob) {
  if (blob.type === 'image/png') return 'png'
  if (blob.type === 'image/webp') return 'webp'
  return 'jpg'
}

async function readPortraitBlob(portraitPath) {
  const signedUrl = await getLibraryPortraitUrl(portraitPath)
  const response = await fetch(signedUrl)
  if (!response.ok) throw new Error('Não foi possível baixar um retrato privado.')
  const blob = await response.blob()
  if (!blob.size) throw new Error('O retrato privado está vazio.')
  return blob
}

export function exportNPC(npc) {
  const payload = {
    version: NPC_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    npc,
  }

  downloadJSON(`npc-${slugify(npc.name)}-vtm.json`, payload)
}

export function exportAllNPCs(npcs) {
  const payload = {
    version: NPC_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    npcs,
  }

  downloadJSON('backup-npcs-vtm.json', payload)
}

export async function exportNpcBackupZip({ npcs, categories, label = 'todos', onProgress }) {
  const selectedNpcs = Array.isArray(npcs) ? npcs : []
  const selectedCategoryIds = new Set(selectedNpcs.map((npc) => npc.categoryId).filter(Boolean))
  const selectedCategories = (categories || []).filter((category) => selectedCategoryIds.has(category.id))
  const JSZip = await loadZipLibrary()
  const zip = new JSZip()
  const exportedNpcs = []
  const portraitErrors = []

  for (let index = 0; index < selectedNpcs.length; index += 1) {
    const npc = selectedNpcs[index]
    const { portraitPath, ...portableNpc } = npc
    const portrait = { type: 'none' }

    if (npc.imageUrl) {
      portrait.type = 'url'
      portrait.url = npc.imageUrl
    } else if (portraitPath) {
      try {
        onProgress?.({ name: npc.name, completed: index, total: selectedNpcs.length })
        const blob = await readPortraitBlob(portraitPath)
        const file = `retratos/${npc.id}.${portraitExtension(blob)}`
        zip.file(file, blob)
        portrait.type = 'file'
        portrait.file = file
      } catch (error) {
        portrait.type = 'missing'
        portraitErrors.push({ name: npc.name, reason: error?.message || 'Retrato indisponível.' })
      }
    }

    exportedNpcs.push({
      ...portableNpc,
      imageUrl: npc.imageUrl || '',
      portrait,
    })
  }

  zip.file('manifest.json', JSON.stringify({
    type: 'chronicle-npc-backup',
    version: 2,
    exportedAt: new Date().toISOString(),
    scope: label,
    categories: selectedCategories,
    npcs: exportedNpcs,
  }, null, 2))

  onProgress?.({ name: '', completed: selectedNpcs.length, total: selectedNpcs.length })
  const archive = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
  downloadBlob(`backup-npcs-${slugify(label)}.zip`, archive)
  return { exported: exportedNpcs.length, portraitErrors }
}

function readNpcBackupManifest(manifest) {
  if (manifest?.type !== 'chronicle-npc-backup' || manifest?.version !== 2 || !Array.isArray(manifest.npcs)) {
    throw new Error('Este ZIP não é um backup de NPCs compatível do Chronicle.')
  }
  return manifest
}

async function resolveImportedCategories(categories, manifestCategories) {
  const existingByName = new Map((categories || []).map((category) => [normalizedName(category.name), category]))
  const mapped = new Map()

  for (const category of manifestCategories || []) {
    const key = normalizedName(category?.name)
    if (!key) continue
    const existing = existingByName.get(key)
    if (existing) {
      mapped.set(category.id, existing.id)
      continue
    }

    const created = {
      id: nanoid(),
      name: String(category.name).trim(),
      color: String(category.color || '#9b742e'),
    }
    await saveNpcCategory(created)
    existingByName.set(key, created)
    mapped.set(category.id, created.id)
  }

  return mapped
}

async function uploadImportedPortrait({ zip, portrait, npcId }) {
  if (portrait?.type !== 'file' || !portrait.file) return ''
  const archiveEntry = zip.file(portrait.file)
  if (!archiveEntry) throw new Error('O arquivo de retrato não existe dentro do ZIP.')
  const blob = await archiveEntry.async('blob')
  if (!blob.size) throw new Error('O arquivo de retrato está vazio.')
  return uploadNpcPortrait({ npcId, file: blob })
}

export async function importNpcBackupZip({ file, targetNpcs, categories, onProgress }) {
  const JSZip = await loadZipLibrary()
  const zip = await JSZip.loadAsync(file)
  const manifestEntry = zip.file('manifest.json')
  if (!manifestEntry) throw new Error('O ZIP não contém manifest.json.')
  const manifest = readNpcBackupManifest(JSON.parse(await manifestEntry.async('text')))
  const categoryMap = await resolveImportedCategories(categories, manifest.categories)
  const targetByName = indexByName(targetNpcs)
  const sourceByName = indexByName(manifest.npcs)
  const report = { created: 0, replaced: 0, portraits: 0, ambiguous: [], failed: [] }

  for (let index = 0; index < manifest.npcs.length; index += 1) {
    const sourceNpc = manifest.npcs[index]
    const { portrait: sourcePortrait, ...sourceNpcData } = sourceNpc
    const key = normalizedName(sourceNpc?.name)
    const sourceMatches = sourceByName.get(key) || []
    const targetMatches = targetByName.get(key) || []
    if (!key || sourceMatches.length !== 1 || targetMatches.length > 1) {
      report.ambiguous.push(sourceNpc?.name || 'NPC sem nome')
      continue
    }

    const existingNpc = targetMatches[0] || null
    const targetId = existingNpc?.id || nanoid()
    const categoryId = sourceNpc.categoryId ? categoryMap.get(sourceNpc.categoryId) || null : null
    const portrait = sourcePortrait || { type: sourceNpc.imageUrl ? 'url' : 'none', url: sourceNpc.imageUrl }
    let uploadedPortraitPath = ''

    onProgress?.({ name: sourceNpc.name, completed: index, total: manifest.npcs.length })
    try {
      uploadedPortraitPath = await uploadImportedPortrait({ zip, portrait, npcId: targetId })
      const previousPortraitPath = String(existingNpc?.portraitPath || '').trim()
      const replacement = normalizeNPC({
        ...sourceNpcData,
        id: targetId,
        categoryId,
        createdAt: existingNpc?.createdAt || sourceNpc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl: portrait.type === 'url' ? String(portrait.url || sourceNpc.imageUrl || '') : '',
        portraitPath: uploadedPortraitPath,
      })

      await saveNpcSheet({
        id: targetId,
        categoryId,
        npcData: replacement,
        portraitPath: uploadedPortraitPath || null,
      })
      if (uploadedPortraitPath) report.portraits += 1
      if (previousPortraitPath && previousPortraitPath !== uploadedPortraitPath) {
        await removeLibraryPortraitIfUnused(previousPortraitPath).catch(() => false)
      }
      if (existingNpc) report.replaced += 1
      else report.created += 1
    } catch (error) {
      if (uploadedPortraitPath) await removeLibraryPortrait(uploadedPortraitPath).catch(() => {})
      report.failed.push({ name: sourceNpc.name, reason: error?.message || 'Falha ao importar NPC.' })
    }
  }

  return report
}

export function validateNPCJSON(json) {
  const npc = json?.npc ?? json

  if (!npc || typeof npc !== 'object') {
    return { valid: false, error: 'Arquivo JSON invalido.' }
  }

  if (!npc.name || typeof npc.name !== 'string') {
    return { valid: false, error: 'NPC sem nome obrigatorio.' }
  }

  if (!npc.type || !['vampire', 'mortal', 'ghoul', 'other'].includes(npc.type)) {
    return { valid: false, error: 'Tipo de NPC invalido.' }
  }

  if (!npc.attributes || typeof npc.attributes !== 'object') {
    return { valid: false, error: 'Atributos do NPC ausentes.' }
  }

  return { valid: true, npc }
}

export function importNPCFromJSON(json, options = {}) {
  const validation = validateNPCJSON(json)

  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const importedNPC = normalizeNPC(validation.npc)

  if (options.createAsNew) {
    importedNPC.id = nanoid()
    importedNPC.createdAt = new Date().toISOString()
    importedNPC.updatedAt = importedNPC.createdAt
  }

  return importedNPC
}

export function importNPCsFromJSON(json, options = {}) {
  const entries = Array.isArray(json?.npcs)
    ? json.npcs
    : Array.isArray(json)
      ? json
      : [json]

  if (!entries.length) {
    throw new Error('O arquivo não contém fichas de NPC.')
  }

  return entries.map((entry) => importNPCFromJSON(entry, options))
}

export async function parseNPCFile(file) {
  const text = await file.text()
  return importNPCFromJSON(JSON.parse(text))
}
