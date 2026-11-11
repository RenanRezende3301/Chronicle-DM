import { isSupabaseConfigured, supabase } from './supabase.js'
import {
  getMyPublicProfile,
  saveMyPublicProfile,
  updateMyDisplayName,
} from './supabaseChronicle2.js'

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('A conexao com o Supabase ainda nao foi configurada.')
  }

  return supabase
}

function throwIfError(error, fallbackMessage) {
  if (error) {
    throw new Error(error.message || fallbackMessage)
  }
}

export async function getSupabaseSession() {
  const client = requireClient()
  const { data, error } = await client.auth.getSession()
  throwIfError(error, 'Nao foi possivel recuperar a sessao.')
  return data.session
}

export function observeSupabaseSession(callback) {
  const client = requireClient()
  const { data } = client.auth.onAuthStateChange((event, session) => {
    callback(session, event)
  })

  return () => data.subscription.unsubscribe()
}

export async function registerSupabaseGm({ displayName, email, password }) {
  const client = requireClient()
  const normalizedDisplayName = String(displayName || '').trim()

  if (!normalizedDisplayName) {
    throw new Error('Informe o nome do narrador.')
  }

  const currentSession = await getSupabaseSession()

  if (currentSession?.user?.is_anonymous) {
    const { error: signOutError } = await client.auth.signOut()
    throwIfError(signOutError, 'Nao foi possivel trocar a sessao atual.')
  }

  const { data, error } = await client.auth.signUp({
    email: String(email || '').trim(),
    password,
    options: {
      data: { display_name: normalizedDisplayName },
    },
  })
  throwIfError(error, 'Nao foi possivel criar a conta do narrador.')

  return {
    session: data.session,
    user: data.user,
    needsEmailConfirmation: Boolean(data.user && !data.session),
  }
}

export async function loginSupabaseGm({ email, password }) {
  const client = requireClient()
  const { data, error } = await client.auth.signInWithPassword({
    email: String(email || '').trim(),
    password,
  })
  throwIfError(error, 'Email ou senha invalidos.')

  if (data.user?.is_anonymous) {
    await client.auth.signOut()
    throw new Error('A conta do narrador precisa ser permanente.')
  }

  return data
}

function normalizePublicAccount({ username, displayName, preferredMode }) {
  const normalizedUsername = String(username || '').trim().toLowerCase()
  const normalizedDisplayName = String(displayName || '').trim()
  const normalizedMode = preferredMode === 'gm' ? 'gm' : 'player'

  if (!/^[a-z0-9_]{3,32}$/.test(normalizedUsername)) {
    throw new Error(
      'O username precisa ter de 3 a 32 letras minusculas, numeros ou underscores.',
    )
  }

  if (!normalizedDisplayName) {
    throw new Error('Informe o nome que sera exibido no Chronicle.')
  }

  return {
    username: normalizedUsername,
    displayName: normalizedDisplayName,
    preferredMode: normalizedMode,
  }
}

async function ensureAccountProfile(user) {
  const existingProfile = await getMyPublicProfile()

  if (existingProfile) {
    return existingProfile
  }

  const metadata = user?.user_metadata || {}
  const username = String(metadata.username || '').trim()
  const displayName = String(metadata.display_name || '').trim()

  if (!username || !displayName) {
    return null
  }

  return saveMyPublicProfile({
    username,
    displayName,
    preferredMode: metadata.preferred_mode,
  })
}

export async function registerSupabaseAccount(credentials) {
  const client = requireClient()
  const profile = normalizePublicAccount(credentials)
  const currentSession = await getSupabaseSession()

  if (currentSession?.user?.is_anonymous) {
    const { error: signOutError } = await client.auth.signOut()
    throwIfError(signOutError, 'Nao foi possivel trocar a sessao temporaria.')
  }

  const { data, error } = await client.auth.signUp({
    email: String(credentials.email || '').trim(),
    password: credentials.password,
    options: {
      data: {
        display_name: profile.displayName,
        username: profile.username,
        preferred_mode: profile.preferredMode,
      },
    },
  })
  throwIfError(error, 'Nao foi possivel criar a conta.')

  const savedProfile = data.session
    ? await saveMyPublicProfile(profile)
    : null

  return {
    session: data.session,
    user: data.user,
    profile: savedProfile,
    needsEmailConfirmation: Boolean(data.user && !data.session),
  }
}

export async function loginSupabaseAccount({ email, password }) {
  const data = await loginSupabaseGm({ email, password })
  const profile = await ensureAccountProfile(data.user)

  return {
    ...data,
    profile,
    needsProfile: !profile,
  }
}

export async function loadSupabaseAccount(session = null) {
  const activeSession = session || (await getSupabaseSession())

  if (!activeSession?.user || activeSession.user.is_anonymous) {
    return { session: activeSession, user: null, profile: null }
  }

  const profile = await ensureAccountProfile(activeSession.user)
  return { session: activeSession, user: activeSession.user, profile }
}

export async function logoutSupabase() {
  const client = requireClient()
  const { error } = await client.auth.signOut()
  throwIfError(error, 'Nao foi possivel encerrar a sessao.')
}

export async function requestSupabasePasswordRecovery({ email, redirectTo }) {
  const client = requireClient()
  const normalizedEmail = String(email || '').trim().toLowerCase()

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('Informe um e-mail válido.')
  }

  // A interface sempre mostra a mesma confirmação, inclusive se o endereço não
  // existir. Isso evita que o login seja usado para descobrir quais e-mails
  // possuem uma conta no Chronicle.
  const { error } = await client.auth.resetPasswordForEmail(normalizedEmail, { redirectTo })
  if (error) {
    throw new Error('Não foi possível solicitar a recuperação agora. Tente novamente em alguns minutos.')
  }
}

async function getAuthenticatedPermanentUser() {
  const client = requireClient()
  const { data, error } = await client.auth.getUser()
  throwIfError(error, 'Sua sessão expirou. Entre novamente.')

  if (!data.user || data.user.is_anonymous || !data.user.email) {
    throw new Error('Entre com uma conta permanente para alterar a conta.')
  }

  return { client, user: data.user }
}

async function confirmCurrentPassword({ client, email, currentPassword }) {
  const password = String(currentPassword || '')
  if (!password) throw new Error('Informe sua senha atual.')

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    throw new Error('A senha atual não confere.')
  }
}

export async function updateSupabaseDisplayName(displayName) {
  await getAuthenticatedPermanentUser()
  return updateMyDisplayName(displayName)
}

export async function changeSupabasePassword({ currentPassword, newPassword }) {
  const { client, user } = await getAuthenticatedPermanentUser()
  await confirmCurrentPassword({
    client,
    email: user.email,
    currentPassword,
  })

  const { error } = await client.auth.updateUser({
    current_password: String(currentPassword || ''),
    password: String(newPassword || ''),
  })
  throwIfError(error, 'Não foi possível alterar sua senha.')

  // Mantém esta sessão aberta, mas remove sessões esquecidas em outros
  // navegadores/dispositivos após uma alteração de credencial.
  const { error: signOutError } = await client.auth.signOut({ scope: 'others' })
  return { otherSessionsClosed: !signOutError }
}

export async function completeSupabasePasswordRecovery(newPassword) {
  const { client } = await getAuthenticatedPermanentUser()
  const password = String(newPassword || '')

  if (password.length < 8) {
    throw new Error('A nova senha precisa ter pelo menos 8 caracteres.')
  }

  const { error } = await client.auth.updateUser({ password })
  throwIfError(error, 'Não foi possível redefinir a senha.')

  const { error: signOutError } = await client.auth.signOut({ scope: 'others' })
  return { otherSessionsClosed: !signOutError }
}

export async function requestSupabaseEmailChange({ currentPassword, newEmail, emailRedirectTo }) {
  const { client, user } = await getAuthenticatedPermanentUser()
  const normalizedEmail = String(newEmail || '').trim().toLowerCase()

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('Informe um novo e-mail válido.')
  }
  if (normalizedEmail === String(user.email || '').trim().toLowerCase()) {
    throw new Error('O novo e-mail precisa ser diferente do atual.')
  }

  await confirmCurrentPassword({
    client,
    email: user.email,
    currentPassword,
  })

  const { data, error } = await client.auth.updateUser(
    {
      current_password: String(currentPassword || ''),
      email: normalizedEmail,
    },
    { emailRedirectTo },
  )
  throwIfError(error, 'Não foi possível iniciar a alteração de e-mail.')

  return {
    pendingEmail: data.user?.new_email || normalizedEmail,
  }
}
