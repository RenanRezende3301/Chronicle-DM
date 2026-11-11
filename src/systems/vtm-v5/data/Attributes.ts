// O teto de schema é 10 porque Sangue Imemorial permite 6-10.
// O teto de REGRA continua sendo a Geração: ver maxTraitByGeneration
// em Generations.ts, aplicado na interface. O schema só precisa ser
// permissivo o bastante para não descartar uma ficha válida.
import { z } from "zod"

export const attributesSchema = z.object({
    strength: z.number().min(1).max(10).int(),
    dexterity: z.number().min(1).max(10).int(),
    stamina: z.number().min(1).max(10).int(),
    charisma: z.number().min(1).max(10).int(),
    manipulation: z.number().min(1).max(10).int(),
    composure: z.number().min(1).max(10).int(),
    intelligence: z.number().min(1).max(10).int(),
    wits: z.number().min(1).max(10).int(),
    resolve: z.number().min(1).max(10).int()
})

export type Attributes = z.infer<typeof attributesSchema>
export const attributesKeySchema = attributesSchema.keyof()
export type AttributesKey = z.infer<typeof attributesKeySchema>

// Page 152
export const attributeDescriptions: Record<AttributesKey, string> = {
    strength: "Tudo relacionado a músculos",
    dexterity: "Agilidade e coordenação",
    stamina: "Dureza e resiliência",
    charisma: "Charme e magnetismo",
    manipulation: "Fazer os outros fazerem o que você quer",
    composure: "Autocontrole e manter a calma",
    intelligence: "Memória e raciocínio lógico",
    wits: "Raciocínio rápido e tomada de decisão em frações de segundo",
    resolve: "Foco e atenção"
}

export const attributeNames: Record<AttributesKey, string> = {
    strength: "Força",
    dexterity: "Destreza",
    stamina: "Vigor",
    charisma: "Carisma",
    manipulation: "Manipulação",
    composure: "Autocontrole",
    intelligence: "Inteligência",
    wits: "Raciocínio",
    resolve: "Determinação"
}
