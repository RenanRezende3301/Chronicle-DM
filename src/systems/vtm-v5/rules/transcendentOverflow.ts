import type { Character } from "../data/Character"
import type { AttributesKey } from "../data/Attributes"
import type { SkillsKey } from "../data/Skills"
import { getDisciplineLevel } from "../data/Disciplines"
import { translateAttribute, translateDiscipline, translateSkill } from "../data/translations"

const CAP = 5

/**
 * PDF, Foundry e Inconnu assumem teto 5. Em vez de truncar em silêncio,
 * descrevemos o excedente para o campo de anotações.
 */
export const describeTranscendentOverflow = (character: Character): string => {
    const lines: string[] = []

    // Ficha salva pode chegar incompleta — os exportadores toleram isso e este
    // texto é acessório, então nada aqui pode derrubar a exportação.
    const attributes = character.attributes ?? ({} as Character["attributes"])
    const skills = character.skills ?? ({} as Character["skills"])
    const disciplines = character.disciplines ?? []

    for (const key of Object.keys(attributes) as AttributesKey[]) {
        const value = attributes[key]
        if (value > CAP) lines.push(`${translateAttribute(key)} ${value}`)
    }

    for (const key of Object.keys(skills) as SkillsKey[]) {
        const value = skills[key]
        if (value > CAP) lines.push(`${translateSkill(key)} ${value}`)
    }

    const seenDisciplines = new Set(disciplines.map((power) => power.discipline))
    for (const discipline of seenDisciplines) {
        const level = getDisciplineLevel({ ...character, disciplines }, discipline)
        if (level > CAP) lines.push(`${translateDiscipline(discipline)} ${level}`)
    }

    if (character.bloodPotency > CAP) {
        lines.push(`Potência de Sangue ${character.bloodPotency}`)
    }
    const hunger = character.ephemeral?.hunger ?? 0
    if (hunger > CAP) {
        lines.push(`Fome ${hunger}`)
    }

    if (lines.length === 0) return ""

    return [
        "SANGUE IMEMORIAL — valores acima de 5 (não representáveis nesta exportação):",
        ...lines
    ].join("\n")
}
