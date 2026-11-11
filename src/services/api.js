import { prepareImageUpload } from '../utils/uploadImage.js'

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      payload.error ?? `Nao foi possivel concluir a requisicao (HTTP ${response.status}).`,
    )
  }

  return payload
}

async function requestBlob(path) {
  const response = await fetch(path, {
    credentials: 'include',
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error ?? 'Nao foi possivel carregar a imagem.')
  }

  return response.blob()
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result ?? '')
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export const api = {
  me: () => request('/api/auth/me'),
  login: (credentials) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (credentials) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () =>
    request('/api/auth/logout', {
      method: 'POST',
    }),
  getState: () => request('/api/state'),
  saveState: (state) =>
    request('/api/state', {
      method: 'PUT',
      body: JSON.stringify({ state }),
    }),
  getImage: (imageId) =>
    requestBlob(`/api/images/${encodeURIComponent(imageId)}`),
  saveImage: async (imageId, imageBlob) => {
    const uploadImage = await prepareImageUpload(imageBlob)
    return request(`/api/images/${encodeURIComponent(imageId)}`, {
      method: 'PUT',
      body: JSON.stringify({
        contentType: uploadImage.type,
        data: await blobToBase64(uploadImage),
      }),
    })
  },
  deleteImage: (imageId) =>
    request(`/api/images/${encodeURIComponent(imageId)}`, {
      method: 'DELETE',
    }),
}
