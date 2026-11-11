import { describe, expect, it } from 'vitest'
import { getGameSystem, listGameSystems } from '..'
import { characterSchema, getEmptyCharacter, schemaVersion } from './data/Character'
import { clanSchema, clans } from './data/Clans'
import { disciplineSchema, disciplines, getAvailablePowersForCharacter, powerSchema } from './data/Disciplines'
import { getAllKnownMeritsAndFlaws, loresheets, meritsAndFlaws } from './data/MeritsAndFlaws'
import { PredatorTypes, predatorTypeSchema } from './data/PredatorType'
import { Rituals } from './data/Rituals'
import { Ceremonies, ceremonySchema } from './data/Ceremonies'
import { ritualSchema } from './data/Disciplines'
import { getAvailableXP, getDisciplineCost } from './rules/xp'
import { vtmV5System } from '.'
import progenyV1 from './test/fixtures/progeny-1.0.0.json'
import progenyV3 from './test/fixtures/progeny-v3.json'

describe('registro de sistemas', () => {
  it('registra o VTM V5 por uma chave estável', () => {
    expect(getGameSystem('vtm-v5')).toBe(vtmV5System)
    expect(listGameSystems().map((system) => system.key)).toContain('vtm-v5')
  })

  it('rejeita uma chave desconhecida com uma mensagem útil', () => {
    expect(() => getGameSystem('sistema-inexistente')).toThrow(
      'Sistema não registrado: sistema-inexistente',
    )
  })
})

describe('contrato da ficha VTM V5', () => {
  it('cria uma ficha vazia válida na versão atual', () => {
    const character = vtmV5System.character.createEmpty()

    expect(character.version).toBe(schemaVersion)
    expect(vtmV5System.character.currentSchemaVersion).toBe(schemaVersion)
    expect(characterSchema.parse(character)).toEqual(character)
  })

  it('migra aliases em inglês e campos ausentes sem alterar a entrada', () => {
    const legacy = structuredClone(getEmptyCharacter()) as Record<string, unknown>
    const merits = [
      {
        name: 'Stunning',
        level: 4,
        summary: 'legacy',
        excludes: ['Ugly'],
        type: 'merit',
      },
    ]

    legacy.version = 2
    legacy.merits = merits
    delete legacy.capitalLiquido
    delete legacy.ceremonies
    delete legacy.notes
    delete legacy.customDisciplines

    const parsed = vtmV5System.character.parse(legacy)

    expect(parsed.version).toBe(schemaVersion)
    expect(parsed.merits[0]?.name).toBe('Deslumbrante')
    expect(parsed.merits[0]?.excludes).toEqual(['Belo(a)', 'Feio(a)', 'Repulsivo(a)'])
    expect(parsed.capitalLiquido).toBe(0)
    expect(parsed.ceremonies).toEqual([])
    expect(parsed.notes).toBe('')
    expect((legacy.merits as typeof merits)[0]?.name).toBe('Stunning')
    expect(legacy).not.toHaveProperty('capitalLiquido')
  })

  it.each([
    ['Progeny 1.0.0', progenyV1, 'Guya'],
    ['Progeny schema v3', progenyV3, 'Alan Cadd'],
  ])('abre uma exportação real do %s', (_label, fixture, expectedName) => {
    const parsed = vtmV5System.character.parse(fixture)

    expect(parsed.name).toBe(expectedName)
    expect(parsed.version).toBe(schemaVersion)
    expect(parsed.ephemeral).toBeDefined()
    expect(parsed.capitalLiquido).toBeGreaterThanOrEqual(0)
  })

  it('resume a ficha com os nomes traduzidos dos clãs', () => {
    const character = getEmptyCharacter()
    character.name = 'Amélia'
    character.clan = 'Ministry'

    expect(vtmV5System.character.summarize(character)).toEqual({
      name: 'Amélia',
      subtitle: 'Ministério',
    })
  })
})

describe('catálogos completos', () => {
  it('valida clãs, disciplinas, tipos de predador, rituais e cerimônias', () => {
    Object.values(clans).forEach((clan) => expect(clanSchema.safeParse(clan).success).toBe(true))
    Object.values(disciplines).forEach((discipline) =>
      expect(disciplineSchema.safeParse(discipline).success).toBe(true),
    )
    Object.values(PredatorTypes).forEach((predatorType) =>
      expect(predatorTypeSchema.safeParse(predatorType).success).toBe(true),
    )
    Rituals.forEach((ritual) => expect(ritualSchema.safeParse(ritual).success).toBe(true))
    Ceremonies.forEach((ceremony) =>
      expect(ceremonySchema.safeParse(ceremony).success).toBe(true),
    )
  })

  it('inclui conteúdo transcendente e o catálogo de São Paulo', () => {
    const powers = Object.values(disciplines).flatMap((discipline) => discipline.powers)
    const transcendentPowers = powers.filter((power) => power.level > 5)
    const allRites = [...Rituals, ...Ceremonies]

    expect(transcendentPowers.length).toBeGreaterThan(0)
    expect(Math.max(...transcendentPowers.map((power) => power.level))).toBe(10)
    transcendentPowers.forEach((power) => expect(powerSchema.parse(power)).toEqual(power))
    expect(allRites.some((rite) => rite.level > 5)).toBe(true)
    expect(meritsAndFlaws.some((category) => category.isDLC)).toBe(true)
    expect(loresheets.some((loresheet) => loresheet.isDLC)).toBe(true)
  })

  it('registra Sangue Esquecido como linhagens e Legados de Amálgama V5', () => {
    const forgottenLineages = [
      'Baali', 'Blood Brothers', 'Daughters of Cacophony', 'Gargoyles', 'Kiasyd',
      'True Brujah', 'Ahrimanes', 'Children of Osiris', 'Lhiannan', 'Maeghar',
    ] as const
    const powers = Object.values(disciplines).flatMap((discipline) => discipline.powers)

    forgottenLineages.forEach((lineage) => expect(clans[lineage]).toBeDefined())
    expect(powers.filter((power) => power.legacy).map((power) => power.legacy)).toContain('Daimoinon')
    expect(powers.some((power) => power.name === 'Portão do Pecado' && power.level === 10)).toBe(true)
    expect(powers.some((power) => power.name === 'Coração da Terra' && power.level === 10)).toBe(true)
  })

  it('respeita a porta de Humanidade dos poderes de Bardo', () => {
    const character = getEmptyCharacter()
    character.clan = 'Children of Osiris'
    character.generation = 8
    character.availableDisciplineNames = ['presence', 'fortitude', 'blood sorcery']
    character.humanity = 1
    character.disciplines = disciplines.presence!.powers.filter((power) => power.level === 1).slice(0, 1)

    expect(getAvailablePowersForCharacter(character, 'blood sorcery').some((power) => power.name === 'Sinal de Banimento de Thoth')).toBe(false)
  })

  it('resolve nomes legados e traduzidos para o mesmo mérito', () => {
    const known = getAllKnownMeritsAndFlaws()

    expect(known.get('Stunning')).toBe(known.get('Deslumbrante'))
    expect(known.get('Resources')).toBe(known.get('Recursos'))
  })
})

describe('regras de experiência', () => {
  it('calcula XP disponível e custos de disciplinas de clã, fora do clã e Caitiff', () => {
    const character = getEmptyCharacter()
    character.clan = 'Brujah'
    character.experience = 20
    character.ephemeral.experienceSpent = 5
    character.availableDisciplineNames = ['potence']

    expect(getAvailableXP(character)).toBe(15)
    expect(getDisciplineCost(character, 'potence')).toBe(5)
    expect(getDisciplineCost(character, 'auspex')).toBe(7)

    character.clan = 'Caitiff'
    expect(getDisciplineCost(character, 'potence')).toBe(6)
  })

  it('aplica a escala transcendente acima do quinto nível', () => {
    const character = getEmptyCharacter()
    character.clan = 'Brujah'
    character.availableDisciplineNames = ['potence']
    character.disciplines = disciplines.potence!.powers
      .filter((power) => power.level <= 5)
      .slice(0, 5)

    expect(character.disciplines).toHaveLength(5)
    expect(getDisciplineCost(character, 'potence')).toBe(60)
  })
})

describe('API pública de regras', () => {
  it('expõe cálculos além de XP pela fronteira do sistema', () => {
    const character = getEmptyCharacter()
    character.merits = [
      {
        name: 'Recursos',
        level: 3,
        summary: '',
        excludes: [],
        type: 'merit',
      },
    ]

    expect(vtmV5System.rules.hunger.getMaxHunger(7)).toBe(7)
    expect(vtmV5System.rules.capital.getInitialCapitalLiquido(character)).toBe(3)
    expect(vtmV5System.rules.generation.maxDisciplineByGeneration(4)).toBe(9)
    expect(vtmV5System.catalogs.localization.locale).toBe('pt-BR')
  })
})
