import { describe, expect, it } from 'vitest'
import {
  applyAttributeDistribution,
  applyClan,
  applyGeneration,
  applyInitialDisciplines,
  applyInitialMeritsAndFlaws,
  applyInitialRites,
  applyPredatorType,
  applySkillDistribution,
  applyTouchstones,
} from '../../features/account/characterCreationRules.js'
import { getEmptyCharacter } from './data/Character'
import { vtmV5System } from '.'

describe('criação guiada VTM V5', () => {
  it('aplica o clã e suas disciplinas disponíveis', () => {
    const character = applyClan(getEmptyCharacter(), 'Brujah')

    expect(character.clan).toBe('Brujah')
    expect(character.availableDisciplineNames).toEqual([
      'celerity',
      'potence',
      'presence',
    ])
  })

  it('aplica a distribuição oficial de atributos e recalcula derivados', () => {
    const character = applyAttributeDistribution(getEmptyCharacter(), {
      strongest: 'strength',
      weakest: 'intelligence',
      medium: ['stamina', 'composure', 'resolve'],
    })

    expect(character.attributes.strength).toBe(4)
    expect(character.attributes.intelligence).toBe(1)
    expect(character.attributes.stamina).toBe(3)
    expect(character.attributes.dexterity).toBe(2)
    expect(character.maxHealth).toBe(6)
    expect(character.willpower).toBe(6)
  })

  it('recusa uma distribuição incompleta de atributos', () => {
    expect(() =>
      applyAttributeDistribution(getEmptyCharacter(), {
        strongest: 'strength',
        weakest: 'intelligence',
        medium: ['stamina', 'composure'],
      }),
    ).toThrow('três médios')
  })

  it('aplica a distribuição equilibrada de habilidades e a especialidade', () => {
    const picked = Object.fromEntries([
      ...['athletics', 'brawl', 'craft'].map((key) => [key, 3]),
      ...['drive', 'firearms', 'melee', 'larceny', 'stealth'].map((key) => [key, 2]),
      ...[
        'survival',
        'animal ken',
        'etiquette',
        'insight',
        'intimidation',
        'leadership',
        'performance',
      ].map((key) => [key, 1]),
    ])
    const character = applySkillDistribution(
      getEmptyCharacter(),
      'Equilibrado',
      picked,
      { skill: 'athletics', name: 'Escalada' },
    )

    expect(character.skills.athletics).toBe(3)
    expect(character.skills.drive).toBe(2)
    expect(character.skills.survival).toBe(1)
    expect(character.skills.academics).toBe(0)
    expect(character.skillSpecialties).toContainEqual({
      skill: 'athletics',
      name: 'Escalada',
    })
  })

  it('aplica geração moderna e antiga com seus orçamentos de XP', () => {
    const neonate = applyGeneration(getEmptyCharacter(), 13)
    const elder = applyGeneration(getEmptyCharacter(), 8, 200)

    expect(neonate.experience).toBe(15)
    expect(neonate.bloodPotency).toBe(1)
    expect(elder.experience).toBe(200)
    expect(elder.bloodPotency).toBe(2)
  })

  it('resolve escolhas obrigatórias do tipo de predador', () => {
    const base = applyGeneration(applyClan(getEmptyCharacter(), 'Brujah'), 13)
    const character = applyPredatorType(
      base,
      'Extortionist',
      { skill: 'intimidation', name: 'Coerção' },
      'potence',
      [
        [3, 0],
        [2, 0],
      ],
    )

    expect(character.predatorType.name).toBe('Extortionist')
    expect(character.predatorType.pickedDiscipline).toBe('potence')
    expect(character.predatorType.pickedMeritsAndFlaws).toHaveLength(2)
    expect(character.humanity).toBe(7)
  })

  it('valida a distribuição inicial de poderes e o Ritual gratuito', () => {
    let character = applyGeneration(applyClan(getEmptyCharacter(), 'Tremere'), 13)
    character = applyPredatorType(
      character,
      'Alleycat',
      { skill: 'brawl', name: 'Agarrar' },
      'celerity',
      [],
    )
    const auspex = vtmV5System.catalogs.disciplines.auspex!.powers
    const bloodSorcery = vtmV5System.catalogs.disciplines['blood sorcery']!.powers
    const celerity = vtmV5System.catalogs.disciplines.celerity!.powers
    character = applyInitialDisciplines(
      character,
      [auspex.find((power) => power.level === 1)!, bloodSorcery.find((power) => power.level === 1)!, bloodSorcery.filter((power) => power.level === 1)[1]!],
      celerity.find((power) => power.level === 1)!,
    )
    character = applyInitialRites(
      character,
      vtmV5System.catalogs.rituals.find((ritual) => ritual.level === 1),
      undefined,
    )

    expect(character.disciplines).toHaveLength(4)
    expect(character.rituals).toHaveLength(1)
    expect(character.ceremonies).toHaveLength(0)
  })

  it('persiste Pilares e respeita o orçamento inicial de Vantagens e Defeitos', () => {
    let character = applyGeneration(applyClan(getEmptyCharacter(), 'Brujah'), 13)
    character = applyTouchstones(character, [
      {
        name: ' Helena ',
        conviction: ' Nunca abandone os seus ',
        description: ' Irmã mortal ',
      },
    ])
    const merit = vtmV5System.catalogs.meritsAndFlaws
      .flatMap((category) => category.merits)
      .find((candidate) => candidate.cost.includes(3))!
    const flaw = vtmV5System.catalogs.meritsAndFlaws
      .flatMap((category) => category.flaws)
      .find(
        (candidate) =>
          candidate.cost.includes(2) &&
          !candidate.excludes.includes(merit.name) &&
          !merit.excludes.includes(candidate.name),
      )!
    character = applyInitialMeritsAndFlaws(character, [
      { ...merit, level: 3, type: 'merit' },
      { ...flaw, level: 2, type: 'flaw' },
    ])

    expect(character.touchstones[0]?.name).toBe('Helena')
    expect(character.merits).toHaveLength(1)
    expect(character.flaws).toHaveLength(1)
    expect(character.characterVersion).toBe(1)
  })
})
