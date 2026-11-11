import { nanoid } from 'nanoid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORY_COLORS } from '../data/categoryColors.js'
import { isSupabaseConfigured } from '../services/supabase.js'
import {
  listMyGalleryLibrary,
  removeGalleryCategory,
  removeGalleryImage,
  saveGalleryCategory,
  saveGalleryImage,
} from '../services/supabaseChronicle2.js'
import { GalleryContext } from './GalleryContextObject.js'
import { useAuth } from './useAuth.js'
import { useUserData } from './useUserData.js'

export function GalleryProvider({ children }) {
  const { appState, isDataReady, updateAppState } = useUserData()
  const { user } = useAuth()
  const [remoteGalleryUserId, setRemoteGalleryUserId] = useState('')
  const usesRemoteGallery = Boolean(
    isSupabaseConfigured && user?.authBackend === 'supabase' && user?.id,
  )
  const isRemoteGalleryReady = !usesRemoteGallery || remoteGalleryUserId === user?.id
  const categories = useMemo(
    () => (isRemoteGalleryReady ? appState.galleryCategories || [] : []),
    [appState.galleryCategories, isRemoteGalleryReady],
  )
  const images = useMemo(
    () => (isRemoteGalleryReady ? appState.gallery || [] : []),
    [appState.gallery, isRemoteGalleryReady],
  )
  const galleryRef = useRef({ categories, images })

  useEffect(() => {
    galleryRef.current = { categories, images }
  }, [categories, images])

  useEffect(() => {
    if (!usesRemoteGallery || !isDataReady) return undefined
    let cancelled = false

    listMyGalleryLibrary()
      .then((library) => {
        if (cancelled) return
        galleryRef.current = library
        updateAppState((currentState) => ({
          ...currentState,
          galleryCategories: library.categories,
          gallery: library.images,
        }))
        setRemoteGalleryUserId(user.id)
      })
      .catch((error) => {
        console.error('Nao foi possivel carregar a galeria.', error)
        if (!cancelled) setRemoteGalleryUserId(user.id)
      })

    return () => {
      cancelled = true
    }
  }, [isDataReady, updateAppState, user?.id, usesRemoteGallery])

  const addImage = useCallback(async (image) => {
    const newImage = {
      id: image.id || nanoid(),
      name: image.name || 'Nova Imagem',
      description: image.description || '',
      categoryId: image.categoryId || null,
      url: image.url || null,
      storagePath: image.storagePath || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (usesRemoteGallery) {
      await saveGalleryImage(newImage, galleryRef.current.images.length)
    }

    galleryRef.current = {
      ...galleryRef.current,
      images: [...galleryRef.current.images, newImage],
    }
    updateAppState((currentState) => ({
      ...currentState,
      gallery: galleryRef.current.images,
    }))

    return newImage
  }, [updateAppState, usesRemoteGallery])

  const updateImage = useCallback(async (imageId, updates) => {
    const currentImage = galleryRef.current.images.find((image) => image.id === imageId)
    if (!currentImage) return null

    const updatedImage = {
      ...currentImage,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    const imageIndex = galleryRef.current.images.findIndex((image) => image.id === imageId)

    if (usesRemoteGallery) {
      await saveGalleryImage(updatedImage, imageIndex)
    }

    galleryRef.current = {
      ...galleryRef.current,
      images: galleryRef.current.images.map((image) => image.id === imageId ? updatedImage : image),
    }
    updateAppState((currentState) => ({ ...currentState, gallery: galleryRef.current.images }))

    return updatedImage
  }, [updateAppState, usesRemoteGallery])

  const deleteImage = useCallback(async (imageId) => {
    if (usesRemoteGallery) await removeGalleryImage(imageId)
    galleryRef.current = {
      ...galleryRef.current,
      images: galleryRef.current.images.filter((image) => image.id !== imageId),
    }
    updateAppState((currentState) => ({
      ...currentState,
      gallery: galleryRef.current.images,
    }))
  }, [updateAppState, usesRemoteGallery])

  const addCategory = useCallback(async (category) => {
    const now = new Date().toISOString()
    const newCategory = {
      id: nanoid(),
      name: category.name,
      color: category.color ?? CATEGORY_COLORS[0],
      createdAt: now,
    }

    if (usesRemoteGallery) {
      await saveGalleryCategory(newCategory, galleryRef.current.categories.length)
    }
    galleryRef.current = {
      ...galleryRef.current,
      categories: [...galleryRef.current.categories, newCategory],
    }
    updateAppState((currentState) => ({
      ...currentState,
      galleryCategories: galleryRef.current.categories,
    }))
    return newCategory
  }, [updateAppState, usesRemoteGallery])

  const updateCategory = useCallback(async (categoryId, updates) => {
    const categoryIndex = galleryRef.current.categories.findIndex((category) => category.id === categoryId)
    const currentCategory = galleryRef.current.categories[categoryIndex]
    if (!currentCategory) return null
    const updatedCategory = { ...currentCategory, ...updates }

    if (usesRemoteGallery) await saveGalleryCategory(updatedCategory, categoryIndex)
    galleryRef.current = {
      ...galleryRef.current,
      categories: galleryRef.current.categories.map((category) =>
        category.id === categoryId ? updatedCategory : category,
      ),
    }
    updateAppState((currentState) => ({
      ...currentState,
      galleryCategories: galleryRef.current.categories,
    }))
    return updatedCategory
  }, [updateAppState, usesRemoteGallery])

  const deleteCategory = useCallback(async (categoryId) => {
    const updatedImages = galleryRef.current.images.map((image) =>
      image.categoryId === categoryId ? { ...image, categoryId: null } : image,
    )
    if (usesRemoteGallery) {
      await Promise.all(
        updatedImages.map((image, index) =>
          image.categoryId === null && galleryRef.current.images[index]?.categoryId === categoryId
            ? saveGalleryImage(image, index)
            : null,
        ).filter(Boolean),
      )
      await removeGalleryCategory(categoryId)
    }
    galleryRef.current = {
      categories: galleryRef.current.categories.filter((category) => category.id !== categoryId),
      images: updatedImages,
    }
    updateAppState((currentState) => ({
      ...currentState,
      galleryCategories: galleryRef.current.categories,
      gallery: galleryRef.current.images,
    }))
  }, [updateAppState, usesRemoteGallery])

  const value = useMemo(
    () => ({
      images,
      categories,
      addImage,
      updateImage,
      deleteImage,
      addCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      images,
      categories,
      addImage,
      updateImage,
      deleteImage,
      addCategory,
      updateCategory,
      deleteCategory,
    ],
  )

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}
