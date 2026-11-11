import { isSupabaseConfigured, supabase } from './supabase.js'

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('A conexao com o Supabase ainda nao foi configurada.')
  }

  return supabase
}

function unwrap(result, fallbackMessage) {
  if (result.error) {
    throw new Error(result.error.message || fallbackMessage)
  }

  return result.data
}

function requireUuid(value, label) {
  const normalized = String(value || '').trim()

  if (!UUID_PATTERN.test(normalized)) {
    throw new Error(`${label} nao e valido.`)
  }

  return normalized
}

export async function getMyPublicProfile() {
  const client = requireClient()
  const session = unwrap(
    await client.auth.getSession(),
    'Nao foi possivel recuperar a sessao.',
  ).session

  if (!session?.user || session.user.is_anonymous) {
    return null
  }

  const result = await client
    .from('profiles')
    .select('id, username, display_name, preferred_mode, created_at, updated_at')
    .eq('id', session.user.id)
    .maybeSingle()

  return unwrap(result, 'Nao foi possivel carregar seu perfil.')
}

export async function saveMyPublicProfile({ username, displayName, preferredMode }) {
  const client = requireClient()
  const result = await client.rpc('set_public_profile', {
    public_username: String(username || '').trim(),
    public_display_name: String(displayName || '').trim(),
    initial_mode: preferredMode === 'gm' ? 'gm' : 'player',
  })

  return unwrap(result, 'Nao foi possivel salvar seu perfil.')
}

export async function updateMyDisplayName(displayName) {
  const client = requireClient()
  const result = await client.rpc('update_my_display_name', {
    public_display_name: String(displayName || '').trim(),
  })

  return unwrap(result, 'Não foi possível atualizar o nome exibido.')
}

export async function listMyCharacters({ includeArchived = false } = {}) {
  const client = requireClient()
  const session = unwrap(
    await client.auth.getSession(),
    'Nao foi possivel recuperar a sessao.',
  ).session

  if (!session?.user || session.user.is_anonymous) return []

  let query = client
    .from('characters')
    .select('*')
    .eq('owner_id', session.user.id)
    .order('updated_at', { ascending: false })

  if (!includeArchived) {
    query = query.is('archived_at', null)
  }

  return unwrap(await query, 'Nao foi possivel carregar seus personagens.') || []
}

export async function createCharacter({
  name,
  systemKey = 'vtm-v5',
  schemaVersion,
  characterData,
  portraitPath = null,
  creationStatus = 'complete',
  creationStep = 0,
}) {
  const client = requireClient()
  const session = unwrap(
    await client.auth.getSession(),
    'Nao foi possivel recuperar a sessao.',
  ).session

  if (!session?.user || session.user.is_anonymous) {
    throw new Error('Entre com uma conta permanente para criar personagens.')
  }

  const result = await client
    .from('characters')
    .insert({
      owner_id: session.user.id,
      system_key: String(systemKey || '').trim(),
      schema_version: Number(schemaVersion),
      name: String(name || '').trim(),
      character_data: characterData,
      portrait_path: portraitPath,
      creation_status: creationStatus === 'draft' ? 'draft' : 'complete',
      creation_step: Math.max(0, Number(creationStep) || 0),
    })
    .select()
    .single()

  return unwrap(result, 'Nao foi possivel criar o personagem.')
}

export async function updateCharacter({
  characterId,
  expectedVersion,
  name,
  schemaVersion,
  characterData,
  portraitPath,
  creationStatus,
  creationStep,
}) {
  const client = requireClient()
  const changes = {}

  if (name !== undefined) changes.name = String(name || '').trim()
  if (schemaVersion !== undefined) changes.schema_version = Number(schemaVersion)
  if (characterData !== undefined) changes.character_data = characterData
  if (portraitPath !== undefined) changes.portrait_path = portraitPath
  if (creationStatus !== undefined) {
    changes.creation_status = creationStatus === 'draft' ? 'draft' : 'complete'
  }
  if (creationStep !== undefined) {
    changes.creation_step = Math.max(0, Number(creationStep) || 0)
  }

  const result = await client
    .from('characters')
    .update(changes)
    .eq('id', requireUuid(characterId, 'Personagem'))
    .eq('version', Number(expectedVersion))
    .select()
    .maybeSingle()
  const character = unwrap(result, 'Nao foi possivel atualizar o personagem.')

  if (!character) {
    throw new Error(
      'A ficha foi alterada em outro dispositivo. Recarregue antes de salvar novamente.',
    )
  }

  return character
}

function portraitExtension(contentType) {
  if (contentType === 'image/png') return 'png'
  if (contentType === 'image/webp') return 'webp'
  return 'jpg'
}

async function uploadLibraryPortrait({ entityType, entityId, file }) {
  const client = requireClient()
  const normalizedEntityId = String(entityId || '').trim()
  const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp'])

  if (!normalizedEntityId || normalizedEntityId.length > 120) {
    throw new Error('A ficha do retrato nao e valida.')
  }
  if (!file || !allowedTypes.has(file.type)) {
    throw new Error('Use uma imagem PNG, JPG ou WebP.')
  }
  if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
    throw new Error('O retrato deve ter no máximo 10 MB.')
  }

  const session = unwrap(
    await client.auth.getSession(),
    'Nao foi possivel recuperar a sessao.',
  ).session
  if (!session?.user || session.user.is_anonymous) {
    throw new Error('Entre com uma conta permanente para enviar retratos.')
  }

  const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const safeEntityId = encodeURIComponent(normalizedEntityId)
  const objectPath = `${session.user.id}/${entityType}/${safeEntityId}/${uniqueId}.${portraitExtension(file.type)}`
  const result = await client.storage
    .from('character-portraits')
    .upload(objectPath, file, { contentType: file.type, upsert: false })

  if (result.error) {
    throw new Error(result.error.message || 'Nao foi possivel enviar o retrato.')
  }

  return objectPath
}

export async function uploadCharacterPortrait({ characterId, file }) {
  return uploadLibraryPortrait({
    entityType: 'characters',
    entityId: requireUuid(characterId, 'Personagem'),
    file,
  })
}

export async function uploadNpcPortrait({ npcId, file }) {
  return uploadLibraryPortrait({ entityType: 'npcs', entityId: npcId, file })
}

export async function uploadGalleryImage({ imageId, file }) {
  return uploadLibraryPortrait({ entityType: 'gallery', entityId: imageId, file })
}

export async function getCharacterPortraitUrl(portraitPath) {
  const client = requireClient()
  const normalizedPath = String(portraitPath || '').trim()
  if (!normalizedPath) return ''

  const result = await client.storage
    .from('character-portraits')
    .createSignedUrl(normalizedPath, 60 * 60)

  return unwrap(result, 'Nao foi possivel carregar o retrato.').signedUrl
}

export const getLibraryPortraitUrl = getCharacterPortraitUrl

export async function listMyGalleryLibrary() {
  const client = requireClient()
  const [categoriesResult, imagesResult] = await Promise.all([
    client
      .from('gm_gallery_categories')
      .select('legacy_id, sort_order, data')
      .is('archived_at', null)
      .order('sort_order'),
    client
      .from('gm_gallery_items')
      .select('legacy_id, sort_order, data')
      .is('archived_at', null)
      .order('sort_order'),
  ])

  return {
    categories: (unwrap(categoriesResult, 'Nao foi possivel carregar as categorias da galeria.') || [])
      .map((row) => ({ ...row.data, id: row.legacy_id })),
    images: (unwrap(imagesResult, 'Nao foi possivel carregar as imagens da galeria.') || [])
      .map((row) => ({ ...row.data, id: row.legacy_id })),
  }
}

async function saveGalleryRecord(table, record, sortOrder, fallbackMessage) {
  const client = requireClient()
  const session = unwrap(
    await client.auth.getSession(),
    'Nao foi possivel recuperar a sessao.',
  ).session

  if (!session?.user || session.user.is_anonymous) {
    throw new Error('Entre com uma conta permanente para usar a galeria.')
  }

  return unwrap(
    await client.from(table).upsert({
      owner_id: session.user.id,
      legacy_id: String(record.id),
      sort_order: Math.max(0, Number(sortOrder) || 0),
      data: record,
      archived_at: null,
      updated_at: new Date().toISOString(),
    }).select().single(),
    fallbackMessage,
  )
}

export function saveGalleryCategory(category, sortOrder = 0) {
  return saveGalleryRecord(
    'gm_gallery_categories',
    category,
    sortOrder,
    'Nao foi possivel salvar a categoria da galeria.',
  )
}

export function saveGalleryImage(image, sortOrder = 0) {
  return saveGalleryRecord(
    'gm_gallery_items',
    image,
    sortOrder,
    'Nao foi possivel salvar a imagem da galeria.',
  )
}

async function removeGalleryRecord(table, id, fallbackMessage) {
  const client = requireClient()
  const deleted = unwrap(
    await client.from(table).delete().eq('legacy_id', String(id)).select('legacy_id').maybeSingle(),
    fallbackMessage,
  )
  if (!deleted) {
    throw new Error('O item da galeria nao foi encontrado ou pertence a outra conta.')
  }
  return deleted
}

export function removeGalleryCategory(id) {
  return removeGalleryRecord(
    'gm_gallery_categories',
    id,
    'Nao foi possivel remover a categoria da galeria.',
  )
}

export function removeGalleryImage(id) {
  return removeGalleryRecord(
    'gm_gallery_items',
    id,
    'Nao foi possivel remover a imagem da galeria.',
  )
}

export async function removeLibraryPortrait(portraitPath) {
  const normalizedPath = String(portraitPath || '').trim()
  if (!normalizedPath) return false

  const client = requireClient()
  const result = await client.storage
    .from('character-portraits')
    .remove([normalizedPath])

  unwrap(result, 'Nao foi possivel remover o retrato anterior.')
  return true
}

export async function removeLibraryPortraitIfUnused(portraitPath) {
  const normalizedPath = String(portraitPath || '').trim()
  if (!normalizedPath) return false

  const client = requireClient()
  const [charactersResult, npcsResult] = await Promise.all([
    client.from('characters').select('id').eq('portrait_path', normalizedPath).limit(1),
    client.from('npc_sheets').select('id').eq('portrait_path', normalizedPath).limit(1),
  ])
  const characters = unwrap(charactersResult, 'Nao foi possivel verificar o retrato anterior.') || []
  const npcs = unwrap(npcsResult, 'Nao foi possivel verificar o retrato anterior.') || []
  if (characters.length || npcs.length) return false

  return removeLibraryPortrait(normalizedPath)
}

export async function setCharacterArchived(characterId, archived) {
  const client = requireClient()
  const result = await client
    .from('characters')
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq('id', requireUuid(characterId, 'Personagem'))
    .select()
    .single()

  return unwrap(result, 'Nao foi possivel arquivar o personagem.')
}

export async function listCharacterXpEvents(characterId) {
  const client = requireClient()
  const result = await client
    .from('character_xp_events')
    .select('*')
    .eq('character_id', requireUuid(characterId, 'Personagem'))
    .order('created_at', { ascending: false })

  return unwrap(result, 'Nao foi possivel carregar o historico de XP.') || []
}

export async function spendCharacterXp({
  characterId,
  expectedVersion,
  cost,
  reason,
  characterData,
  details = {},
  campaignId = null,
}) {
  const client = requireClient()
  const result = await client.rpc('spend_character_xp', {
    target_character_id: requireUuid(characterId, 'Personagem'),
    expected_character_version: Number(expectedVersion),
    xp_cost: Number(cost),
    change_reason: String(reason || '').trim(),
    next_character_data: characterData,
    event_details: details,
    target_campaign_id: campaignId ? requireUuid(campaignId, 'Cronica') : null,
  })

  return unwrap(result, 'Nao foi possivel concluir a evolucao do personagem.')
}

export async function refundCharacterXpPurchase({ eventId, expectedVersion, reason }) {
  const client = requireClient()
  const result = await client.rpc('refund_character_xp_purchase', {
    target_event_id: requireUuid(eventId, 'Compra de XP'),
    expected_character_version: Number(expectedVersion),
    refund_reason: String(reason || '').trim(),
  })

  return unwrap(result, 'Nao foi possivel estornar a compra de XP.')
}

export async function shareCharacterWithChronicle({ characterId, campaignId }) {
  const client = requireClient()
  const normalizedCampaignId = requireUuid(campaignId, 'Cronica')
  const normalizedCharacterId = requireUuid(characterId, 'Personagem')
  const session = unwrap(
    await client.auth.getSession(),
    'Nao foi possivel recuperar a sessao.',
  ).session

  if (!session?.user || session.user.is_anonymous) {
    throw new Error('Entre com uma conta permanente para compartilhar fichas.')
  }

  const existingResult = await client
    .from('chronicle_characters')
    .select('id')
    .eq('campaign_id', normalizedCampaignId)
    .eq('character_id', normalizedCharacterId)
    .maybeSingle()
  const existing = unwrap(
    existingResult,
    'Nao foi possivel verificar o compartilhamento da ficha.',
  )
  const result = existing
    ? await client
        .from('chronicle_characters')
        .update({ archived_at: null })
        .eq('id', existing.id)
        .select()
        .single()
    : await client
        .from('chronicle_characters')
        .insert({
          campaign_id: normalizedCampaignId,
          character_id: normalizedCharacterId,
          shared_by: session.user.id,
        })
        .select()
        .single()

  return unwrap(result, 'Nao foi possivel compartilhar a ficha.')
}

export async function listAvailableChronicles() {
  const client = requireClient()
  const result = await client
    .from('campaigns')
    .select('id, name, owner_id, created_at')
    .is('archived_at', null)
    .order('name')

  return unwrap(result, 'Nao foi possivel carregar suas cronicas.') || []
}

export async function listCharacterChronicleLinks(characterId) {
  const client = requireClient()
  const result = await client
    .from('chronicle_characters')
    .select('*, campaign:campaigns(id, name)')
    .eq('character_id', requireUuid(characterId, 'Personagem'))
    .order('shared_at')

  return unwrap(result, 'Nao foi possivel carregar os compartilhamentos.') || []
}

export async function setCharacterShareArchived({ linkId, archived }) {
  const client = requireClient()
  const result = await client
    .from('chronicle_characters')
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq('id', requireUuid(linkId, 'Vinculo da ficha'))
    .select()
    .single()

  return unwrap(result, 'Nao foi possivel alterar o compartilhamento da ficha.')
}

export async function deleteChronicleCharacterLink(linkId) {
  const client = requireClient()
  const normalizedLinkId = requireUuid(linkId, 'Vinculo da ficha')
  const actors = unwrap(
    await client
      .from('actors')
      .select('id')
      .eq('character_link_id', normalizedLinkId),
    'Nao foi possivel localizar o ator vinculado.',
  ) || []

  if (actors.length) {
    unwrap(
      await client
        .from('actors')
        .delete()
        .in('id', actors.map((actor) => actor.id)),
      'Nao foi possivel remover o ator vinculado.',
    )
  }

  const deleted = unwrap(
    await client
      .from('chronicle_characters')
      .delete()
      .eq('id', normalizedLinkId)
      .select('id')
      .maybeSingle(),
    'Nao foi possivel remover o personagem compartilhado.',
  )

  if (!deleted) {
    throw new Error('O personagem compartilhado nao foi encontrado ou voce nao tem permissao para remove-lo.')
  }
  return deleted
}

export async function setGmCharacterEditPermission({ linkId, allowed }) {
  const client = requireClient()
  const result = await client
    .from('chronicle_characters')
    .update({ can_gm_edit: Boolean(allowed) })
    .eq('id', requireUuid(linkId, 'Vinculo da ficha'))
    .select()
    .single()

  return unwrap(result, 'Nao foi possivel alterar a permissao do narrador.')
}

export function subscribeToCharacter({ characterId, onChange }) {
  const client = requireClient()
  const normalizedId = requireUuid(characterId, 'Personagem')
  const channel = client.channel(`character:${normalizedId}`)
  channel
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'characters', filter: `id=eq.${normalizedId}`,
    }, onChange)
    .subscribe()
  return () => channel.unsubscribe()
}

export async function listMyNpcLibrary() {
  const client = requireClient()
  const [categoriesResult, sheetsResult] = await Promise.all([
    client.from('npc_categories').select('*').order('name'),
    client.from('npc_sheets').select('*').order('updated_at', { ascending: false }),
  ])
  return {
    categories: unwrap(categoriesResult, 'Nao foi possivel carregar as categorias de NPC.') || [],
    sheets: unwrap(sheetsResult, 'Nao foi possivel carregar as fichas de NPC.') || [],
  }
}

export async function saveNpcCategory({ id, name, color }) {
  const client = requireClient()
  const session = unwrap(await client.auth.getSession(), 'Nao foi possivel recuperar a sessao.').session
  if (!session?.user || session.user.is_anonymous) throw new Error('Entre com uma conta permanente.')
  return unwrap(
    await client.from('npc_categories').upsert({
      id: String(id), owner_id: session.user.id, name: String(name || '').trim(), color: String(color || '#9b742e'),
    }).select().single(),
    'Nao foi possivel salvar a categoria de NPC.',
  )
}

export async function removeNpcCategory(id) {
  const client = requireClient()
  return unwrap(
    await client.from('npc_categories').delete().eq('id', String(id)).select().maybeSingle(),
    'Nao foi possivel remover a categoria de NPC.',
  )
}

export async function saveNpcSheet({ id, categoryId = null, npcData, portraitPath }) {
  const client = requireClient()
  const session = unwrap(await client.auth.getSession(), 'Nao foi possivel recuperar a sessao.').session
  if (!session?.user || session.user.is_anonymous) throw new Error('Entre com uma conta permanente.')

  // `portrait_path` is deliberately private and must belong to the current
  // account. URLs live only in npc_data.imageUrl. Sanitizing at this shared
  // persistence boundary protects every caller (form, importer and realtime
  // reconciliation) from accidentally sending an external URL or stale path
  // to the database trigger.
  const requestedPortraitPath = String(
    portraitPath ?? npcData?.portraitPath ?? '',
  ).trim()
  const ownedPortraitPath = requestedPortraitPath.startsWith(`${session.user.id}/`)
    ? requestedPortraitPath
    : null
  const { portraitPath: ignoredPortraitPath, ...safeNpcData } = npcData || {}
  void ignoredPortraitPath
  const canonicalNpcData = ownedPortraitPath
    ? { ...safeNpcData, portraitPath: ownedPortraitPath }
    : safeNpcData

  return unwrap(
    await client.from('npc_sheets').upsert({
      id: String(id),
      owner_id: session.user.id,
      category_id: categoryId || null,
      npc_data: canonicalNpcData,
      portrait_path: ownedPortraitPath,
    }).select().single(),
    'Nao foi possivel salvar a ficha de NPC.',
  )
}

export async function removeNpcSheet(id) {
  const client = requireClient()
  return unwrap(
    await client.from('npc_sheets').delete().eq('id', String(id)).select().maybeSingle(),
    'Nao foi possivel remover a ficha de NPC.',
  )
}

export function subscribeToMyNpcLibrary({ userId, onChange }) {
  const client = requireClient()
  const channel = client.channel(`npc-library:${userId}`)
  channel
    .on('postgres_changes', { event: '*', schema: 'public', table: 'npc_categories', filter: `owner_id=eq.${userId}` }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'npc_sheets', filter: `owner_id=eq.${userId}` }, onChange)
    .subscribe()
  return () => channel.unsubscribe()
}
