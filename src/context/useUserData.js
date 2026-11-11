import { useContext } from 'react'
import { UserDataContext } from './UserDataContextObject.js'

export function useUserData() {
  const context = useContext(UserDataContext)

  if (!context) {
    throw new Error('useUserData deve ser usado dentro de UserDataProvider.')
  }

  return context
}
