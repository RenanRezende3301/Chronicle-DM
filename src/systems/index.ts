import { registerGameSystem } from './registry'
import { vtmV5System } from './vtm-v5'

registerGameSystem(vtmV5System)

export { getGameSystem, listGameSystems } from './registry'
export { vtmV5System } from './vtm-v5'
export type { GameSystemModule } from './contracts'
