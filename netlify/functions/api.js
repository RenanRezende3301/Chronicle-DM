import { Buffer } from 'node:buffer'
import { connectLambda, getStore } from '@netlify/blobs'
import {
  SESSION_COOKIE,
  clearSessionCookie,
  createId,
  createSessionCookie,
  createSessionExpiry,
  hashPassword,
  normalizeEmail,
  parseCookies,
  verifyPassword,
} from '../../server/auth.js'
import { createEmptyAppState, normalizeAppState } from '../../server/appState.js'

const MAX_BODY_SIZE = 3 * 1024 * 1024
const MAX_IMAGE_SIZE = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

function getStores() {
  return {
    users: getStore('vtm-users'),
    sessions: getStore('vtm-sessions'),
    states: getStore('vtm-user-states'),
    images: getStore('vtm-npc-images'),
  }
}

function json(statusCode, payload, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
    body: JSON.stringify(payload),
  }
}

function noContent(headers = {}) {
  return {
    statusCode: 204,
    headers,
    body: '',
  }
}

function imageResponse(contentType, data) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'private, no-store',
    },
    isBase64Encoded: true,
    body: Buffer.from(data).toString('base64'),
  }
}

function publicUser(user) {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
  }
}

function normalizePath(event) {
  const path = event.path || '/'

  if (path.startsWith('/.netlify/functions/api')) {
    return path.replace('/.netlify/functions/api', '') || '/'
  }

  if (path.startsWith('/api')) {
    return path.replace('/api', '') || '/'
  }

  return path
}

function readJSONBody(event) {
  if (!event.body) {
    return {}
  }

  const body = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body

  if (body.length > MAX_BODY_SIZE) {
    const error = new Error('Payload muito grande.')
    error.statusCode = 413
    throw error
  }

  try {
    return JSON.parse(body)
  } catch {
    const error = new Error('JSON invalido.')
    error.statusCode = 400
    throw error
  }
}

function getSessionId(event) {
  const cookieHeader = event.headers.cookie ?? event.headers.Cookie ?? ''
  return parseCookies(cookieHeader)[SESSION_COOKIE] ?? ''
}

async function getUserById(stores, userId) {
  return stores.users.get(`user:${userId}`, { type: 'json' })
}

async function getUserByEmail(stores, email) {
  const userId = await stores.users.get(`email:${email}`)

  if (!userId) {
    return null
  }

  return getUserById(stores, userId)
}

async function getCurrentUser(event, stores) {
  const sessionId = getSessionId(event)

  if (!sessionId) {
    return null
  }

  const session = await stores.sessions.get(`session:${sessionId}`, { type: 'json' })

  if (!session) {
    return null
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await stores.sessions.delete(`session:${sessionId}`)
    return null
  }

  return getUserById(stores, session.userId)
}

async function requireUser(event, stores) {
  const user = await getCurrentUser(event, stores)

  if (!user) {
    return { response: json(401, { error: 'Sessao expirada. Faca login novamente.' }) }
  }

  return { user }
}

async function getState(stores, userId) {
  const state = await stores.states.get(`state:${userId}`, { type: 'json' })
  return normalizeAppState(state ?? createEmptyAppState())
}

async function saveState(stores, userId, state) {
  const normalizedState = normalizeAppState(state)
  await stores.states.setJSON(`state:${userId}`, normalizedState, {
    metadata: { updatedAt: new Date().toISOString() },
  })
  return normalizedState
}

async function createSession(stores, userId) {
  const sessionId = createId('ses')
  const expiresAt = createSessionExpiry()

  await stores.sessions.setJSON(`session:${sessionId}`, {
    id: sessionId,
    userId,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  })

  return { sessionId, expiresAt }
}

async function register(event, stores) {
  const body = readJSONBody(event)
  const email = normalizeEmail(body.email)
  const password = String(body.password ?? '')
  const displayName = String(body.displayName ?? '').trim() || email.split('@')[0]

  if (!email || !email.includes('@')) {
    return json(400, { error: 'Informe um email valido.' })
  }

  if (password.length < 8) {
    return json(400, { error: 'A senha precisa ter pelo menos 8 caracteres.' })
  }

  if (await getUserByEmail(stores, email)) {
    return json(409, { error: 'Este email ja esta cadastrado.' })
  }

  const now = new Date().toISOString()
  const passwordData = await hashPassword(password)
  const user = {
    id: createId('usr'),
    email,
    displayName,
    passwordHash: passwordData.hash,
    passwordSalt: passwordData.salt,
    createdAt: now,
    updatedAt: now,
  }
  const { sessionId, expiresAt } = await createSession(stores, user.id)
  const state = createEmptyAppState()

  await stores.users.setJSON(`user:${user.id}`, user)
  await stores.users.set(`email:${email}`, user.id)
  await saveState(stores, user.id, state)

  return json(
    201,
    { user: publicUser(user), state },
    { 'Set-Cookie': createSessionCookie(sessionId, expiresAt, { secure: true }) },
  )
}

async function login(event, stores) {
  const body = readJSONBody(event)
  const email = normalizeEmail(body.email)
  const password = String(body.password ?? '')
  const user = await getUserByEmail(stores, email)

  if (
    !user ||
    !(await verifyPassword(password, user.passwordSalt, user.passwordHash))
  ) {
    return json(401, { error: 'Email ou senha invalidos.' })
  }

  const { sessionId, expiresAt } = await createSession(stores, user.id)

  return json(
    200,
    { user: publicUser(user), state: await getState(stores, user.id) },
    { 'Set-Cookie': createSessionCookie(sessionId, expiresAt, { secure: true }) },
  )
}

async function logout(event, stores) {
  const sessionId = getSessionId(event)

  if (sessionId) {
    await stores.sessions.delete(`session:${sessionId}`)
  }

  return noContent({ 'Set-Cookie': clearSessionCookie({ secure: true }) })
}

async function me(event, stores) {
  const user = await getCurrentUser(event, stores)

  if (!user) {
    return json(200, { user: null, state: null })
  }

  return json(200, {
    user: publicUser(user),
    state: await getState(stores, user.id),
  })
}

async function readState(event, stores) {
  const { user, response } = await requireUser(event, stores)

  if (response) {
    return response
  }

  return json(200, { state: await getState(stores, user.id) })
}

async function writeState(event, stores) {
  const { user, response } = await requireUser(event, stores)

  if (response) {
    return response
  }

  const body = readJSONBody(event)
  return json(200, { state: await saveState(stores, user.id, body.state) })
}

async function getImage(event, stores, npcId) {
  const { user, response } = await requireUser(event, stores)

  if (response) {
    return response
  }

  const image = await stores.images.getWithMetadata(`${user.id}/${npcId}`, {
    type: 'arrayBuffer',
  })

  if (!image?.data) {
    return json(404, { error: 'Imagem nao encontrada.' })
  }

  return imageResponse(image.metadata?.contentType ?? 'application/octet-stream', image.data)
}

async function saveImage(event, stores, npcId) {
  const { user, response } = await requireUser(event, stores)

  if (response) {
    return response
  }

  const body = readJSONBody(event)
  const contentType = String(body.contentType ?? '')
  const imageData = Buffer.from(String(body.data ?? ''), 'base64')

  if (!npcId) {
    return json(400, { error: 'NPC invalido para imagem.' })
  }

  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return json(400, { error: 'Formato de imagem nao suportado.' })
  }

  if (!imageData.length || imageData.length > MAX_IMAGE_SIZE) {
    return json(400, { error: 'Imagem invalida ou acima de 2MB.' })
  }

  await stores.images.set(
    `${user.id}/${npcId}`,
    imageData.buffer.slice(
      imageData.byteOffset,
      imageData.byteOffset + imageData.byteLength,
    ),
    {
      metadata: {
        contentType,
        updatedAt: new Date().toISOString(),
      },
    },
  )

  return json(200, { ok: true })
}

async function deleteImage(event, stores, npcId) {
  const { user, response } = await requireUser(event, stores)

  if (response) {
    return response
  }

  await stores.images.delete(`${user.id}/${npcId}`)
  return noContent()
}

export const handler = async (event) => {
  try {
    connectLambda(event)
    const stores = getStores()
    const path = normalizePath(event)
    const method = event.httpMethod
    const imageMatch = path.match(/^\/images\/([^/]+)$/)

    if (method === 'POST' && path === '/auth/register') {
      return register(event, stores)
    }

    if (method === 'POST' && path === '/auth/login') {
      return login(event, stores)
    }

    if (method === 'POST' && path === '/auth/logout') {
      return logout(event, stores)
    }

    if (method === 'GET' && path === '/auth/me') {
      return me(event, stores)
    }

    if (method === 'GET' && path === '/state') {
      return readState(event, stores)
    }

    if (method === 'PUT' && path === '/state') {
      return writeState(event, stores)
    }

    if (imageMatch && method === 'GET') {
      return getImage(event, stores, decodeURIComponent(imageMatch[1]))
    }

    if (imageMatch && method === 'PUT') {
      return saveImage(event, stores, decodeURIComponent(imageMatch[1]))
    }

    if (imageMatch && method === 'DELETE') {
      return deleteImage(event, stores, decodeURIComponent(imageMatch[1]))
    }

    return json(404, { error: 'Rota nao encontrada.' })
  } catch (error) {
    return json(error.statusCode ?? 500, {
      error: error.message || 'Erro interno do servidor.',
    })
  }
}
