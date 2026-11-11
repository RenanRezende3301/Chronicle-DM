import { useCallback, useEffect, useRef, useState } from 'react'
import {
  deleteImage,
  getImage,
  imageToObjectUrl,
  saveImage,
} from '../utils/imageStorage.js'
import { api } from '../services/api.js'
import { useAuth } from '../context/useAuth.js'

export function useIndexedDB(npcId) {
  const { isAuthenticated } = useAuth()
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const objectUrlRef = useRef('')

  const replaceImageUrl = useCallback((url) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    objectUrlRef.current = url
    setImageUrl(url)
  }, [])

  const loadImage = useCallback(async () => {
    if (!npcId) {
      setImageUrl('')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      if (isAuthenticated) {
        const serverBlob = await api.getImage(npcId)

        if (serverBlob) {
          const url = URL.createObjectURL(serverBlob)
          replaceImageUrl(url)
          return url
        }
      }

      const localBlob = await getImage(npcId)

      if (localBlob && isAuthenticated) {
        await api.saveImage(npcId, localBlob)
        await deleteImage(npcId)
      }

      const url = localBlob ? URL.createObjectURL(localBlob) : await imageToObjectUrl(npcId)
      replaceImageUrl(url)
      return url
    } catch (loadError) {
      setError(loadError)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, npcId, replaceImageUrl])

  useEffect(() => {
    queueMicrotask(() => {
      loadImage()
    })

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = ''
      }
    }
  }, [loadImage])

  const saveNPCImage = useCallback(
    async (imageBlob) => {
      setIsLoading(true)
      setError(null)

      try {
        if (isAuthenticated) {
          await api.saveImage(npcId, imageBlob)
          await deleteImage(npcId)
        } else {
          await saveImage(npcId, imageBlob)
        }

        return await loadImage()
      } catch (saveError) {
        setError(saveError)
        throw saveError
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, loadImage, npcId],
  )

  const deleteNPCImage = useCallback(async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (isAuthenticated) {
          await api.deleteImage(npcId)
        }

        await deleteImage(npcId)
        replaceImageUrl('')
        return true
      } catch (deleteError) {
        setError(deleteError)
        return false
      } finally {
        setIsLoading(false)
      }
  }, [isAuthenticated, npcId, replaceImageUrl])

  return {
    imageUrl,
    isLoading,
    error,
    getImage,
    saveImage: saveNPCImage,
    deleteImage: deleteNPCImage,
    reloadImage: loadImage,
  }
}
