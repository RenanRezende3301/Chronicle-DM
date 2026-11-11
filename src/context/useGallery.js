import { useContext } from 'react'
import { GalleryContext } from './GalleryContextObject.js'

export function useGallery() {
  const context = useContext(GalleryContext)

  if (context === undefined) {
    throw new Error('useGallery deve ser usado dentro de um GalleryProvider')
  }

  return context
}
