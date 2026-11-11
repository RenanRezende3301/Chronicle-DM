import { createContext } from 'react'

export const GalleryContext = createContext({
  images: [],
  categories: [],
  addImage: () => {},
  updateImage: () => {},
  deleteImage: () => {},
})
