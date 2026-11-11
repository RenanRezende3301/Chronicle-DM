import { Buffer } from 'node:buffer'
import { createServer } from 'node:http'
import process from 'node:process'
import { database, getUserPublicProfile } from './database.js'
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
} from './auth.js'
import { createEmptyAppState, normalizeAppState } from './appState.js'

const PORT = Number(process.env.API_PORT ?? 4178)
const MAX_BODY_SIZE = 15 * 1024 * 1024
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

const statements = {
  createUser: database.prepare(`
    INSERT INTO users (id, email, display_name, password_hash, password_salt, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  findUserByEmail: database.prepare('SELECT * FROM users WHERE email = ?'),
  findUserById: database.prepare('SELECT * FROM users WHERE id = ?'),
  createSession: database.prepare(`
    INSERT INTO sessions (id, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `),
  deleteSession: database.prepare('DELETE FROM sessions WHERE id = ?'),
  deleteExpiredSessions: database.prepare('DELETE FROM sessions WHERE expires_at <= ?'),
  findSession: database.prepare(`
    SELECT sessions.*, users.email, users.display_name, users.created_at AS user_created_at
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ? AND sessions.expires_at > ?
  `),
  getState: database.prepare('SELECT state_json FROM user_state WHERE user_id = ?'),
  upsertState: database.prepare(`
    INSERT INTO user_state (user_id, state_json, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      state_json = excluded.state_json,
      updated_at = excluded.updated_at
  `),
  getImage: database.prepare(`
    SELECT content_type, image_data
    FROM npc_images
    WHERE user_id = ? AND npc_id = ?
  `),
  upsertImage: database.prepare(`
    INSERT INTO npc_images (user_id, npc_id, content_type, image_data, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, npc_id) DO UPDATE SET
      content_type = excluded.content_type,
      image_data = excluded.image_data,
      updated_at = excluded.updated_at
  `),
  deleteImage: database.prepare('DELETE FROM npc_images WHERE user_id = ? AND npc_id = ?'),
}

function sendJSON(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  })
  response.end(JSON.stringify(payload))
}

function sendNoContent(response, headers = {}) {
  response.writeHead(204, headers)
  response.end()
}

function sendImage(response, image) {
  response.writeHead(200, {
    'Content-Type': image.content_type,
    'Cache-Control': 'private, no-store',
  })
  response.end(image.image_data)
}

async function readJSONBody(request) {
  let body = ''

  for await (const chunk of request) {
    body += chunk

    if (body.length > MAX_BODY_SIZE) {
      const error = new Error('Payload muito grande.')
      error.statusCode = 413
      throw error
    }
  }

  if (!body) {
    return {}
  }

  try {
    return JSON.parse(body)
  } catch {
    const error = new Error('JSON invalido.')
    error.statusCode = 400
    throw error
  }
}

function getSessionId(request) {
  return parseCookies(request.headers.cookie)[SESSION_COOKIE] ?? ''
}

function getCurrentUser(request) {
  const sessionId = getSessionId(request)

  if (!sessionId) {
    return null
  }

  const now = new Date().toISOString()
  const session = statements.findSession.get(sessionId, now)

  if (!session) {
    return null
  }

  return {
    id: session.user_id,
    email: session.email,
    display_name: session.display_name,
    created_at: session.user_created_at,
  }
}

function requireUser(request, response) {
  const user = getCurrentUser(request)

  if (!user) {
    sendJSON(response, 401, { error: 'Sessao expirada. Faca login novamente.' })
    return null
  }

  return user
}

function getUserState(userId) {
  const row = statements.getState.get(userId)

  if (!row) {
    return createEmptyAppState()
  }

  try {
    return normalizeAppState(JSON.parse(row.state_json))
  } catch {
    return createEmptyAppState()
  }
}

function saveUserState(userId, state) {
  statements.upsertState.run(
    userId,
    JSON.stringify(normalizeAppState(state)),
    new Date().toISOString(),
  )
}

async function handleRegister(request, response) {
  const body = await readJSONBody(request)
  const email = normalizeEmail(body.email)
  const password = String(body.password ?? '')
  const displayName = String(body.displayName ?? '').trim() || email.split('@')[0]

  if (!email || !email.includes('@')) {
    sendJSON(response, 400, { error: 'Informe um email valido.' })
    return
  }

  if (password.length < 8) {
    sendJSON(response, 400, { error: 'A senha precisa ter pelo menos 8 caracteres.' })
    return
  }

  if (statements.findUserByEmail.get(email)) {
    sendJSON(response, 409, { error: 'Este email ja esta cadastrado.' })
    return
  }

  const now = new Date().toISOString()
  const passwordData = await hashPassword(password)
  const userId = createId('usr')
  const sessionId = createId('ses')
  const expiresAt = createSessionExpiry()

  statements.createUser.run(
    userId,
    email,
    displayName,
    passwordData.hash,
    passwordData.salt,
    now,
    now,
  )
  statements.createSession.run(sessionId, userId, expiresAt.toISOString(), now)
  saveUserState(userId, createEmptyAppState())

  const user = statements.findUserById.get(userId)

  sendJSON(
    response,
    201,
    { user: getUserPublicProfile(user), state: getUserState(userId) },
    { 'Set-Cookie': createSessionCookie(sessionId, expiresAt) },
  )
}

async function handleLogin(request, response) {
  const body = await readJSONBody(request)
  const email = normalizeEmail(body.email)
  const password = String(body.password ?? '')
  const user = statements.findUserByEmail.get(email)

  if (!user || !(await verifyPassword(password, user.password_salt, user.password_hash))) {
    sendJSON(response, 401, { error: 'Email ou senha invalidos.' })
    return
  }

  const now = new Date().toISOString()
  const sessionId = createId('ses')
  const expiresAt = createSessionExpiry()

  statements.createSession.run(sessionId, user.id, expiresAt.toISOString(), now)

  sendJSON(
    response,
    200,
    { user: getUserPublicProfile(user), state: getUserState(user.id) },
    { 'Set-Cookie': createSessionCookie(sessionId, expiresAt) },
  )
}

function handleLogout(request, response) {
  const sessionId = getSessionId(request)

  if (sessionId) {
    statements.deleteSession.run(sessionId)
  }

  sendNoContent(response, { 'Set-Cookie': clearSessionCookie() })
}

function handleMe(request, response) {
  const user = getCurrentUser(request)

  if (!user) {
    sendJSON(response, 200, { user: null, state: null })
    return
  }

  sendJSON(response, 200, {
    user: getUserPublicProfile(user),
    state: getUserState(user.id),
  })
}

async function handleSaveState(request, response) {
  const user = requireUser(request, response)

  if (!user) {
    return
  }

  const body = await readJSONBody(request)
  saveUserState(user.id, body.state)
  sendJSON(response, 200, { state: getUserState(user.id) })
}

function getImageNPCId(pathname) {
  const match = pathname.match(/^\/api\/images\/([^/]+)$/)
  return match ? decodeURIComponent(match[1]) : ''
}

function handleGetImage(request, response, npcId) {
  const user = requireUser(request, response)

  if (!user) {
    return
  }

  const image = statements.getImage.get(user.id, npcId)

  if (!image) {
    sendJSON(response, 404, { error: 'Imagem nao encontrada.' })
    return
  }

  sendImage(response, image)
}

async function handleSaveImage(request, response, npcId) {
  const user = requireUser(request, response)

  if (!user) {
    return
  }

  const body = await readJSONBody(request)
  const contentType = String(body.contentType ?? '')
  const base64Data = String(body.data ?? '')

  if (!npcId) {
    sendJSON(response, 400, { error: 'NPC invalido para imagem.' })
    return
  }

  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    sendJSON(response, 400, { error: 'Formato de imagem nao suportado.' })
    return
  }

  const imageData = Buffer.from(base64Data, 'base64')

  if (!imageData.length || imageData.length > MAX_IMAGE_SIZE) {
    sendJSON(response, 400, { error: 'Imagem invalida ou acima de 10MB.' })
    return
  }

  statements.upsertImage.run(
    user.id,
    npcId,
    contentType,
    imageData,
    new Date().toISOString(),
  )

  sendJSON(response, 200, { ok: true })
}

function handleDeleteImage(request, response, npcId) {
  const user = requireUser(request, response)

  if (!user) {
    return
  }

  statements.deleteImage.run(user.id, npcId)
  sendNoContent(response)
}

function handleGetState(request, response) {
  const user = requireUser(request, response)

  if (!user) {
    return
  }

  sendJSON(response, 200, { state: getUserState(user.id) })
}

async function route(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`)
  const imageNPCId = getImageNPCId(url.pathname)

  if (request.method === 'POST' && url.pathname === '/api/auth/register') {
    await handleRegister(request, response)
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/login') {
    await handleLogin(request, response)
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
    handleLogout(request, response)
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/auth/me') {
    handleMe(request, response)
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/state') {
    handleGetState(request, response)
    return
  }

  if (request.method === 'PUT' && url.pathname === '/api/state') {
    await handleSaveState(request, response)
    return
  }

  if (imageNPCId && request.method === 'GET') {
    handleGetImage(request, response, imageNPCId)
    return
  }

  if (imageNPCId && request.method === 'PUT') {
    await handleSaveImage(request, response, imageNPCId)
    return
  }

  if (imageNPCId && request.method === 'DELETE') {
    handleDeleteImage(request, response, imageNPCId)
    return
  }

  sendJSON(response, 404, { error: 'Rota nao encontrada.' })
}

const server = createServer(async (request, response) => {
  try {
    statements.deleteExpiredSessions.run(new Date().toISOString())
    await route(request, response)
  } catch (error) {
    sendJSON(response, error.statusCode ?? 500, {
      error: error.message || 'Erro interno do servidor.',
    })
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`API do Escudo do Narrador em http://127.0.0.1:${PORT}`)
})
