// Tabela "Limite de Sangue" — Sangue Imemorial, Capítulo I.
// A Geração define o máximo absoluto de Atributos, Habilidades e Disciplinas.
// Da 13ª à 8ª o teto continua sendo o 5 da V5 padrão.
const maxByGeneration: Record<number, number> = {
    3: 10,
    4: 9,
    5: 8,
    6: 7,
    7: 6
}

const DEFAULT_MAX = 5

/** Teto de Atributo e Habilidade permitido pela geração. */
export const maxTraitByGeneration = (generation: number): number =>
    maxByGeneration[generation] ?? DEFAULT_MAX

/** Teto de Disciplina permitido pela geração. */
export const maxDisciplineByGeneration = (generation: number): number =>
    maxByGeneration[generation] ?? DEFAULT_MAX

export type ScaleModel = {
    key: string
    label: string
    ageRange: string
    generations: number[]
    potencyRange: [number, number]
    /** null = sem orçamento fixo (Antediluviano). */
    xpRange: [number, number] | null
    warning?: string
}

// Tabela "Modelos de escala" — Sangue Imemorial, Capítulo VII.
// As faixas são pontos de partida, não biologia: um vampiro pode passar
// séculos em torpor ou dedicar toda a existência a três obsessões.
export const scaleModels: ScaleModel[] = [
    {
        key: "ancião",
        label: "Ancião",
        ageRange: "200–500 anos",
        generations: [9, 8, 7],
        potencyRange: [4, 6],
        xpRange: [120, 280]
    },
    {
        key: "ancião-superior",
        label: "Ancião superior",
        ageRange: "500–1.000 anos",
        generations: [8, 7, 6],
        potencyRange: [5, 7],
        xpRange: [280, 500]
    },
    {
        key: "matusalém",
        label: "Matusalém",
        ageRange: "1.000–3.000 anos",
        generations: [6, 5, 4],
        potencyRange: [6, 9],
        xpRange: [500, 1000]
    },
    {
        key: "primordial",
        label: "Primordial",
        ageRange: "3.000+ anos",
        generations: [5, 4],
        potencyRange: [8, 10],
        xpRange: [1000, 1600],
        warning: "Escala mítica. A campanha inteira precisa reagir à presença do personagem."
    },
    {
        key: "antediluviano",
        label: "Antediluviano",
        ageRange: "Mítico",
        generations: [3],
        potencyRange: [10, 10],
        xpRange: null,
        warning:
            "Exige acordo explícito de campanha. Recomendado apenas para crônicas míticas ou NPCs."
    }
]

/** Modelo de escala que cobre a geração informada, do mais brando ao mais extremo. */
export const getScaleModelForGeneration = (generation: number): ScaleModel | undefined =>
    scaleModels.find((model) => model.generations.includes(generation))
