import { useContext } from 'react'
import { TurnTrackerContext } from '../context/TurnTrackerContextObject.js'

export function useTurnTracker() {
  const context = useContext(TurnTrackerContext)

  if (!context) {
    throw new Error('useTurnTracker deve ser usado dentro de TurnTrackerProvider.')
  }

  return context
}
