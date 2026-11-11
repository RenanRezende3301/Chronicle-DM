import { normalizeAppState } from '../utils/appState.js'
import { isSupabaseConfigured, supabase } from './supabase.js'

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

function sortJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortJsonValue(value[key])]),
    )
  }

  return value
}

export function serializeWorkspaceForChecksum(state) {
  return JSON.stringify(sortJsonValue(normalizeAppState(state)))
}

export async function checksumWorkspace(state) {
  const serialized = serializeWorkspaceForChecksum(state)
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(serialized),
  )

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

export async function mirrorLegacyWorkspace(state) {
  const client = requireClient()
  const snapshot = normalizeAppState(state)
  const checksum = await checksumWorkspace(snapshot)
  const result = await client.rpc('mirror_gm_workspace', {
    workspace_snapshot: snapshot,
    workspace_checksum: checksum,
  })

  return unwrap(result, 'Nao foi possivel espelhar os dados do Escudo.')
}

export async function verifyLegacyWorkspaceMirror(expectedChecksum = null) {
  const client = requireClient()
  const result = await client.rpc('verify_gm_workspace_mirror', {
    expected_checksum: expectedChecksum,
  })

  return unwrap(result, 'Nao foi possivel conferir o espelho do Escudo.')
}

export async function mirrorAndVerifyLegacyWorkspace(state) {
  const mirror = await mirrorLegacyWorkspace(state)
  const verification = await verifyLegacyWorkspaceMirror(mirror.checksum)

  if (!verification.valid) {
    throw new Error('As contagens do espelho nao correspondem ao estado original.')
  }

  return { mirror, verification }
}

export async function getMirroredLegacyWorkspace() {
  const client = requireClient()
  const result = await client
    .from('gm_workspaces')
    .select(
      'schema_version, source_checksum, snapshot, migration_status, mirrored_at, verified_at, updated_at',
    )
    .maybeSingle()

  const workspace = unwrap(
    result,
    'Nao foi possivel carregar o espelho do Escudo.',
  )

  return workspace
    ? { ...workspace, snapshot: normalizeAppState(workspace.snapshot) }
    : null
}

export async function listLegacyWorkspaceRevisions() {
  const client = requireClient()
  const result = await client
    .from('gm_workspace_revisions')
    .select('source_checksum, created_at')
    .order('created_at', { ascending: false })

  return unwrap(result, 'Nao foi possivel listar as revisoes do Escudo.') || []
}

export async function restoreLegacyWorkspaceRevision(checksum) {
  const client = requireClient()
  const normalizedChecksum = String(checksum || '').trim().toLowerCase()

  if (!/^[a-f0-9]{64}$/.test(normalizedChecksum)) {
    throw new Error('O checksum da revisao e invalido.')
  }

  const result = await client.rpc('restore_gm_workspace_revision', {
    revision_checksum: normalizedChecksum,
  })

  return unwrap(result, 'Nao foi possivel restaurar a revisao do Escudo.')
}
