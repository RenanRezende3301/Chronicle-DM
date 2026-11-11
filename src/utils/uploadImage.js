const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

// The image API stores Base64 inside JSON. Keeping the binary below this size
// leaves room for Base64 expansion and Netlify Function request limits.
const MAX_UPLOAD_BYTES = Math.floor(1.5 * 1024 * 1024)
const MAX_UPLOAD_DIMENSION = 2560

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Nao foi possivel ler esta imagem.'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Nao foi possivel otimizar esta imagem.'))
        }
      },
      'image/webp',
      quality,
    )
  })
}

export async function prepareImageUpload(imageBlob) {
  if (!(imageBlob instanceof Blob) || !ALLOWED_IMAGE_TYPES.has(imageBlob.type)) {
    throw new Error('Use uma imagem PNG, JPG ou WebP.')
  }

  if (imageBlob.size <= MAX_UPLOAD_BYTES) {
    return imageBlob
  }

  const image = await loadImage(imageBlob)
  let width = image.naturalWidth || image.width
  let height = image.naturalHeight || image.height
  const largestSide = Math.max(width, height)

  if (largestSide > MAX_UPLOAD_DIMENSION) {
    const factor = MAX_UPLOAD_DIMENSION / largestSide
    width = Math.max(1, Math.round(width * factor))
    height = Math.max(1, Math.round(height * factor))
  }

  const canvas = document.createElement('canvas')

  for (let attempt = 0; attempt < 7; attempt += 1) {
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, width, height)

    const quality = Math.max(0.48, 0.9 - attempt * 0.07)
    const optimized = await canvasToBlob(canvas, quality)
    if (optimized.size <= MAX_UPLOAD_BYTES) {
      return optimized
    }

    width = Math.max(1, Math.round(width * 0.78))
    height = Math.max(1, Math.round(height * 0.78))
  }

  throw new Error('A imagem nao pode ser reduzida para um tamanho seguro de envio.')
}
