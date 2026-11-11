// O teto de schema é 10 porque Sangue Imemorial permite 6-10.
// O teto de REGRA continua sendo a Geração: ver maxTraitByGeneration
// em Generations.ts, aplicado na interface. O schema só precisa ser
// permissivo o bastante para não descartar uma ficha válida.
import { z } from "zod"

export const skillsSchema = z.object({
    athletics: z.number().min(0).max(10).int(),
    brawl: z.number().min(0).max(10).int(),
    craft: z.number().min(0).max(10).int(),
    drive: z.number().min(0).max(10).int(),
    firearms: z.number().min(0).max(10).int(),
    melee: z.number().min(0).max(10).int(),
    larceny: z.number().min(0).max(10).int(),
    stealth: z.number().min(0).max(10).int(),
    survival: z.number().min(0).max(10).int(),
    "animal ken": z.number().min(0).max(10).int(),
    etiquette: z.number().min(0).max(10).int(),
    insight: z.number().min(0).max(10).int(),
    intimidation: z.number().min(0).max(10).int(),
    leadership: z.number().min(0).max(10).int(),
    performance: z.number().min(0).max(10).int(),
    persuasion: z.number().min(0).max(10).int(),
    streetwise: z.number().min(0).max(10).int(),
    subterfuge: z.number().min(0).max(10).int(),
    academics: z.number().min(0).max(10).int(),
    awareness: z.number().min(0).max(10).int(),
    finance: z.number().min(0).max(10).int(),
    investigation: z.number().min(0).max(10).int(),
    medicine: z.number().min(0).max(10).int(),
    occult: z.number().min(0).max(10).int(),
    politics: z.number().min(0).max(10).int(),
    science: z.number().min(0).max(10).int(),
    technology: z.number().min(0).max(10).int()
})

export type Skills = z.infer<typeof skillsSchema>
export const skillsKeySchema = skillsSchema.keyof()
export type SkillsKey = z.infer<typeof skillsKeySchema>

export const allSkills: SkillsKey[] = [
    "athletics",
    "brawl",
    "craft",
    "drive",
    "firearms",
    "melee",
    "larceny",
    "stealth",
    "survival",

    "animal ken",
    "etiquette",
    "insight",
    "intimidation",
    "leadership",
    "performance",
    "persuasion",
    "streetwise",
    "subterfuge",

    "academics",
    "awareness",
    "finance",
    "investigation",
    "medicine",
    "occult",
    "politics",
    "science",
    "technology"
]

export const emptySkills: Skills = {
    athletics: 0,
    brawl: 0,
    craft: 0,
    drive: 0,
    firearms: 0,
    melee: 0,
    larceny: 0,
    stealth: 0,
    survival: 0,

    "animal ken": 0,
    etiquette: 0,
    insight: 0,
    intimidation: 0,
    leadership: 0,
    performance: 0,
    persuasion: 0,
    streetwise: 0,
    subterfuge: 0,

    academics: 0,
    awareness: 0,
    finance: 0,
    investigation: 0,
    medicine: 0,
    occult: 0,
    politics: 0,
    science: 0,
    technology: 0
}

// Page 152
export const skillsDescriptions: Record<SkillsKey, string> = {
    athletics: "Correr, pular e escalar",
    brawl: "Combate desarmado",
    craft: "Construir, consertar, criar",
    drive: "Operar veículos (não necessário para direção básica)",
    firearms: "Usar armas de fogo",
    melee: "Combate armado corpo a corpo",
    larceny: "Invadir lugares e proteger sua casa contra o mesmo",
    stealth: "Não ser visto, ouvido ou reconhecido",
    survival: "Lidar com ambientes adversos",

    academics: "Conhecimento acadêmico e humanidades",
    awareness: "Sentidos aguçados e percepção do ambiente",
    finance: "Ganhar e gerenciar dinheiro",
    investigation: "Pesquisar, encontrar e seguir pistas",
    medicine: "Curar e diagnosticar",
    occult: "Afinidade por conhecimentos secretos",
    politics: "Lidar com governo e burocracia",
    science: "Conhecimento do mundo físico",
    technology: "Entender tecnologia moderna, computadores, internet",

    "animal ken": "Interagir com animais",
    etiquette: "Seguir convenções sociais",
    insight: "Sentir emoções e motivos",
    intimidation: "Fazer alguém recuar",
    leadership: "Inspirar outros",
    performance: "Arte performática para um público",
    persuasion: "Convencer outros",
    streetwise: "Entender a sociedade criminal e urbana",
    subterfuge: "Enganar outros"
}

export const skillNames: Record<SkillsKey, string> = {
    athletics: "Atletismo",
    brawl: "Briga",
    craft: "Ofícios",
    drive: "Condução",
    firearms: "Armas de Fogo",
    melee: "Armas Brancas",
    larceny: "Ladroagem",
    stealth: "Furtividade",
    survival: "Sobrevivência",

    academics: "Erudição",
    awareness: "Percepção",
    finance: "Finanças",
    investigation: "Investigação",
    medicine: "Medicina",
    occult: "Ocultismo",
    politics: "Política",
    science: "Ciência",
    technology: "Tecnologia",

    "animal ken": "Empatia com Animais",
    etiquette: "Etiqueta",
    insight: "Sagacidade",
    intimidation: "Intimidação",
    leadership: "Liderança",
    performance: "Performance",
    persuasion: "Persuasão",
    streetwise: "Manha",
    subterfuge: "Subterfúgio"
}
