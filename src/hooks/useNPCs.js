import { useContext } from 'react'
import { NPCContext } from '../context/NPCContextObject.js'

export function useNPCs() {
  const context = useContext(NPCContext)

  if (!context) {
    throw new Error('useNPCs deve ser usado dentro de NPCProvider.')
  }

  return context
}
