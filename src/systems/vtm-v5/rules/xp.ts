import type { Character } from "../data/Character"
import type { DisciplineName } from "../data/NameSchemas"

export const getAvailableXP = (character: Character): number => {
    return character.experience - character.ephemeral.experienceSpent
}

/**
 * Acima do quinto ponto o multiplicador muda. Um poder de nível 6 não é 20%
 * melhor que um de nível 5: abre uma escala nova de ação.
 * Sangue Imemorial, Capítulo III — Experiência Transcendente.
 */
const TRANSCENDENT_THRESHOLD = 5

/**
 * Nível de uma Disciplina = quantidade de poderes dela na ficha.
 * Poderes comprados como segundo poder do mesmo nível não contam.
 */
export const countDisciplineLevel = (
    character: Character,
    disciplineName: DisciplineName
): number =>
    character.disciplines.filter((p) => p.discipline === disciplineName && !p.isExtraPower).length

export const getAttributeCost = (newLevel: number): number => {
    return newLevel * (newLevel > TRANSCENDENT_THRESHOLD ? 8 : 5)
}

export const getSkillCost = (newLevel: number): number => {
    return newLevel * (newLevel > TRANSCENDENT_THRESHOLD ? 5 : 3)
}

export const getSpecialtyCost = (): number => {
    return 3
}

export const getBloodPotencyCost = (newLevel: number): number => {
    return newLevel * 10
}

export const getDisciplineCost = (character: Character, disciplineName: DisciplineName): number => {
    const newLevel = countDisciplineLevel(character, disciplineName) + 1

    const isNative =
        character.availableDisciplineNames.includes(disciplineName) ||
        character.predatorType.pickedDiscipline === disciplineName

    if (newLevel > TRANSCENDENT_THRESHOLD) {
        // Caitiff não tem Disciplina de clã; paga sempre como "outra".
        return newLevel * (isNative && character.clan !== "Caitiff" ? 10 : 14)
    }

    if (character.clan === "Caitiff") {
        return newLevel * 6
    }

    return newLevel * (isNative ? 5 : 7)
}

export const getRitualCost = (level: number): number => {
    return level * 3
}

export const getMeritCost = (level: number, previousLevel: number): number => {
    return Math.max(0, level - previousLevel) * 3
}

export const canAffordUpgrade = (availableXP: number, cost: number): boolean => {
    return availableXP >= cost
}

export const costFunctionByFieldName: Partial<
    Record<keyof Character, (newLevel: number) => number>
> = {
    bloodPotency: getBloodPotencyCost,
    attributes: getAttributeCost,
    skills: getSkillCost,
    skillSpecialties: getSpecialtyCost
}
