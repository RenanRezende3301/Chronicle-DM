import { z } from "zod"
import { specialtySchema } from "./Specialties"
import { disciplineNameSchema, PredatorTypeName } from "./NameSchemas"
import { meritFlawSchema } from "./Character"

const selectableMeritsAndFlawsSchema = z.object({
    options: meritFlawSchema.extend({ maxLevel: z.number().int() }).omit({ level: true }).array(),
    totalPoints: z.number().int(),
    exclusive: z.boolean().optional()
})
export type SelectableMeritsAndFlaws = z.infer<typeof selectableMeritsAndFlawsSchema>

export const predatorTypeSchema = z.object({
    name: z.string(),
    summary: z.string(),
    specialtyOptions: specialtySchema.extend({ customInput: z.string().optional() }).array(),
    disciplineOptions: z.object({ name: disciplineNameSchema }).array(),
    meritsAndFlaws: meritFlawSchema.array(),
    selectableMeritsAndFlaws: selectableMeritsAndFlawsSchema.array(),
    humanityChange: z.number().int(),
    bloodPotencyChange: z.number().int()
})
export type PredatorType = z.infer<typeof predatorTypeSchema>

// TODO: consider referencing merits&flaws from the list instead of duplicating their definitions here
export const PredatorTypes: Record<PredatorTypeName, PredatorType> = {
    Alleycat: {
        name: "Gato de Beco",
        summary: "Embosca presas em becos",
        specialtyOptions: [
            {
                skill: "intimidation",
                name: "Assaltos"
            },
            {
                skill: "brawl",
                name: "Agarrar"
            }
        ],
        disciplineOptions: [{ name: "celerity" }, { name: "potence" }],
        meritsAndFlaws: [
            { name: "Contatos Criminais", level: 3, summary: "", excludes: [], type: "merit" }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: -1,
        bloodPotencyChange: 0
    },
    Extortionist: {
        name: "Extorsionista",
        summary: "Força a presa a dar seu sangue",
        specialtyOptions: [
            {
                skill: "intimidation",
                name: "Coerção"
            },
            {
                skill: "larceny",
                name: "Segurança"
            }
        ],
        disciplineOptions: [{ name: "dominate" }, { name: "potence" }],
        meritsAndFlaws: [],
        selectableMeritsAndFlaws: [
            {
                options: [
                    {
                        name: "Contatos",
                        summary: "mortais que fornecem informações ou itens valiosos",
                        maxLevel: 3,
                        excludes: [],
                        type: "merit"
                    },
                    {
                        name: "Recursos",
                        summary: "riqueza e renda",
                        maxLevel: 3,
                        excludes: ["Miserável"],
                        type: "merit"
                    }
                ],
                totalPoints: 3
            },
            {
                options: [
                    { name: "Inimigo", summary: "Polícia", maxLevel: 2, excludes: [], type: "flaw" },
                    { name: "Inimigo", summary: "Vítima", maxLevel: 2, excludes: [], type: "flaw" }
                ],
                totalPoints: 2,
                exclusive: true
            }
        ],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    "Roadside Killer": {
        name: "Assassino de Estrada",
        summary: "Caça presas em estradas desoladas",
        specialtyOptions: [
            {
                skill: "survival",
                name: "A Estrada"
            },
            {
                skill: "investigation",
                name: "Gíria Vampírica"
            }
        ],
        disciplineOptions: [{ name: "fortitude" }, { name: "protean" }],
        meritsAndFlaws: [
            {
                name: "Rebanho",
                level: 2,
                summary: "Rebanho migratório, sempre na estrada",
                excludes: [],
                type: "merit"
            },
            {
                name: "Exclusão de Presa",
                level: 1,
                summary: "Não pode se alimentar de moradores locais",
                excludes: [],
                type: "flaw"
            }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    Montero: {
        name: "Montero",
        summary: "Usa carniçais para direcionar a presa à sua armadilha para o abate",
        specialtyOptions: [
            {
                skill: "leadership",
                name: "Alcatéia de Caça"
            },
            {
                skill: "stealth",
                name: "Campana"
            }
        ],
        disciplineOptions: [{ name: "dominate" }, { name: "obfuscate" }],
        meritsAndFlaws: [
            {
                name: "Lacaios",
                level: 2,
                summary: "Mortais que te ajudam a caçar",
                excludes: [],
                type: "merit"
            }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: -1,
        bloodPotencyChange: 0
    },
    Cleaver: {
        name: "Sanguessuga Familiar",
        summary: "Alimenta-se de amigos e familiares",
        specialtyOptions: [
            {
                skill: "persuasion",
                name: "Gaslighting"
            },
            {
                skill: "subterfuge",
                name: "Acobertamentos"
            }
        ],
        disciplineOptions: [{ name: "dominate" }, { name: "animalism" }],
        meritsAndFlaws: [
            {
                name: "Rebanho",
                level: 2,
                summary: "Grupo de mortais que deixam você se alimentar",
                excludes: [],
                type: "merit"
            },
            { name: "Segredo Sombrio", level: 1, summary: "Sanguessuga Familiar", excludes: [], type: "flaw" }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    Consensualist: {
        name: "Consensualista",
        summary: "Leva o sangue apenas dos dispostos",
        specialtyOptions: [
            {
                skill: "medicine",
                name: "Flebotomia"
            },
            {
                skill: "persuasion",
                name: "Recipientes"
            }
        ],
        disciplineOptions: [{ name: "auspex" }, { name: "fortitude" }],
        meritsAndFlaws: [
            { name: "Violador da Máscara", level: 1, summary: "", excludes: [], type: "flaw" },
            {
                name: "Exclusão de Presa",
                level: 1,
                summary: "Não pode se alimentar de não-consensuais",
                excludes: [],
                type: "flaw"
            }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: 1,
        bloodPotencyChange: 0
    },
    Osiris: {
        name: "Osíris",
        summary: "Alimenta-se de seus seguidores",
        specialtyOptions: [
            {
                skill: "occult",
                name: "Tradição",
                customInput: "Qual tradição?"
            },
            {
                skill: "performance",
                name: "Personalizado",
                customInput: "Qual especialidade?"
            }
        ],
        disciplineOptions: [{ name: "blood sorcery" }, { name: "presence" }],
        meritsAndFlaws: [],
        selectableMeritsAndFlaws: [
            {
                options: [
                    { name: "Fama", summary: "", maxLevel: 3, excludes: [], type: "merit" },
                    {
                        name: "Rebanho",
                        summary: "grupo de mortais que deixam você se alimentar",
                        maxLevel: 3,
                        excludes: [],
                        type: "merit"
                    }
                ],
                totalPoints: 3
            },
            {
                options: [
                    {
                        name: "Inimigos",
                        summary: "grupo de mortais que desejam te ferir",
                        maxLevel: 2,
                        excludes: [],
                        type: "flaw"
                    },
                    {
                        name: "Perdição Folclórica",
                        summary: "itens específicos te ferem (ex: prata, alho)",
                        maxLevel: 1,
                        excludes: [],
                        type: "flaw"
                    },
                    {
                        name: "Bloqueio Folclórico",
                        summary:
                            "precisa gastar força de vontade para ignorar um bloqueio (ex: água corrente, porta sem convite)",
                        maxLevel: 1,
                        excludes: [],
                        type: "flaw"
                    },
                    {
                        name: "Estigmas",
                        summary: "sangra pelas mãos, pés e testa quando a Fome é 4",
                        maxLevel: 1,
                        excludes: [],
                        type: "flaw"
                    },
                    {
                        name: "Isca de Estaca",
                        summary: "Morte Final quando empalado",
                        maxLevel: 2,
                        excludes: [],
                        type: "flaw"
                    }
                ],
                totalPoints: 2
            }
        ],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    "Scene Queen": {
        name: "Rainha da Cena",
        summary: "Alimenta-se em sua cena / subcultura",
        specialtyOptions: [
            {
                skill: "etiquette",
                name: "Cena",
                customInput: "Qual cena?"
            },
            {
                skill: "leadership",
                name: "Cena",
                customInput: "Qual cena?"
            },
            {
                skill: "streetwise",
                name: "Cena",
                customInput: "Qual cena?"
            }
        ],
        disciplineOptions: [{ name: "dominate" }, { name: "potence" }],
        meritsAndFlaws: [
            {
                name: "Fama",
                level: 1,
                summary: "uma subcultura específica te adora",
                excludes: [],
                type: "merit"
            },
            { name: "Contato", level: 1, summary: "", excludes: [], type: "merit" }
        ],
        selectableMeritsAndFlaws: [
            {
                options: [
                    {
                        name: "Impopular",
                        summary: "Uma subcultura não gosta de você",
                        maxLevel: 1,
                        excludes: [],
                        type: "flaw"
                    },
                    {
                        name: "Exclusão de Presa (outra cena)",
                        summary: "Não pode se alimentar da presa excluída",
                        maxLevel: 1,
                        excludes: [],
                        type: "flaw"
                    }
                ],
                totalPoints: 1
            }
        ],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    Siren: {
        name: "Sereia",
        summary: "Seduz a presa e pega seu sangue",
        specialtyOptions: [
            {
                skill: "persuasion",
                name: "Sedução"
            },
            {
                skill: "subterfuge",
                name: "Sedução"
            }
        ],
        disciplineOptions: [{ name: "fortitude" }, { name: "presence" }],
        meritsAndFlaws: [
            {
                name: "Belo(a)",
                level: 2,
                summary: "+1 dado em rolagens Sociais",
                excludes: ["Deslumbrante", "Feio(a)", "Repulsivo(a)"],
                type: "merit"
            },
            {
                name: "Inimigo",
                level: 1,
                summary: "(amante rejeitado ou parceiro ciumento)",
                excludes: [],
                type: "flaw"
            }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    Sandman: {
        name: "João Pestana",
        summary: "Invade casas e alimenta-se de presas adormecidas",
        specialtyOptions: [
            {
                skill: "medicine",
                name: "Anestésicos"
            },
            {
                skill: "stealth",
                name: "Arrombamento"
            }
        ],
        disciplineOptions: [{ name: "auspex" }, { name: "obfuscate" }],
        meritsAndFlaws: [{ name: "Recursos", level: 1, summary: "", excludes: [], type: "merit" }],
        selectableMeritsAndFlaws: [],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    Graverobber: {
        name: "Ladrão de Sepulturas",
        summary: "Alimenta-se de cadáveres frescos e famílias em luto",
        specialtyOptions: [
            {
                skill: "occult",
                name: "Rituais de túmulo"
            },
            {
                skill: "medicine",
                name: "Cadáveres"
            }
        ],
        disciplineOptions: [{ name: "fortitude" }, { name: "oblivion" }],
        meritsAndFlaws: [
            {
                name: "Estômago de Ferro",
                level: 3,
                summary: "capaz de se alimentar de sangue rançoso",
                excludes: [],
                type: "merit"
            },
            { name: "Refúgio", level: 1, summary: "", excludes: ["Sem Refúgio"], type: "merit" },
            {
                name: "Predador Óbvio",
                level: 2,
                summary: "mortais têm medo de você, não pode manter Rebanho",
                excludes: [],
                type: "flaw"
            }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    "Grim Reaper": {
        name: "Ceifador",
        summary: "Alimenta-se exclusivamente dos moribundos",
        specialtyOptions: [
            {
                skill: "awareness",
                name: "Morte"
            },
            {
                skill: "larceny",
                name: "Falsificação"
            }
        ],
        disciplineOptions: [{ name: "auspex" }, { name: "oblivion" }],
        meritsAndFlaws: [
            { name: "Aliados", level: 1, summary: "comunidade médica", excludes: [], type: "merit" },
            {
                name: "Exclusão de Presa",
                level: 1,
                summary: "Não pode se alimentar de pessoas saudáveis",
                excludes: [],
                type: "flaw"
            }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: 1,
        bloodPotencyChange: 0
    },
    Pursuer: {
        name: "Rastreador",
        summary: "Persegue a presa por muito tempo antes de matá-la",
        specialtyOptions: [
            {
                skill: "investigation",
                name: "Perfilamento"
            },
            {
                skill: "stealth",
                name: "Seguir oculto"
            }
        ],
        disciplineOptions: [{ name: "animalism" }, { name: "auspex" }],
        meritsAndFlaws: [
            {
                name: "Cão Farejador",
                level: 1,
                summary: "capaz de cheirar a ressonância no sangue mortal",
                excludes: [],
                type: "merit"
            },
            {
                name: "Contatos",
                level: 1,
                summary: "Pessoa sem ética nos seus locais de caça",
                excludes: [],
                type: "merit"
            }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: -1,
        bloodPotencyChange: 0
    },
    Trapdoor: {
        name: "Alçapão",
        summary: "Constrói uma armadilha em seu refúgio e atrai presas para dentro",
        specialtyOptions: [
            {
                skill: "persuasion",
                name: "Marketing"
            },
            {
                skill: "stealth",
                name: "Emboscadas e armadilhas"
            }
        ],
        disciplineOptions: [{ name: "protean" }, { name: "obfuscate" }],
        meritsAndFlaws: [
            {
                name: "Refúgio",
                level: 1,
                summary: "Apartamento Seguro",
                excludes: ["Sem Refúgio"],
                type: "merit"
            }
        ],
        selectableMeritsAndFlaws: [
            {
                options: [
                    {
                        name: "Lacaio",
                        summary: "Servo mortal fraco",
                        maxLevel: 1,
                        excludes: [],
                        type: "merit"
                    },
                    {
                        name: "Rebanho",
                        summary: "grupo de mortais que deixam você se alimentar",
                        maxLevel: 1,
                        excludes: [],
                        type: "merit"
                    },
                    {
                        name: "Refúgio",
                        summary: "Um apartamento seguro",
                        maxLevel: 1,
                        excludes: ["Sem Refúgio"],
                        type: "merit"
                    }
                ],
                totalPoints: 1
            },
            {
                options: [
                    {
                        name: "Sinistro",
                        summary: "As pessoas têm receio de sua casa",
                        maxLevel: 1,
                        excludes: ["Sem Refúgio"],
                        type: "flaw"
                    },
                    {
                        name: "Assombrado",
                        summary: "Presença fantasmagórica no seu refúgio",
                        maxLevel: 1,
                        excludes: ["Sem Refúgio"],
                        type: "flaw"
                    }
                ],
                totalPoints: 1
            }
        ],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    Bagger: {
        name: "Ensacador",
        summary: "Alimenta-se de bolsas de sangue",
        specialtyOptions: [
            {
                skill: "larceny",
                name: "Arrombar fechaduras"
            },
            {
                skill: "streetwise",
                name: "Mercado negro"
            }
        ],
        disciplineOptions: [{ name: "obfuscate" }, { name: "oblivion" }, { name: "blood sorcery" }],
        meritsAndFlaws: [
            {
                name: "Estômago de Ferro",
                level: 3,
                summary: "capaz de se alimentar de sangue rançoso",
                excludes: [],
                type: "merit"
            },
            {
                name: "Inimigo",
                level: 2,
                summary: "Alguém acredita que você deve a ele",
                excludes: [],
                type: "flaw"
            }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: 0,
        bloodPotencyChange: 0
    },
    "Blood Leech": {
        name: "Sanguessuga",
        summary: "Alimenta-se de outros vampiros",
        specialtyOptions: [
            {
                skill: "brawl",
                name: "Membros"
            },
            {
                skill: "stealth",
                name: "Contra Membros"
            }
        ],
        disciplineOptions: [{ name: "celerity" }, { name: "protean" }],
        meritsAndFlaws: [
            {
                name: "Exclusão de Presa",
                level: 2,
                summary: "Não pode se alimentar de mortais",
                excludes: [],
                type: "flaw"
            }
        ],
        selectableMeritsAndFlaws: [
            {
                options: [
                    {
                        name: "Diabolista",
                        summary: "Alguém sabe que você bebe de Membros",
                        maxLevel: 2,
                        excludes: [],
                        type: "merit"
                    },
                    {
                        name: "Rejeitado",
                        summary: "Desprezado por uma facção",
                        maxLevel: 2,
                        excludes: [],
                        type: "flaw"
                    }
                ],
                totalPoints: 2,
                exclusive: true
            }
        ],
        humanityChange: -1,
        bloodPotencyChange: 1
    },
    Farmer: {
        name: "Fazendeiro",
        summary: "Alimenta-se de animais",
        specialtyOptions: [
            {
                skill: "animal ken",
                name: "Animal",
                customInput: "Qual animal?"
            },
            {
                skill: "survival",
                name: "Caça"
            }
        ],
        disciplineOptions: [{ name: "animalism" }, { name: "protean" }],
        meritsAndFlaws: [
            {
                name: "Fazendeiro",
                level: 2,
                summary: "alimentar-se de sangue não animal custa 2 de força de vontade",
                excludes: [],
                type: "flaw"
            }
        ],
        selectableMeritsAndFlaws: [],
        humanityChange: 1,
        bloodPotencyChange: 0
    },
    "": {
        name: "",
        summary: "",
        specialtyOptions: [],
        disciplineOptions: [],
        meritsAndFlaws: [],
        selectableMeritsAndFlaws: [],
        humanityChange: 0,
        bloodPotencyChange: 0
    }
}
