import { nanoid } from 'nanoid'
import { attributeDefaults, skillDefaults } from '../data/skills.js'
import {
  getSheetCapabilities,
  getSheetHungerMaximum,
} from '../domain/characterSheetContract.js'

export const DAMAGE_STATES = {
  empty: 'empty',
  superficial: 'superficial',
  aggravated: 'aggravated',
}

export function clampNumber(value, min, max) {
  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) {
    return min
  }

  return Math.min(Math.max(numberValue, min), max)
}

export function getHungerMaximum(bloodPotency = 0) {
  return getSheetHungerMaximum(bloodPotency)
}

export function calcHealthMax(attributes = {}) {
  return clampNumber(attributes.stamina ?? 1, 1, 10) + 3
}

export function calcWillpowerMax(attributes = {}) {
  return (
    clampNumber(attributes.composure ?? 1, 1, 10) +
    clampNumber(attributes.resolve ?? 1, 1, 10)
  )
}

export function calcInitiative(attributes = {}) {
  return (
    clampNumber(attributes.dexterity ?? 1, 1, 10) +
    clampNumber(attributes.wits ?? 1, 1, 10)
  )
}

export function createTrack(size) {
  return Array.from({ length: Math.max(Number(size) || 0, 0) }, () => DAMAGE_STATES.empty)
}

function conditionTrack(size, superficial, aggravated) {
  const maximum = Math.max(0, Number(size) || 0)
  const total = Math.min(maximum, Math.max(0, Number(superficial) || 0))
  const aggravatedTotal = Math.min(total, Math.max(0, Number(aggravated) || 0))
  return Array.from({ length: maximum }, (_, index) => (
    index < aggravatedTotal
      ? DAMAGE_STATES.aggravated
      : index < total ? DAMAGE_STATES.superficial : DAMAGE_STATES.empty
  ))
}

export function getHealthStatus(boxes = []) {
  if (!boxes.length || boxes.some((box) => box === DAMAGE_STATES.empty)) {
    return 'ok'
  }

  if (boxes.every((box) => box === DAMAGE_STATES.aggravated)) {
    return 'torpor'
  }

  return 'impaired'
}

export function cycleDamageState(state) {
  if (state === DAMAGE_STATES.empty) {
    return DAMAGE_STATES.superficial
  }

  if (state === DAMAGE_STATES.superficial) {
    return DAMAGE_STATES.aggravated
  }

  return DAMAGE_STATES.empty
}

export function calculateDerived(attributes = {}) {
  return {
    healthMax: calcHealthMax(attributes),
    willpowerMax: calcWillpowerMax(attributes),
    initiativeBase: calcInitiative(attributes),
  }
}

export function normalizeDisciplinePowers(powers, { keepEmpty = false } = {}) {
  if (Array.isArray(powers)) {
    return powers
      .map((power) => {
        if (typeof power === 'string') {
          return { id: nanoid(), name: power.trim(), mechanics: '' }
        }

        return {
          id: power.id ?? nanoid(),
          name: power.name ?? '',
          mechanics: power.mechanics ?? power.notes ?? '',
        }
      })
      .filter((power) => keepEmpty || power.name || power.mechanics)
  }

  if (typeof powers !== 'string') {
    return []
  }

  const normalizedText = powers.trim()

  if (!normalizedText) {
    return []
  }

  return normalizedText
    .split(normalizedText.includes('\n') ? /\n+/ : /\s+-\s+/)
    .map((power) => power.trim())
    .filter(Boolean)
    .map((power) => ({ id: nanoid(), name: power, mechanics: '' }))
}

export function normalizeDiscipline(discipline) {
  return {
    id: discipline.id ?? nanoid(),
    name: discipline.name ?? '',
    level: clampNumber(discipline.level ?? 1, 1, 5),
    powers: normalizeDisciplinePowers(discipline.powers),
    notes: discipline.notes ?? '',
  }
}

export function createDefaultNPC(overrides = {}) {
  const {
    attributes: attributeOverrides = {},
    skills: skillOverrides = {},
    disciplines = [],
    equipment = [],
    ...rest
  } = overrides
  const now = new Date().toISOString()
  const attributes = {
    ...attributeDefaults,
    ...attributeOverrides,
  }
  const derived = calculateDerived(attributes)

  return {
    id: nanoid(),
    categoryId: null,
    name: '',
    clan: '',
    type: 'vampire',
    generation: 13,
    bloodPotency: 1,
    humanity: 7,
    concept: '',
    description: '',
    notes: '',
    imageUrl: '',
    ...rest,
    attributes,
    ...derived,
    skills: {
      ...skillDefaults,
      ...skillOverrides,
    },
    disciplines: disciplines.map((discipline) => normalizeDiscipline(discipline)),
    equipment,
    createdAt: rest.createdAt ?? now,
    updatedAt: rest.updatedAt ?? now,
  }
}

export function normalizeNPC(npc) {
  // Read old condition snapshots once, then keep only the NPC's own sheet fields.
  const { vttConditions: legacyConditions, ...npcData } = npc
  const now = new Date().toISOString()
  const attributes = {
    ...attributeDefaults,
    ...(npc.attributes ?? {}),
  }
  const derived = calculateDerived(attributes)
  const capabilities = getSheetCapabilities({ sourceKind: 'npc', characterType: npc.type })

  const oldConditions = legacyConditions && typeof legacyConditions === 'object'
    ? legacyConditions
    : null
  const healthBoxes = oldConditions
    ? conditionTrack(
      derived.healthMax,
      oldConditions.superficialDamage,
      oldConditions.aggravatedDamage,
    )
    : npc.healthBoxes && npc.healthBoxes.length === derived.healthMax
    ? npc.healthBoxes
    : createTrack(derived.healthMax)

  const willpowerBoxes = oldConditions
    ? conditionTrack(
      derived.willpowerMax,
      oldConditions.superficialWillpowerDamage,
      oldConditions.aggravatedWillpowerDamage,
    )
    : npc.willpowerBoxes && npc.willpowerBoxes.length === derived.willpowerMax
    ? npc.willpowerBoxes
    : createTrack(derived.willpowerMax)

  return {
    ...createDefaultNPC(),
    ...npcData,
    attributes,
    ...derived,
    healthBoxes,
    willpowerBoxes,
    hunger: capabilities.tracks.hunger
      ? oldConditions?.hunger ?? npc.hunger ?? 1
      : 0,
    humanityStains: oldConditions?.humanityStains ?? npc.humanityStains ?? 0,
    capitalLiquido: oldConditions?.capitalLiquido ?? npc.capitalLiquido ?? 0,
    skills: {
      ...skillDefaults,
      ...(npc.skills ?? {}),
    },
    disciplines: Array.isArray(npc.disciplines)
      ? npc.disciplines.map((discipline) => normalizeDiscipline(discipline))
      : [],
    equipment: Array.isArray(npc.equipment) ? npc.equipment : [],
    createdAt: npc.createdAt ?? now,
    updatedAt: now,
  }
}

export function applyNPCUpdates(npc, updates) {
  if (!npc) return null

  return normalizeNPC({
    ...npc,
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export function createParticipantFromNPC(npc, overrides = {}) {
  const healthMax = npc.healthMax ?? calcHealthMax(npc.attributes)
  const willpowerMax = npc.willpowerMax ?? calcWillpowerMax(npc.attributes)
  const capabilities = getSheetCapabilities({ sourceKind: 'npc', characterType: npc.type })

  const healthBoxes = npc.healthBoxes && npc.healthBoxes.length === healthMax 
    ? [...npc.healthBoxes] 
    : createTrack(healthMax)
    
  const willpowerBoxes = npc.willpowerBoxes && npc.willpowerBoxes.length === willpowerMax
    ? [...npc.willpowerBoxes] 
    : createTrack(willpowerMax)

  return {
    id: nanoid(),
    npcId: npc.id,
    type: 'npc',
    characterType: capabilities.type,
    isVampire: capabilities.type === 'vampire',
    name: npc.name,
    clan: npc.clan,
    concept: npc.concept,
    imageStorageKey: npc.id,
    imageUrl: npc.imageUrl ?? '',
    portraitPath: npc.portraitPath ?? '',
    healthMax,
    healthBoxes,
    willpowerMax,
    willpowerBoxes,
    bloodPotency: Number(npc.bloodPotency) || 0,
    hunger: capabilities.tracks.hunger ? npc.hunger ?? 1 : 0,
    sortOrder: 0,
    isCurrentTurn: false,
    notes: '',
    ...overrides,
  }
}
