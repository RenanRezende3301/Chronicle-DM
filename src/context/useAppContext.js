import { useContext } from 'react'
import { AppContext } from './AppContextObject.js'

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider.')
  }

  return context
}
