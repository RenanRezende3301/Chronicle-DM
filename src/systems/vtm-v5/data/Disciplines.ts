import { z } from "zod"

import animalismLogo from "../resources/Rombo_Disciplines/rombo_Animalism.svg"
import auspexLogo from "../resources/Rombo_Disciplines/rombo_Auspex.svg"
import celerityLogo from "../resources/Rombo_Disciplines/rombo_Celerity.svg"
import dominateLogo from "../resources/Rombo_Disciplines/rombo_Dominate.svg"
import fortitudeLogo from "../resources/Rombo_Disciplines/rombo_Fortitude.svg"
import obfuscateLogo from "../resources/Rombo_Disciplines/rombo_Obfuscate.svg"
import potenceLogo from "../resources/Rombo_Disciplines/rombo_Potence.svg"
import presenceLogo from "../resources/Rombo_Disciplines/rombo_Presence.svg"
import proteanLogo from "../resources/Rombo_Disciplines/rombo_Protean.svg"
import bloodSorceryLogo from "../resources/Rombo_Disciplines/rombo_BloodSorcery.svg"
import oblivionLogo from "../resources/Rombo_Disciplines/rombo_Oblivion.svg"
import alchemyLogo from "../resources/Rombo_Disciplines/rombo_Alchemy.svg"
import { clanNameSchema, DisciplineName, disciplineNameSchema } from "./NameSchemas.js"
import type { Character } from "./Character"
import { transcendentPowers } from "./transcendent/powers.generated"
import { transcendentAmalgams } from "./transcendent/amalgams.generated"
import { sangueEsquecidoPowers } from "./SangueEsquecido"
import { maxDisciplineByGeneration } from "./Generations"

export const amalgamPrerequisiteSchema = z.object({
    discipline: disciplineNameSchema,
    level: z.number().min(1).int()
})

export type AmalgamPrerequisite = z.infer<typeof amalgamPrerequisiteSchema>

export const powerSchema = z.object({
    name: z.string(),
    description: z.string(),
    summary: z.string(),
    dicePool: z.string(),
    level: z.number().min(1).int(),
    discipline: disciplineNameSchema,
    rouseChecks: z.number().min(0).int(),
    amalgamPrerequisites: amalgamPrerequisiteSchema.array(),
    /** Um dos grupos deve ser satisfeito; usado por Amálgamas com caminhos alternativos. */
    amalgamPrerequisiteOptions: amalgamPrerequisiteSchema.array().array().optional(),
    /** Poderes específicos que precisam já constar na ficha. */
    requiredPowerNames: z.string().array().optional(),
    minimumHumanity: z.number().min(0).int().optional(),
    /** Identidade do Legado de Sangue que concedeu este poder, quando aplicável. */
    legacy: z.string().optional(),
    /** Restringe uma variante de poder a uma ou mais linhagens do suplemento. */
    availableForClans: clanNameSchema.array().optional(),
    isCustom: z.boolean().optional(),
    /**
     * Segundo poder comprado no mesmo nível (Sangue Imemorial, Capítulo III).
     * Não conta para o nível da Disciplina — ver countDisciplineLevel.
     */
    isExtraPower: z.boolean().optional()
})

export type Power = z.infer<typeof powerSchema>

export const ritualSchema = z.object({
    name: z.string(),
    summary: z.string(),
    rouseChecks: z.number().min(0).int(),
    requiredTime: z.string(),
    dicePool: z.string(),
    ingredients: z.string(),
    level: z.number().min(1).int(),
    discipline: disciplineNameSchema.optional(),
    isCustom: z.boolean().optional()
})

export type Ritual = z.infer<typeof ritualSchema>

export const sanitizeCustomDisciplineLogoUrl = (value: string | undefined): string => {
    const trimmed = value?.trim() ?? ""
    if (!trimmed) return ""

    try {
        const parsed = new URL(trimmed)
        return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : ""
    } catch {
        return ""
    }
}

const customDisciplineLogoSchema = z
    .string()
    .optional()
    .default("")
    .transform((value) => sanitizeCustomDisciplineLogoUrl(value))

export const disciplineSchema = z.object({
    clans: clanNameSchema.array(),
    summary: z.string(),
    powers: powerSchema.array(),
    logo: z.string(),
    isCustom: z.boolean().optional()
})
export type Discipline = z.infer<typeof disciplineSchema>

export const customDisciplineSchema = z.object({
    name: z.string(),
    summary: z.string(),
    logo: customDisciplineLogoSchema
})
export type CustomDiscipline = z.infer<typeof customDisciplineSchema>

export const disciplines: Record<DisciplineName, Discipline> = {
    animalism: {
        clans: ["Nosferatu", "Gangrel", "Ravnos", "Tzimisce"],
        summary: "Interaja e controle animais",
        logo: animalismLogo,
        powers: [
            {
                name: "Vínculo Familiar",
                description: "",
                rouseChecks: 3,
                amalgamPrerequisites: [],
                summary:
                    "vincule-se a um companheiro animal. Ele obedece comandos básicos, mas comunicação completa só é possível com Sussurros Selvagens",
                dicePool: "Carisma + Empatia com Animais",
                level: 1,
                discipline: "animalism"
            },
            {
                name: "Sentir a Besta",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "sinta hostilidade e traços sobrenaturais em pessoas",
                dicePool: "Determinação + Animalismo",
                level: 1,
                discipline: "animalism"
            },
            {
                name: "Sussurros Selvagens",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "comunique-se com animais. Você também pode chamar animais próximos, e eles virão até você",
                dicePool: "Manipulação / Carisma + Animalismo",
                level: 2,
                discipline: "animalism"
            },
            {
                name: "Atavismo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "faça um animal se enfurecer ou fugir",
                dicePool: "Autocontrole + Animalismo",
                level: 2,
                discipline: "animalism"
            },
            {
                name: "Coleira da Besta",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "fortitude", level: 1 }],
                summary:
                    "gaste vitae para suavizar um crítico, uma falha bestial ou um dado falho para resistir ao frenesi",
                dicePool: "",
                level: 2,
                discipline: "animalism"
            },
            {
                name: "Mensageiro Animal",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "auspex", level: 1 }],
                summary: "envie seu famulus para entregar uma mensagem curta falada com sua voz",
                dicePool: "",
                level: 2,
                discipline: "animalism"
            },

            {
                name: "Suculência Animal",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "alimente-se de animais com mais eficiência. Você pode consumir seu famulus para ganhar temporariamente o aspecto dele",
                dicePool: "",
                level: 3,
                discipline: "animalism"
            },
            {
                name: "Faro da Presa",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "detecte mortais que testemunharam violações da Máscara",
                dicePool: "Determinação + Animalismo",
                level: 3,
                discipline: "animalism"
            },
            {
                name: "Comando do Mensageiro",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "dominate", level: 1 }],
                summary: "envie Compelir ou Hipnotizar por meio de uma mensagem entregue por seu famulus",
                dicePool: "",
                level: 3,
                discipline: "animalism"
            },
            {
                name: "Praga de Bestas",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "marque um alvo para que animais próximos o perturbem e facilitem seu rastreamento",
                dicePool: "Manipulação + Animalismo",
                level: 3,
                discipline: "animalism"
            },
            {
                name: "Augúrio",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "auspex", level: 1 }],
                summary:
                    "force um enxame, bando ou cardume a formar uma resposta para uma pergunta sobre a área em que está",
                dicePool: "Manipulação + Animalismo",
                level: 3,
                discipline: "animalism"
            },
            {
                name: "Despertar o Parasita",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "faça parasitas irromperem dentro de um corpo próximo, prejudicando fala, concentração e a sobrevivência de mortais",
                dicePool: "Determinação + Animalismo",
                level: 3,
                discipline: "animalism"
            },
            {
                name: "Acalmar a Besta",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "suprima impulsos e desejos de um alvo, tirando vampiros do frenesi",
                dicePool: "Carisma + Animalismo",
                level: 3,
                discipline: "animalism"
            },
            {
                name: "Colmeia Não-Viva",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "obfuscate", level: 2 }],
                summary:
                    "estenda sua influência animal a enxames de insetos, tratando um enxame como uma única criatura",
                dicePool: "",
                level: 3,
                discipline: "animalism"
            },
            {
                name: "Subsumir o Espírito",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "transfira sua mente para o corpo de um animal, controlando-o e usando seus sentidos",
                dicePool: "Manipulação + Animalismo",
                level: 4,
                discipline: "animalism"
            },
            {
                name: "Influenciar o Bando",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "altere o humor de animais em uma grande área para calma ou agressividade",
                dicePool: "Autocontrole + Animalismo",
                level: 4,
                discipline: "animalism"
            },
            {
                name: "Domínio Animal",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary: "comande bandos e matilhas de animais como extensões do seu próprio corpo",
                dicePool: "Carisma + Animalismo",
                level: 5,
                discipline: "animalism"
            },
            {
                name: "Extrair a Besta",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "projete sua Besta no momento do frenesi, transferindo-a para um sujeito próximo",
                dicePool: "Raciocínio + Animalismo",
                level: 5,
                discipline: "animalism"
            },
            {
                name: "Instigar o Temperamento Bestial",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "eleve ou reduza sutilmente a dificuldade de frenesi de vampiros próximos enquanto cantarola ou rosna",
                dicePool: "Manipulação + Animalismo",
                level: 5,
                discipline: "animalism"
            }
        ]
    },
    auspex: {
        clans: ["Toreador", "Tremere", "Malkavian", "Hecata", "Salubri"],
        summary: "Sentidos sobrenaturais e premonições",
        logo: auspexLogo,
        powers: [
            {
                name: "Sentidos Aguçados",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "seus sentidos se tornam sobrenaturalmente aguçados; adicione o nível de Auspícios às rolagens de percepção",
                dicePool: "",
                level: 1,
                discipline: "auspex"
            },
            {
                name: "Sentir o Oculto",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "sinta atividades sobrenaturais",
                dicePool: "Raciocínio / Determinação + Auspícios",
                level: 1,
                discipline: "auspex"
            },
            {
                name: "Premonição",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "ganhe visões do futuro",
                dicePool: "",
                level: 2,
                discipline: "auspex"
            },
            {
                name: "Obeah",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "fortitude", level: 1 }],
                summary: "acalme o tormento psicológico de uma pessoa",
                dicePool: "Autocontrole + Auspícios",
                level: 2,
                discipline: "auspex"
            },
            {
                name: "Panaceia",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "fortitude", level: 1 }],
                summary: "cure dano à Força de Vontade de outra pessoa e acalme sofrimento mortal",
                dicePool: "Autocontrole + Auspícios",
                level: 2,
                discipline: "auspex"
            },
            {
                name: "Revelar Temperamento",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "fareje a ressonância, discrasias ou a última vítima de um vampiro",
                dicePool: "Inteligência + Auspícios",
                level: 2,
                discipline: "auspex"
            },
            {
                name: "Perseguição Infalível",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "dominate", level: 1 }],
                summary: "crie um vínculo com um alvo para espioná-lo",
                dicePool: "Determinação + Auspícios",
                level: 2,
                discipline: "auspex"
            },

            {
                name: "Falha Fatal",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "oblivion", level: 1 }],
                summary: "determine a fraqueza de um alvo",
                dicePool: "Inteligência + Auspícios",
                level: 3,
                discipline: "auspex"
            },
            {
                name: "Perscrutar a Alma",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "veja as auras das pessoas",
                dicePool: "Inteligência + Auspícios",
                level: 3,
                discipline: "auspex"
            },
            {
                name: "Compartilhar os Sentidos",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "perceba pelos sentidos de outra pessoa, como enxergar por seus olhos",
                dicePool: "Determinação + Auspícios",
                level: 3,
                discipline: "auspex"
            },
            {
                name: "Toque do Espírito",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "sinta resíduos emocionais deixados por quem manuseou um objeto ou visitou um local",
                dicePool: "Inteligência + Auspícios",
                level: 4,
                discipline: "auspex"
            },
            {
                name: "Harúspice",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "oblivion", level: 1 }],
                summary:
                    "leia uma morte recente para preparar uma rolagem futura com uma repetição poderosa",
                dicePool: "Determinação + Auspícios",
                level: 3,
                discipline: "auspex"
            },
            {
                name: "Coração Exposto",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "descubra, em conversa, o medo ou desejo oculto mais forte de um alvo",
                dicePool: "Inteligência + Auspícios",
                level: 4,
                discipline: "auspex"
            },
            {
                name: "Clarividência",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "reúna informações de uma área do tamanho de um quarteirão por conexão mística",
                dicePool: "Inteligência + Auspícios",
                level: 5,
                discipline: "auspex"
            },
            {
                name: "Possessão",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [{ discipline: "dominate", level: 3 }],
                summary: "remova a vontade de um mortal e possua completamente seu corpo",
                dicePool: "Determinação + Auspícios",
                level: 5,
                discipline: "auspex"
            },
            {
                name: "Aliviar a Alma Bestial",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [{ discipline: "dominate", level: 3 }],
                summary:
                    "remova Máculas de outro vampiro ou proteja-o de Máculas futuras, a um custo",
                dicePool: "Autocontrole + Auspícios",
                level: 5,
                discipline: "auspex"
            },
            {
                name: "Telepatia",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "leia mentes e projete pensamentos nas mentes de outros",
                dicePool: "Determinação + Auspícios",
                level: 5,
                discipline: "auspex"
            }
        ]
    },
    celerity: {
        clans: ["Toreador", "Brujah", "Banu Haqim"],
        summary: "Mova-se com velocidade sobrenatural",
        logo: celerityLogo,
        powers: [
            {
                name: "Graça Felina",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "passe automaticamente em testes de equilíbrio",
                dicePool: "",
                level: 1,
                discipline: "celerity"
            },
            {
                name: "Reflexos Rápidos",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "reações mais rápidas e ações menores gratuitas",
                dicePool: "",
                level: 1,
                discipline: "celerity"
            },
            {
                name: "Rapidez",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "adicione o nível de Rapidez às rolagens de defesa e Destreza",
                dicePool: "",
                level: 2,
                discipline: "celerity"
            },
            {
                name: "Trabalho Relâmpago",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "execute tarefas de perícia fora de combate em segundos ou como ações menores",
                dicePool: "",
                level: 2,
                discipline: "celerity"
            },

            {
                name: "Piscar",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "dispare até 50 m em velocidade sobrenatural",
                dicePool: "Destreza + Atletismo",
                level: 3,
                discipline: "celerity"
            },
            {
                name: "Travessia",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "corra sobre líquidos ou paredes",
                dicePool: "Destreza + Atletismo",
                level: 3,
                discipline: "celerity"
            },
            {
                name: "Zigue-zague",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "adicione o nível de Rapidez à defesa contra ataques à distância (requer Reflexos Rápidos)",
                dicePool: "",
                level: 3,
                discipline: "celerity"
            },
            {
                name: "Mil Cortes",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "adicione Rapidez a um ataque com garras ou lâmina que deixa vítimas sangrando e vulneráveis",
                dicePool: "",
                level: 3,
                discipline: "celerity"
            },
            {
                name: "Impulso Borrado",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "mova-se como um borrão, fazendo ataques fracos errarem mesmo quando você não puder se defender",
                dicePool: "",
                level: 4,
                discipline: "celerity"
            },
            {
                name: "Elixir da Elegância",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "conceda poder temporário de Rapidez a quem beber seu Sangue",
                dicePool: "",
                level: 4,
                discipline: "celerity"
            },
            {
                name: "Mais Rápido que a Luz",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "use Piscar para atravessar uma pequena área de fogo ou luz solar sem sofrer dano",
                dicePool: "",
                level: 4,
                discipline: "celerity"
            },
            {
                name: "Mira Infalível",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "auspex", level: 2 }],
                summary: "mire e dispare qualquer arma contra um alvo como se ele estivesse parado",
                dicePool: "",
                level: 4,
                discipline: "celerity"
            },
            {
                name: "Golpe Invisível",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [{ discipline: "obfuscate", level: 4 }],
                summary:
                    "desapareça, aproxime-se instantaneamente de um inimigo e possivelmente ataque de surpresa",
                dicePool: "Destreza + Rapidez",
                level: 4,
                discipline: "celerity"
            },
            {
                name: "Golpe Relâmpago",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "ataque com punho ou arma corpo a corpo em velocidade tão alta que o oponente não possa se defender",
                dicePool: "",
                level: 5,
                discipline: "celerity"
            },
            {
                name: "Fração de Segundo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "reaja a eventos no mesmo instante, sobrepondo-se à narração do Narrador",
                dicePool: "",
                level: 5,
                discipline: "celerity"
            }
        ]
    },
    dominate: {
        clans: ["Ventrue", "Malkavian", "Tremere", "Lasombra", "Tzimisce", "Salubri"],
        summary: "Controle a mente dos outros",
        logo: dominateLogo,
        powers: [
            {
                name: "Memória Turva",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "faça uma pessoa esquecer o último minuto",
                dicePool: "Carisma + Dominação",
                level: 1,
                discipline: "dominate"
            },
            {
                name: "Compelir",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "emita um comando único e curto com efeito imediato",
                dicePool: "Carisma + Dominação",
                level: 1,
                discipline: "dominate"
            },
            {
                name: "Hipnotizar",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "permita comandos mais complexos",
                dicePool: "Manipulação + Dominação",
                level: 2,
                discipline: "dominate"
            },

            {
                name: "Favor do Domitor",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "torne mais difícil para servos resistirem a você",
                dicePool: "",
                level: 2,
                discipline: "dominate"
            },
            {
                name: "Devoção Servil",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "presence", level: 1 }],
                summary:
                    "fortaleça a mente de suas vítimas dominadas contra interferência de outros Membros",
                dicePool: "",
                level: 2,
                discipline: "dominate"
            },
            {
                name: "Demência",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "obfuscate", level: 2 }],
                summary: "provoque surtos psicóticos ou colapsos nervosos em outros",
                dicePool: "Manipulação + Dominação",
                level: 2,
                discipline: "dominate"
            },
            {
                name: "A Voz Roubada",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "silencie uma vítima para que fala, escrita, gestos e outras formas de comunicação falhem",
                dicePool: "Autocontrole + Dominação",
                level: 2,
                discipline: "dominate"
            },
            {
                name: "Mente Esquecida",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "reescreva memórias",
                dicePool: "Manipulação + Dominação",
                level: 3,
                discipline: "dominate"
            },
            {
                name: "Implantar Sugestão",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "presence", level: 1 }],
                summary: "altere temporariamente desejos, opiniões ou intenções de um alvo",
                dicePool: "Manipulação + Dominação",
                level: 3,
                discipline: "dominate"
            },
            {
                name: "Diretiva Submersa",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "ao usar Hipnotizar, você pode dar um comando que permanece dormente até ser acionado (requer Hipnotizar)",
                dicePool: "",
                level: 3,
                discipline: "dominate"
            },
            {
                name: "Racionalizar",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "as vítimas acreditam que qualquer coisa feita sob Dominação foi fruto de sua própria vontade",
                dicePool: "",
                level: 4,
                discipline: "dominate"
            },
            {
                name: "Domínio Ancestral",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "blood sorcery", level: 3 }],
                summary:
                    "comande um descendente pelo Sangue, mesmo sem contato visual ou ordens faladas",
                dicePool: "Manipulação + Dominação",
                level: 4,
                discipline: "dominate"
            },
            {
                name: "Tabula Rasa",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary:
                    "apague memórias e identidade de uma vítima contida, preservando perícias e poderes",
                dicePool: "Determinação + Dominação",
                level: 4,
                discipline: "dominate"
            },
            {
                name: "Manipulação em Massa",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "amplie qualquer poder de Dominação para afetar um grupo de pessoas de uma só vez",
                dicePool: "",
                level: 5,
                discipline: "dominate"
            },
            {
                name: "Decreto Terminal",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "emita comandos que levem diretamente a vítima a sofrer dano ou morrer",
                dicePool: "",
                level: 5,
                discipline: "dominate"
            }
        ]
    },
    fortitude: {
        clans: ["Ventrue", "Gangrel", "Hecata", "Salubri"],
        summary: "Resista a dano e influência",
        logo: fortitudeLogo,
        powers: [
            {
                name: "Resiliência",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "adicione o nível de Fortitude à trilha de Vitalidade",
                dicePool: "",
                level: 1,
                discipline: "fortitude"
            },
            {
                name: "Mente Inabalável",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "adicione defesa extra contra influência mental",
                dicePool: "",
                level: 1,
                discipline: "fortitude"
            },
            {
                name: "Robustez",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "reduza dano físico superficial sofrido",
                dicePool: "",
                level: 2,
                discipline: "fortitude"
            },
            {
                name: "Autoconfiança",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "absorva dano superficial à Força de Vontade durante conflito social antes que ele o afete",
                dicePool: "",
                level: 2,
                discipline: "fortitude"
            },
            {
                name: "Perseverança da Terra",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "enraíze-se no lugar para que apenas você escolha quando se mover",
                dicePool: "",
                level: 2,
                discipline: "fortitude"
            },
            {
                name: "Vitae Revigorante",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "auspex", level: 1 }],
                summary: "sua vitae cura seres vivos com mais eficiência que o normal",
                dicePool: "",
                level: 2,
                discipline: "fortitude"
            },
            {
                name: "Bestas Duradouras",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "animalism", level: 1 }],
                summary: "compartilhe parte de sua resistência sobrenatural com animais que você influencia",
                dicePool: "Vigor + Animalismo",
                level: 2,
                discipline: "fortitude"
            },
            // { name: "Obstinado", description: "", rouseChecks: 0, amalgamPrerequisites: [{ discipline: "potence", level: 2 }], summary: "mantenha o equilíbrio mesmo quando atingido por força massiva", dicePool: "", level: 2, discipline: "fortitude" },

            {
                name: "Desafiar Perdição",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "transforme dano agravado em superficial",
                dicePool: "",
                level: 3,
                discipline: "fortitude"
            },
            {
                name: "Fortificar a Fachada Interior",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "resista a Auspícios e poderes semelhantes",
                dicePool: "",
                level: 3,
                discipline: "fortitude"
            },
            {
                name: "Selar a Goela da Besta",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary: "ignore a Fome por uma cena",
                dicePool: "",
                level: 3,
                discipline: "fortitude"
            },
            {
                name: "Alma Calejada",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "cometa uma atrocidade planejada para anestesiar sua consciência contra novas Máculas naquela noite",
                dicePool: "",
                level: 3,
                discipline: "fortitude"
            },
            {
                name: "Valeren",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "auspex", level: 1 }],
                summary: "use seu sangue para curar outros vampiros",
                dicePool: "Inteligência + Fortitude",
                level: 3,
                discipline: "fortitude"
            },
            {
                name: "Elixir da Resistência",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "conceda poder temporário de Fortitude a quem beber seu Sangue",
                dicePool: "",
                level: 4,
                discipline: "fortitude"
            },
            {
                name: "Escamas da Górgona",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "use a última ressonância da qual se alimentou como defesa específica contra perdições ou poderes",
                dicePool: "",
                level: 4,
                discipline: "fortitude"
            },
            {
                name: "Despedaçar",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "enquanto Robustez estiver ativa, reflita parte do dano absorvido de volta contra atacantes ou armas",
                dicePool: "Vigor + Fortitude",
                level: 4,
                discipline: "fortitude"
            },
            {
                name: "Carne de Mármore",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary:
                    "endureça sua pele com brilho marmóreo, ignorando a primeira fonte de dano físico a cada turno",
                dicePool: "",
                level: 5,
                discipline: "fortitude"
            },
            {
                name: "Proeza da Dor",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "você não sofre mais penalidades de dados por dano à Vitalidade. Ative para aumentar um atributo físico em 1 para cada caixa de Vitalidade danificada",
                dicePool: "",
                level: 5,
                discipline: "fortitude"
            },
            {
                name: "Escudos de Carne",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "extraia força de mortais fracos ou feridos próximos, elevando temporariamente Fortitude",
                dicePool: "",
                level: 5,
                discipline: "fortitude"
            }
        ]
    },
    obfuscate: {
        clans: ["Nosferatu", "Malkavian", "Banu Haqim", "Ministry", "Ravnos"],
        summary: "Permaneça indetectável",
        logo: obfuscateLogo,
        powers: [
            {
                name: "Manto das Sombras",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "misture-se ao ambiente enquanto permanecer imóvel",
                dicePool: "Raciocínio + Ofuscação / Furtividade",
                level: 1,
                discipline: "obfuscate"
            },
            {
                name: "Máscara das Idades",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "faça-se parecer muito mais velho ou mais jovem até o amanhecer",
                dicePool: "",
                level: 1,
                discipline: "obfuscate"
            },
            {
                name: "Silêncio da Morte",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "abafe todos os sons que você produz",
                dicePool: "",
                level: 1,
                discipline: "obfuscate"
            },
            {
                name: "Fala Dupla",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "auspex", level: 1 }],
                summary:
                    "oculte uma mensagem privada curta dentro de uma fala comum para um ouvinte escolhido",
                dicePool: "Autocontrole + Ofuscação",
                level: 2,
                discipline: "obfuscate"
            },
            {
                name: "Passagem Invisível",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "mova-se enquanto permanece oculto",
                dicePool: "Raciocínio + Ofuscação / Furtividade",
                level: 2,
                discipline: "obfuscate"
            },
            {
                name: "Quimerismo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "presence", level: 1 }],
                summary: "crie breves alucinações sensoriais",
                dicePool: "Manipulação + Ofuscação",
                level: 2,
                discipline: "obfuscate"
            },
            {
                name: "Passagem Fantasma",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "animalism", level: 1 }],
                summary: "estenda seus poderes de Ofuscação a animais sob sua influência",
                dicePool: "Raciocínio + Ofuscação",
                level: 2,
                discipline: "obfuscate"
            },
            // { name: "Ventriloquismo", description: "", rouseChecks: 0, amalgamPrerequisites: [{ discipline: "auspex", level: 2 }], summary: "escolha quem pode ou não ouvir você quando fala", dicePool: "", level: 2, discipline: "obfuscate" },

            {
                name: "Fata Morgana",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "presence", level: 2 }],
                summary:
                    "crie uma alucinação elaborada multissensorial que afeta todos que a percebem",
                dicePool: "Manipulação + Ofuscação",
                level: 3,
                discipline: "obfuscate"
            },
            {
                name: "Fantasma na Máquina",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "Ofuscação afeta tecnologia, por exemplo ocultando você de gravações",
                dicePool: "",
                level: 3,
                discipline: "obfuscate"
            },
            {
                name: "Máscara das Mil Faces",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "faça-se parecer um estranho genérico para os outros",
                dicePool: "",
                level: 3,
                discipline: "obfuscate"
            },
            {
                name: "Aparência dos Falecidos",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "oblivion", level: 1 }],
                summary:
                    "toque um cadáver recente para copiar sua aparência, postura e maneirismos até o amanhecer",
                dicePool: "Raciocínio + Ofuscação",
                level: 3,
                discipline: "obfuscate"
            },
            {
                name: "Labirinto Mental",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "dominate", level: 1 }],
                summary: "impeça alguém de perceber saídas ou meios de fuga",
                dicePool: "Carisma + Ofuscação",
                level: 3,
                discipline: "obfuscate"
            },
            {
                name: "Máscara do Isolamento",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "dominate", level: 1 }],
                summary: "faça uma vítima parecer irreconhecível até para quem a conhece bem",
                dicePool: "Manipulação + Ofuscação",
                level: 3,
                discipline: "obfuscate"
            },
            {
                name: "Máscara Mental",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "dominate", level: 2 }],
                summary:
                    "oculte sua mente real atrás de uma persona falsa contra leituras sobrenaturais",
                dicePool: "Inteligência + Ofuscação",
                level: 3,
                discipline: "obfuscate"
            },
            {
                name: "Ocultar",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "auspex", level: 3 }],
                summary: "encubra um objeto inanimado, como uma porta, carro ou casa pequena",
                dicePool: "Inteligência + Ofuscação",
                level: 4,
                discipline: "obfuscate"
            },
            {
                name: "Reclusão",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "dominate", level: 1 }],
                summary:
                    "cegue uma vítima para todas as pessoas próximas, deixando-a isolada e desorientada",
                dicePool: "Manipulação + Ofuscação",
                level: 4,
                discipline: "obfuscate"
            },
            {
                name: "Desaparecer",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "ative Manto das Sombras e Passagem Invisível mesmo sob observação direta",
                dicePool: "Raciocínio + Ofuscação",
                level: 4,
                discipline: "obfuscate"
            },
            {
                name: "Encobrir o Grupo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "abrigue seus companheiros sob o manto da Ofuscação",
                dicePool: "",
                level: 5,
                discipline: "obfuscate"
            },
            {
                name: "Aparência do Impostor",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "faça-se parecer uma pessoa específica de qualquer porte e gênero",
                dicePool: "Raciocínio + Ofuscação",
                level: 5,
                discipline: "obfuscate"
            }
        ]
    },
    potence: {
        clans: ["Nosferatu", "Brujah", "Lasombra"],
        summary: "Ganhe força sobrenatural",
        logo: potenceLogo,
        powers: [
            {
                name: "Corpo Letal",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "cause dano físico grave a mortais",
                dicePool: "",
                level: 1,
                discipline: "potence"
            },
            {
                name: "Salto Elevado",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "salte longas distâncias",
                dicePool: "",
                level: 1,
                discipline: "potence"
            },
            {
                name: "Proeza",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "adicione o nível de Potência aos testes de Força",
                dicePool: "",
                level: 2,
                discipline: "potence"
            },
            {
                name: "Agarrão Implacável",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "adicione Potência como sucessos automáticos ao segurar algo ou manter um agarrão",
                dicePool: "",
                level: 2,
                discipline: "potence"
            },
            {
                name: "Alimentação Brutal",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "drene uma pessoa em segundos",
                dicePool: "",
                level: 3,
                discipline: "potence"
            },
            {
                name: "Aderência Sobrenatural",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "agarre-se e mantenha-se preso a qualquer superfície, incluindo paredes e tetos",
                dicePool: "",
                level: 3,
                discipline: "potence"
            },
            {
                name: "Demolidor",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "adicione o dobro do nível de Potência à Força ao destruir objetos (requer Proeza)",
                dicePool: "",
                level: 3,
                discipline: "potence"
            },
            {
                name: "Exuberância",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "force Potência além do seu nível, arriscando esforço agravado autoinfligido",
                dicePool: "",
                level: 3,
                discipline: "potence"
            },
            {
                name: "Centelha da Fúria",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "presence", level: 3 }],
                summary:
                    "adicione Potência a qualquer rolagem para incitar violência; force vampiros a fazer testes de frenesi",
                dicePool: "Manipulação + Potência",
                level: 3,
                discipline: "potence"
            },
            {
                name: "Elixir do Poder",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "conceda temporariamente metade do seu poder de Potência a quem beber seu Sangue",
                dicePool: "",
                level: 4,
                discipline: "potence"
            },
            {
                name: "Queda Devastadora",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "aterrisse após Salto Elevado com um impacto em área que causa dano",
                dicePool: "Força + Potência",
                level: 4,
                discipline: "potence"
            },
            {
                name: "Tremor de Terra",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary:
                    "esmague punho ou pé contra o chão, criando uma onda de choque que derruba oponentes",
                dicePool: "",
                level: 5,
                discipline: "potence"
            },
            {
                name: "Martelo Sutil",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "canalize a força do corpo inteiro por pequenos movimentos como ações menores",
                dicePool: "",
                level: 5,
                discipline: "potence"
            },
            {
                name: "Punho de Caim",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "mãos nuas podem infligir ferimentos graves, causando dano agravado a mortais e vampiros",
                dicePool: "",
                level: 5,
                discipline: "potence"
            }
        ]
    },
    presence: {
        clans: ["Toreador", "Brujah", "Ventrue", "Ministry", "Ravnos"],
        summary: "Aparência e presença sobrenatural",
        logo: presenceLogo,
        powers: [
            {
                name: "Fascínio",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "torne-se atraente e carismático; adicione o nível de Presença a testes de Persuasão e Performance",
                dicePool: "",
                level: 1,
                discipline: "presence"
            },
            {
                name: "Amedrontar",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "afaste e intimide pessoas; adicione o nível de Presença a testes de Intimidação",
                dicePool: "",
                level: 1,
                discipline: "presence"
            },
            {
                name: "Olhos da Serpente",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "protean", level: 1 }],
                summary: "imobilize alguém por contato visual",
                dicePool: "Carisma + Presença",
                level: 1,
                discipline: "presence"
            },
            {
                name: "Beijo Persistente",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "faça mortais dos quais você se alimenta amarem você",
                dicePool: "",
                level: 2,
                discipline: "presence"
            },
            {
                name: "Melpômene",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "use poderes de Presença contra alvos que não podem vê-lo, mas podem ouvi-lo",
                dicePool: "",
                level: 2,
                discipline: "presence"
            },
            {
                name: "Olhar Aterrador",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "aterrorize um indivíduo, fazendo-o se submeter, congelar, fugir ou entrar em frenesi de terror",
                dicePool: "Carisma + Presença",
                level: 3,
                discipline: "presence"
            },
            {
                name: "Encantamento",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "cause fascinação, fazendo um alvo quase qualquer coisa para permanecer em suas boas graças",
                dicePool: "Carisma + Presença",
                level: 3,
                discipline: "presence"
            },
            {
                name: "Exibição Revigorante",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "atraia para si a ressonância elevada de uma multidão após uma performance bem-sucedida",
                dicePool: "Autocontrole + Presença",
                level: 3,
                discipline: "presence"
            },
            {
                name: "Sanguessuga de Paixão",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "auspex", level: 2 }],
                summary:
                    "drene uma emoção poderosa de um mortal para sentir-se mais humano por um breve momento enquanto o esvazia",
                dicePool: "Autocontrole + Auspícios",
                level: 3,
                discipline: "presence"
            },
            {
                name: "Face do Amor Verdadeiro",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "obfuscate", level: 3 }],
                summary:
                    "apareça para uma vítima como alguém por quem ela sente algo intenso, ajudando a manipular emoções e ressonância",
                dicePool: "Manipulação + Presença",
                level: 3,
                discipline: "presence"
            },
            {
                name: "Voz Projetada",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "auspex", level: 1 }],
                summary: "projete sua voz para qualquer lugar que possa ver",
                dicePool: "",
                level: 3,
                discipline: "presence"
            },
            {
                name: "Voz Irresistível",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "dominate", level: 1 }],
                summary: "use apenas sua voz para empregar poderes de Dominação",
                dicePool: "",
                level: 4,
                discipline: "presence"
            },
            {
                name: "Saturar o Edifício",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "imbua uma construção com um poder de Presença que afeta quem está dentro",
                dicePool: "",
                level: 4,
                discipline: "presence"
            },
            {
                name: "Inflamar Desejo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "obfuscate", level: 1 }],
                summary: "amplie o desejo atual de um alvo tocado em uma obsessão que dura a cena",
                dicePool: "Manipulação + Presença",
                level: 4,
                discipline: "presence"
            },
            {
                name: "Ala",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "estenda um de seus poderes ativos de Presença a outro vampiro voluntário em vez de a si mesmo",
                dicePool: "",
                level: 4,
                discipline: "presence"
            },
            {
                name: "Convocação",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "chame até você qualquer pessoa sobre quem já tenha usado Fascínio, Encantamento ou Majestade",
                dicePool: "Manipulação + Presença",
                level: 4,
                discipline: "presence"
            },
            {
                name: "Majestade",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary:
                    "amplie sua presença a níveis sobrenaturais, tornando todos incapazes de agir contra você",
                dicePool: "Carisma + Presença",
                level: 5,
                discipline: "presence"
            },
            {
                name: "Magnetismo Estelar",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "poderes de Presença afetam pessoas que veem você em transmissões ao vivo ou o ouvem pelo telefone",
                dicePool: "",
                level: 5,
                discipline: "presence"
            }
        ]
    },
    protean: {
        clans: ["Gangrel", "Ministry", "Tzimisce"],
        summary: "Molde seu corpo para ganhar poder",
        logo: proteanLogo,
        powers: [
            {
                name: "Olhos da Besta",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "seus olhos começam a brilhar e você enxerga na escuridão total",
                dicePool: "",
                level: 1,
                discipline: "protean"
            },
            {
                name: "Contorcer-se",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "desloque e amoleça seu corpo para escapar de amarras ou passar por frestas",
                dicePool: "",
                level: 1,
                discipline: "protean"
            },
            {
                name: "Peso Pena",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "torne-se sem peso",
                dicePool: "",
                level: 1,
                discipline: "protean"
            },
            {
                name: "Armas Ferais",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "desenvolva garras mortais",
                dicePool: "",
                level: 2,
                discipline: "protean"
            },
            {
                name: "Beijo da Serpente",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "desenvolva presas ocas que injetam sua vitae na vítima durante uma mordida ou beijo",
                dicePool: "",
                level: 2,
                discipline: "protean"
            },
            {
                name: "O Gole Falso",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "fortitude", level: 1 }],
                summary:
                    "mantenha sangue engolido fora do seu sistema por uma cena, evitando efeitos da alimentação até expeli-lo",
                dicePool: "",
                level: 2,
                discipline: "protean"
            },
            {
                name: "Vicissitude",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "dominate", level: 2 }],
                summary: "remodele sua própria pele, músculos e ossos à vontade",
                dicePool: "Determinação + Proteanismo",
                level: 2,
                discipline: "protean"
            },

            {
                name: "Fusão com a Terra",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "funda-se ao solo",
                dicePool: "",
                level: 3,
                discipline: "protean"
            },
            {
                name: "Mudança de Forma",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "transforme-se em um animal de tamanho humano",
                dicePool: "",
                level: 3,
                discipline: "protean"
            },
            {
                name: "Escultura da Carne",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "dominate", level: 2 }],
                summary: "remodele a carne de outra criatura por meio de Vicissitude",
                dicePool: "Determinação + Proteanismo",
                level: 3,
                discipline: "protean"
            },
            {
                name: "Máscara da Morte",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "oblivion", level: 2 }],
                summary: "assuma a aparência de um cadáver, capaz de suportar dano enquanto permanece imóvel",
                dicePool: "",
                level: 3,
                discipline: "protean"
            },
            {
                name: "Metamorfose",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "conceda uma forma animal adicional, permitindo alterar seu tamanho",
                dicePool: "",
                level: 4,
                discipline: "protean"
            },
            {
                name: "Forma Horrenda",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [{ discipline: "dominate", level: 2 }],
                summary:
                    "torça seu corpo em uma forma de batalha monstruosa com poder físico ampliado",
                dicePool: "",
                level: 4,
                discipline: "protean"
            },
            {
                name: "Forma de Névoa",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "transforme-se em uma nuvem de névoa, perceptível mas intocável exceto por fogo e luz solar",
                dicePool: "",
                level: 5,
                discipline: "protean"
            },
            {
                name: "Um com a Terra",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "perceba através da terra ao redor enquanto estiver fundido ao solo",
                dicePool: "",
                level: 5,
                discipline: "protean"
            },
            {
                name: "O Coração das Trevas",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "fortitude", level: 2 }],
                summary:
                    "remova e esconda seu coração, tornando o empalamento muito mais difícil enquanto embota seu remorso",
                dicePool: "",
                level: 5,
                discipline: "protean"
            },
            {
                name: "O Coração Desimpedido",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "seu coração se solta e se move livremente no peito, tornando você extremamente difícil de empalar",
                dicePool: "",
                level: 5,
                discipline: "protean"
            },
            {
                name: "Rosto da Vítima",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "assuma a aparência física e a voz da última pessoa de quem se alimentou",
                dicePool: "",
                level: 5,
                discipline: "protean"
            },
            {
                name: "Enxame",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary:
                    "dissolva-se em um enxame de pequenas criaturas capaz de atacar vários alvos ao mesmo tempo",
                dicePool: "",
                level: 5,
                discipline: "protean"
            }
        ]
    },
    "blood sorcery": {
        clans: ["Tremere", "Banu Haqim"],
        summary: "Use magia e rituais relacionados ao sangue",
        logo: bloodSorceryLogo,
        powers: [
            {
                name: "Vitae Corrosiva",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "torne seu sangue corrosivo para substâncias mortas",
                dicePool: "",
                level: 1,
                discipline: "blood sorcery"
            },
            {
                name: "Um Gosto por Sangue",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "discernir traços de alguém ao provar uma gota de seu sangue",
                dicePool: "Determinação + Feitiçaria de Sangue",
                level: 1,
                discipline: "blood sorcery"
            },
            {
                name: "Forma do Sacramento Sanguíneo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "manipule sangue para exibir mensagens ou formas simples",
                dicePool: "Manipulação + Feitiçaria de Sangue",
                level: 1,
                discipline: "blood sorcery"
            },
            {
                name: "Feitiçaria Koldúnica",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "vincule-se a um elemento escolhido e sofra dano para estender seus sentidos por meio dele",
                dicePool: "",
                level: 1,
                discipline: "blood sorcery"
            },
            {
                name: "Extinguir Vitae",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "aumente a Fome de outro vampiro",
                dicePool: "Determinação + Feitiçaria de Sangue",
                level: 2,
                discipline: "blood sorcery"
            },
            {
                name: "Vasculhar Segredos",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "localize informações específicas em um texto",
                dicePool: "Inteligência + Feitiçaria de Sangue",
                level: 2,
                discipline: "blood sorcery"
            },

            {
                name: "Sangue Potente",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "aumente temporariamente sua Potência de Sangue",
                dicePool: "Determinação + Feitiçaria de Sangue",
                level: 3,
                discipline: "blood sorcery"
            },
            {
                name: "Toque do Escorpião",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "transforme seu sangue em veneno paralisante",
                dicePool: "Força + Feitiçaria de Sangue",
                level: 3,
                discipline: "blood sorcery"
            },
            {
                name: "Laço Transitivo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "seu sangue pode reter propriedades de laço de sangue mesmo armazenado em um objeto ou carniçal",
                dicePool: "Inteligência + Feitiçaria de Sangue",
                level: 3,
                discipline: "blood sorcery"
            },
            {
                name: "Ondulações do Coração",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "altere a ressonância do sangue ou plante uma compulsão no sangue que o próximo vampiro beber",
                dicePool: "",
                level: 3,
                discipline: "blood sorcery"
            },
            {
                name: "Roubo de Vitae",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "abra uma ferida em uma artéria principal de uma vítima mortal, fazendo o sangue jorrar até sua boca aberta",
                dicePool: "Raciocínio + Feitiçaria de Sangue",
                level: 4,
                discipline: "blood sorcery"
            },
            {
                name: "Égide de Sangue",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "forme uma barreira flutuante de vitae que absorve dano à distância",
                dicePool: "",
                level: 4,
                discipline: "blood sorcery"
            },
            {
                name: "Vitae Fulminante",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary: "carregue um frasco do seu Sangue para explodir em estilhaços cortantes quando quebrado",
                dicePool: "Vigor + Feitiçaria de Sangue",
                level: 4,
                discipline: "blood sorcery"
            },
            {
                name: "Marionete",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "manipule sangue derramado ou o sangue de uma vítima viva em ações físicas violentas",
                dicePool: "Manipulação + Feitiçaria de Sangue",
                level: 4,
                discipline: "blood sorcery"
            },
            {
                name: "Carícia de Baal",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "transmute seu Sangue em um veneno extremamente agressivo, letal para mortais e Membros",
                dicePool: "Força + Feitiçaria de Sangue",
                level: 5,
                discipline: "blood sorcery"
            },
            {
                name: "Caldeirão de Sangue",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "ferva o sangue de uma vítima em suas próprias veias, causando dano agravado por margem acima da rolagem de Autocontrole + Ocultismo dela",
                dicePool: "Determinação + Feitiçaria de Sangue",
                level: 5,
                discipline: "blood sorcery"
            },
            {
                name: "Recuperação de Vitae",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "recupere vitae de seus carniçais a qualquer distância, saciando a Fome enquanto os fere",
                dicePool: "",
                level: 5,
                discipline: "blood sorcery"
            }
        ]
    },
    oblivion: {
        clans: ["Lasombra", "Hecata"],
        summary: "Poderes de sombra e necromancia",
        logo: oblivionLogo,
        powers: [
            {
                name: "Manto Sombrio",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "manipule sombras para furtividade ou intimidação",
                dicePool: "",
                level: 1,
                discipline: "oblivion"
            },
            {
                name: "Visão do Oblívio",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "enxergue no escuro e veja fantasmas",
                dicePool: "",
                level: 1,
                discipline: "oblivion"
            },
            {
                name: "Cinzas às Cinzas",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "use sua vitae para desintegrar cadáveres não vampíricos",
                dicePool: "Vigor + Oblívio",
                level: 1,
                discipline: "oblivion"
            },
            {
                name: "Grilhão Vinculante",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "identifique objetos e locais conectados a fantasmas",
                dicePool: "",
                level: 1,
                discipline: "oblivion"
            },
            {
                name: "Conjurar Sombra",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "convoque uma sombra sobrenatural sob seu controle",
                dicePool: "",
                level: 2,
                discipline: "oblivion"
            },
            {
                name: "Onde o Sudário Afina",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "encontre lugares onde fantasmas podem cruzar entre mundos",
                dicePool: "Inteligência + Oblívio",
                level: 2,
                discipline: "oblivion"
            },
            {
                name: "Braços de Ahriman",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "potence", level: 2 }],
                summary:
                    "conjura apêndices sombrios que o usuário controla, mas o impede de fazer qualquer outra coisa",
                dicePool: "Raciocínio + Oblívio",
                level: 2,
                discipline: "oblivion"
            },
            {
                name: "Previsão Fatal",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "auspex", level: 2 }],
                summary: "preveja a provável morte de um mortal e explore esse presságio",
                dicePool: "Determinação + Oblívio",
                level: 2,
                discipline: "oblivion"
            },
            {
                name: "Aura de Decomposição",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "decomponha tudo ao redor",
                dicePool: "Vigor + Oblívio",
                level: 3,
                discipline: "oblivion"
            },
            {
                name: "Perspectiva Sombria",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "projete seus sentidos através das sombras",
                dicePool: "",
                level: 3,
                discipline: "oblivion"
            },
            {
                name: "Servo Sombrio",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "separe e anime sua sombra como um servo independente",
                dicePool: "",
                level: 3,
                discipline: "oblivion"
            },
            {
                name: "Toque do Oblívio",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "decomponha um corpo vivo ou não-vivo",
                dicePool: "",
                level: 3,
                discipline: "oblivion"
            },
            {
                name: "Banquete de Paixão",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [{ discipline: "fortitude", level: 2 }],
                summary:
                    "alimente-se das paixões motrizes de uma aparição, reduzindo brevemente a Fome enquanto fere a vontade do espírito",
                dicePool: "Determinação + Oblívio",
                level: 3,
                discipline: "oblivion"
            },
            {
                name: "Praga Necrótica",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "infecte um mortal por toque com uma doença debilitante sobrenatural que pode se tornar contagiosa",
                dicePool: "Inteligência + Oblívio",
                level: 4,
                discipline: "oblivion"
            },
            {
                name: "Sudário Estígio",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "espalhe uma escuridão sobrenatural sufocante por uma área próxima",
                dicePool: "",
                level: 4,
                discipline: "oblivion"
            },
            {
                name: "Profanar o Santificado",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "apodreça símbolos sagrados ou sufoque brevemente a proteção sagrada de um crente verdadeiro",
                dicePool: "Determinação + Oblívio",
                level: 4,
                discipline: "oblivion"
            },
            {
                name: "Skuld Cumprido",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary:
                    "force ferimentos antigos, doenças ou idade a retornarem a uma vítima que havia escapado deles",
                dicePool: "Vigor + Oblívio",
                level: 5,
                discipline: "oblivion"
            },
            {
                name: "Passo das Sombras",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "entre em uma sombra e emerja de outra sombra à vista",
                dicePool: "",
                level: 5,
                discipline: "oblivion"
            },
            {
                name: "Avatar Tenebroso",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary: "torne-se uma sombra bidimensional ferida apenas por fogo e luz solar",
                dicePool: "",
                level: 5,
                discipline: "oblivion"
            },
            {
                name: "Espírito Definhante",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary:
                    "canalize entropia no espírito de uma vítima, causando dano agravado à Força de Vontade e arriscando a destruição de sua alma",
                dicePool: "Determinação + Oblívio",
                level: 5,
                discipline: "oblivion"
            },
            {
                name: "A Escuridão Interior",
                description: "",
                rouseChecks: 2,
                amalgamPrerequisites: [],
                summary:
                    "extraia o eu sombrio violento de uma vítima como um duplo hostil empenhado em destruí-la",
                dicePool: "Manipulação + Oblívio",
                level: 5,
                discipline: "oblivion"
            }
        ]
    },
    "thin-blood alchemy": {
        clans: [],
        summary: "Crie poções e tinturas com sangue e outros ingredientes",
        logo: alchemyLogo,
        powers: [
            {
                name: "Alcance Distante",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "use sua mente para agarrar, segurar e empurrar objetos ou pessoas sem tocá-los",
                dicePool: "Determinação + Alchemy",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Bruma",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "crie um campo de névoa que segue você, tornando-o mais difícil de alvejar com armas à distância",
                dicePool: "",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Língua Mercurial",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "fale o idioma nativo do mortal cujo sangue abasteceu a fórmula",
                dicePool: "",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Conectar",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "gere uma corrente elétrica baixa para alimentar pequenos dispositivos por toque",
                dicePool: "Determinação + Alchemy",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Hieros Gamos Profano",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary: "mude seu gênero permanentemente por transformação alquímica",
                dicePool: "",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Sombra Portátil",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "prepare uma proteção solar que adia dano de luz do dia por várias horas",
                dicePool: "Vigor + Alchemy",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Pintura Corporal",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "crie tinta sobrenatural de tatuagem capaz de marcar a pele permanentemente ou se remodelar",
                dicePool: "Destreza + Ofícios / Vigor + Determinação",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Hora do Check-out",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "coloque um vampiro em torpor cadavérico até uma hora final escrita, protegendo-o de acidentes com luz do dia",
                dicePool: "",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Elevar",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "prepare uma droga eufórica de festa que aguça Destreza e intensifica sensações",
                dicePool: "Vigor + Alchemy",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Marca de Alimento",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "marque um recipiente para reconhecer a próxima pessoa que beber dele",
                dicePool: "",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Falar do Coração",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "oculte uma mensagem curta, imagem ou emoção no sangue de um portador para o próximo bebedor",
                dicePool: "",
                level: 1,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Envolver",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "crie uma névoa que gruda na vítima, cegando-a e causando sufocamento em mortais",
                dicePool: "Raciocínio + Alchemy",
                level: 2,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Lista de Amigos",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "veja fios prateados conectando mortais aos Membros aos quais estão ligados",
                dicePool: "Inteligência + Alchemy",
                level: 2,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Torpor Avançado",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "induza torpor que melhora chances de cura e pode preservar a Fome de sangue-ralos",
                dicePool: "",
                level: 2,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Surpresa de Luz Negra",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "faça luz ultravioleta queimar vampiros como luz solar fraca e provocar frenesi de terror",
                dicePool: "",
                level: 2,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Estado Azul",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "faça um alvo se fixar na próxima traição ou quebra de Convicção cometida por um aliado",
                dicePool: "",
                level: 2,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Defracionar",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "crie um elixir que devolve frescor a sangue fracionado de suprimento médico",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Concoctar Ashe",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "destile as cinzas de um vampiro destruído em Ashe, uma droga perigosa que carrega traço de poder vampírico",
                dicePool: "Inteligência + Thin-Alquimia de Sangue",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Mandagloire",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "emita gás nocivo que paralisa mortais e causa cãibras em criaturas sobrenaturais",
                dicePool: "Vigor + Alchemy",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Rumor",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "faça um alvo acreditar que concordou livremente com uma declaração",
                dicePool: "Manipulação + Alchemy",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Tanque",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "reduza o primeiro dano que sofrer em uma cena",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Flashback Quimicamente Induzido",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "modifique Ashe com uma posse de vampiro para reviver uma memória do vampiro destruído",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Queimadura Solar Sob Demanda",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "armazene uma única carga de luz solar em seu corpo para queimar você e um alvo",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Sangrar Até o Fim",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "transforme o sangue de uma vítima mortal em uma refeição macabra compartilhada por uma coterie de sangue-ralos",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Saraimu",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "crie um familiar de limo senciente e breve a partir da vitae de três vampiros",
                dicePool: "Determinação + Alchemy",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Pele de Diamante",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "endureça a pele para transformar parte do dano agravado por corte, perfuração ou impacto em superficial",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Pele de Fogo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "superaqueça seu corpo, ignore fogo por uma cena e adicione dano de fogo a ataques por toque",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Correntes Hospitalares",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "impeça um alvo ferido de curar dano físico por vários dias",
                dicePool: "Distillation vs Vigor",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Pureza Marciana",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "queime uma infecção transmitida pelo sangue através da pele do portador em uma explosão dolorosa",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Sem Máscara",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "crie um gás que remove Rubor de Vida de vampiros verdadeiros atingidos pela explosão",
                dicePool: "Distillation vs Vigor + Determinação",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Cuidado Carinhoso",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "trate sangue animal para que vampiros possam se alimentar dele como se fosse sangue humano",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Provocar os Piedosos",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "cubra uma pessoa, objeto ou lugar com uma pasta que perturba religiosos e atormenta fiéis",
                dicePool: "",
                level: 3,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Impulso Aéreo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "eleve-se do chão, alcançando voo rápido ou flutuação",
                dicePool: "Força + Alchemy",
                level: 4,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Curto-Circuito",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "sobrecarregue silenciosamente eletrônicos ou sistemas elétricos por toque",
                dicePool: "",
                level: 4,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Personalidade Tóxica",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary: "secrete bile cáustica que corrói materiais e fortalece ataques por toque",
                dicePool: "Força or Destreza + Alchemy",
                level: 4,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Canalização de Disciplina",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "modifique Ashe para canalizar temporariamente um ou dois poderes de Disciplina do vampiro destruído",
                dicePool: "",
                level: 4,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Imitador",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "desfoque seu rosto e cabelo para se aproximar da aparência de um doador de sangue como disfarce breve",
                dicePool: "Inteligência + Percepção",
                level: 4,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Condutor Meio-Vivo",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "ignore dano elétrico e redirecione eletricidade como ataque alquímico à distância",
                dicePool: "Vigor + Alchemy / Destreza + Alchemy",
                level: 4,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Estado Vermelho",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "apague da memória de um alvo a próxima traição ou ação nociva de um aliado confiável",
                dicePool: "",
                level: 4,
                discipline: "thin-blood alchemy"
            },
            {
                name: "MSG de Vitae",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "torne o sangue de um recipiente irresistivelmente apetitoso, pressionando vampiros próximos a se alimentar",
                dicePool: "",
                level: 4,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Amaranto Florescente",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "compartilhe diablerie entre sangue-ralos para ganhar o primeiro ponto da Disciplina de clã da vítima",
                dicePool: "Determinação + Alchemy",
                level: 5,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Momento de Clareza",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "aguce temporariamente o foco mental, resista a Disciplinas mentais e evite interferência bestial",
                dicePool: "",
                level: 5,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Despertar o Adormecido",
                description: "",
                rouseChecks: 0,
                amalgamPrerequisites: [],
                summary:
                    "crie um elixir que, adicionado a sangue humano, pode despertar um vampiro do torpor",
                dicePool: "",
                level: 5,
                discipline: "thin-blood alchemy"
            },
            {
                name: "Fluxo de Saturno",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "quebre um Laço de Sangue em um dia por meio de uma purga dolorosa e politicamente perigosa",
                dicePool: "",
                level: 5,
                discipline: "thin-blood alchemy"
            },
            {
                name: "A Bomba",
                description: "",
                rouseChecks: 1,
                amalgamPrerequisites: [],
                summary:
                    "transforme um recipiente mortal em uma explosão retardada de vísceras e dano agravado",
                dicePool: "",
                level: 5,
                discipline: "thin-blood alchemy"
            }
        ]
    },
    "": {
        clans: [],
        summary: "",
        logo: "",
        powers: []
    }
}

// Sangue Imemorial acrescenta os níveis 6–10 e os Legados do Sangue ao
// catálogo. O acesso continua limitado pela Geração: ver
// maxDisciplineByGeneration em Generations.ts. Sem essa trava, um neófito de
// 13ª geração enxergaria poderes de nível 10.
for (const power of [...transcendentPowers, ...transcendentAmalgams, ...sangueEsquecidoPowers]) {
    disciplines[power.discipline]?.powers.push(power)
}

/**
 * Nível atual de uma Disciplina: quantidade de poderes dela na ficha.
 * Poderes comprados como segundo poder do mesmo nível não contam.
 */
export const getDisciplineLevel = (character: Character, disciplineName: DisciplineName): number =>
    character.disciplines.filter((p) => p.discipline === disciplineName && !p.isExtraPower).length

/**
 * Poderes que o personagem pode comprar agora nesta Disciplina.
 *
 * Duas travas: o próximo nível (não se pula degrau) e o teto da Geração
 * (Sangue Imemorial, Capítulo I). A segunda é o que impede um neófito de
 * 13ª geração de acessar os poderes 6–10.
 */
export const getAvailablePowersForCharacter = (
    character: Character,
    disciplineName: DisciplineName
): Power[] => {
    const discipline = disciplines[disciplineName]
    if (!discipline) return []

    const currentLevel = getDisciplineLevel(character, disciplineName)
    const generationCap = maxDisciplineByGeneration(character.generation)
    const maxLevel = Math.min(currentLevel === 0 ? 1 : currentLevel + 1, generationCap)
    const ownedNames = new Set(character.disciplines.map((p) => p.name))

    return discipline.powers.filter((power) => {
        const matchesClan = !power.availableForClans?.length || power.availableForClans.includes(character.clan)
        const ownsRequiredPowers = power.requiredPowerNames?.every((name) => ownedNames.has(name)) ?? true
        const meetsHumanityRequirement = (power.minimumHumanity ?? 0) <= character.humanity
        const matchesAlternativeRequirements = power.amalgamPrerequisiteOptions?.every((options) =>
            options.some((prerequisite) =>
                character.disciplines.filter((candidate) => candidate.discipline === prerequisite.discipline).length >= prerequisite.level
            )
        ) ?? true

        return !ownedNames.has(power.name) && power.level <= maxLevel && matchesClan && ownsRequiredPowers && meetsHumanityRequirement && matchesAlternativeRequirements
    })
}

export const powerIsRitual = (p: Power | Ritual): p is Ritual => {
    return (p as Ritual)["ingredients"] !== undefined
}

export const getAvailableDisciplines = (
    character: Character
): Record<DisciplineName, Discipline> => {
    const availableDisciplines: Record<string, Discipline> = {}
    for (const n of character.availableDisciplineNames) {
        if (disciplines[n]) {
            availableDisciplines[n] = disciplines[n]
        } else if (character.customDisciplines?.[n]) {
            const customDiscipline = character.customDisciplines[n]
            availableDisciplines[n] = {
                clans: [],
                summary: customDiscipline.summary,
                powers: character.disciplines.filter((p) => p.discipline === n && p.isCustom),
                logo: sanitizeCustomDisciplineLogoUrl(customDiscipline.logo),
                isCustom: true
            }
        }
    }

    return availableDisciplines
}
