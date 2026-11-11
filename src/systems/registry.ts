import type { GameSystemKey, GameSystemModule } from './contracts'

type RegisteredGameSystem = GameSystemModule<
  unknown,
  Record<string, unknown>,
  Record<string, unknown>
>

const systems = new Map<GameSystemKey, RegisteredGameSystem>()

export function registerGameSystem<TCharacter>(
  system: GameSystemModule<
    TCharacter,
    Record<string, unknown>,
    Record<string, unknown>
  >,
): void {
  if (systems.has(system.key)) {
    throw new Error(`Sistema já registrado: ${system.key}`)
  }

  systems.set(system.key, system as RegisteredGameSystem)
}

export function getGameSystem(systemKey: GameSystemKey): RegisteredGameSystem {
  const system = systems.get(systemKey)

  if (!system) {
    throw new Error(`Sistema não registrado: ${systemKey}`)
  }

  return system
}

export function listGameSystems(): RegisteredGameSystem[] {
  return [...systems.values()]
}
