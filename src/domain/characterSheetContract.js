const KNOWN_NPC_TYPES = new Set(['vampire', 'mortal', 'ghoul', 'other'])

export function normalizeSheetCharacterType(characterType, sourceKind = 'npc') {
  if (sourceKind === 'player') return 'vampire'

  const normalized = String(characterType || '').trim().toLowerCase()
  if (!normalized) return 'vampire'
  return KNOWN_NPC_TYPES.has(normalized) ? normalized : 'other'
}

export function getSheetCapabilities({ sourceKind = 'npc', characterType } = {}) {
  const type = normalizeSheetCharacterType(characterType, sourceKind)
  const isVampire = type === 'vampire'
  const isPlayerCharacter = sourceKind === 'player'

  return Object.freeze({
    type,
    sourceKind,
    tracks: Object.freeze({
      health: true,
      willpower: true,
      humanity: true,
      hunger: isVampire,
    }),
    actions: Object.freeze({
      roll: true,
      rouseCheck: isVampire,
      bloodSurge: isVampire,
      willpowerReroll: true,
    }),
    fields: Object.freeze({
      attributes: true,
      skills: true,
      disciplines: true,
      bloodPotency: true,
      capitalLiquido: isPlayerCharacter,
    }),
  })
}

export function getSheetHungerMaximum(bloodPotency = 0) {
  return Math.max(5, Math.min(10, Math.floor(Number(bloodPotency) || 0)))
}

export function shouldShowHungerTrack(characterType, sourceKind = 'npc') {
  return getSheetCapabilities({ sourceKind, characterType }).tracks.hunger
}
