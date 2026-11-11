import { Character } from "./Character"
import { PredatorTypes } from "./PredatorType"

export type BloodPotencyEffect = {
    surge: number
    mend: string
    discBonus: string
    discRouse: string
    bane: number
    penalty: string
}

export type BloodPotencyLimits = {
    min: number
    max: number
}

export const potencyLimitByGeneration: Record<number, BloodPotencyLimits> = {
    // Sangue Imemorial estende a tabela oficial, que para na 4ª geração.
    3: { min: 6, max: 10 },
    4: { min: 5, max: 10 },
    5: { min: 4, max: 9 },
    6: { min: 3, max: 8 },
    7: { min: 3, max: 7 },
    8: { min: 2, max: 6 },
    9: { min: 2, max: 5 },
    10: { min: 1, max: 4 },
    11: { min: 1, max: 4 },
    12: { min: 1, max: 3 },
    13: { min: 1, max: 3 },
    14: { min: 0, max: 0 },
    15: { min: 0, max: 0 },
    16: { min: 0, max: 0 }
}

export const potencyEffects: Record<number, BloodPotencyEffect> = {
    0: { surge: 1, mend: "1 superficial", discBonus: "-", discRouse: "-", bane: 0, penalty: "-" },
    1: {
        surge: 2,
        mend: "1 superficial",
        discBonus: "-",
        discRouse: "Nv. 1",
        bane: 2,
        penalty: "-"
    },
    2: {
        surge: 2,
        mend: "2 superficiais",
        discBonus: "Adicione 1 dado",
        discRouse: "Nv. 1",
        bane: 2,
        penalty: "Sangue animal e sangue em bolsa saciam metade da Fome"
    },
    3: {
        surge: 3,
        mend: "2 superficiais",
        discBonus: "Adicione 1 dado",
        discRouse: "Nv. 2 ou menor",
        bane: 3,
        penalty: "Sangue animal e sangue em bolsa não saciam Fome"
    },
    4: {
        surge: 3,
        mend: "3 superficiais",
        discBonus: "Adicione 2 dados",
        discRouse: "Nv. 2 ou menor",
        bane: 3,
        penalty: "Sangue animal e sangue em bolsa não saciam Fome,\nSacie 1 Fome a menos por humano"
    },
    5: {
        surge: 4,
        mend: "3 superficiais",
        discBonus: "Adicione 2 dados",
        discRouse: "Nv. 3 ou menor",
        bane: 4,
        penalty:
            "Sangue animal e sangue em bolsa não saciam Fome,\nSacie 1 Fome a menos por humano,\nPrecisa drenar e matar um humano para reduzir Fome abaixo de 2"
    },
    6: {
        surge: 4,
        mend: "3 superficiais",
        discBonus: "Adicione 3 dados",
        discRouse: "Nv. 3 ou menor",
        bane: 4,
        penalty:
            "Sangue animal e sangue em bolsa não saciam Fome,\nSacie 2 Fome a menos por humano,\nPrecisa drenar e matar um humano para reduzir Fome abaixo de 2"
    },
    7: {
        surge: 5,
        mend: "3 superficiais",
        discBonus: "Adicione 3 dados",
        discRouse: "Nv. 4 ou menor",
        bane: 5,
        penalty:
            "Sangue animal e sangue em bolsa não saciam Fome,\nSacie 2 Fome a menos por humano,\nPrecisa drenar e matar um humano para reduzir Fome abaixo de 2"
    },
    8: {
        surge: 5,
        mend: "4 superficiais",
        discBonus: "Adicione 4 dados",
        discRouse: "Nv. 4 ou menor",
        bane: 5,
        penalty:
            "Sangue animal e sangue em bolsa não saciam Fome,\nSacie 2 Fome a menos por humano,\nPrecisa drenar e matar um humano para reduzir Fome abaixo de 3"
    },
    9: {
        surge: 6,
        mend: "4 superficiais",
        discBonus: "Adicione 4 dados",
        discRouse: "Nv. 5 ou menor",
        bane: 6,
        penalty:
            "Sangue animal e sangue em bolsa não saciam Fome,\nSacie 2 Fome a menos por humano,\nPrecisa drenar e matar um humano para reduzir Fome abaixo de 3"
    },
    10: {
        surge: 6,
        mend: "5 superficiais",
        discBonus: "Adicione 5 dados",
        discRouse: "Nv. 5 ou menor",
        bane: 6,
        penalty:
            "Sangue animal e sangue em bolsa não saciam Fome,\nSacie 3 Fome a menos por humano,\nPrecisa drenar e matar um humano para reduzir Fome abaixo de 3"
    }
}

const bloodPotencyDisciplineBonusByLevel: Record<number, number> = {
    0: 0,
    1: 0,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 3,
    7: 3,
    8: 4,
    9: 4,
    10: 5
}

export const getBloodPotencyEffectLevel = (bloodPotency: number): number =>
    Math.max(0, Math.min(5, Math.floor(bloodPotency)))

export const getBloodPotencyDisciplineBonus = (bloodPotency: number): number => {
    const clampedBloodPotency = getBloodPotencyEffectLevel(bloodPotency)
    return bloodPotencyDisciplineBonusByLevel[clampedBloodPotency] || 0
}

export const calculateBloodPotency = (character: Character): number => {
    let bloodPotency = (() => {
        switch (character.generation) {
            case 16:
            case 15:
            case 14:
                return 0
            case 13:
            case 12:
                return 1
            case 11:
            case 10:
                return 2
            default: {
                // Gerações 9ª–3ª: comece no mínimo permitido pela geração.
                // Sangue Imemorial, Capítulo VII, passo 2 — não comece
                // automaticamente no máximo geracional.
                const limits = potencyLimitByGeneration[character.generation]
                return limits ? limits.min : 1
            }
        }
    })()
    bloodPotency += PredatorTypes[character.predatorType.name].bloodPotencyChange
    return bloodPotency
}
