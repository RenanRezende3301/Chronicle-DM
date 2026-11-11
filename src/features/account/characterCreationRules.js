import { vtmV5System } from '../../systems/vtm-v5'

export const SKILL_DISTRIBUTIONS = {
  'Faz-tudo': { 4: 0, 3: 1, 2: 8, 1: 10 },
  Equilibrado: { 4: 0, 3: 3, 2: 5, 1: 7 },
  Especialista: { 4: 1, 3: 3, 2: 3, 1: 3 },
}

export function recalculateCharacter(
  character,
  { preserveBloodPotency = false, preserveHumanity = false } = {},
) {
  const next = structuredClone(character)
  const resilience = next.disciplines.some((power) => power.name === 'Resilience')
  const fortitudeLevel = next.disciplines.filter(
    (power) => power.discipline === 'fortitude',
  ).length

  next.maxHealth = 3 + next.attributes.stamina + (resilience ? fortitudeLevel : 0)
  next.willpower = next.attributes.composure + next.attributes.resolve
  if (!preserveBloodPotency) {
    next.bloodPotency = vtmV5System.rules.bloodPotency.calculateBloodPotency(next)
  }
  if (!preserveHumanity) {
    next.humanity =
      7 + (vtmV5System.catalogs.predatorTypes[next.predatorType.name]?.humanityChange ?? 0)
  }

  return next
}

export function applyClan(character, clanName) {
  if (!clanName || !vtmV5System.catalogs.clans[clanName]) {
    throw new Error('Escolha um clã antes de continuar.')
  }
  const next = structuredClone(character)
  const changed = next.clan !== clanName

  next.clan = clanName
  next.availableDisciplineNames = [
    ...vtmV5System.catalogs.clans[clanName].nativeDisciplines,
  ]

  if (changed && (next.disciplines.length || next.predatorType.name)) {
    next.disciplines = []
    next.rituals = []
    next.ceremonies = []
  }

  if (clanName === 'Thin-blood') {
    next.generation = 14
    next.predatorType = vtmV5System.character.createEmpty().predatorType
  }

  return next
}

function validatePowerPrerequisites(character, powers, power) {
  const sameDisciplineLevel = powers.filter(
    (candidate) => candidate.discipline === power.discipline,
  ).length
  if (sameDisciplineLevel < power.level) {
    throw new Error(`O poder ${power.name} exige nível ${power.level} em sua Disciplina.`)
  }
  for (const prerequisite of power.amalgamPrerequisites) {
    const level = powers.filter(
      (candidate) => candidate.discipline === prerequisite.discipline,
    ).length
    if (level < prerequisite.level) {
      throw new Error(`O poder ${power.name} não cumpre um pré-requisito de amálgama.`)
    }
  }

  for (const options of power.amalgamPrerequisiteOptions || []) {
    const meetsOneOption = options.some((prerequisite) =>
      powers.filter((candidate) => candidate.discipline === prerequisite.discipline).length >= prerequisite.level,
    )
    if (!meetsOneOption) {
      throw new Error(`O poder ${power.name} não cumpre um dos pré-requisitos alternativos de amálgama.`)
    }
  }

  for (const requiredPowerName of power.requiredPowerNames || []) {
    if (!powers.some((candidate) => candidate.name === requiredPowerName)) {
      throw new Error(`O poder ${power.name} exige o poder ${requiredPowerName}.`)
    }
  }

  if ((power.minimumHumanity || 0) > character.humanity) {
    throw new Error(`O poder ${power.name} exige Humanidade ${power.minimumHumanity}.`)
  }
}

export function applyInitialDisciplines(character, clanPowers, predatorPower) {
  const next = structuredClone(character)
  if (next.clan === 'Thin-blood') {
    next.disciplines = []
    next.rituals = []
    next.ceremonies = []
    return recalculateCharacter(next)
  }

  if (clanPowers.length !== 3 || !predatorPower) {
    throw new Error('Escolha três poderes das Disciplinas do clã e um do tipo de predador.')
  }
  const available = new Set(next.availableDisciplineNames)
  if (clanPowers.some((power) => !available.has(power.discipline))) {
    throw new Error('Um dos poderes escolhidos não pertence às Disciplinas disponíveis do clã.')
  }
  if (predatorPower.discipline !== next.predatorType.pickedDiscipline) {
    throw new Error('O poder bônus precisa ser da Disciplina do tipo de predador.')
  }
  const clanDisciplines = new Set(clanPowers.map((power) => power.discipline))
  if (clanDisciplines.size > 2) {
    throw new Error('Os três poderes do clã devem estar distribuídos em no máximo duas Disciplinas.')
  }
  for (const disciplineName of clanDisciplines) {
    if (clanPowers.filter((power) => power.discipline === disciplineName).length > 2) {
      throw new Error('Escolha dois poderes de uma Disciplina e um de outra.')
    }
  }

  const powers = [...clanPowers, predatorPower]
  if (new Set(powers.map((power) => power.name)).size !== powers.length) {
    throw new Error('O mesmo poder não pode ser escolhido duas vezes.')
  }
  powers.forEach((power) => validatePowerPrerequisites(next, powers, power))

  next.disciplines = structuredClone(powers)
  if (!vtmV5System.rules.character.containsBloodSorcery(powers)) next.rituals = []
  if (!vtmV5System.rules.character.containsOblivion(powers)) next.ceremonies = []
  return recalculateCharacter(next)
}

export function applyInitialRites(character, ritual, ceremony) {
  const next = structuredClone(character)
  const hasBloodSorcery = vtmV5System.rules.character.containsBloodSorcery(next.disciplines)
  const hasOblivion = vtmV5System.rules.character.containsOblivion(next.disciplines)

  if (hasBloodSorcery) {
    if (!ritual || ritual.level !== 1) {
      throw new Error('Escolha um Ritual de nível 1.')
    }
    next.rituals = [structuredClone(ritual)]
  } else {
    next.rituals = []
  }

  if (hasOblivion) {
    const eligibleCeremonies = vtmV5System.catalogs.ceremonies.filter(
      (candidate) =>
        candidate.level === 1 &&
        vtmV5System.rules.ceremonies.characterHasCeremonyPrerequisite(next, candidate),
    )
    if (eligibleCeremonies.length && !ceremony) {
      throw new Error('Escolha uma Cerimônia de nível 1 compatível.')
    }
    if (
      ceremony &&
      (ceremony.level !== 1 ||
        !vtmV5System.rules.ceremonies.characterHasCeremonyPrerequisite(next, ceremony))
    ) {
      throw new Error('A Cerimônia escolhida não cumpre seus pré-requisitos.')
    }
    next.ceremonies = ceremony ? [structuredClone(ceremony)] : []
  } else {
    next.ceremonies = []
  }

  return next
}

export function applyTouchstones(character, touchstones) {
  const next = structuredClone(character)
  next.touchstones = touchstones.map((touchstone) => ({
    name: String(touchstone.name || '').trim(),
    conviction: String(touchstone.conviction || '').trim(),
    description: String(touchstone.description || '').trim(),
  }))
  return next
}

function getThinbloodNameSets() {
  return {
    merits: new Set(
      vtmV5System.catalogs.thinbloodMeritsAndFlaws.merits.map((item) => item.name),
    ),
    flaws: new Set(
      vtmV5System.catalogs.thinbloodMeritsAndFlaws.flaws.map((item) => item.name),
    ),
  }
}

export function getInitialMeritUsage(character, pickedItems) {
  const predatorItems =
    vtmV5System.rules.meritsAndFlaws.getPredatorTypeMeritsByName(character)
  const thinblood = getThinbloodNameSets()
  let merits = 0
  let flaws = 0
  let thinbloodMerits = 0
  let thinbloodFlaws = 0

  pickedItems.forEach((item) => {
    if (thinblood.merits.has(item.name)) thinbloodMerits += 1
    else if (thinblood.flaws.has(item.name)) thinbloodFlaws += 1
    else if (item.type === 'merit') {
      merits += vtmV5System.rules.meritsAndFlaws.getMeritFlawPointCost(
        item,
        predatorItems,
      )
    } else {
      flaws += vtmV5System.rules.meritsAndFlaws.getMeritFlawPointCost(
        item,
        predatorItems,
      )
    }
  })

  return {
    merits,
    flaws,
    meritBudget: character.generation === 10 || character.generation === 11 ? 9 : 7,
    flawBudget: character.generation === 10 || character.generation === 11 ? 4 : 2,
    thinbloodBalance: thinbloodFlaws - thinbloodMerits,
  }
}

export function applyInitialMeritsAndFlaws(character, pickedItems) {
  const next = structuredClone(character)
  const usage = getInitialMeritUsage(next, pickedItems)
  if (usage.merits > usage.meritBudget || usage.flaws > usage.flawBudget) {
    throw new Error('As Vantagens ou os Defeitos excedem o orçamento inicial.')
  }
  if (next.clan === 'Thin-blood' && usage.thinbloodBalance < 0) {
    throw new Error('Cada Vantagem de Sangue-Ralo exige um Defeito de Sangue-Ralo.')
  }

  const clanExclusions = new Set(
    vtmV5System.catalogs.clans[next.clan]?.excludedMeritsAndFlaws ?? [],
  )
  const selectedNames = new Set(pickedItems.map((item) => item.name))
  const predatorGrantedItems = [
    ...(vtmV5System.catalogs.predatorTypes[next.predatorType.name]?.meritsAndFlaws ?? []),
    ...next.predatorType.pickedMeritsAndFlaws,
  ]
  const predatorExclusions = new Set(
    predatorGrantedItems.flatMap((item) => item.excludes),
  )
  for (const item of pickedItems) {
    if (clanExclusions.has(item.name) || predatorExclusions.has(item.name)) {
      throw new Error(`${item.name} não está disponível para o clã ${next.clan}.`)
    }
    const conflict = item.excludes.find((excludedName) => selectedNames.has(excludedName))
    if (conflict) throw new Error(`${item.name} é incompatível com ${conflict}.`)
  }

  const loresheetItems = vtmV5System.catalogs.loresheets.flatMap((sheet) =>
    sheet.merits.map((item) => ({ item, sheet })),
  )
  for (const picked of pickedItems) {
    const loresheet = loresheetItems.find(({ item }) => item.name === picked.name)?.sheet
    if (
      loresheet &&
      !loresheet.requirementFunctions.every((requirement) => requirement(next))
    ) {
      throw new Error(`${picked.name} não cumpre os requisitos da Folha de Conhecimento.`)
    }
  }

  const predatorItemsByName =
    vtmV5System.rules.meritsAndFlaws.getPredatorTypeMeritsByName(next)
  const paidItems = pickedItems.filter(
    (item) =>
      vtmV5System.rules.meritsAndFlaws.getMeritFlawPointCost(
        item,
        predatorItemsByName,
      ) > 0,
  )
  next.merits = structuredClone(paidItems.filter((item) => item.type === 'merit'))
  next.flaws = structuredClone(paidItems.filter((item) => item.type === 'flaw'))
  next.capitalLiquido = vtmV5System.rules.capital.getInitialCapitalLiquido(next)
  next.characterVersion = Math.max(1, next.characterVersion)
  return recalculateCharacter(next)
}

export function applyAttributeDistribution(character, selection) {
  const chosen = [selection.strongest, selection.weakest, ...selection.medium]
  if (!selection.strongest || !selection.weakest || selection.medium.length !== 3) {
    throw new Error('Escolha um atributo forte, um fraco e três médios.')
  }
  if (new Set(chosen).size !== chosen.length) {
    throw new Error('Cada atributo só pode ocupar uma posição.')
  }

  const next = structuredClone(character)
  Object.keys(next.attributes).forEach((key) => {
    next.attributes[key] = 2
  })
  next.attributes[selection.strongest] = 4
  next.attributes[selection.weakest] = 1
  selection.medium.forEach((key) => {
    next.attributes[key] = 3
  })

  return recalculateCharacter(next)
}

export function applySkillDistribution(character, distributionName, pickedSkills, specialty) {
  const distribution = SKILL_DISTRIBUTIONS[distributionName]
  if (!distribution) throw new Error('Escolha uma distribuição de habilidades.')

  const selectedKeys = Object.keys(pickedSkills)
  const expectedCount = Object.values(distribution).reduce((total, count) => total + count, 0)
  if (selectedKeys.length !== expectedCount) {
    throw new Error('Complete a distribuição de habilidades antes de continuar.')
  }

  for (const [level, expected] of Object.entries(distribution)) {
    const actual = Object.values(pickedSkills).filter(
      (pickedLevel) => pickedLevel === Number(level),
    ).length
    if (actual !== expected) throw new Error('A distribuição escolhida está incompleta.')
  }

  if (!specialty?.skill || !specialty?.name?.trim()) {
    throw new Error('Escolha a especialidade inicial do personagem.')
  }

  const next = structuredClone(character)
  Object.keys(next.skills).forEach((key) => {
    next.skills[key] = pickedSkills[key] ?? 0
  })
  next.skillSpecialties = [
    ...next.skillSpecialties.filter(
      (candidate) =>
        candidate.skill !== specialty.skill || candidate.name !== specialty.name.trim(),
    ),
    { skill: specialty.skill, name: specialty.name.trim() },
  ]
  return next
}

export function getGenerationBonusExperience(generation) {
  if (generation === 13 || generation === 12) return 15
  if (generation === 11 || generation === 10) return 35
  return 0
}

export function applyGeneration(character, generation, scaleExperience = 0) {
  const numericGeneration = Number(generation)
  if (!Number.isInteger(numericGeneration) || numericGeneration < 3 || numericGeneration > 14) {
    throw new Error('Escolha uma geração válida.')
  }
  if (character.clan === 'Thin-blood' && numericGeneration !== 14) {
    throw new Error('Personagens Sangue-Ralo começam na 14ª geração.')
  }

  const next = structuredClone(character)
  next.generation = numericGeneration
  const scaleModel = vtmV5System.catalogs.generationScales.find((model) =>
    model.generations.includes(numericGeneration),
  )

  if (scaleModel) {
    const [minimum, maximum] = scaleModel.xpRange ?? [0, Number.MAX_SAFE_INTEGER]
    const requested = Number(scaleExperience)
    next.experience = Number.isFinite(requested)
      ? Math.min(maximum, Math.max(minimum, Math.round(requested)))
      : minimum
  } else {
    next.experience = getGenerationBonusExperience(numericGeneration)
  }

  return recalculateCharacter(next)
}

export function applyPredatorType(
  character,
  predatorName,
  specialty,
  disciplineName,
  allocations,
) {
  const predator = vtmV5System.catalogs.predatorTypes[predatorName]
  if (!predator || !predatorName) throw new Error('Escolha um tipo de predador.')
  if (
    vtmV5System.catalogs.clans[character.clan]?.excludedPredatorTypes?.includes(
      predatorName,
    )
  ) {
    throw new Error(
      `O tipo de predador escolhido não está disponível para o clã ${character.clan}.`,
    )
  }
  if (!specialty?.skill || !specialty?.name?.trim()) {
    throw new Error('Escolha uma especialidade do tipo de predador.')
  }
  if (!predator.disciplineOptions.some((option) => option.name === disciplineName)) {
    throw new Error('Escolha uma disciplina oferecida pelo tipo de predador.')
  }

  const pickedMeritsAndFlaws = predator.selectableMeritsAndFlaws.flatMap(
    (group, groupIndex) => {
      const values = allocations[groupIndex] ?? []
      const spent = values.reduce((total, value) => total + Number(value || 0), 0)
      if (spent !== group.totalPoints) {
        throw new Error('Distribua todos os pontos de vantagens e defeitos do predador.')
      }
      if (group.exclusive && values.filter((value) => value > 0).length !== 1) {
        throw new Error('Escolha apenas uma opção no grupo exclusivo.')
      }

      return group.options.flatMap((option, optionIndex) => {
        const level = Number(values[optionIndex] || 0)
        if (!level) return []
        if (level > option.maxLevel) throw new Error('Uma escolha excedeu seu limite.')
        return [
          {
            name: option.name,
            summary: option.summary,
            excludes: option.excludes,
            type: option.type,
            level,
          },
        ]
      })
    },
  )
  const nextPredatorType = {
    name: predatorName,
    pickedDiscipline: disciplineName,
    pickedSpecialties: [{ skill: specialty.skill, name: specialty.name.trim() }],
    pickedMeritsAndFlaws,
  }
  const adjusted =
    vtmV5System.rules.meritsAndFlaws.adjustPickedMeritsAndFlawsForPredatorTypeChange(
      character,
      nextPredatorType,
    )
  const changedDiscipline =
    disciplineName !== character.predatorType.pickedDiscipline
  const next = {
    ...structuredClone(character),
    ...adjusted,
    predatorType: nextPredatorType,
    disciplines: changedDiscipline ? [] : character.disciplines,
    rituals: changedDiscipline ? [] : character.rituals,
    ceremonies: changedDiscipline ? [] : character.ceremonies,
  }

  return recalculateCharacter(next)
}
