import { Buffer } from 'node:buffer'
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)

export const SESSION_COOKIE = 'vtm_session'
export const SESSION_DAYS = 30

export function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

export function createId(prefix) {
  return `${prefix}_${randomBytes(18).toString('hex')}`
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scrypt(password, salt, 64)

  return {
    salt,
    hash: derivedKey.toString('hex'),
  }
}

export async function verifyPassword(password, salt, storedHash) {
  const derivedKey = await scrypt(password, salt, 64)
  const storedKey = Buffer.from(storedHash, 'hex')

  if (storedKey.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(storedKey, derivedKey)
}

export function createSessionExpiry() {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS)
  return expiresAt
}

export function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((cookies, cookie) => {
      const separatorIndex = cookie.indexOf('=')

      if (separatorIndex === -1) {
        return cookies
      }

      const key = cookie.slice(0, separatorIndex)
      const value = cookie.slice(separatorIndex + 1)
      cookies[key] = decodeURIComponent(value)
      return cookies
    }, {})
}

export function createSessionCookie(sessionId, expiresAt, { secure = false } = {}) {
  const cookie = [
    `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Expires=${expiresAt.toUTCString()}`,
  ]

  if (secure) {
    cookie.push('Secure')
  }

  return cookie.join('; ')
}

export function clearSessionCookie({ secure = false } = {}) {
  const cookie = [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ]

  if (secure) {
    cookie.push('Secure')
  }

  return cookie.join('; ')
}
