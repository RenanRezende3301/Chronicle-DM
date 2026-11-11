import type { GameSystemModule } from '../contracts'
import { attributeDescriptions, attributeNames } from './data/Attributes'
import { potencyEffects, potencyLimitByGeneration } from './data/BloodPotency'
import { Ceremonies } from './data/Ceremonies'
import {
  applyCharacterCompatibilityPatches,
  characterSchema,
  getEmptyCharacter,
  schemaVersion,
  type Character,
} from './data/Character'
import { clans } from './data/Clans'
import { disciplines } from './data/Disciplines'
import { scaleModels } from './data/Generations'
import {
  loresheets,
  meritsAndFlaws,
  thinbloodMeritsAndFlaws,
} from './data/MeritsAndFlaws'
import { PredatorTypes } from './data/PredatorType'
import { Rituals } from './data/Rituals'
import { allSkills, skillNames, skillsDescriptions } from './data/Skills'
import { ptBRDictionary } from './data/ui_translations'
import { variantClanBanes } from './data/VariantClanBanes'
import * as bloodPotencyRules from './data/BloodPotency'
import * as capitalRules from './data/CapitalLiquido'
import * as ceremonyRules from './data/Ceremonies'
import * as characterRules from './data/Character'
import * as disciplineRules from './data/Disciplines'
import * as generationRules from './data/Generations'
import * as hungerRules from './data/DeepHunger'
import * as loresheetRules from './data/loresheetBonuses'
import * as meritRules from './data/meritsAndFlawsResolution'
import * as translationRules from './data/translations'
import * as variantBaneRules from './data/VariantClanBanes'
import * as disciplinePowerRules from './rules/disciplinePowerMatcher'
import * as transcendentRules from './rules/transcendentOverflow'
import * as xpRules from './rules/xp'

const catalogs = {
  clans,
  disciplines,
  predatorTypes: PredatorTypes,
  meritsAndFlaws,
  thinbloodMeritsAndFlaws,
  loresheets,
  rituals: Rituals,
  ceremonies: Ceremonies,
  attributes: {
    names: attributeNames,
    descriptions: attributeDescriptions,
  },
  skills: {
    keys: allSkills,
    names: skillNames,
    descriptions: skillsDescriptions,
  },
  bloodPotency: {
    effects: potencyEffects,
    limitsByGeneration: potencyLimitByGeneration,
  },
  generationScales: scaleModels,
  variantClanBanes,
  localization: {
    locale: 'pt-BR',
    dictionary: ptBRDictionary,
  },
}

const rules = {
  xp: xpRules,
  bloodPotency: bloodPotencyRules,
  capital: capitalRules,
  character: characterRules,
  disciplines: disciplineRules,
  disciplinePowers: disciplinePowerRules,
  ceremonies: ceremonyRules,
  generation: generationRules,
  hunger: hungerRules,
  loresheets: loresheetRules,
  meritsAndFlaws: meritRules,
  variantClanBanes: variantBaneRules,
  transcendent: transcendentRules,
  translations: translationRules,
}

function parseCharacter(input: unknown): Character {
  const copy = structuredClone(input)

  if (!copy || typeof copy !== 'object' || Array.isArray(copy)) {
    return characterSchema.parse(copy)
  }

  applyCharacterCompatibilityPatches(copy as Record<string, unknown>)
  return characterSchema.parse(copy)
}

export const vtmV5System = {
  key: 'vtm-v5',
  label: 'Vampiro: A Máscara 5ª Edição',
  character: {
    schema: characterSchema,
    currentSchemaVersion: schemaVersion,
    createEmpty: getEmptyCharacter,
    parse: parseCharacter,
    summarize: (character: Character) => {
      const clan = clans[character.clan]

      return {
        name: character.name || 'Personagem sem nome',
        subtitle: [clan?.displayName ?? clan?.name, character.predatorType?.name]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
  catalogs,
  rules,
} satisfies GameSystemModule<Character, typeof catalogs, typeof rules>

export type VtmV5System = typeof vtmV5System
export type { Character as VtmV5Character }
