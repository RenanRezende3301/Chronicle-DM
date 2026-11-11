import type { Character, MeritFlaw } from "./Character"
import { ClanName } from "./NameSchemas"
import type {
    Loresheet,
    LoresheetMeritBonuses,
    MeritOrFlaw,
    MeritsAndFlaws
} from "./MeritsAndFlaws"

export const thinbloodMeritsAndFlaws: MeritsAndFlaws = {
    title: "◐ Específico Sangue-Ralo",
    merits: [
        {
            name: "Camaradas Anarquistas",
            cost: [1],
            summary: "Uma coterie de Anarquistas considera você seu protegido de estimação",
            excludes: []
        },
        {
            name: "Contato na Camarilla",
            cost: [1],
            summary:
                "Um recrutador da Camarilla promete sua admissão, mas trata você mal e exige tarefas",
            excludes: []
        },
        {
            name: "Sangue Catenante",
            cost: [1],
            summary: "Você pode criar laços de sangue e Abraçar novos vampiros",
            excludes: []
        },
        {
            name: "Bebedor Diurno",
            cost: [1],
            summary:
                "Andar sob o sol não causa dano, mas remove suas habilidades vampíricas e reduz sua Vitalidade pela metade",
            excludes: []
        },
        {
            name: "Afinidade com Disciplina",
            cost: [1],
            summary: "Escolha uma Disciplina (nível 1) que você pode aumentar como um vampiro normal",
            excludes: []
        },
        {
            name: "Verossímil",
            cost: [1],
            summary: "Seu corpo parece plenamente humano, com coração batendo e estômago funcional",
            excludes: []
        },
        {
            name: "Alquimista Sangue-Ralo",
            cost: [1],
            summary: "Ganhe um ponto e uma fórmula em Alquimia Sangue-Ralo",
            excludes: []
        },
        {
            name: "Resiliência Vampírica",
            cost: [1],
            summary: "Sofra apenas dano superficial da maioria das fontes, como um vampiro normal",
            excludes: []
        },
        {
            name: "Memórias dos Caídos",
            cost: [2],
            summary: "Visões de Ashe tornam algumas rolagens de Alquimia de Sangue criticamente mais fortes",
            excludes: [],
            complexity: "advanced"
        }
    ],
    flaws: [
        {
            name: "Dentes de Leite",
            cost: [1],
            summary: "Seus dentes são inúteis para alimentação; você precisa cortar suas vítimas",
            excludes: []
        },
        {
            name: "Temperamento Bestial",
            cost: [1],
            summary: "Você é vulnerável ao frenesi como um vampiro normal",
            excludes: []
        },
        {
            name: "Marcado pela Camarilla",
            cost: [1],
            summary: "A Camarilla mantém os olhos em você",
            excludes: []
        },
        { name: "Rejeitado pelos Anarquistas", cost: [1], summary: "Anarquistas rejeitam você", excludes: [] },
        { name: "Maldição do Clã", cost: [1], summary: "Escolha uma Maldição de Clã (gravidade 1)", excludes: [] },
        {
            name: "Carne Morta",
            cost: [1],
            summary: "Sua carne apodrece lentamente; -1 em testes Sociais com mortais",
            excludes: []
        },
        {
            name: "Fragilidade Mortal",
            cost: [1],
            summary: "Você não pode despertar o sangue para curar a si mesmo",
            excludes: []
        },
        {
            name: "Dependência de Vitae",
            cost: [1],
            summary: "Você precisa beber vitae de vampiro uma vez por semana para usar Disciplinas",
            excludes: []
        },
        {
            name: "Vício em Ashe",
            cost: [2],
            summary: "Falhas em alquimia relacionada a Ashe deixam você distraído pela sessão",
            excludes: [],
            complexity: "advanced"
        }
    ]
}
export const essentialMeritsAndFlaws: MeritsAndFlaws[] = [
    {
        title: "💄 Aparência",
        merits: [
            {
                name: "Belo(a)",
                cost: [2],
                summary: "+1 dado em testes Sociais",
                excludes: ["Deslumbrante", "Feio(a)", "Repulsivo(a)"]
            },
            {
                name: "Deslumbrante",
                cost: [4],
                summary: "+2 dados em testes Sociais",
                excludes: ["Belo(a)", "Feio(a)", "Repulsivo(a)"]
            }
        ],
        flaws: [
            {
                name: "Feio(a)",
                cost: [1],
                summary: "-1 dado em testes Sociais",
                excludes: ["Belo(a)", "Deslumbrante", "Repulsivo(a)"]
            },
            {
                name: "Repulsivo(a)",
                cost: [2],
                summary: "-2 dados em testes Sociais",
                excludes: ["Belo(a)", "Deslumbrante", "Feio(a)"]
            }
        ]
    },
    {
        title: "🏠 Refúgio",
        merits: [
            {
                name: "Refúgio",
                cost: [1, 2, 3],
                summary: "base segura, 1 - apartamento, 3 - prédio grande",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Arsenal Oculto",
                cost: [1],
                summary: "armas e armaduras no seu refúgio",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Cela",
                cost: [1],
                summary: "você pode aprisionar pessoas no seu refúgio",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Vigias",
                cost: [1],
                summary: "guardas de segurança mortais",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Luxo",
                cost: [1],
                summary: "+2 Dados em testes Sociais no seu refúgio",
                excludes: ["Sem Refúgio"]
            }
        ],
        flaws: [
            {
                name: "Sem Refúgio",
                cost: [1],
                summary: "você não tem um lar",
                excludes: [
                    "Refúgio",
                    "Arsenal Oculto",
                    "Cela",
                    "Vigias",
                    "Luxo",
                    "Assombrado",
                    "Sinistro"
                ]
            },
            {
                name: "Assombrado",
                cost: [1],
                summary: "presença fantasmagórica no seu refúgio",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Sinistro",
                cost: [1],
                summary:
                    "seu refúgio parece o covil de um assassino em série; vizinhos podem denunciar à polícia",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Comprometido",
                cost: [2],
                summary: "seu refúgio está em uma lista de vigilância",
                excludes: ["Sem Refúgio"]
            }
        ]
    },
    {
        title: "💰 Recursos",
        merits: [
            {
                name: "Recursos",
                cost: [1, 2, 3, 4, 5],
                summary:
                    "riqueza e renda; 1 - você consegue pagar o básico, 5 - consegue pagar qualquer coisa que dinheiro compre",
                excludes: ["Miserável"]
            },
            {
                name: "Confira o Porta-malas",
                cost: [1],
                summary:
                    "Tenha acesso fácil a um arsenal ou ferramentas; nenhum item pode valer mais que Recursos 2",
                excludes: []
            }
        ],
        flaws: [
            { name: "Miserável", cost: [1], summary: "pobre e sem renda", excludes: ["Recursos"] }
        ]
    },
    {
        title: "🩸 Alimentação",
        merits: [
            {
                name: "Cão Farejador",
                cost: [1],
                summary: "sinta o cheiro da ressonância no sangue mortal",
                excludes: []
            },
            {
                name: "Viciado Funcional",
                cost: [1],
                summary:
                    "adicione um dado a uma categoria de parada (escolhida uma vez) quando a última pessoa de quem você se alimentou estava sob efeito da sua droga",
                excludes: []
            },
            {
                name: "Estômago de Ferro",
                cost: [3],
                summary: "capaz de se alimentar de sangue rançoso",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Exclusão de Presa",
                cost: [1],
                summary: "não pode se alimentar de certos tipos de pessoas",
                excludes: []
            },
            {
                name: "Sede de Matusalém",
                cost: [1],
                summary: "não consegue se saciar completamente com sangue mortal",
                excludes: []
            },
            {
                name: "Fazendeiro",
                cost: [2],
                summary: "alimentar-se de sangue não animal custa 2 de Força de Vontade",
                excludes: ["Vegano"]
            },
            {
                name: "Organívoro",
                cost: [2],
                summary: "sua fome exige carne e órgãos humanos",
                excludes: []
            },
            {
                name: "Vício",
                cost: [1],
                summary: "-1 dado em todas as paradas se a última pessoa de quem você se alimentou não estava sob efeito da sua droga",
                excludes: ["Vício Irremediável"]
            },
            {
                name: "Vício Irremediável",
                cost: [2],
                summary: "-2 dados em todas as paradas se a última pessoa de quem você se alimentou não estava sob efeito da sua droga",
                excludes: ["Vício"]
            }
        ]
    },
    {
        title: "🕰 Acompanhando os tempos",
        merits: [],
        flaws: [
            {
                name: "Vivendo no Passado",
                cost: [1],
                summary: "você tem visões e convicções ultrapassadas",
                excludes: []
            },
            {
                name: "Arcaico",
                cost: [2],
                summary: "Não consegue usar computadores; Tecnologia fica travada em 0",
                excludes: []
            }
        ]
    },
    {
        title: "🌙 Mítico",
        merits: [{ name: "Comer Comida", cost: [2], summary: "pode consumir comida normal", excludes: [] }],
        flaws: [
            {
                name: "Perdição Folclórica",
                cost: [1],
                summary: "itens específicos ferem você (ex.: prata, alho)",
                excludes: []
            },
            {
                name: "Bloqueio Folclórico",
                cost: [1],
                summary:
                    "deve gastar Força de Vontade para atravessar um bloqueio específico (ex.: água corrente, porta sem convite)",
                excludes: []
            },
            {
                name: "Estigmas",
                cost: [1],
                summary: "sangra pelas mãos, pés e testa quando está com Fome 4",
                excludes: []
            },
            { name: "Isca de Estaca", cost: [2], summary: "Morte Final ao ser empalado", excludes: [] }
        ]
    },
    {
        title: "👺 Máscara",
        merits: [
            {
                name: "Máscara",
                cost: [1, 2],
                summary: "identidade falsa com documentos falsos; nível 2 passa em verificações de antecedentes",
                excludes: []
            },
            {
                name: "Apagado",
                cost: [1],
                summary: "todos os seus registros reais foram apagados; oficialmente, você não existe",
                excludes: []
            },
            {
                name: "Falsificador",
                cost: [1],
                summary: "Você pode criar ou conseguir máscaras para outras pessoas",
                excludes: []
            }
        ],
        flaws: [
            { name: "Cadáver Conhecido", cost: [1], summary: "outros sabem que você está morto", excludes: [] },
            {
                name: "Corpo-Branco Conhecido",
                cost: [2],
                summary: "Certos governos ou organizações sabem que você é um vampiro",
                excludes: []
            }
        ]
    },
    {
        title: "🗣 Linguística",
        merits: [
            {
                name: "Linguística",
                cost: [1],
                summary: "fala fluentemente outro idioma",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Analfabeto",
                cost: [2],
                summary: "Não consegue ler nem escrever; Erudição e Ciência ficam limitadas a 1",
                excludes: []
            }
        ]
    },
    {
        title: "🧛 Membros",
        merits: [
            {
                name: "Mawla",
                cost: [1, 2, 3, 4, 5],
                summary: "mentor Membro que aconselha ou ajuda você",
                excludes: []
            },
            {
                name: "Status",
                cost: [1, 2, 3, 4, 5],
                summary: "reputação positiva dentro de uma facção",
                excludes: []
            }
        ],
        flaws: [
            { name: "Adversário", cost: [1], summary: "inimigo Membro", excludes: [] },
            {
                name: "Suspeito",
                cost: [1],
                summary: "má reputação dentro de uma facção; -2 em testes Sociais com ela",
                excludes: []
            },
            { name: "Rejeitado", cost: [2], summary: "desprezado por uma facção", excludes: [] },
            {
                name: "Segredo Sombrio",
                cost: [1, 2],
                summary:
                    "Você tem um segredo sombrio, como dever algo a pessoas perigosas ou ter escapado de uma caçada de sangue por violar a Máscara em outra cidade",
                excludes: []
            }
        ]
    },
    {
        title: "⛓️ Laço de Sangue",
        merits: [],
        flaws: [
            {
                name: "Laço Longo",
                cost: [1],
                summary: "laços de sangue sobre você demoram mais para enfraquecer",
                excludes: ["Laço Curto", "Inlaçável"]
            },
            {
                name: "Viciado em Laço",
                cost: [1],
                summary: "perca um dado em todas as ações que contrariem seu laço de sangue",
                excludes: ["Inlaçável"]
            },
            {
                name: "Escravo de Laço",
                cost: [2],
                summary: "laços de sangue sobre você são criados no primeiro gole",
                excludes: ["Resistência ao Laço", "Inlaçável"]
            }
        ]
    },
    {
        title: "👱 Mortais",
        merits: [
            {
                name: "Lacaio",
                cost: [1, 2, 3],
                summary:
                    "servo mortal leal; 1 - marginal fraco, 3 - lacaio profissional competente",
                excludes: []
            },
            {
                name: "Aliados",
                cost: [1, 2, 3, 4, 5],
                summary: "grupo de mortais que aconselha ou ajuda você",
                excludes: []
            },
            {
                name: "Contatos",
                cost: [1, 2, 3],
                summary: "mortais que fornecem informações ou itens valiosos",
                excludes: []
            },
            {
                name: "Rebanho",
                cost: [1, 2, 3, 4, 5],
                summary:
                    "grupo de mortais que deixa você se alimentar; 1 - algumas pessoas, 5 - grupo grande em que você pode escolher livremente ressonâncias desejadas",
                excludes: []
            },
            {
                name: "Fama",
                cost: [1, 2, 3, 4, 5],
                summary:
                    "1 - uma subcultura específica ama você, 5 - você é conhecido e amado globalmente",
                excludes: []
            }
        ],
        flaws: [
            { name: "Perseguidores", cost: [1], summary: "seguidores mortais indesejados", excludes: [] },
            {
                name: "Inimigo",
                cost: [1, 2],
                summary: "grupo de mortais que quer ferir você",
                excludes: []
            },
            {
                name: "Predador Óbvio",
                cost: [2],
                summary: "mortais têm medo de você; não pode manter Rebanho",
                excludes: []
            },
            {
                name: "Infâmia",
                cost: [1, 2, 3, 4, 5],
                summary:
                    "1 - uma subcultura específica despreza você, 5 - você é conhecido e odiado globalmente",
                excludes: []
            }
        ]
    }
]

// Requirement function generators
const isClan = (clan: ClanName) => (character: Character) => character.clan === clan
const isNotClan = (clan: ClanName) => (character: Character) => character.clan !== clan
const hasDiscipline = (discipline: string) => (character: Character) =>
    character.availableDisciplineNames.includes(discipline) ||
    character.disciplines.some((power) => power.discipline === discipline)

const loreMerit = (
    name: string,
    cost: number,
    summary: string,
    bonuses?: LoresheetMeritBonuses
): MeritOrFlaw => ({
    name,
    cost: [cost],
    summary,
    excludes: [],
    ...(bonuses ? { bonuses } : {})
})

const bonusMerit = (name: string, level: number, text = "", summary = ""): MeritFlaw => ({
    name,
    level,
    summary,
    excludes: [],
    type: "merit",
    ...(text ? { text } : {})
})

const bonusFlaw = (name: string, level: number, text = "", summary = ""): MeritFlaw => ({
    name,
    level,
    summary,
    excludes: [],
    type: "flaw",
    ...(text ? { text } : {})
})

export const loresheets: Loresheet[] = [
    {
        title: "Os Bahari",
        summary:
            "Adeptos do Caminho de Lilith que buscam iluminação por meio da dor e do conflito. Têm pouca compaixão, entregam-se a prazeres carnais e formam relações rígidas de maternidade/paternidade sobre Membros menores.",
        source: "Core V5 p382",
        requirementFunctions: [],
        merits: [
            {
                name: "Reputação Perigosa",
                cost: [1],
                summary: "Uma vez por história, adicione 2 dados a Intimidação contra adoradores de Caim.",
                excludes: []
            },
            {
                name: "Escarificação Ritual",
                cost: [2],
                summary:
                    "Uma vez por sessão, escarifique-se com 1 dano agravado para recuperar 1 Força de Vontade agravada.",
                excludes: []
            },
            {
                name: "Sacrifique as Crianças",
                cost: [3],
                summary:
                    "Se você diablerizar sua cria, adicione 3 dados à sua rolagem de Determinação + Humanidade + Potência de Sangue para absorver disciplinas.",
                excludes: []
            },
            {
                name: "O Sangue do Útero",
                cost: [4],
                summary:
                    "Uma vez por história, beba sangue de um útero para receber +2 Vigor ou Determinação até o amanhecer.",
                excludes: []
            },
            {
                name: "Primeiros Amaldiçoados",
                cost: [5],
                summary:
                    "Caminhe na primeira hora de luz do dia pela manhã e antes do pôr do sol, tenha relações sexuais sem Rubor de Vida, ganhe o Defeito Predador Óbvio, testes Sociais de difamação contra você têm -1 de dificuldade, e vampiros usando Auspícios contra você têm metade da Determinação e Força de Vontade até o fim da cena.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [
                        bonusFlaw(
                            "Predador Óbvio",
                            2,
                            "Primeiros Amaldiçoados",
                            "Mortais têm medo de você; não pode manter Rebanho"
                        )
                    ]
                }
            }
        ]
    },
    {
        title: "Theo Bell",
        summary:
            "Theo é um antigo cão de colo da Camarilla que desertou para os Anarquistas após matar Hardestadt na Convenção de Praga. Ele inspirou inúmeros Brujah a derrubar Príncipes da Camarilla para formar bastiões Anarquistas, e agora atua como ligação entre figuras de alto status da Camarilla e Anarquistas.",
        source: "Core V5 p383",
        requirementFunctions: [],
        merits: [
            {
                name: "Célula Rebelde",
                cost: [1],
                summary:
                    "Uma vez por história, comande mortais rebeldes (equivalente a Aliado 3) para cumprir uma tarefa perigosa sem sua presença.",
                excludes: []
            },
            {
                name: "Anarquista Verdadeiro",
                cost: [2],
                summary:
                    "Receba 2 sucessos automáticos em qualquer rolagem de Investigação sobre vampiros que desertaram para o Movimento Anarquista.",
                excludes: []
            },
            {
                name: "Informação de Contato",
                cost: [3],
                summary:
                    "Faça uma mensagem chegar a Theo Bell. Os efeitos no jogo dependem do Narrador.",
                excludes: []
            },
            {
                name: "Círculo de Bell",
                cost: [4],
                summary:
                    "Ganhe Theo Bell como Mawla 5, mas sua associação com ele também traz desvantagens.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 5, "Theo Bell")]
                }
            },
            {
                name: "Neutralidade de Seita",
                cost: [5],
                summary:
                    "Você tem um pequeno grupo de seguidores Brujah leais que pode influenciar em qualquer direção (Camarilla, Anarquistas ou grupo independente). Até que se rebelem contra você, distribua 5 pontos entre Contatos, Refúgio (casas seguras), Mawla e Lacaios.",
                excludes: []
            }
        ]
    },
    {
        title: "Heresia Cainita",
        summary:
            "Membros da Heresia Cainita acreditam que Caim foi o verdadeiro messias e que Cristo foi sua Segunda Vinda. Vampiros são seus anjos na Terra.",
        source: "Core V5 p384",
        requirementFunctions: [],
        merits: [
            {
                name: "Que Aquele Que Tem Entendimento",
                cost: [1],
                summary:
                    "Uma vez por história, o Narrador dará a você uma pista gratuita para investigar os planos da Heresia agora ou no passado.",
                excludes: []
            },
            {
                name: "Mão da Heresia",
                cost: [2],
                summary:
                    "Receba um total de três pontos entre Aliados, Rebanho, Mawla ou Lacaios para representar seu papel no grupo de Heresia da cidade. Receba também o Defeito Segredo Sombrio (Heresia).",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [
                        bonusFlaw(
                            "Segredo Sombrio",
                            1,
                            "Heresy",
                            "Você está ligado à Heresia Cainita."
                        )
                    ]
                }
            },
            {
                name: "Contra-Inquisição",
                cost: [3],
                summary: "Sinta o cheiro de Fé Verdadeira em humanos",
                excludes: []
            },
            {
                name: "Celebrante Vermelho",
                cost: [4],
                summary:
                    "Uma vez por história, realize um ritual elaborado para desencadear algo parecido com frenesi em um grupo de humanos.",
                excludes: []
            },
            {
                name: "Aquele Nomeado na Profecia",
                cost: [5],
                summary:
                    "Você é um membro essencial da Heresia. Uma vez por história, use esse fato para determinar o vencedor de um conflito Social se conseguir apresentar um argumento plausível.",
                excludes: []
            }
        ]
    },
    {
        title: "Carna",
        summary:
            "Carna é uma Tremere poderosa que formou sua própria Casa para se opor à Pirâmide Tremere. Ela luta por modernização e direitos das mulheres.",
        source: "Core V5 p385",
        requirementFunctions: [],
        merits: [
            {
                name: "Abrace a Visão",
                cost: [1],
                summary: "Quando estiver perto de membros da Casa Carna, ganhe 1 dado em todos os testes de Força de Vontade.",
                excludes: []
            },
            {
                name: "A Trilha Rebelde",
                cost: [2],
                summary:
                    "Quando estiver em risco de sofrer Laço de Sangue, faça um teste de Força de Vontade contra a Potência de Sangue da vitae ingerida para ignorá-lo.",
                excludes: []
            },
            {
                name: "Rituais Heterodoxos",
                cost: [3],
                summary:
                    "Uma vez por história, realize um ritual conhecido sem gastar sangue. Em um crítico bestial, você fica perturbado de alguma forma até o fim da história.",
                excludes: []
            },
            {
                name: "Laço Reimaginado",
                cost: [4],
                summary:
                    "Forme Laços de Sangue mútuos entre você, seu parceiro e Carna (mesmo ausente) ao fazer sexo. Dura até o fim da história.",
                excludes: []
            },
            {
                name: "Livro da Guerra dos Túmulos",
                cost: [5],
                summary:
                    "Ganhe um sucesso automático em todos os testes de Ocultismo sobre a Gehenna e sobre quebrar grilhões que prendem vampiros aos anciões. Torne-se imune a Laços de Sangue. Tremere buscam destruir você e o livro.",
                excludes: []
            }
        ]
    },
    {
        title: "O Sistema Circulatório",
        summary:
            "O Sistema Circulatório é uma rede de tráfico humano que busca o sangue mais saboroso e explora Ressonâncias.",
        source: "Core V5 p386",
        requirementFunctions: [],
        merits: [
            {
                name: "Acesse o Sistema",
                cost: [1],
                summary:
                    "Uma vez por história, solicite recipientes de sangue específicos ao Sistema Circulatório.",
                excludes: []
            },
            {
                name: "Pequeno Livro Negro",
                cost: [2],
                summary:
                    "Ganhe um dado em rolagens de Investigação, Alquimia, Medicina e Ciência para rastrear ou testar sangue específico. Pesquise novas fórmulas de Alquimia Sangue-Ralo de 2 e 3 pontos em metade do tempo.",
                excludes: []
            },
            {
                name: "Fazenda no Interior",
                cost: [3],
                summary:
                    "Você sabe de uma fazenda de mortais com sangue potente (equivalente a Rebanho 4). Pode alimentar-se deles uma vez por semana ou atacar a fazenda e assumir controle total.",
                excludes: []
            },
            {
                name: "Trânsito Seguro",
                cost: [4],
                summary: "Ganhe acesso a vans de transporte armadas e seguras.",
                excludes: []
            },
            {
                name: "Sommelier de Sangue",
                cost: [5],
                summary:
                    "Adicione 2 dados a qualquer teste para descobrir a Ressonância do sangue e escolha 3 pontos em Vantagens de Contatos, Aliados ou Refúgio para explicar seu conhecimento. Uma vez por história, pergunte ao Narrador as propriedades do sangue do recipiente mais valioso.",
                excludes: []
            }
        ]
    },
    {
        title: "Convenção dos Espinhos",
        summary:
            "Você tem profundo conhecimento histórico da Convenção dos Espinhos, onde a Camarilla foi fundada e as Tradições foram gravadas em pedra.",
        source: "Core V5 p387",
        requirementFunctions: [],
        merits: [
            {
                name: "Historiador dos Espinhos",
                cost: [1],
                summary:
                    "Você conhece detalhes dos muitos pequenos acordos feitos na Convenção dos Espinhos e pode usá-los para aplicar pressão legal. Uma vez por história, peça ao Narrador uma informação conhecida sobre a convenção.",
                excludes: []
            },
            {
                name: "Mestre das Tradições",
                cost: [2],
                summary:
                    "Uma vez por crônica, invoque leis periféricas em domínios onde clãs governantes possam simpatizar com Tradições dos Espinhos não aceitas.",
                excludes: []
            },
            {
                name: "Segredos da Convenção",
                cost: [3],
                summary:
                    "Ganhe 1 dado em testes Sociais envolvendo Membros que estiveram na Convenção. Você conhece segredos que podem valer um Favor Maior para um vampiro poderoso. Uma vez por história, peça ao Narrador o nome de um Membro que precise do seu conhecimento.",
                excludes: []
            },
            {
                name: "Justicar em Potencial",
                cost: [4],
                summary: "Você tem apoio poderoso para se tornar o próximo Justicar do seu clã.",
                excludes: []
            },
            {
                name: "Novas Tradições",
                cost: [5],
                summary:
                    "Você pode propor uma nova tradição ou alteração em uma existente. Sua voz será ouvida pelo círculo interno da Camarilla sem julgamento prévio.",
                excludes: []
            }
        ]
    },
    {
        title: "A Primeira Inquisição",
        summary:
            "Você tem informações especiais sobre a Primeira Inquisição, que queimou muitos vampiros na Idade Média, e pode usar esse conhecimento para manipular ou evitar a Segunda Inquisição atual.",
        source: "Core V5 p388",
        requirementFunctions: [],
        merits: [
            {
                name: "Erros do Passado",
                cost: [1],
                summary:
                    "Uma vez por história, peça ao Narrador uma informação sobre a Primeira Inquisição.",
                excludes: []
            },
            {
                name: "Nomes dos Culpados",
                cost: [2],
                summary:
                    "Uma vez por história, peça ao Narrador o nome de um descendente de um vampiro traidor, que entregou outros à Primeira Inquisição, no seu domínio (se houver).",
                excludes: []
            },
            {
                name: "A Seita de São Tiago",
                cost: [3],
                summary:
                    "Uma vez por história, use um abade ligado a remanescentes da Primeira Inquisição como Contato 4.",
                excludes: []
            },
            {
                name: "O Segundo Ato",
                cost: [4],
                summary:
                    "Você tem um Contato na Segunda Inquisição. Não tem poder sobre ele, mas pode obter informações dele ou alimentá-lo com desinformação.",
                excludes: []
            },
            {
                name: "Mancha Negra",
                cost: [5],
                summary:
                    "Você conhece um lugar no seu domínio onde a Segunda Inquisição não entra. Mas o que há de tão santo ou profano nesse local para que eles não ousem entrar?",
                excludes: []
            }
        ]
    },
    {
        title: "Golconda",
        summary:
            "Golconda é uma iluminação mítica que vampiros supostamente podem alcançar. Rumores dizem que ela concede benefícios poderosos, como acalmar sua Besta interior e caminhar sob a luz solar.",
        source: "Core V5 p389",
        requirementFunctions: [],
        merits: [
            {
                name: "Sementes de Golconda",
                cost: [1],
                summary:
                    "Uma vez por sessão, pergunte ao Narrador se uma ação colocará em risco a chance de buscar Golconda.",
                excludes: []
            },
            {
                name: "O Único Caminho Verdadeiro",
                cost: [2],
                summary:
                    "Você possui um panfleto que, uma vez por história, concede 3 dados extras em um teste Social envolvendo a natureza da Golconda.",
                excludes: []
            },
            {
                name: "Discípulo de Saulot",
                cost: [3],
                summary:
                    "Sempre que entrar voluntariamente em frenesi, marque isso. Você pode obter sucesso automático no seu próximo teste de frenesi.",
                excludes: []
            },
            {
                name: "Sacie a Fome",
                cost: [4],
                summary:
                    "Uma vez por sessão, você pode reduzir sua Fome em 1 (não abaixo de 1) sem alimentação.",
                excludes: []
            },
            {
                name: "Cumprimente o Sol",
                cost: [5],
                summary:
                    "Uma vez por história, caminhe um dia sob a luz solar. Ao anoitecer desse dia, você entra em frenesi de Fome.",
                excludes: []
            }
        ]
    },
    {
        title: "Descendente de Hardestadt",
        summary:
            "Hardestadt foi o Ventrue mais importante por 800 anos, até Theo Bell matá-lo. Ele foi o membro Ventrue fundador da Camarilla.",
        source: "Core V5 p390",
        requirementFunctions: [isClan("Ventrue")],
        merits: [
            {
                name: "Voz de Hardestadt",
                cost: [1],
                summary: "Você consegue falar acima de qualquer ruído e atrair atenção.",
                excludes: []
            },
            {
                name: "Líder Supremo",
                cost: [2],
                summary:
                    "Uma vez por história, não sofra penalidade na sua parada de dados por enviar pessoas ao perigo.",
                excludes: []
            },
            {
                name: "Pilar Ventrue",
                cost: [3],
                summary: "Você sempre tem 3 pontos de Status com os Ventrue.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Status", 3, "Ventrue")]
                }
            },
            {
                name: "Linha até os Fundadores",
                cost: [4],
                summary:
                    "Uma vez por crônica, envie uma mensagem a um dos fundadores da Camarilla. Se seu pedido for importante o bastante, ele responderá.",
                excludes: []
            },
            {
                name: "Herdeiro de Hardestadt",
                cost: [5],
                summary:
                    "Você tem um documento assinado declarando-o herdeiro de Hardestadt. Ele afirma que, quando você assumir o nome “Hardestadt”, a Camarilla obedecerá a você e os Anarquistas virão em massa para derrubá-lo.",
                excludes: []
            }
        ]
    },
    {
        title: "Descendente de Helena",
        summary:
            "Dona da boate vampírica mais popular, que pode ou não estar tentando despertar o Antediluviano Toreador. Ela é bela e uma artista brilhante, o exemplo perfeito de Toreador.",
        source: "Core V5 p391",
        requirementFunctions: [isClan("Toreador")],
        merits: [
            {
                name: "Superficial",
                cost: [1],
                summary:
                    "Uma vez por história, mencione Helena em uma conversa com um Toreador ou vampiro que a conheça para ganhar 1 Status com ele. Repita demais e todos se cansarão de você.",
                excludes: []
            },
            {
                name: "Talento Real",
                cost: [2],
                summary:
                    "Escolha Ofícios, Etiqueta ou Performance. Aumentar essa Perícia custa metade do XP normal (arredondado para baixo).",
                excludes: []
            },
            {
                name: "Abrace os Estereótipos",
                cost: [3],
                summary:
                    "Uma vez por história, organize uma festa para aumentar seu Status ou Influência em dois pontos com um grupo convidado. O aumento dura até a festa terminar.",
                excludes: []
            },
            {
                name: "Pureza Divina",
                cost: [4],
                summary: "Adicione 2 dados a todos os testes para evitar culpa por suas ações.",
                excludes: []
            },
            {
                name: "Franquia do Clube Súcubo",
                cost: [5],
                summary:
                    "Abra uma franquia do famoso Succubus Club. Enquanto ela estiver aberta, ganhe 2 pontos na classificação Chasse do domínio da sua coterie. Escolha quatro pontos entre Recursos, Fama e Status entre todos os vampiros.",
                excludes: []
            }
        ]
    },
    {
        title: "Veterano da Guerra de Seitas",
        summary:
            "A Guerra das Seitas foi um enorme confronto entre a Camarilla e o Sabá dos anos 1990 ao início dos anos 2000 na América do Norte. Durante o conflito, o Sabá abriu caminho com assassinatos por domínios da Camarilla e Anarquistas, embora hoje tenha sido em grande parte repelido pela Camarilla.",
        source: "Core V5 p392",
        requirementFunctions: [],
        merits: [
            {
                name: "Sobrevivente",
                cost: [1],
                summary:
                    "Uma vez por história, peça ao Narrador uma informação relacionada à guerra das seitas no seu domínio.",
                excludes: []
            },
            {
                name: "Participante Ativo",
                cost: [2],
                summary: "Receba 3 pontos de Status ou Mawla relacionados à sua condição de veterano.",
                excludes: []
            },
            {
                name: "Abate-Troféu",
                cost: [3],
                summary:
                    "Uma vez por história, use a lenda de ter matado um vampiro famoso durante a guerra para contornar uma disputa em que isso possa ajudar.",
                excludes: []
            },
            {
                name: "Terra de Ninguém Vampírica",
                cost: [4],
                summary:
                    "Adicione 2 pontos ao Portillon do seu domínio e 2 dados a testes de Manha, Ladroagem e Furtividade no seu domínio e em dois domínios vizinhos ao usar santuários ocultos, arsenais, redes de túneis e ruas secundárias.",
                excludes: []
            },
            {
                name: "Agitador de Seita",
                cost: [5],
                summary: "Adicione 2 dados a todos os testes Sociais para inflamar tensão sectária.",
                excludes: []
            }
        ]
    },
    {
        title: "A Trindade",
        summary:
            "A Trindade de Michael, Antonius e o Dracon liderou Constantinopla durante a Era de Ouro, quando vampiros de todas as crenças podiam existir em harmonia. Essa utopia foi despedaçada pelas Cruzadas, pela mania de um Matusalém e pela corrupção Setita, virando a Trindade uns contra os outros. Muitos anseiam por seu retorno à antiga glória.",
        source: "Core V5 p393",
        requirementFunctions: [],
        merits: [
            {
                name: "Constantinopla",
                cost: [1],
                summary:
                    "Uma vez por história, faça ao Narrador uma pergunta sobre o passado de Constantinopla.",
                excludes: []
            },
            {
                name: "Arquitetura de Antonius",
                cost: [2],
                summary:
                    "Adicione 2 dados a qualquer teste de Política envolvendo o governo do domínio. Uma vez por história, medie e acalme qualquer debate da corte, sufocando violência com ação e profundidade.",
                excludes: []
            },
            {
                name: "O Sonho",
                cost: [3],
                summary:
                    "Adicione 1 dado a qualquer teste de Sagacidade ao tentar avaliar a Besta de outro. Uma vez por história, gaste 1 ponto de Força de Vontade para permitir que outro vampiro role novamente até 3 dados ao resistir ao frenesi.",
                excludes: []
            },
            {
                name: "O Dracon",
                cost: [4],
                summary:
                    "Ganhe o Dracon como Mawla 5. Ele pode ajudá-lo com assuntos espirituais e de Disciplina.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 5, "O Dracon")]
                }
            },
            {
                name: "A Nova Trindade",
                cost: [5],
                summary:
                    "Você e dois amigos foram profetizados para reconstruir Constantinopla como uma nova cidade. Uma vez por história, remova até 5 Máculas obtidas ao perseguir esse objetivo.",
                excludes: []
            }
        ]
    },
    {
        title: "Jeanette / Therese Voerman",
        summary:
            "As irmãs Voerman comandam a segunda boate vampírica mais famosa, O Asilo, em Los Angeles. Elas se odeiam, apesar de secretamente serem duas personalidades no mesmo corpo. Elas provam que Malkavianos podem ser tão inspirados e prósperos quanto qualquer Toreador ou Ventrue.",
        source: "Core V5 p394",
        requirementFunctions: [],
        merits: [
            {
                name: "Filiação ao Asylum",
                cost: [1],
                summary:
                    "Você nunca precisa esperar na fila para entrar no Asilo e pode caçar ali duas vezes por sessão (Dificuldade 2).",
                excludes: []
            },
            {
                name: "Macaco de Palco",
                cost: [2],
                summary:
                    "As irmãs frequentemente lhe dão missões que recompensam generosamente com favores.",
                excludes: []
            },
            {
                name: "Favorito de Jeanette",
                cost: [3],
                summary:
                    "Ganhe Jeanette como Mawla 4, mas apenas para assuntos Malkavianos e Anarquistas. Ela permite que você use o clube para festas, descanse ali durante o dia e recebe favores dela.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 4, "Jeanette")]
                }
            },
            {
                name: "Favorito de Therese",
                cost: [4],
                summary:
                    "Ganhe Therese como Mawla 3. Ela fala por você em qualquer regnum e pode instruí-lo em negócios e finanças.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 3, "Therese")]
                }
            },
            {
                name: "Operador do Asylum",
                cost: [5],
                summary:
                    "Comande uma franquia do Asilo no seu domínio. Enquanto estiver aberta, distribua 4 pontos entre Refúgio, Rebanho, Recursos ou Chasse do seu Domínio. Se quiser, seu clube pode ser um Elísio.",
                excludes: []
            }
        ]
    },
    {
        title: "A Semana dos Pesadelos",
        summary:
            "A estrela vermelha Anthelios anunciou a Semana dos Pesadelos, quando o Antediluviano Ravnos expurgou seu próprio clã e vampiros sangue-ralo emergiram. Você testemunhou e sobreviveu à mania, e agora observa sinais de desgraças por vir.",
        source: "Core V5 p395",
        requirementFunctions: [],
        merits: [
            {
                name: "História Oral",
                cost: [1],
                summary:
                    "Adicione 3 dados a testes de Performance para contar a história da Semana dos Pesadelos.",
                excludes: []
            },
            {
                name: "Restos Ravnos",
                cost: [2],
                summary:
                    "Ganhe 3 pontos de Mawla representando um grupo de Ravnos como contatos. Eles levam notícias e avisos até você e podem ser convencidos a lançar ilusões poderosas uma vez por história.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 3, "contatos Ravnos")]
                }
            },
            {
                name: "Eu Estive Lá",
                cost: [3],
                summary:
                    "Uma vez por história, use seu status de sobrevivente para obter um favor menor de um historiador Membro, Ravnos ou ocultista.",
                excludes: []
            },
            {
                name: "A Estrela Vermelha",
                cost: [4],
                summary:
                    "Uma vez por história, você pode reduzir sua Fome para 2 ou ganhar 1 dado nas paradas de uma Disciplina por uma noite ao encarar a estrela Anthelios por 10 minutos.",
                excludes: []
            },
            {
                name: "Sangue de Zapathasura",
                cost: [5],
                summary:
                    "Você possui um pequeno frasco contendo o Sangue do Antediluviano Ravnos. O que acontece quando ele é ingerido fica a cargo do Narrador.",
                excludes: []
            }
        ]
    },
    {
        title: "Rudi",
        summary:
            "Um representante Anarquista das minorias oprimidas na sociedade vampírica. Ele é próximo dos mortais e também luta pelos direitos deles. Alguns Príncipes europeus temem que ele lidere uma revolta contra as instituições em breve.",
        source: "Core V5 p396",
        requirementFunctions: [],
        merits: [
            {
                name: "Direitos Recém-Conquistados",
                cost: [1],
                summary:
                    "Uma vez por história, role novamente uma parada de dados de teste de Perícia ao atacar o establishment.",
                excludes: []
            },
            {
                name: "Eles e os Deles",
                cost: [2],
                summary:
                    "Você sente quando um Pilar de qualquer membro da sua coterie está ameaçado, mas não sabe qual.",
                excludes: []
            },
            {
                name: "Defensor Gangrel",
                cost: [3],
                summary:
                    "Adicione 1 dado a testes Sociais com Gangrel. Você pode organizar reuniões de trégua entre Gangrel e representantes da Camarilla com um teste de Carisma + Política (Dificuldade definida pelo Narrador).",
                excludes: []
            },
            {
                name: "A Matilha do Urso",
                cost: [4],
                summary:
                    "Ganhe o Bear Pack como Mawla 3. Eles podem entrar em brigas verbais e físicas por você. Uma vez por história, eles e você recebem 1 sucesso automático ao tentar incitar Anarquistas contra o establishment.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 3, "A Matilha do Urso")]
                }
            },
            {
                name: "Exército de Rudi",
                cost: [5],
                summary:
                    "Você exerce influência sobre um exército de revolucionários que pode incitar contra governos vampíricos ou mortais. Divida 5 pontos entre Aliados, Influência e Contatos; eles podem ser direcionados, mas nunca controlados.",
                excludes: []
            }
        ]
    },
    {
        title: "Descendente de Tyler",
        summary:
            "Tyler é a revolucionária Brujah que inspirou o Movimento Anarquista. A própria Tyler já não está convencida de que a violência é a resposta, mas seus seguidores ainda pensam assim.",
        source: "Core V5 p397",
        requirementFunctions: [isClan("Brujah")],
        merits: [
            {
                name: "Instigador",
                cost: [1],
                summary:
                    "Uma vez por história, adicione 2 dados a uma rolagem para persuadir uma multidão mortal a uma ação violenta.",
                excludes: []
            },
            {
                name: "Campeão da Causa",
                cost: [2],
                summary:
                    "Ganhe 2 pontos de Status com rebeldes durante uma rebelião. Rebeldes procuram você em busca de conselho ou liderança.",
                excludes: []
            },
            {
                name: "Misericórdia de Tyler",
                cost: [3],
                summary:
                    "Uma vez por história, ao entrar em frenesi, assuma uma compulsão Brujah para encerrar imediatamente o frenesi.",
                excludes: []
            },
            {
                name: "Os Furores",
                cost: [4],
                summary:
                    "Uma vez por crônica, os Furores armam você e concedem recursos, influência e Aliados 5 surpresa. Só pode ser usado para tentar derrubar um Príncipe, Barão ou vampiro de status superior.",
                excludes: []
            },
            {
                name: "Revolução Permanente",
                cost: [5],
                summary:
                    "Você já derrubou uma figura de proa de uma Seita e continua sua revolução. Anarquistas param para ouvi-lo; Brujah Anarquistas obedecem a todos os seus comandos.",
                excludes: []
            }
        ]
    },
    {
        title: "Descendente de Zelios",
        summary:
            "Um grande arquiteto e planejador Nosferatu que desapareceu sob Nova York em 1990. Ele é responsável por muitos labirintos, masmorras e prisões Nosferatu.",
        source: "Core V5 p398",
        requirementFunctions: [isClan("Nosferatu")],
        merits: [
            {
                name: "Santuário",
                cost: [1],
                summary: "Divida 2 pontos entre Refúgio-Porta Secreta e Refúgio-Sistema de Segurança.",
                excludes: []
            },
            {
                name: "Sabotador",
                cost: [2],
                summary:
                    "Derrube uma construção usando apenas um martelo ao longo de tantas noites quanto o Narrador definir (4 para uma casa familiar, 9 para um arranha-céu).",
                excludes: []
            },
            {
                name: "Sob Encomenda",
                cost: [3],
                summary:
                    "Ganhe um favor menor por história de um vampiro que peça seu conselho para construir seu Refúgio. Você sabe onde muitos vampiros poderosos dormem.",
                excludes: []
            },
            {
                name: "O Labirinto",
                cost: [4],
                summary:
                    "Você construiu um grande labirinto sob seu domínio. Não pode usá-lo como Refúgio, pois ele o aterroriza, mas pode escapar para dentro dele quando perseguido, e ninguém consegue segui-lo.",
                excludes: []
            },
            {
                name: "Sentir as Linhas Ley",
                cost: [5],
                summary:
                    "Você consegue sentir Linhas Ley. Dormir perto delas permite que vampiros rolem 2 dados e escolham o maior na Checagem de Sangue ao despertar.",
                excludes: []
            }
        ]
    },
    {
        title: "Descendente de Vasantasena",
        summary:
            "Uma entusiasta do livre-arbítrio que pregou contra o Laço de Sangue e a hierarquia vampírica tradicional na Idade Média. Ela é ex-membro da Camarilla e do Sabá e deseja combater os Antediluvianos.",
        source: "Core V5 p399",
        requirementFunctions: [isClan("Malkavian")],
        merits: [
            {
                name: "Agente do Caos",
                cost: [1],
                summary:
                    "Uma vez por sessão, enquanto estiver em uma situação caótica, role novamente 1 dado sem gastar Força de Vontade.",
                excludes: []
            },
            {
                name: "Ouça Minhas Palavras",
                cost: [2],
                summary:
                    "Uma vez por história, aconselhe alguém em uma situação caótica. Essa pessoa pode rolar novamente 1 dado em um teste futuro dentro da mesma situação.",
                excludes: []
            },
            {
                name: "Farejar o Laço",
                cost: [3],
                summary:
                    "Uma vez por história, role Determinação + Percepção (Dificuldade 4) para farejar o Laço de Sangue em um vampiro ligado e em seu regente.",
                excludes: []
            },
            {
                name: "Destruir o Laço",
                cost: [4],
                summary:
                    "Beba um gole do sangue de um vampiro e atravesse um frenesi para quebrar um Laço de Sangue sobre ele.",
                excludes: []
            },
            {
                name: "Sabá se Torna Camarilla",
                cost: [5],
                summary:
                    "Uma vez por história, desprograme um vampiro de suas crenças sectárias. Para isso, isole-o completamente em uma atmosfera de perfumes. Uma vez a cada 3 noites, role Inteligência ou Carisma + Sagacidade. Você vence ao acumular sucessos totais iguais ao dobro da Força de Vontade do alvo.",
                excludes: []
            }
        ]
    },
    {
        title: "Alto Clã",
        summary:
            "Embora “Alto” e “Baixo” clã tenham sido abolidos com a formação da Camarilla, no seu domínio essas regras ainda valem em algum grau. Historicamente, Altos Clãs incluem Lasombra, Toreador, Tzimisce e Ventrue, às vezes Brujah e Hecata, e raramente Tremere. Em outras partes do mundo, Banu Haqim e Ministério são considerados Altos Clãs.",
        source: "Core V5 p400",
        requirementFunctions: [],
        merits: [
            {
                name: "Pavão",
                cost: [1],
                summary:
                    "Uma vez por sessão, role novamente um único dado ao exigir deferência de um vampiro sem título no seu domínio.",
                excludes: []
            },
            {
                name: "Influenciar os Baixos",
                cost: [2],
                summary:
                    "Você intimidou vampiros de Baixo Clã equivalentes a 3 pontos de Mawla até obter sua lealdade. Ganhe 3 dados extras em Intimidação ou Liderança contra esses vampiros. Se algum dia obtiver uma falha total em tal teste, deve compensá-los ou eles se voltarão contra você.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 3, "vampiros de Clã Baixo")]
                }
            },
            {
                name: "Elevar os Baixos",
                cost: [3],
                summary:
                    "Uma vez por crônica, eleve um vampiro de Baixo Clã ao status de Alto Clã. Ganhe 1 dado em testes Sociais contra vampiros de Baixo Clã ao aludir à possibilidade de elevá-los.",
                excludes: []
            },
            {
                name: "Abraçado para Governar",
                cost: [4],
                summary:
                    "Adicione 1 dado a testes de Liderança envolvendo vampiros de Alto Clã. Uma vez por história, outros vampiros de Alto Clã votam em você ou permitem que assuma uma posição de poder, a menos que tenham queixas pessoais contra você.",
                excludes: []
            },
            {
                name: "Abençoado, não Amaldiçoado",
                cost: [5],
                summary: "Uma vez por sessão, gaste 1 Força de Vontade para ignorar a Maldição do seu Clã.",
                excludes: []
            }
        ]
    },
    {
        title: "Baixo Clã",
        summary:
            "Você é membro de um clã considerado inferior no seu domínio (normalmente Gangrel, Malkavianos e Nosferatu; às vezes também Brujah e Tremere). Isso significa que muitos o tratam como menor, mas você também tem acesso a rebeldes e contracultura.",
        source: "Core V5 p401",
        requirementFunctions: [],
        merits: [
            {
                name: "Couro Grosso",
                cost: [1],
                summary:
                    "Uma vez por história, ignore ataques verbais ou provocações por uma cena sem rolar.",
                excludes: []
            },
            {
                name: "Amaldiçoado pelo Orgulho",
                cost: [2],
                summary:
                    "Uma vez por história, ganhe um sucesso automático em uma rolagem ao incorporar a Maldição do seu Clã.",
                excludes: []
            },
            {
                name: "Parentesco Sobrenatural",
                cost: [3],
                summary: "Escolha 3 pontos de Mawla ou Status de outros Baixos Clãs no domínio.",
                excludes: []
            },
            {
                name: "Comércio entre Iguais",
                cost: [4],
                summary:
                    "Escolha a Disciplina de outro Baixo Clã. Você pode comprar pontos nessa Disciplina com experiência como se ela fosse de clã para você.",
                excludes: []
            },
            {
                name: "Incidente de Criticidade",
                cost: [5],
                summary:
                    "Adicione 1 dado a todas as rolagens de projetos que enfraquecem Altos Clãs no seu domínio. Uma vez por crônica, sacrifique 10 pontos de Antecedentes para derrubar o mesmo número de vampiros de Alto Clã em um golpe.",
                excludes: []
            }
        ]
    },
    {
        title: "Ambrus Maropis",
        summary:
            "Um formador de tendências bem-quisto na sociedade da Camarilla. Muitos não sabem que ele é Nosferatu, pois usa intermediários para interagir com Príncipes e Barões enquanto permanece oculto. No fundo, é um nerd introvertido de anime e jogos, além de hacker e desenvolvedor de software habilidoso.",
        source: "Core V5 p402",
        requirementFunctions: [],
        merits: [
            {
                name: "Crente Verdadeiro",
                cost: [1],
                summary:
                    "Ganhe bônus de 1 dado em testes para encontrar esconderijos compartilhados de Membros na sua cidade.",
                excludes: []
            },
            {
                name: "Informação Clandestina",
                cost: [2],
                summary:
                    "Uma vez por história, obtenha uma informação armazenada online sobre um mortal em 2 a 20 horas.",
                excludes: []
            },
            {
                name: "Ensinado pelos Melhores",
                cost: [3],
                summary:
                    "Considere Ambrus um Mawla 3. Ele pode arranjar seu hacker pessoal a “preço de amigo” ou obter informações sobre uma ampla variedade de tópicos, como ações da SI ou tendências de moda em subculturas obscuras.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 3, "Ambrus Maropis")]
                }
            },
            {
                name: "Panóptico pela Porta dos Fundos",
                cost: [4],
                summary:
                    "Uma vez por história, acesse uma porta dos fundos do PRISM para obter dois sucessos automáticos em qualquer Investigação envolvendo atividade celular ou presença online de alguém.",
                excludes: []
            },
            {
                name: "Em Outra Rede Inteiramente",
                cost: [5],
                summary:
                    "Ganhe duas identidades de cobertura de Máscara 2, ganhe a vantagem Apagado e receba 3 dados extras para resistir a tentativas de descobrir suas atividades online ou ações no mundo mortal.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [
                        bonusMerit("Máscara", 2, "duas identidades de fachada"),
                        bonusMerit("Apagado", 1)
                    ]
                }
            }
        ]
    },
    {
        title: "Carmelita Neillson",
        summary:
            "Uma jornalista vampírica que registra histórias de vampiros antigos e a história da sociedade dos Membros. Carmelita estabeleceu muitas bibliotecas ocultas em locais escondidos. Ela é contratada para interrogar Matusaléns recém-despertos, investigar templos arruinados e interpretar escrituras do Sabá.",
        source: "Core V5 p403",
        requirementFunctions: [],
        merits: [
            {
                name: "A Arte da História",
                cost: [1],
                summary:
                    "Toreador sempre lhe dão ouvidos quando você fala de saber histórico ou contos míticos.",
                excludes: []
            },
            {
                name: "A Arte da Vontade",
                cost: [2],
                summary:
                    "Uma vez por sessão, medite antes de repousar durante o dia e passe em um teste de Determinação + Erudição com dificuldade 5 para despertar com um ponto adicional de Força de Vontade.",
                excludes: []
            },
            {
                name: "Biblioteca Neillson",
                cost: [3],
                summary:
                    "Atue como curador de uma biblioteca oculta que serve como Refúgio 2 com Biblioteca 2. Outros vampiros também se reúnem ali.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Refúgio", 2, "biblioteca oculta")]
                }
            },
            {
                name: "Entrevista com o Matusalém",
                cost: [4],
                summary:
                    "Uma vez por história, peça ao Narrador um segredo sobre um dos clãs no seu domínio.",
                excludes: []
            },
            {
                name: "Tumba do Ancestral",
                cost: [5],
                summary:
                    "Você foi encarregado de guardar o local de repouso de um de seus ancestrais. Enquanto o mantiver seguro, uma vez por história, pode recorrer a Carmelita por um Favor Maior. Se falhar em proteger a tumba, haverá consequências.",
                excludes: []
            }
        ]
    },
    {
        title: "Fiorenza Savona",
        summary:
            "Uma Ventrue relativamente recém-transformada com enorme influência entre mortais da elite política e empresarial. Ela tem influência em ONGs, na ONU e na elite de Davos, e gosta de manter estruturas rígidas de poder.",
        source: "Core V5 p404",
        requirementFunctions: [],
        merits: [
            {
                name: "Na Lista de Fiorenza",
                cost: [1],
                summary:
                    "Ganhe um Lacaio Mortal Talentoso (guarda-costas, motorista, mordomo...) que espiona você abertamente para Fiorenza.",
                excludes: []
            },
            {
                name: "Café da Manhã com Fiorenza",
                cost: [2],
                summary:
                    "Uma vez por história, encontre Fiorenza. Isso pode ser lucrativo ou informativo, se fizer as perguntas certas.",
                excludes: []
            },
            {
                name: "Benefícios Amigáveis",
                cost: [3],
                summary:
                    "Ganhe Fiorenza como Mawla 3, capaz de fornecer dicas de negociação privilegiada, carros caros, aviões particulares ou acalmar Ventrue irritados por você. Se abusar dessa conexão, ela o cortará.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 3, "Fiorenza Savona")]
                }
            },
            {
                name: "A Diretoria",
                cost: [4],
                summary:
                    "Sofra Laço de Sangue com uma diretoria Ventrue sombria que quer que você submeta Fiorenza à vontade deles. Eles fornecem 6 pontos para distribuir entre Contatos, Mawla e Recursos.",
                excludes: []
            },
            {
                name: "Moção Governamental",
                cost: [5],
                summary:
                    "Uma vez por crônica, Fiorenza influenciará um líder político mortal por você. Isso concede 5 dados para distribuir como quiser entre rolagens envolvendo ação governamental.",
                excludes: []
            }
        ]
    },
    {
        title: "Descendente de Karl Schrekt",
        summary:
            "Tradicionalista radical e antigo Justicar da Camarilla. Karl era caçador de vampiros antes de seu Abraço em 1235 e conquistou enorme respeito como executor implacável e forte da Camarilla, caçando ameaças sobrenaturais.",
        source: "Core V5 p405",
        requirementFunctions: [isClan("Tremere")],
        merits: [
            {
                name: "Lembre-se da Casa",
                cost: [1],
                summary:
                    "Uma vez por história, peça ao Narrador uma informação sobre a Casa Tremere antes da queda da Pirâmide.",
                excludes: []
            },
            {
                name: "Linha-Dura",
                cost: [2],
                summary:
                    "Com a concordância do Narrador, adicione 2 dados a qualquer teste para resistir a tentativas de desviá-lo dos objetivos de Schrekt.",
                excludes: []
            },
            {
                name: "Prontidão Ritual",
                cost: [3],
                summary:
                    "Uma vez por história, realize um de seus rituais em cinco minutos e sem preparação.",
                excludes: []
            },
            {
                name: "Perdição do Arconte",
                cost: [4],
                summary:
                    "Tenha um Aliado sobrenatural 4 (lobisomem, mago, aparição, changeling...) que está sendo caçado. Uma vez por história, ele vem em seu auxílio.",
                excludes: []
            },
            {
                name: "Conheça o Mundo",
                cost: [5],
                summary:
                    "Ganhe 3 pontos em Refúgio-Biblioteca e escolha 3 Especialidades em Ocultismo. Uma vez por história, faça ao Narrador uma pergunta simples sobre criaturas sobrenaturais não vampíricas.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Refúgio", 3, "biblioteca")]
                }
            }
        ]
    },
    {
        title: "Descendente de Xaviar",
        summary:
            "Antigo Justicar Gangrel que viu sua coterie ser devorada por um Antediluviano. Ele deixou a Camarilla porque ignoraram seus avisos e morreu misteriosamente pouco depois.",
        source: "Core V5 p406",
        requirementFunctions: [isClan("Gangrel")],
        merits: [
            {
                name: "Ancestral Martirizado",
                cost: [1],
                summary: "Ganhe 2 pontos de Status com outros Gangrel no seu domínio.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Status", 2, "Gangrel em seu domínio")]
                }
            },
            {
                name: "Onde os Corpos Estão Enterrados",
                cost: [2],
                summary:
                    "Faça um teste de Determinação + Percepção para detectar vampiros fundidos ou em torpor no solo abaixo de você.",
                excludes: []
            },
            {
                name: "Cão Leal",
                cost: [3],
                summary:
                    "Distribua 4 pontos entre Domínio, Rebanho e Status. Gangrel fora da Camarilla desprezam você por permanecer leal à Camarilla.",
                excludes: []
            },
            {
                name: "Morcego Monstruoso",
                cost: [4],
                summary:
                    "Uma vez por história, transforme-se em um morcego do tamanho de um homem. Nessa forma, ganhe +1 em todos os Atributos Físicos, plane no ar e cause +1 dano agravado com mordidas.",
                excludes: []
            },
            {
                name: "Enfrentou o Antediluviano",
                cost: [5],
                summary:
                    "Uma vez por história, enquanto toca solo aberto, sinta a localização de outro Gangrel e drene um pouco de vitae dele para redefinir sua Fome para 2.",
                excludes: []
            }
        ]
    },
    {
        title: "Descendente de Roger de Camden",
        summary:
            "Roger é um antigo e sombrio vampiro Cappadociano que atualmente governa como Príncipe de Edimburgo. É conhecido como estudioso das fronteiras entre vida e morte, mártir e sobrevivente.",
        source: "Ash and Bone p171",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            {
                name: "Cria Orgulhosa",
                cost: [1],
                summary: "Ganhe 2 pontos de Status enquanto estiver em um ambiente controlado pelos Hecata.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Status", 2, "ambiente controlado pelos Hecata")]
                }
            },
            {
                name: "Sentido Cadavérico",
                cost: [2],
                summary:
                    "Ganhe 2 dados em qualquer parada para investigar a causa de ferimento ou morte de um corpo. Aparições conseguem se comunicar com você mais facilmente.",
                excludes: []
            },
            {
                name: "Olho no Olho",
                cost: [3],
                summary: "Ganhe 2 dados em Persuasão ou Intimidação ao falar com Ventrue.",
                excludes: []
            },
            {
                name: "O Caminho de Toda Carne",
                cost: [4],
                summary: "Você pode Abraçar cadáveres antigos, desde que não estejam apodrecidos além do reconhecimento.",
                excludes: []
            },
            {
                name: "Talvez Sonhar",
                cost: [5],
                summary: "Você pode vagar pelas Terras das Sombras enquanto repousa ou está em torpor.",
                excludes: []
            }
        ]
    },
    {
        title: "Filhos de Tenochtitlan",
        summary:
            "Vampiros originalmente astecas que foram oprimidos pelos Giovanni e agora procuram um novo líder enquanto planejam vingança.",
        source: "Blood Gods p221",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            {
                name: "Escondendo-se do Lobo",
                cost: [1],
                summary: "Ganhe 1 dado em qualquer rolagem para se esconder.",
                excludes: []
            },
            {
                name: "Instintos Fantasmagóricos",
                cost: [2],
                summary:
                    "Ganhe 2 dados em qualquer rolagem de Cerimônia de Oblívio envolvendo convocação, controle ou destruição de fantasmas.",
                excludes: []
            },
            {
                name: "Pensamento Avançado",
                cost: [3],
                summary:
                    "Uma vez por história, você pode rolar novamente qualquer rolagem de Perícia. Uma vez por cena, pode rolar novamente uma rolagem de Perícia contra outro Hecata, com +1 sucesso se ele for um Harbinger of Skulls.",
                excludes: []
            },
            {
                name: "Prodígio Necromântico",
                cost: [4],
                summary:
                    "Receba +2 sucessos em qualquer rolagem necessária para ativar uma Cerimônia necromântica de Oblívio.",
                excludes: []
            },
            {
                name: "Próximo na Linha",
                cost: [5],
                summary:
                    "Receba 2 pontos de Status com os Hecata e ganhe um Aliado entre os Anziani que atua como Mawla 5 a cada duas histórias.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [
                        bonusMerit("Status", 2, "Hecata"),
                        bonusMerit("Mawla", 5, "aliado anziani")
                    ]
                }
            }
        ]
    },
    {
        title: "Devoradores de Carne",
        summary:
            "Os Nagaraja são vampiros devoradores de carne. São temidos por muitos e frequentemente são assassinos sádicos.",
        source: "Blood Gods p223",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            {
                name: "Viscus",
                cost: [1],
                summary:
                    "Morder mortais e causar ferimentos conta como beber sangue para você, saciando sua Fome. Você também pode comer cadáveres frescos.",
                excludes: []
            },
            {
                name: "Espírito Invisível",
                cost: [2],
                summary:
                    "Ganhe a Disciplina Manto das Sombras, mas ela só funciona contra fantasmas. Se você já tem Ofuscação, todas as suas habilidades de Ofuscação também funcionam contra fantasmas.",
                excludes: []
            },
            {
                name: "O Assassinato Perfeito",
                cost: [3],
                summary:
                    "Se você tiver pelo menos uma noite para planejar, ganhe +1 sucesso em qualquer rolagem durante uma cena de assassinato intencional (pode ser anulado por Send a Murderer).",
                excludes: []
            },
            {
                name: "Envie um Assassino",
                cost: [4],
                summary:
                    "Receba +2 dados em rolagens para estudar cenas de assassinato ou rastrear assassinos. Distribua 3 pontos entre Contatos com polícia mortal, investigadores vampíricos e Status.",
                excludes: []
            },
            {
                name: "Mordida Monstruosa",
                cost: [5],
                summary:
                    "Suas presas podem crescer como adagas, concedendo +1 sucesso em rolagens de Intimidação, dano 3 em mordidas e removendo a penalidade de ataque localizado de ataques de mordida.",
                excludes: []
            }
        ]
    },
    {
        title: "La Famiglia Giovanni",
        summary:
            "Os Giovanni são uma antiga e respeitada família mafiosa de vampiros. São a parte mais poderosa do clã Hecata e farão de tudo para continuar assim.",
        source: "Blood Gods p225",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            {
                name: "O Ouvido de um Primo",
                cost: [1],
                summary:
                    "Uma vez por sessão, faça uma pergunta direta a outro Giovanni e receba uma resposta direta. Você terá que responder honestamente a uma pergunta em troca. Uma vez por história, obtenha um favor de um membro mortal da família.",
                excludes: []
            },
            {
                name: "Glamour Desbotado",
                cost: [2],
                summary:
                    "Uma vez por sessão, adicione um sucesso automático a uma rolagem social contra outro Hecata ou seus servos.",
                excludes: []
            },
            {
                name: "Dinheiro Miúdo",
                cost: [3],
                summary:
                    "Distribua quatro pontos entre Recursos e Lacaios. Membros anciões da família podem tirá-los de você a qualquer momento.",
                excludes: []
            },
            {
                name: "Servo Espectral",
                cost: [4],
                summary:
                    "Você ganha um espectro para atuar como seu servo (Aliado 4, use as estatísticas do livro básico p. 377), que pode convocar uma vez por sessão. Ele chegará em até 10 horas.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Aliados", 4, "servo espectral")]
                }
            },
            {
                name: "Aspirante a Anziani",
                cost: [5],
                summary:
                    "Ganhe 5 pontos de Status entre os Hecata e obtenha uma audiência privada com o Capuchinho a cada poucas histórias.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Status", 5, "Hecata")]
                }
            }
        ]
    },
    {
        title: "A Nação de Sangue / Descendentes do Barão",
        summary:
            "Vampiros antes conhecidos como Samedi. Costumam trabalhar como espiões mercenários e necromantes, ou comandar círculos religiosos secretos que praticam magia vodu. A maldição do clã apodrece sua carne ou, em alguns casos, expõe osso cru, dando a eles aparência ainda mais cadavérica que a da maioria dos vampiros.",
        source: "Blood Gods p222",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            {
                name: "Coisa de CSI",
                cost: [1],
                summary:
                    "Você identifica facilmente a causa da morte ao inspecionar um cadáver (role se ela estiver ocultada magicamente).",
                excludes: []
            },
            {
                name: "Libra de Carne",
                cost: [2],
                summary:
                    "Se você aceitar um presente dado livremente, você e quem o deu recebem uma penalidade de dados baseada na Gravidade da Maldição de cada personagem por uma noite.",
                excludes: []
            },
            {
                name: "Mime-se",
                cost: [3],
                summary:
                    "Uma vez por noite, você pode se entregar a um vício como um humano faria, sem as desvantagens vampíricas usuais (por exemplo, uma refeição, bebidas, sexo ou um charuto).",
                excludes: []
            },
            {
                name: "Meu Amigo Setita",
                cost: [4],
                summary:
                    "Você tem um amigo no Ministério. Uma vez por história, pode pedir um favor tão poderoso quanto 3 pontos nas Vantagens apropriadas (Aliados, Influência, Recursos...).",
                excludes: []
            },
            {
                name: "A Cartola de Seda",
                cost: [5],
                summary:
                    "Você é o próximo na linha de sucessão do Barão. Antes de assumir sua posição, você o tem como Mawla 5 (sua ajuda vem de maneiras crípticas e misteriosas). Se tomar seu lugar, pode ser apenas um cargo, ou talvez você ganhe seus poderes místicos. De qualquer forma, certamente herdará seus inimigos.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Mawla", 5, "o Barão")]
                }
            }
        ]
    },
    {
        title: "Descendente do Ankou",
        summary:
            "Uma linhagem Malkaviana de visionários da morte do norte da França, atraída por sangue, mortalidade e segredos arrancados dos mortos.",
        source: "Tattered Facade p171",
        requirementFunctions: [isClan("Malkavian")],
        merits: [
            loreMerit(
                "Bleed Them Dry",
                1,
                "Ganhe três especialidades ligadas a sangue, lâmina, presas, ocultismo ou hematologia, mas todo refúgio que você ocupa se torna sinistro."
            ),
            loreMerit(
                "Crimson Visionary",
                2,
                "Aprenda Oblívio pelo custo de clã sem o Sangue de um tutor, mas seus primeiros poderes devem focar em percepção e você ganha uma fraqueza folclórica menor."
            ),
            loreMerit(
                "Bloody Work",
                3,
                "Gaste sangue extra ou mate um animal para adicionar 2 dados a paradas de Auspícios, Ocultismo, Ritual ou Cerimônia usadas para obter informações."
            ),
            loreMerit(
                "Focus of Clarity",
                4,
                "Uma vez por sessão, use um objeto de foco precioso com uma perícia para transformar um dado de Fome com 1 ou 10 em uma falha normal."
            ),
            loreMerit(
                "O Profeta da Morte Renascido",
                5,
                "No início de cada história, receba Contatos, Influência, Recursos locais temporários ou um favor menor de um Membro por suas profecias."
            )
        ]
    },
    {
        title: "Descendente do Barão Vollgirre",
        summary:
            "Uma linhagem Toreador marcada pela crueldade de Vollgirre, por educação clássica e por um legado oculto de moldar carne.",
        source: "Tattered Facade p172",
        requirementFunctions: [isClan("Toreador")],
        merits: [
            loreMerit(
                "As Sete Artes",
                1,
                "Ganhe três especialidades de artes liberais entre perícias acadêmicas, sociais ou criativas, mas seu refinamento marca você como impopular."
            ),
            loreMerit(
                "Prodigy of Flesh",
                2,
                "Aprenda Proteanismo pelo custo de clã e use Presença para amálgamas de Vicissitude, mas aprender Vicissitude cria um segredo perigoso."
            ),
            loreMerit(
                "Sadistic Hunger",
                3,
                "Infligir dor ou medo real imediatamente antes ou durante a alimentação sacia 1 Fome extra, dentro dos limites normais."
            ),
            loreMerit(
                "Unusual Connections",
                4,
                "Ganhe um Mawla 5 entre descendentes do Sabá, Tzimisce ou Vollgirre, mas seu Sangue se torna vulnerável a defeitos de laço.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Mawla", 5, "descendentes Sabbat, Tzimisce ou Vollgirre")
                    ]
                }
            ),
            loreMerit(
                "Voice of Treachery",
                5,
                "Uma vez por história, defina um dado como 10 em uma rolagem social para intimidar, torturar ou influenciar membros do Sabá, Toreador, Tzimisce ou usuários de Vicissitude."
            )
        ]
    },
    {
        title: "Descendente de Montano",
        summary:
            "Uma linhagem Lasombra ligada ao antigo domínio Abissal de Montano, à lealdade à Camarilla e a uma longa memória da política do clã.",
        source: "Tattered Facade p173",
        requirementFunctions: [isClan("Lasombra")],
        merits: [
            loreMerit(
                "A Sombra de Ontem",
                1,
                "Uma vez por história, escreva a Montano em busca de verdade ou pistas sobre a Camarilla ou o Clã Lasombra."
            ),
            loreMerit(
                "Siblings in Darkness",
                2,
                "Seu Status Lasombra se aplica através das fronteiras de seita porque o clã respeita a linhagem de Montano."
            ),
            loreMerit(
                "Abyssal Apprentice",
                3,
                "Uma vez por história, use um poder de Oblívio que você não conhece, de nível igual ou inferior ao seu nível atual de Oblívio."
            ),
            loreMerit(
                "Word of Mouth",
                4,
                "Seu Status de Camarilla não Lasombra acompanha você por todo o seu país natal, mesmo fora da sua cidade."
            ),
            loreMerit(
                "Purity of Remorse",
                5,
                "Ao rolar Remorso, nunca role menos de dois dados."
            )
        ]
    },
    {
        title: "Pequenos Irmãos",
        summary:
            "Hecata Rossellini que tratam fantasmas como ferramentas e praticam Oblívio com disciplina necromântica severa e dominadora.",
        source: "Tattered Facade p174",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            loreMerit(
                "Grave Attitude",
                1,
                "Sua certeza sobre a morte impõe penalidade de 1 dado a tentativas de intimidar ou manipular você."
            ),
            loreMerit(
                "Ghostly Dominance",
                2,
                "Após ferir uma aparição ou seus vínculos, ganhe 3 dados para comandar essa aparição."
            ),
            loreMerit("Especialização Necromântica", 3, "Reduza em 1 a dificuldade de Cerimônias de Oblívio."),
            loreMerit(
                "Stolen Will",
                4,
                "Morder o grilhão danificado de um fantasma comandado pode curar seu dano de Força de Vontade."
            ),
            loreMerit(
                "Purge",
                5,
                "Seus ataques podem atingir fantasmas intangíveis e sempre causam dano agravado a eles."
            )
        ]
    },
    {
        title: "Descendente de Idder",
        summary:
            "Uma linhagem errante Banu Haqim com raízes nômades, instintos protetores e profunda experiência em manter rebanhos seguros na estrada.",
        source: "Live from the Succubus Club p158",
        requirementFunctions: [isClan("Banu Haqim")],
        merits: [
            loreMerit(
                "Animal Affinity",
                1,
                "Role novamente Checagens de Sangue para manter carniçais animais e mantenha dois Famuli se conhecer Vínculo Familiar."
            ),
            loreMerit("Pastor", 2, "Sacie 1 Fome extra com seu Rebanho a cada sessão."),
            loreMerit(
                "Never Unprepared",
                3,
                "Ganhe 2 dados na primeira vez que caçar mortais em uma nova cidade ou ambiente."
            ),
            loreMerit(
                "Safe Haven",
                4,
                "Se estiver livre e a meia hora do nascer do sol, ganhe 1 Fome para que a Besta encontre abrigo diurno."
            ),
            loreMerit(
                "Haqim's Justice",
                5,
                "Ganhe 2 dados ao defender ou vingar conexões próximas e, uma vez por história, declare uma vendeta para obter um bônus duradouro contra um alvo."
            )
        ]
    },
    {
        title: "Descendente de Kerwiya",
        summary:
            "Gangrel urbanos descendentes da tradição Gangrel grega, mais à vontade na política dos Membros que no isolamento selvagem.",
        source: "Live from the Succubus Club p159",
        requirementFunctions: [isClan("Gangrel")],
        merits: [
            loreMerit(
                "Hidden Predator",
                1,
                "Você pode aprender Ofuscação sem beber de um professor, embora ela continue fora do clã."
            ),
            loreMerit(
                "Politically Adept",
                2,
                "Ganhe especialidades focadas em vampiros ou primeiros pontos em Política, Sagacidade e Subterfúgio, mas perca acesso a especialidades de cultura mortal."
            ),
            loreMerit(
                "Actions Have Consequences",
                3,
                "Uma vez por história, pergunte se uma escolha aumentará o perigo vindo de outros Membros e receba uma resposta de sim ou não."
            ),
            loreMerit(
                "A Economia de Favores",
                4,
                "Uma vez por história, eleve em um grau um favor trivial ou menor devido a você."
            ),
            loreMerit(
                "Echoes of Constantinople",
                5,
                "Após rolar Sagacidade, Subterfúgio ou Política, defina um dado como 10."
            )
        ]
    },
    {
        title: "Descendente de Phaedyme",
        summary:
            "Ravnos descendentes de uma tradição marcial de cavaleiros-peregrinos, conhecidos por viagem, guarda e uma honra difícil.",
        source: "Live from the Succubus Club p160",
        requirementFunctions: [isClan("Ravnos")],
        merits: [
            loreMerit(
                "Skilled Traveler",
                1,
                "Ganhe especialidades de viagem e combate ou primeiros pontos, mas não pode escolher especialidades de perícias de conhecimento."
            ),
            loreMerit(
                "Safe Routes",
                2,
                "Uma vez por sessão, contorne bloqueios ou obstáculos pegando uma rota mais longa, com as consequências do atraso."
            ),
            loreMerit(
                "Renown Guardian",
                3,
                "Uma vez por história, uma autoridade local concede a você uma função de segurança quando pedir."
            ),
            loreMerit(
                "Honra entre os Desonrados",
                4,
                "Ganhe uma Convicção extra de dever, honra ou cavalaria que não precisa de Pilar."
            ),
            loreMerit(
                "Defender",
                5,
                "Uma vez por história, role novamente Checagens de Sangue de Surto de Sangue por uma cena enquanto defende alguém ou algo importante."
            )
        ]
    },
    {
        title: "Descendente do Senhor Caído",
        summary:
            "Uma linhagem Salubri militante moldada pela guerra do Sabá, rancores antigos e disciplina violenta.",
        source: "Live from the Succubus Club p161",
        requirementFunctions: [isClan("Salubri")],
        merits: [
            loreMerit(
                "Instinct for Death",
                1,
                "Ganhe duas especialidades de combate ou primeiros pontos, mas personagens muito humanitários acham mais difícil lidar com você."
            ),
            loreMerit(
                "Tracker's Mark",
                2,
                "Ganhe 2 dados para rastrear qualquer pessoa que você tenha atacado em combate."
            ),
            loreMerit(
                "Fury's Strike",
                3,
                "Uma vez por cena, após acertar em combate próximo, use imediatamente um poder de Disciplina contra esse alvo como se tivesse toque ou contato visual."
            ),
            loreMerit(
                "What Must Be Done",
                4,
                "Ganhe uma Convicção permanente de destruição de inimigo que não precisa de Pilar."
            ),
            loreMerit(
                "Vengeful Eye",
                5,
                "Ao rolar novamente dados de Armas Brancas com Força de Vontade, role novamente um dado extra, até mesmo de Fome, enquanto expõe seu terceiro olho."
            )
        ]
    },
    {
        title: "Imitador do Clube Súcubo",
        summary:
            "Dono ou operador-chave de uma boate tentando capturar o glamour perigoso do lendário Succubus Club.",
        source: "Live from the Succubus Club p162",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Dedo no Pulso",
                1,
                "Ganhe 1 dado em paradas Sociais envolvendo mortais importantes que desejam seu favor ou discrição."
            ),
            loreMerit(
                "Energizing Beat",
                2,
                "Sangue caçado no seu clube conta como Ressonância Intensa para você."
            ),
            loreMerit(
                "Damage Control",
                3,
                "Uma vez por sessão enquanto caça no clube, role novamente todos os dados após um Crítico Bestial ou teste de frenesi falho."
            ),
            loreMerit(
                "Loyalty",
                4,
                "Sua equipe resiste automaticamente a laços, Dominação ou Presença que a colocariam contra você ou contra o clube."
            ),
            loreMerit(
                "Destination of Choice",
                5,
                "Uma vez por sessão, solicite sediar a principal reunião dos mortos-vivos da cidade no seu clube."
            )
        ]
    },
    {
        title: "O Pony Express",
        summary:
            "Uma rede de mensageiros da Camarilla que transporta mensagens físicas seguras, pessoas e bens entre domínios depois que comunicação digital se tornou mortal.",
        source: "Live from the Succubus Club p163",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Acesso à Rede",
                1,
                "Envie ou receba um pacote ou mensagem segura por qualquer domínio atendido pelo Express."
            ),
            loreMerit(
                "Station Agent",
                2,
                "Ganhe uma Máscara 2, Apagado e o uso de um refúgio Express 2 enquanto lida com entregas locais arriscadas.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Máscara", 2, "Pony Express"),
                        bonusMerit("Apagado", 1),
                        bonusMerit("Refúgio", 2, "Pony Express")
                    ]
                }
            ),
            loreMerit(
                "Driver",
                3,
                "Uma vez por história, obtenha um veículo de viagem adequado e use a cadeia de estações seguras do Express."
            ),
            loreMerit(
                "World Tour",
                4,
                "Uma vez por história, acesse viagem internacional segura para Membros com estações seguras em ambas as pontas."
            ),
            loreMerit(
                "Passenger Service",
                5,
                "Uma vez por história, mova você e sua coterie para outro destino atendido pelo Express."
            )
        ]
    },
    {
        title: "Mensageiro de Estrada",
        summary:
            "Um mensageiro discreto que sobrevive a longas noites na estrada, vias ruins e aos perigos de transportar carga sensível.",
        source: "Live from the Succubus Club p164",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Bucket",
                1,
                "Ganhe 2 dados para encontrar um veículo temporário em cidades ou ao longo de estradas principais."
            ),
            loreMerit(
                "Seis da Manhã",
                2,
                "Uma vez por história, ganhe 4 dados para encontrar abrigo veicular contra o amanhecer em uma estrada ou perto dela."
            ),
            loreMerit(
                "Chosen Steed",
                3,
                "Escolha um veículo que manteve por uma história; ganhe 3 dados para conduzi-lo ou trabalhar nele."
            ),
            loreMerit(
                "Highway Harbinger",
                4,
                "Por três noites em uma nova cidade, ganhe 3 dados para intimidar, investigar ou navegar rumores vampíricos, mas atraia um Adversário temporário."
            ),
            loreMerit(
                "Midnight Express",
                5,
                "Ganhe Contatos de mensageiros e, uma vez por história, faça-os reconhecer e liberar uma rota para uma noite de viagem em alta velocidade."
            )
        ]
    },
    {
        title: "Histórias das Filhas",
        summary:
            "Um vínculo suspeito, fingido ou genuíno com as lendárias Filhas da Cacofonia e seus dons vocais sobrenaturais.",
        source: "Live from the Succubus Club p165",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Aspiring Idol",
                1,
                "Ganhe 2 dados em testes de canto, mas uma falha dispara imediatamente uma Compulsão."
            ),
            loreMerit(
                "Surprise Performance",
                2,
                "Uma vez por história, adicione 2 sucessos a um teste de fala pública depois de rolar."
            ),
            loreMerit(
                "Wayward Daughter",
                3,
                "Passe-se por uma Filha no seu domínio e distribua 4 pontos entre Status, Rebanho e Mawla até ser exposto."
            ),
            loreMerit(
                "Songstress Supreme",
                4,
                "Ganhe 4 dados em performances vocais, mas receba Perseguidores e um Adversário possessivo ou ciumento."
            ),
            loreMerit(
                "Rejuvenating Voice",
                5,
                "Ganhe 2 dados em Presença não intimidadora, Acalmar a Besta ou Obeah e, uma vez por história, cure a Força de Vontade dos ouvintes por meio de canção."
            )
        ]
    },
    {
        title: "Contrato do Templo do Estrondo",
        summary:
            "Uma conexão comercial ou artística com o império de entretenimento Anarquista de Victor Temple e sua marca crescente de boates.",
        source: "Live from the Succubus Club p166",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Chocolate Drop",
                1,
                "Ganhe 1 ponto em Fama e 1 em Contatos como talento do Temple, além de um Defeito Perseguidores.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Fama", 1, "talento do Temple"),
                        bonusMerit("Contatos", 1, "talento do Temple"),
                        bonusFlaw("Perseguidores", 1, "talento do Temple")
                    ]
                }
            ),
            loreMerit(
                "Got Connections",
                2,
                "Ganhe temporariamente Recursos ou Contatos ao recrutar talentos para o Temple of Boom."
            ),
            loreMerit(
                "This is Fine",
                3,
                "Uma vez por história, mencione Victor para ganhar 3 dados em cenas de negócios ou entretenimento, mas receba um Inimigo temporário."
            ),
            loreMerit(
                "Maharaja/Maharani",
                4,
                "Abra uma franquia de clube Temple, melhorando Refúgio, Fama, Recursos, Rebanho e uma especialidade enquanto torna o refúgio Comprometido."
            ),
            loreMerit(
                "Se Não Agora, Quando?",
                5,
                "Tenha um favor maior de Victor Temple, mas usá-lo marca sua conexão Anarquista para a Camarilla."
            )
        ]
    },
    {
        title: "Descendente de Al-Ashrad",
        summary:
            "Uma linhagem feiticeira Banu Haqim que carrega o prestígio, as visões e o ódio de al-Ashrad por espíritos hostis e cismáticos do clã.",
        source: "Blood Sigils p177",
        requirementFunctions: [isClan("Banu Haqim")],
        merits: [
            loreMerit(
                "Stories of Old",
                1,
                "Ganhe 2 dados em testes de Liderança ao invocar al-Ashrad ou Haqim para motivar outros."
            ),
            loreMerit(
                "Sight Beyond Sight",
                2,
                "Uma vez por sessão, use Sentir o Invisível com Potência de Sangue no lugar de Auspícios, ou ganhe 2 dados se já o conhece."
            ),
            loreMerit(
                "Vengeful Sorcery",
                3,
                "Uma vez por sessão em conflito violento, ganhe 2 dados em um poder nocivo de Feitiçaria de Sangue contra outro vampiro."
            ),
            loreMerit(
                "Banir o Intangível",
                4,
                "Poderes e rituais de Feitiçaria de Sangue que ferem alvos físicos também afetam seres incorpóreos."
            ),
            loreMerit(
                "Amr-in-Waiting",
                5,
                "Ganhe Status Banu Haqim 5 e um ritual gratuito, mas também um poderoso Adversário feiticeiro.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Status", 5, "Banu Haqim"),
                        bonusFlaw("Adversário", 2, "feiticeiro poderoso")
                    ]
                }
            )
        ]
    },
    {
        title: "Estudante de Kirin Taunk",
        summary:
            "Um alquimista sangue-ralo moldado pelas fórmulas eficientes, pragmatismo social e patronato misterioso de Kirin Taunk.",
        source: "Blood Sigils p178",
        requirementFunctions: [isClan("Thin-blood")],
        merits: [
            loreMerit("Eficiência Impressionante", 1, "Reduza pela metade todos os tempos de destilação de fórmulas."),
            loreMerit(
                "Professional Mindset",
                2,
                "Uma vez por sessão, use o nível de Alquimia Sangue-Ralo no lugar de uma Perícia Social menor, a critério do Narrador."
            ),
            loreMerit(
                "A Taunk Formula",
                3,
                "Escolha uma fórmula gratuitamente quando sua alquimia for alta o bastante e ganhe 2 dados para destilá-la."
            ),
            loreMerit(
                "Diplomatic Power",
                4,
                "Ganhe Status 2 tanto com a Camarilla quanto com os Anarquistas.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Status", 2, "Camarilla"),
                        bonusMerit("Status", 2, "Anarquistas")
                    ]
                }
            ),
            loreMerit(
                "Taunk's Patron",
                5,
                "Ganhe um Mawla 5 capaz de aprimorar três fórmulas aprovadas por história com ingredientes raros.",
                { meritsOrFlaws: [bonusMerit("Mawla", 5, "patrono de Taunk")] }
            )
        ]
    },
    {
        title: "Veias da Terra",
        summary:
            "Um místico da arte do sangue que sente e explora veias energéticas ocultas da terra viva e locais furcus.",
        source: "Blood Sigils p179",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Seeking a Vein",
                1,
                "Uma vez por história, declare sua localização atual como um furcus, a critério do Narrador."
            ),
            loreMerit(
                "Atraindo as Moscas",
                2,
                "Ganhe um Rebanho 3 de mortais atraídos por energias da terra, mantido ao compartilhar descobertas.",
                { meritsOrFlaws: [bonusMerit("Rebanho", 3, "energias da terra")] }
            ),
            loreMerit(
                "Revelações da Terra",
                3,
                "Uma vez por sessão, medite em um furcus para fazer uma pergunta verdadeira sobre a localização e movimentação de um Membro."
            ),
            loreMerit(
                "Canalizando a Terra",
                4,
                "Uma vez por sessão, medite em um furcus para adicionar 1 dado a uma parada de Disciplina além da Potência de Sangue."
            ),
            loreMerit(
                "Tiamat's Exchange",
                5,
                "Uma vez por história, ofereça carne ou sangue a um furcus para ganhar 3 sucessos automáticos em um teste escolhido."
            )
        ]
    },
    {
        title: "Vienna Zero",
        summary:
            "Um feiticeiro de sangue ou saqueador com acesso perigoso à arruinada Capela Prime Tremere e aos caçadores que a escavam.",
        source: "Blood Sigils p180",
        requirementFunctions: [hasDiscipline("blood sorcery")],
        merits: [
            loreMerit(
                "Inside Knowledge",
                1,
                "Ganhe 2 dados em rolagens de Ocultismo da arte do sangue ou Política Tremere."
            ),
            loreMerit(
                "Caído do Caminhão",
                2,
                "Ganhe um Contato 3 capaz de obter itens restritos de Vienna Zero se você puder pagar.",
                { meritsOrFlaws: [bonusMerit("Contatos", 3, "itens restritos da Vienna Zero")] }
            ),
            loreMerit(
                "Instrument of Power",
                3,
                "Ganhe um artefato acordado com +1 dado em seus testes, mas cada uso arrisca chamar atenção de caçadores."
            ),
            loreMerit(
                "A Última Cópia",
                4,
                "Possua um grimório Tremere único listando quatro rituais que você pode aprender sem professor na metade do tempo."
            ),
            loreMerit(
                "Deep Clearance",
                5,
                "Ganhe Máscara 3 com Apagado e, uma vez por história, pegue emprestado um artefato de Vienna Zero, mas receba um Inimigo caçador suspeito.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Máscara", 3, "Vienna Zero"),
                        bonusMerit("Apagado", 1),
                        bonusFlaw("Inimigo", 2, "caçador desconfiado")
                    ]
                }
            )
        ]
    },
    {
        title: "Nascimento dos Estados Livres Anarquistas",
        summary:
            "Uma conexão alegada ou genuína com a Segunda Revolta Anarquista em Los Angeles e o mito dos Estados Livres.",
        source: "In Memoriam p149",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Fake Revolutionary",
                1,
                "Ganhe 1 dado para reunir ou manipular Anarquistas, mas veteranos podem perceber sua história falsa."
            ),
            loreMerit(
                "Connections",
                2,
                "Uma vez por história, faça a um contato veterano uma pergunta honesta sobre política Anarquista ou história dos Estados Livres."
            ),
            loreMerit(
                "Original Rebel",
                3,
                "Ganhe 1 dado em testes envolvendo revolução contra o domínio da Camarilla."
            ),
            loreMerit(
                "Herói da Revolução",
                4,
                "Uma vez por história, convoque cinco neófitos Anarquistas para uma ação anti-Camarilla justificada."
            ),
            loreMerit(
                "Legado da Revolução",
                5,
                "Uma vez por crônica, provoque uma revolta Anarquista em todo o domínio com aprovação do Narrador."
            )
        ]
    },
    {
        title: "Cria da Revolução",
        summary:
            "Um Membro sobrevivente ou herdeiro da violência da Revolução Francesa, dos salões reformistas e da política boêmia.",
        source: "In Memoriam p150",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Rousing Speech",
                1,
                "Ganhe 2 dados em Persuasão ou Liderança ao argumentar contra a ordem estabelecida."
            ),
            loreMerit(
                "Sob a Guilhotina",
                2,
                "Uma vez por história, role novamente um teste falho de Frenesi de Fome."
            ),
            loreMerit(
                "Bal des Victimes",
                3,
                "Ganhe 2 ou 3 dados em testes sociais ao criar laços por meio do luto, especialmente com outros presentes."
            ),
            loreMerit(
                "Friend of Beaumont",
                4,
                "Conte Felicien Beaumont como Mawla 5 que pede um favor menor a cada história.",
                { meritsOrFlaws: [bonusMerit("Mawla", 5, "Felicien Beaumont")] }
            ),
            loreMerit(
                "Bohemian Affinities",
                5,
                "Distribua 5 pontos entre Refúgio, Contatos e Recursos e ocasionalmente use os Halls de Montmartre como esconderijo."
            )
        ]
    },
    {
        title: "Descendente de Drácula",
        summary:
            "Uma linhagem Tzimisce que reivindica o legado perigoso, carisma, resiliência ligada à terra e potencial ocultista de Vlad Tepes.",
        source: "In Memoriam p151",
        requirementFunctions: [isClan("Tzimisce")],
        merits: [
            loreMerit(
                "Sangue do Dragão",
                1,
                "Uma vez por história, ganhe 1 dado em todos os testes Físicos por uma cena."
            ),
            loreMerit(
                "Da Terra",
                2,
                "Uma vez por história, enterre-se por 48 horas para curar todo dano agravado de Força de Vontade ou físico."
            ),
            loreMerit(
                "Carisma do Conde",
                3,
                "Ganhe uma especialidade de Persuasão e 1 dado em testes de sedução ou charme."
            ),
            loreMerit(
                "Sussurros no Sangue",
                4,
                "Uma vez por história, use um poder desconhecido de uma Disciplina que já possui em seu nível atual ou inferior."
            ),
            loreMerit(
                "Dracula's Chosen",
                5,
                "Uma vez por história, recorra à sua linhagem para obter até um favor maior, com expectativas políticas associadas."
            )
        ]
    },
    {
        title: "A Ordem dos Arrependidos",
        summary:
            "Membros penitentes que um dia se perderam para a Besta e agora buscam disciplina, expiação e controle.",
        source: "In Memoriam p152",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Sponsorship",
                1,
                "Ganhe um Mawla 3 da ordem que ajuda uma vez por história e pode vigiar sua conduta.",
                { meritsOrFlaws: [bonusMerit("Mawla", 3, "Order of Repentants")] }
            ),
            loreMerit(
                "Surface Empathy",
                2,
                "Uma vez por sessão, ganhe 2 dados em um teste de Sagacidade ou Persuasão."
            ),
            loreMerit(
                "Flagellation",
                3,
                "Ganhe 1 dado para resistir ao frenesi, mas depois deve infligir dano agravado a si mesmo ou falhar no próximo teste de frenesi."
            ),
            loreMerit(
                "Superior Focus",
                4,
                "Uma vez por história, role novamente uma Falha Bestial sem gastar Força de Vontade."
            ),
            loreMerit(
                "Benevolence",
                5,
                "Uma vez por história, role novamente um teste de Remorso falho seu ou de outro jogador."
            )
        ]
    },
    {
        title: "A Dama Vermelha",
        summary:
            "Acesso às festas infames, favoritos mutáveis e favores discretos da Camarilla de uma Toreador de Praga.",
        source: "In Memoriam p153",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Você Precisa Conhecer Alguém",
                1,
                "Conheça um contato capaz de colocá-lo em uma das festas da Dama Vermelha."
            ),
            loreMerit(
                "Person of Interest",
                2,
                "Ganhe 1 dado em testes de Carisma perto da Dama Vermelha ou de seus convidados quando você se encaixa nos gostos atuais dela."
            ),
            loreMerit(
                "A Pretty Pet",
                3,
                "Conte a Dama Vermelha como Mawla 2 e ganhe Rebanho 1 e Recursos 1 enquanto permanecer favorecido.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Mawla", 2, "A Dama Vermelha"),
                        bonusMerit("Rebanho", 1, "A Dama Vermelha"),
                        bonusMerit("Recursos", 1, "A Dama Vermelha")
                    ]
                }
            ),
            loreMerit(
                "A Trusted Friend",
                4,
                "Uma vez por história, receba a Dama Vermelha em troca de um favor e ganhe Status Camarilla 1."
            ),
            loreMerit(
                "Red Haze",
                5,
                "Uma vez por história, faça a Dama Vermelha ocultar evidências de diablerie no seu Sangue e aura."
            )
        ]
    },
    {
        title: "Os Ventrue Vanderbilt",
        summary:
            "Uma conexão Ventrue com a riqueza dourada, vantagem social e barganhas ocultistas ao redor do círculo Vanderbilt.",
        source: "In Memoriam p154",
        requirementFunctions: [isClan("Ventrue")],
        merits: [
            loreMerit(
                "Well-connected",
                1,
                "Uma vez por história, recorra a um parente distante Vanderbilt para um favor social, financeiro ou profissional menor."
            ),
            loreMerit(
                "Financial Problem-solving",
                2,
                "Ganhe 1 Recursos e gaste Força de Vontade para garantir um Lacaio profissional temporário pela história.",
                { meritsOrFlaws: [bonusMerit("Recursos", 1, "Vanderbilt")] }
            ),
            loreMerit(
                "Someone of Worth",
                3,
                "Ganhe 1 dado com a alta sociedade e 1 dado para ler intenções em situações sociais de elite."
            ),
            loreMerit(
                "Por Dentro",
                4,
                "Uma vez por história, chantageie uma ancilla ou ancião adequado, com tentativas repetidas arriscadas possíveis."
            ),
            loreMerit(
                "Ancient Pact",
                5,
                "Realize uma barganha ocultista custosa para obter 2 sucessos automáticos em testes relacionados a finanças por uma história, mas sofra má sorte perto da Morte Final."
            )
        ]
    },
    {
        title: "Os Anubi",
        summary:
            "Coteries caçadoras de Lupinos modeladas a partir dos Anubi de Milwaukee, variando de equipes de ataque armadas com prata a diplomatas tensos entre lobisomens.",
        source: "Let the Streets Run Red p224",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Argent Fury",
                1,
                "Uma vez por história, equipe-se com uma arma de mão ou munição de prata."
            ),
            loreMerit(
                "What Big Eyes You Have",
                2,
                "Uma vez por história, ganhe 2 sucessos automáticos para investigar Lupinos no seu domínio."
            ),
            loreMerit(
                "Brick House",
                3,
                "Gaste 4 pontos em Refúgio e Lacaios dedicados à defesa contra Lupinos."
            ),
            loreMerit(
                "Na Cidade, na Mata",
                4,
                "Escolha um benefício de caça a Lupinos, diplomacia ou sangue de lobisomem para sua organização."
            ),
            loreMerit(
                "Convocar a Matilha",
                5,
                "Uma vez por história, quando Lupinos estiverem envolvidos, convoque um Mawla temporário e Aliados motoqueiros Anubi."
            )
        ]
    },
    {
        title: "Eletria",
        summary:
            "Um vínculo pessoal com Eletria, artista desaparecida, guerreira, antiga Príncipe de Veracruz e outrora companheira de Helena.",
        source: "Let the Streets Run Red p225",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Muse",
                1,
                "Reduza em 1 a dificuldade em testes escolhidos de pintura, escultura ou música."
            ),
            loreMerit(
                "Portrait of a Woman",
                2,
                "Uma vez por sessão, medite sobre a arte de Eletria antes do repouso para recuperar todo dano superficial de Força de Vontade em um teste criativo bem-sucedido."
            ),
            loreMerit(
                "This is Sparta",
                3,
                "Ganhe 1 dado para pesquisa ou defesa ocultista contra incursões hostis de seitas."
            ),
            loreMerit(
                "Ageless Beauty",
                4,
                "Uma vez por sessão, vislumbre e reproduza artisticamente um alvo como ele parecia no passado."
            ),
            loreMerit(
                "Conspicuous Consumption",
                5,
                "Junte-se ao círculo de alimentação de Helena e distribua 5 pontos entre Antecedentes sociais e materiais, com exigência de sigilo."
            )
        ]
    },
    {
        title: "Influenciador Membro de Mídias Sociais",
        summary:
            "Um vampiro arriscando atenção online por dinheiro, alcance, seguidores, informação e alimentação fácil.",
        source: "Let the Streets Run Red p226",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Friends Everywhere",
                1,
                "Uma vez por capítulo, peça ajuda coletiva para um problema, rolando uma perícia desconhecida ou adicionando sucessos a uma área familiar."
            ),
            loreMerit(
                "Niche Following",
                2,
                "Ganhe 2 pontos de Influência específica de área e, uma vez por história, receba um aumento temporário de Recursos por conteúdo pago."
            ),
            loreMerit(
                "Internet Famous",
                3,
                "Ganhe 2 Recursos e, uma vez por história, organize um encontro que fornece Rebanho 1.",
                { meritsOrFlaws: [bonusMerit("Recursos", 2, "fama na internet")] }
            ),
            loreMerit(
                "Collabs and Sponsorships",
                4,
                "Ganhe Fama 2, Aliados fãs 2 e Contato empresarial 2.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Fama", 2, "plataforma online"),
                        bonusMerit("Aliados", 2, "fãs"),
                        bonusMerit("Contatos", 2, "empresa")
                    ]
                }
            ),
            loreMerit(
                "Superstar",
                5,
                "Ganhe Fama 3 e Recursos 3 por sua plataforma, mas sua visibilidade torna exposição mortal.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Fama", 3, "plataforma online"),
                        bonusMerit("Recursos", 3, "plataforma online")
                    ]
                }
            )
        ]
    },
    {
        title: "Juggler",
        summary:
            "Uma conexão com a rede Anarquista de Gary de Juggler, logística revolucionária e planos ocultos contra a Camarilla.",
        source: "Let the Streets Run Red p227",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Pela Causa",
                1,
                "Uma vez por sessão, role novamente Briga, Armas Brancas ou Manha contra membros da Camarilla."
            ),
            loreMerit(
                "Guns to a Knife Fight",
                2,
                "Uma vez por história, acesse um dos esconderijos de armas de Juggler em Gary."
            ),
            loreMerit(
                "Rabble Rouser",
                3,
                "Uma vez por história, convoque um pequeno grupo Anarquista de Membros para criar caos ou lutar."
            ),
            loreMerit(
                "Coordination is Key",
                4,
                "Ganhe Status Anarquista 3, Influência em Gary 3 e, uma vez por história, peça informações recentes de movimentação.",
                { meritsOrFlaws: [bonusMerit("Status", 3, "Gary Anarchs")] }
            ),
            loreMerit(
                "Rust Never Sleeps",
                5,
                "Conte Juggler ou Evelyn como Mawla 4 e, uma vez por história, transforme um Anarquista de outra cidade em Contato temporário.",
                { meritsOrFlaws: [bonusMerit("Mawla", 4, "Juggler or Evelyn")] }
            )
        ]
    },
    {
        title: "Segredos Perdidos da Capela de Milwaukee",
        summary:
            "Acesso aos mistérios, refúgios, grimórios e locais ocultistas abandonados pelos Tremere em Milwaukee.",
        source: "Let the Streets Run Red p228",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Carna's Primogen Files",
                1,
                "Ganhe 1 dado em rolagens de Política envolvendo Membros de Milwaukee."
            ),
            loreMerit(
                "Abandoned Real Estate",
                2,
                "Ganhe acesso a um refúgio em Milwaukee com uma biblioteca ocultista ou arsenal oculto.",
                { meritsOrFlaws: [bonusMerit("Refúgio", 1, "biblioteca ocultista ou arsenal de Milwaukee")] }
            ),
            loreMerit(
                "Victor's Grimoire",
                3,
                "Feiticeiros de sangue podem justificar aprender um ritual especial de Milwaukee e depois aprender mais com o grimório."
            ),
            loreMerit(
                "Objects of Desire",
                4,
                "Ganhe um refúgio precário 4 perto da Zona Nula, além de inimigos e rivais sérios.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Refúgio", 4, "Null Zone"),
                        bonusFlaw("Inimigo", 2, "rivais da Null Zone")
                    ]
                }
            ),
            loreMerit(
                "Dr. Mortius's Haven",
                5,
                "Encontre o refúgio assombrado de Mortius e sua poderosa biblioteca ocultista, com possíveis segredos e defesas dentro."
            )
        ]
    },
    {
        title: "Mark Decker",
        summary:
            "Um lugar na ordem paranoica do Príncipe Decker em Milwaukee, construída sobre patrulhas, defesa contra Lupinos e aplicação severa da lei.",
        source: "Let the Streets Run Red p229",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Good Graces",
                1,
                "Aja com autoridade limitada de Decker em patrulha, mas aceite um Laço de Sangue de um passo."
            ),
            loreMerit(
                "Tyrant's Recognition",
                2,
                "Ganhe Rebanho 2 e Refúgio 1 como direitos de alimentação por proteger Milwaukee.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Rebanho", 2, "direitos de alimentação em Milwaukee"),
                        bonusMerit("Refúgio", 1, "Milwaukee")
                    ]
                }
            ),
            loreMerit(
                "One Strike",
                3,
                "Uma vez por história, negocie uma infração menor às leis de Decker em vez de enfrentar a Morte Final."
            ),
            loreMerit(
                "A Confiança do Príncipe",
                4,
                "Uma vez por história, conte Decker como Mawla 5 ou garanta uma audiência privada com ele."
            ),
            loreMerit(
                "Childe of Mark Decker",
                5,
                "Apenas Gangrel: ganhe Refúgio, Status e uma especialidade de combate pelo Abraço de Decker, além de Adversários que odeiam sua linhagem."
            )
        ]
    },
    {
        title: "Maxwell",
        summary:
            "Apoio do desaparecido Brujah pretendente a Príncipe, sua Vanguarda de Gary e seus planos para retomar Chicago.",
        source: "Let the Streets Run Red p230",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Tactician",
                1,
                "Ganhe 2 dados em rolagens acadêmicas, políticas, militares ou de planejamento enganoso."
            ),
            loreMerit(
                "Travelling Companion",
                2,
                "Uma vez por história, recorra aos aliados de Maxwell para viagem segura entre cidades."
            ),
            loreMerit(
                "Vanguard",
                3,
                "Ganhe Status em Gary 3, um Refúgio 2 e posição local reconhecida.",
                {
                    meritsOrFlaws: [bonusMerit("Status", 3, "Gary"), bonusMerit("Refúgio", 2, "Gary")]
                }
            ),
            loreMerit(
                "A Arte de Desaparecer",
                4,
                "Uma vez por história, Maxwell ajuda a criar ou aposentar uma Máscara 2 para trabalho anônimo.",
                { meritsOrFlaws: [bonusMerit("Máscara", 2, "Maxwell")] }
            ),
            loreMerit(
                "O Príncipe de Outrora e do Futuro",
                5,
                "Ganhe Recursos 5, acesso à lista de favores de Maxwell e a obrigação de gastar seus favores com sabedoria.",
                { meritsOrFlaws: [bonusMerit("Recursos", 5, "Maxwell")] }
            )
        ]
    },
    {
        title: 'The Milwaukee "Null Zone"',
        summary:
            "Conhecimento da zona morta ocultista sob a Universidade Marquette e dos talismãs Lupinos enterrados ali.",
        source: "Let the Streets Run Red p231",
        requirementFunctions: [],
        merits: [
            loreMerit("Lendas de Usla", 1, "Ganhe 1 dado para investigar ou pesquisar a Zona Nula."),
            loreMerit(
                "Dentro da Zona",
                2,
                "Acesse a Zona Nula com segurança e explore seus efeitos estranhos sobre Auspícios, Proteanismo e Feitiçaria de Sangue."
            ),
            loreMerit(
                "St. Joan of Arc Chapel",
                3,
                "Conheça a capela protegida e os túneis ocultos no centro da Zona."
            ),
            loreMerit(
                "Church of Isis",
                4,
                "Uma vez por crônica, convoque um grupo de Aliados ocultistas 5 ligado à Zona."
            ),
            loreMerit(
                "Usla's Talismans",
                5,
                "Com permissão, localize um poderoso talismã de Auspícios ou Proteanismo enquanto atrai perseguição Lupina implacável."
            )
        ]
    },
    {
        title: "Modius",
        summary:
            "Um lealista, correspondente ou beneficiário do autoproclamado Príncipe de Gary e de sua longa rivalidade com Juggler.",
        source: "Let the Streets Run Red p233",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Followers",
                1,
                "Uma vez por capítulo, recorra a outro apoiador de Modius por um pequeno favor em Gary."
            ),
            loreMerit(
                "Windy City Ally",
                2,
                "Ganhe um Lacaio 2 enviado por Modius como agradecimento por apoiar suas ambições em Chicago.",
                { meritsOrFlaws: [bonusMerit("Lacaio", 2, "Modius")] }
            ),
            loreMerit(
                "Chaves da Mansão",
                3,
                "Use o refúgio da mansão de Modius e, uma vez por história, peça informações sobre movimentos Anarquistas."
            ),
            loreMerit(
                "Since 1913",
                4,
                "Ganhe Status Camarilla em Gary 4 e permissão de alimentação por toda Gary, apesar da resistência Anarquista.",
                { meritsOrFlaws: [bonusMerit("Status", 4, "Gary Camarilla")] }
            ),
            loreMerit(
                "Pauper Dynasty",
                5,
                "Conte Modius como Mawla 5 e ganhe 2 Influência em uma cidade que ele espera que você um dia governe.",
                { meritsOrFlaws: [bonusMerit("Mawla", 5, "Modius")] }
            )
        ]
    },
    {
        title: "A Garganta Rubi",
        summary:
            "Uma conexão com a casa de jogos dos mortos-vivos de Atlantic City, onde Membros apostam status, segredos, recipientes e prêmios mais estranhos.",
        source: "Ash and Bone p170",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Rubbing Shoulders",
                1,
                "Mencione patronos importantes para ganhar 1 dado ao obter acesso ou informação em Atlantic City, se escolher bem."
            ),
            loreMerit(
                "O Que Há nas Suas Mangas",
                2,
                "Ganhe 2 dados para intimidar Membros na cena criminal e identificar frequentadores regulares da noite de Atlantic City."
            ),
            loreMerit(
                "Chicken Dinner",
                3,
                "Uma vez por história, assuma responsabilidade por um recipiente humano com uma discrasia à sua escolha."
            ),
            loreMerit(
                "High Roller",
                4,
                "Aumente Recursos em 2 até o máximo de 4 e acesse Rebanho 2 em Atlantic City, mas ganhe um Adversário ciumento.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Recursos", 2, "Ruby Throat"),
                        bonusMerit("Rebanho", 2, "Atlantic City"),
                        bonusFlaw("Adversário", 1, "ciumento")
                    ]
                }
            ),
            loreMerit(
                "Dead Man's Hand",
                5,
                "Antes do jogo anual de apostas mais altas, ganhe Status em Atlantic City 3 e acesso a jogos menores sem rolagem."
            )
        ]
    },
    {
        title: "Relíquias do Véu",
        summary:
            "Relíquias assombradas e grilhões que auxiliam Oblívio, resistem a aparições, revelam segredos ou carregam a atenção dos mortos.",
        source: "Ash and Bone p172",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Torn Shroud",
                1,
                "Tenha um fragmento frágil do Sudário para ganhar 1 dado em paradas de Oblívio até que o uso excessivo o destrua."
            ),
            loreMerit(
                "Burning Effigy",
                2,
                "Queime a efígie uma vez para curar Vitalidade agravada extra no próximo crepúsculo enquanto outra coisa sente a dor."
            ),
            loreMerit(
                "O Manto Emaciado",
                3,
                "Gaste Força de Vontade enquanto veste o robe para obter 2 sucessos automáticos ao resistir a habilidades de aparições."
            ),
            loreMerit(
                "Os Pregos de Dismus",
                4,
                "Possua um prego-relíquia cruel que empala vampiros e os atormenta a cada amanhecer."
            ),
            loreMerit(
                "Codex Caecitus",
                5,
                "Uma vez por história, medite sobre o códice para descobrir um grande segredo mortuário, nome de aparição, grilhão ou ritual de Oblívio."
            )
        ]
    },
    {
        title: "Banqueiros de Dunsirn",
        summary:
            "Uma linhagem Hecata de financistas canibais cujo dinheiro, sigilo e influência mantêm o Clã da Morte solvente.",
        source: "Blood Gods p220",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            loreMerit(
                "Money Obfuscates",
                1,
                "Receba uma Máscara de 2 pontos sustentada pelo dinheiro da família, desde que você a mantenha a cada história.",
                { meritsOrFlaws: [bonusMerit("Máscara", 2, "dinheiro da família")] }
            ),
            loreMerit(
                "Money Talks",
                2,
                "Uma vez por história, compre informações como se tivesse Contatos iguais aos seus Recursos por uma cena."
            ),
            loreMerit(
                "Money Enhances",
                3,
                "Receba 1 dado ao usar seu próprio equipamento de alta qualidade em uma rolagem."
            ),
            loreMerit(
                "Money Multiplies",
                4,
                "Receba 3 pontos de Recursos, até 5, e ajude sua coterie a se recuperar de Destituído ou a comprar Recursos com desconto.",
                { meritsOrFlaws: [bonusMerit("Recursos", 3, "Dunsirn")] }
            ),
            loreMerit(
                "Money Dictates",
                5,
                "Receba Status Hecata 3 e, uma vez por crônica, ajuste os Recursos dos Hecata por uma história, criando inimigos se tirar riqueza de alguém.",
                { meritsOrFlaws: [bonusMerit("Status", 3, "Hecata")] }
            )
        ]
    },
    {
        title: "Arautos de Ashur",
        summary:
            "Remanescentes capadócios mascarados cuja identidade Hecata equilibra erudição sobre a morte, antigas mágoas e experiência no Submundo.",
        source: "Blood Gods p224",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            loreMerit(
                "A Máscara de Cinzas",
                1,
                "Quando uma Âncora morre, o estudo do cadáver pode mover a Convicção dela para outro mortal como se a morte tivesse sido pacífica."
            ),
            loreMerit(
                "A Máscara Dourada",
                2,
                "Use o equivalente a Influência 4 para encobrir mortes causadas por você ou sua coterie."
            ),
            loreMerit(
                "A Máscara Branca",
                3,
                "Receba 3 dados em ações sociais contra Harbingers e 2 dados contra outros Hecata."
            ),
            loreMerit(
                "A Máscara de Obsidiana",
                4,
                "Aprenda Cerimônias de Oblívio sem professor, mas efeitos que miram fantasmas também ameaçam você."
            ),
            loreMerit(
                "A Máscara Lazarena",
                5,
                "Não receba Máculas por matar Hecata ou servos dos Hecata em busca da doutrina necromântica final de sua linhagem."
            )
        ]
    },
    {
        title: "Os Puttanesca Criminosos",
        summary:
            "Executores e solucionadores criminosos de rua dos Hecata, encarregados do trabalho de crime organizado mais sujo da família.",
        source: "Blood Gods p226",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            loreMerit(
                "Friends in Low Places",
                1,
                "Distribua 2 pontos entre Aliados e Recursos a cada história, mas a vigilância policial acompanha isso."
            ),
            loreMerit(
                "Show Your Belly",
                2,
                "Receba 3 dados para convencer pessoas mais fortes a não ferirem ou colocarem você em perigo."
            ),
            loreMerit(
                "Show Your Fists",
                3,
                "Receba 2 dados para intimidar mortais e aumente em 1 o dano desarmado contra eles."
            ),
            loreMerit(
                "Reunir o Esquadrão",
                4,
                "Uma vez por história, reúna Puttanesca locais e Aliados mortais para uma briga, com um sucesso social automático para justificá-la."
            ),
            loreMerit(
                "O Dom",
                5,
                "Receba 3 pontos em Contatos, Influência e Recursos criminosos, mas mantê-los arrisca criar inimigos na polícia.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Contatos", 3, "criminosos"),
                        bonusMerit("Recursos", 3, "criminosos")
                    ]
                }
            )
        ]
    },
    {
        title: "As Górgonas",
        summary:
            "Guerreiros Hecata descendentes das Lamia, ligados a Lilith, ritos Bahari, controle corporal e ao antigo dever de proteger capadócios.",
        source: "Blood Gods p227",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            loreMerit(
                "O Beijo da Serpente",
                1,
                "Uma vez por história, infecte uma presa mortal com uma doença que causa dano agravado ao longo de três noites."
            ),
            loreMerit("Proteção", 2, "Receba 2 dados ao usar Bloqueio para proteger outra pessoa."),
            loreMerit(
                "Four Humours",
                3,
                "Uma vez por história, morda um mortal para penalizar ações que não combinem com a ressonância atual dele."
            ),
            loreMerit(
                "Controlando a Besta",
                4,
                "Uma vez por sessão, converta um crítico bestial em combate em um crítico normal."
            ),
            loreMerit(
                "Medusa's Gaze",
                5,
                "Uma vez por sessão, depois de vencer Intimidação ou um conflito, paralise brevemente o perdedor em combate ou por uma cena fora dele."
            )
        ]
    },
    {
        title: "Convocando a Reunião de Família",
        summary:
            "Um infiltrado Hecata ligado às negociações, assassinatos, favores e consequências espectrais que unificaram o Clã da Morte.",
        source: "Blood Gods p228",
        requirementFunctions: [isClan("Hecata")],
        merits: [
            loreMerit(
                "A Mesa das Crianças",
                1,
                "Receba 2 dados para persuadir Hecata a não reacender antigas mágoas."
            ),
            loreMerit(
                "Atualizando o Rolodex",
                2,
                "Use o equivalente a Status Hecata 3 para obter informações e pequenos favores."
            ),
            loreMerit(
                "Escondendo os Corpos",
                3,
                "Uma vez por história, cobre a dívida de um ancião Hecata como um favor, com uso excessivo criando um Adversário."
            ),
            loreMerit(
                "Dealmaker",
                4,
                "Receba um Mawla Hecata de 5 pontos por um acordo secreto, que se torna um Adversário se for exposto.",
                { meritsOrFlaws: [bonusMerit("Mawla", 5, "acordo secreto Hecata")] }
            ),
            loreMerit(
                "Spiritual Assault",
                5,
                "Receba 2 sucessos automáticos quando você ou alguém que você aconselha usar Cerimônias de Oblívio contra fantasmas hostis."
            )
        ]
    },
    {
        title: "Cria do Anjo Miguel",
        summary:
            "Um cultista Nephilim em busca de beleza, perfeição, hedonismo e do sonho de uma Constantinopla restaurada.",
        source: "Blood Gods p229",
        requirementFunctions: [isNotClan("Nosferatu")],
        merits: [
            loreMerit(
                "Os Grandes e Bons",
                1,
                "Distribua 2 pontos entre Contatos, Fama, Rebanho e Influência, atraindo admiradores fanáticos."
            ),
            loreMerit(
                "Outer Beauty",
                2,
                "Receba 4 pontos de Aparência mesmo após a criação de personagem, mas sua aparência se torna memorável."
            ),
            loreMerit(
                "Hedonistic Pleasure",
                3,
                "Receba 2 dados para encontrar drogas, parceiros ou festas, e escolha Fama 2 ou Status 2."
            ),
            loreMerit(
                "Michael's Calling",
                4,
                "Uma vez por história, use os Antecedentes relevantes de outro membro do culto como se fossem seus."
            ),
            loreMerit(
                "Apagando as Máculas",
                5,
                "Uma vez por história, gaste Força de Vontade e uma hora hedonista para remover a Mácula de outro vampiro."
            )
        ]
    },
    {
        title: "Servidor de Irad",
        summary:
            "Um cultista infiltrado em profundidade que serve aos Antediluvianos enfraquecendo anciões, destruindo alianças e semeando divisão.",
        source: "Blood Gods p230",
        requirementFunctions: [],
        merits: [
            loreMerit("Escudo de Irad", 1, "Receba 1 dado ao mentir para outros Membros."),
            loreMerit(
                "Sword of Irad",
                2,
                "Uma vez por história, adicione 3 dados a uma rolagem central para os planos do seu culto."
            ),
            loreMerit(
                "Conhecer a Vontade dos Antigos",
                3,
                "Receba uma Convicção extra relacionada à infiltração, sustentada pelo culto em vez de por uma Âncora."
            ),
            loreMerit(
                "Cumprir a Vontade dos Antigos",
                4,
                "Uma vez por história, ignore a Maldição do seu clã enquanto age como um Servitor."
            ),
            loreMerit(
                "Kill Thy Brother",
                5,
                "Uma vez por história, receba 2 dados para infligir dano agravado a um vampiro e ignore frenesi de fogo nesse ataque."
            )
        ]
    },
    {
        title: "A Promessa de 1528",
        summary:
            "Conhecimento proibido sobre o pacto prestes a expirar entre os Giovanni e a Camarilla, útil em pressão legal e política.",
        source: "Blood Gods p231",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Legal Scholar",
                1,
                "Receba 2 dados em Persuasão em disputas legais com Membros da Camarilla ou Hecata."
            ),
            loreMerit(
                "Scrap of Information",
                2,
                "Uma vez por história, compartilhe notas de pesquisa para receber um ponto temporário de Antecedente e um grande favor futuro."
            ),
            loreMerit(
                "Tick Tock",
                3,
                "Uma vez por história, consiga uma audiência com uma facção e 2 sucessos automáticos ao usar conhecimento da Promise como vantagem."
            ),
            loreMerit(
                "Faulty Memory",
                4,
                "Uma vez por história, adicione 3 dados quando uma memória ressurgida da Promise puder ajudar."
            ),
            loreMerit(
                "Signatory",
                5,
                "Uma vez por crônica, force um Príncipe da Camarilla ou anziani Hecata a mudar uma decisão em seu favor."
            )
        ]
    },
    {
        title: "Annabelle",
        summary:
            "Uma ligação com a Primigênie Toreador de Chicago, suas festas, contatos na mídia, patrocínio artístico e longa influência entre os Primigênies.",
        source: "Chicago by Night p262",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Intern",
                1,
                "Uma vez por história, peça orientação a Annabelle, quer a ajuda dela seja claramente benéfica ou não."
            ),
            loreMerit(
                "Glitterati",
                2,
                "Uma vez por história, coloque seu nome na lista de convidados de um evento por meio do seu nome ou fama."
            ),
            loreMerit(
                "Com Agradecimentos aos Nossos Doadores",
                3,
                "Uma vez por história, Annabelle organiza uma reunião com alguém importante na arte, mídia ou cultura."
            ),
            loreMerit(
                "Patronage",
                4,
                "Uma vez por história, apresentar ou vender arte por meio de Annabelle aumenta Recursos em 1 pela história."
            ),
            loreMerit(
                "Inner Circle",
                5,
                "Uma vez por história, faça Annabelle levar uma questão de sua escolha ao conselho dos Primigênies."
            )
        ]
    },
    {
        title: "Indústrias Ballard",
        summary:
            "Acesso ao império corporativo de Horatio Ballard, sua máquina jurídica, influência policial e poder financeiro Ventrue.",
        source: "Chicago by Night p263",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Deep Pockets",
                1,
                "Uma vez por história, restaure Recursos depois que um evento os reduzir."
            ),
            loreMerit(
                "Onde a Turma Popular Vai",
                2,
                "Uma vez por história, invoque a influência de Ballard para receber 3 dados em um teste social corporativo, ou arrisque uma quebra da Máscara para obter sucesso automático."
            ),
            loreMerit(
                "Eu Lutei Contra a Lei, e Venci",
                3,
                "Sempre tenha acesso a Influência Policial 3 no seu estado ou distrito de origem."
            ),
            loreMerit(
                "Favors for Favors",
                4,
                "Gaste recursos em um SPC para criar uma dívida e ganhar vantagem ao exigir o pagamento."
            ),
            loreMerit(
                "A Vista do Topo",
                5,
                "Comande parte do império de Ballard, recebendo Antecedentes importantes e inimigos nos negócios."
            )
        ]
    },
    {
        title: "Instalação Secreta 24",
        summary:
            "Conhecimento sobre o local oculto de detenção e pesquisa da FIRSTLIGHT em Illinois para vampiros capturados.",
        source: "Chicago by Night p264",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Rumors",
                1,
                "Uma vez por história, receba um rumor possivelmente não confiável sobre desaparecimentos suspeitos."
            ),
            loreMerit(
                "No, Really!",
                2,
                "Uma vez por história, receba uma informação sólida sobre o que você testemunhou."
            ),
            loreMerit(
                "Paranoia Strikes Deep",
                3,
                "Uma vez por história, use Contatos 4 focados na FIRSTLIGHT ou em operações semelhantes de caçadores."
            ),
            loreMerit(
                "É Meu Trabalho Saber Essas Coisas",
                4,
                "Receba Status entre Membros 2 e Influência mortal 2 graças ao seu conhecimento especializado de segurança.",
                { meritsOrFlaws: [bonusMerit("Status", 2, "especialista em segurança dos Membros")] }
            ),
            loreMerit(
                "Aquele que Escapou",
                5,
                "Você escapou do Blacksite 24, pode recuperar uma memória clara por história e resiste ao Rotschreck induzido pela FIRSTLIGHT."
            )
        ]
    },
    {
        title: "O Blue Velvet",
        summary:
            "Um lugar no lendário clube de Bronwyn em Chicago, com sua história, frequentadores, palco, acesso VIP e patrocínio secreto.",
        source: "Chicago by Night p266",
        requirementFunctions: [],
        merits: [
            loreMerit("Est. 1972", 1, "Receba 2 dados para recordar ou usar a história do Blue Velvet."),
            loreMerit(
                "Who's Who",
                2,
                "Uma vez por história, descubra quando um frequentador regular visitou o clube pela última vez, como se comportou e quem encontrou."
            ),
            loreMerit(
                "Standing Gig",
                3,
                "Uma vez por história, enquanto se apresenta no clube, receba Recursos 3 ou Rebanho 3 temporários."
            ),
            loreMerit(
                "VIP Club",
                4,
                "Conte Bronwyn como Aliada ou Mawla de 4 pontos e receba acesso VIP privado."
            ),
            loreMerit(
                "Backstage Pass",
                5,
                "Uma vez por história, peça a ajuda de Bronwyn com dinheiro, influência ou acesso ao clube."
            )
        ]
    },
    {
        title: "O Livro de Nod",
        summary:
            "Estudo, fragmentos e autoridade em torno das escrituras cainitas, profecias nodistas e da história proibida de Caim.",
        source: "Chicago by Night p267",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Precis",
                1,
                "Uma vez por história, adicione 2 dados a Acadêmicos ou Ocultismo sobre história cainita antiga."
            ),
            loreMerit(
                "Well-versed",
                2,
                "Uma vez por história, busque ajuda de um senhor ou Mawla para receber 2 dados em Ocultismo nodista."
            ),
            loreMerit(
                "Scholar",
                3,
                "Uma vez por sessão, adicione 3 dados a Persuasão ao debater o Livro de Nod."
            ),
            loreMerit(
                "Collector",
                4,
                "Uma vez por história, conceda acesso à sua coleção em troca de recursos temporários ou de um favor futuro."
            ),
            loreMerit(
                "Noddist Master",
                5,
                "Uma vez por história, cite um fato ou profecia para obter sucesso automático em um teste apropriado de Persuasão."
            )
        ]
    },
    {
        title: "Gangue Capone",
        summary:
            "Filiação, favores e acesso criminoso por meio da continuação vampírica do submundo de Capone em Chicago comandada por Eddie Wu.",
        source: "Chicago by Night p268",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "A Favor for a Favor",
                1,
                "Uma vez por história, use Contatos e Aliados da Capone Gang para obter bens ilegais, informações ou serviços."
            ),
            loreMerit(
                "In Debt",
                2,
                "Uma vez por história, faça a gangue resolver um grande problema e depois fique devendo um favor a Eddie."
            ),
            loreMerit(
                "Just One Job",
                3,
                "Participe de um assalto planejado e receba Recursos 3 após um trabalho bem-sucedido."
            ),
            loreMerit(
                "One of Us",
                4,
                "Receba Recursos 2, Aliados da Capone Gang 2 e 1 dado em Manha sobre crime organizado.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Recursos", 2, "Gangue Capone"),
                        bonusMerit("Aliados", 2, "Gangue Capone")
                    ]
                }
            ),
            loreMerit(
                "Prodigal Child",
                5,
                "Receba Contatos da Capone Gang 4, Eddie Wu como Mawla 2 e um refúgio em esconderijo da gangue, em troca de lealdade.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Contatos", 4, "Gangue Capone"),
                        bonusMerit("Mawla", 2, "Eddie Wu"),
                        bonusMerit("Refúgio", 1, "esconderijo da Capone Gang")
                    ]
                }
            )
        ]
    },
    {
        title: "A Teia",
        summary:
            "O laço psíquico de um Malkaviano com a Rede da Loucura, de impressões dispersas à comunhão direta com a mente dentro dela.",
        source: "Chicago by Night p270",
        requirementFunctions: [isClan("Malkavian")],
        merits: [
            loreMerit(
                "Uma Falha na Estática",
                1,
                "Capte breves impressões da Rede Malkaviana, o bastante para entender uma ordem ou pedido de ajuda."
            ),
            loreMerit(
                "Step into My Parlor",
                2,
                "Comunique-se nas proximidades pela Rede usando frases curtas, imagens e emoções."
            ),
            loreMerit(
                "Pela Teia",
                3,
                "Mantenha conversas malkavianas em escala urbana e, uma vez por história, inicie o Chamado."
            ),
            loreMerit(
                "Puxar os Fios",
                4,
                "Uma vez por história, observe pelos sentidos do seu senhor ou cria."
            ),
            loreMerit(
                "Malkav's Will",
                5,
                "Uma vez por história, peça um segredo sobre outro Malkaviano ou sobre as ordens da entidade da Rede."
            )
        ]
    },
    {
        title: "Cultivar",
        summary:
            "Um seguidor moldado pelo culto de Lilith de Nerissa Blackwater em uma arma para a Ancestral e o Novo Jardim.",
        source: "Chicago by Night p271",
        requirementFunctions: [],
        merits: [
            loreMerit("Muda Sombria", 1, "Uma vez por história, convoque Aliados mortais Cultivar 2."),
            loreMerit(
                "Fresh Cutting",
                2,
                "Receba uma especialidade de Ocultismo em Bahari, Lilith ou a Ancestral, e Status 1 com os Cultivars.",
                { meritsOrFlaws: [bonusMerit("Status", 1, "Cultivars")] }
            ),
            loreMerit(
                "Suprimindo a Besta",
                3,
                "Receba Rebanho 3 e, uma vez por história, um Refúgio 1 fornecido por cultistas, mas nunca mais poderá se alimentar de animais.",
                { meritsOrFlaws: [bonusMerit("Rebanho", 3, "Cultivars")] }
            ),
            loreMerit(
                "Newly Made Initiate",
                4,
                "Receba Status Cultivar 3 e, uma vez por história, adicione 2 dados a uma rolagem de Força de Vontade ao recordar sua iniciação.",
                { meritsOrFlaws: [bonusMerit("Status", 3, "Cultivars")] }
            ),
            loreMerit(
                "Joia no Jardim",
                5,
                "Receba 4 dados para resistir ao frenesi enquanto mantiver um Jardim e atender aos chamados do culto."
            )
        ]
    },
    {
        title: "Culto de Shalim",
        summary:
            "Uma fé apocalíptica Lasombra dedicada à paz aniquiladora do Abismo e ao fim da realidade.",
        source: "Chicago by Night p272",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Dark Whispers",
                1,
                "Uma vez por história, receba 2 dados para investigar ou identificar o culto."
            ),
            loreMerit(
                "Cult Initiate",
                2,
                "Use a frase do culto para receber 2 dados ao persuadir um membro iniciado a ajudar."
            ),
            loreMerit(
                "Power of Faith",
                3,
                "Ignore penalidades por Debilitação enquanto estiver em uma igreja ou templo."
            ),
            loreMerit(
                "Esmagar os Sonhos da Vida",
                4,
                "Leia a ambição de um alvo, explore-a socialmente e talvez destrua as esperanças dele pela história."
            ),
            loreMerit(
                "Shalim Is",
                5,
                "Receba Rebanho 2, Influência religiosa 3, um Segredo Sombrio e sucesso automático ao ocultar sua filiação ao culto com Autocontrole.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Rebanho", 2, "Culto de Shalim"),
                        bonusFlaw("Segredo Sombrio", 1, "Culto de Shalim")
                    ]
                }
            )
        ]
    },
    {
        title: "Descendente de Lodin",
        summary:
            "Um descendente Ventrue do príncipe caído de Chicago, herdando a autoridade, os segredos, os inimigos e o instinto de sobrevivência de sua linhagem.",
        source: "Chicago by Night p273",
        requirementFunctions: [isClan("Ventrue")],
        merits: [
            loreMerit("Caçula da Família", 1, "Entre os Ventrue de Chicago, sempre tenha Mawla 1.", {
                meritsOrFlaws: [bonusMerit("Mawla", 1, "Chicago Ventrue")]
            }),
            loreMerit(
                "Responsible Middle Childe",
                2,
                "Entre pares de idade e geração semelhantes, sempre tenha Status 2.",
                { meritsOrFlaws: [bonusMerit("Status", 2, "pares")] }
            ),
            loreMerit(
                "Ovelha Negra da Família",
                3,
                "Uma vez por história, descubra um segredo sobre uma das crias de Lodin."
            ),
            loreMerit(
                "Like Sire, Like Childe",
                4,
                "Receba 2 dados para evitar ferimentos físicos ou sobrenaturais fora de conflito físico direto."
            ),
            loreMerit(
                "Long-Lost Relative",
                5,
                "Receba Status Ventrue e da corte 4, atenção social e um lugar à mesa do Príncipe.",
                { meritsOrFlaws: [bonusMerit("Status", 4, "corte Ventrue")] }
            )
        ]
    },
    {
        title: "Incêndios, Enchentes e a Noite do Diabo",
        summary:
            "Experiência com os desastres de Chicago, a política morta-viva escondida neles e as oportunidades que criaram.",
        source: "Chicago by Night p275",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Trivia Buff",
                1,
                "Receba 2 dados em Acadêmicos ou Investigação sobre desastres de Chicago."
            ),
            loreMerit(
                "Old Bones",
                2,
                "Uma vez por história, esconda-se em uma parte antiga e soterrada por reconstruções da cidade para despistar perseguidores."
            ),
            loreMerit(
                "Devil's Night Survivor",
                3,
                "Uma vez por história, adicione 3 dados a rolagens Sociais com sobreviventes de incêndios ou suas crias."
            ),
            loreMerit(
                "Local Hero",
                4,
                "Uma vez por crônica, receba Influência 5 temporária para influenciar a opinião mortal por meio da boa vontade gerada por desastres."
            ),
            loreMerit(
                "Puppetmaster",
                5,
                "Trabalhe com o Narrador para definir o desastre que você ajudou a orquestrar e o que ganhou com isso."
            )
        ]
    },
    {
        title: "FIRSTLIGHT",
        summary:
            "Conhecimento operacional, contramedidas e ajuda interna contra a coalizão de inteligência que caça vampiros.",
        source: "Chicago by Night p276",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Evasion Tactics",
                1,
                "Receba 1 dado para evitar vigilância, perseguição ou gravação."
            ),
            loreMerit(
                "Branch Office",
                2,
                "Conheça a localização da base de operações da FIRSTLIGHT mais próxima."
            ),
            loreMerit(
                "O Que Eles Sabem",
                3,
                "Uma vez por história, pergunte quais informações a FIRSTLIGHT possui sobre você ou um companheiro de coterie."
            ),
            loreMerit(
                "No Records Found",
                4,
                "Receba 3 dados em Furto, Furtividade ou Sobrevivência ao lidar com operações da FIRSTLIGHT."
            ),
            loreMerit(
                "Amigo por Dentro",
                5,
                "Um informante avisa você sobre ações contra você e, uma vez por história, realiza uma pequena sabotagem."
            )
        ]
    },
    {
        title: "Kevin Jackson",
        summary:
            "Serviço ao Príncipe de Chicago, com acesso às suas máscaras, carniçais, influência, rede de gangues e favor político.",
        source: "Chicago by Night p277",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "New Blood",
                1,
                "Uma vez por história, use uma Máscara de 2 pontos especialmente construída, sustentada pela Influência de Jackson."
            ),
            loreMerit(
                "Recent Graduate",
                2,
                "Receba um carniçal Lacaio de 2 pontos que ensina sobre Chicago e ajuda em suas tarefas designadas.",
                { meritsOrFlaws: [bonusMerit("Lacaio", 2, "carniçal de Kevin Jackson")] }
            ),
            loreMerit(
                "Up and Comer",
                3,
                "Receba Influência 3 em um dos interesses de Jackson e, uma vez por história, invoque-o para obter sucesso social automático."
            ),
            loreMerit(
                "Adjutant",
                4,
                "Uma vez por história, convoque os Bloods como Aliados 3 e Contatos 2 para uma cena futura."
            ),
            loreMerit(
                "Tenente do Príncipe",
                5,
                "Receba Kevin Jackson como Mawla 4 e, uma vez por história, peça permissão para Abraçar um mortal escolhido.",
                { meritsOrFlaws: [bonusMerit("Mawla", 4, "Kevin Jackson")] }
            )
        ]
    },
    {
        title: "Iconografia dos Membros",
        summary:
            "Domínio de símbolos vampíricos, moda, grafite e imagética de clã como uma linguagem visual prática.",
        source: "Chicago by Night p278",
        requirementFunctions: [],
        merits: [
            loreMerit("Iconógrafo", 1, "Receba 2 dados em Acadêmicos envolvendo símbolos dos Membros."),
            loreMerit(
                "A Escrita na Parede",
                2,
                "Receba 3 dados em Manha ao interpretar sinais vampíricos locais em arte pública e marcações."
            ),
            loreMerit(
                "Trendsetter",
                3,
                "Receba 2 dados em rolagens Sociais enquanto estiver vestido com a imagética do seu clã ou afiliação."
            ),
            loreMerit(
                "Graffiti Artist",
                4,
                "Receba 3 dados em rolagens de Ofícios envolvendo iconografia dos Membros."
            ),
            loreMerit(
                "Giorgio Who?",
                5,
                "Uma vez por história, seu design concede Status 2 ou sua crítica remove Status 1 por uma sessão."
            )
        ]
    },
    {
        title: "O Labirinto",
        summary:
            "Acesso à superestação subterrânea abandonada de Chicago, suas comunidades ocultas, rumores, festas, oráculos e rotas seguras.",
        source: "Chicago by Night p279",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Tunnel Access",
                1,
                "Use um caminho seguro do Labirinto para se esconder ou escapar, desde que não se desvie."
            ),
            loreMerit(
                "Boxcar Blues",
                2,
                "Receba especialidades de Performance e Manha para decifrar canções populares e rumores do Labirinto."
            ),
            loreMerit(
                "Church",
                3,
                "Conheça e possa frequentar a noite mensal do clube subterrâneo com um acompanhante."
            ),
            loreMerit("Covil de Lydia", 4, "Receba acesso a Lydia, a oráculo, como uma Mawla de 4 pontos.", {
                meritsOrFlaws: [bonusMerit("Mawla", 4, "Lydia, a oráculo")]
            }),
            loreMerit(
                "Hideout",
                5,
                "Receba Aliados 4 da Comunidade de Membros do Labirinto para proteção e esconderijo.",
                { meritsOrFlaws: [bonusMerit("Aliados", 4, "Comunidade de Membros do Labirinto")] }
            )
        ]
    },
    {
        title: "Especialista em Lupinos",
        summary:
            "Conhecimento raro sobre lobisomens testado pela sobrevivência, de rastreamento e táticas a negociações entre Lupinos e Membros.",
        source: "Chicago by Night p280",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Huntsman",
                1,
                "Uma vez por sessão, receba 3 dados em um teste Mental para perseguir Lupinos."
            ),
            loreMerit(
                "Tactician",
                2,
                "Contra Lupinos, seu grupo sempre pode usar Trabalho em Equipe, com todos contribuindo com um dado."
            ),
            loreMerit(
                "Soldier",
                3,
                "Quando Lupinos transformados lutarem fisicamente contra você, o modificador de dano de garras e mordidas deles é reduzido."
            ),
            loreMerit(
                "Trophy",
                4,
                "Uma vez por história, revele um troféu de lobisomem para forçar um Lupino a fugir ou se concentrar apenas em você."
            ),
            loreMerit(
                "Ambassador",
                5,
                "Receba 2 dados para negociar cooperação entre vampiros e lobisomens e, uma vez por crônica, una-os em uma tarefa comum."
            )
        ]
    },
    {
        title: "Nathaniel Bordruff",
        summary:
            "Uma associação perigosa com um amargo ancião Nosferatu que conspira para expor e destruir a sociedade dos Membros.",
        source: "Chicago by Night p281",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Recruit",
                1,
                "Receba Bordruff como Mawla 2, mas aceite um Laço de Sangue de um passo com ele.",
                { meritsOrFlaws: [bonusMerit("Mawla", 2, "Nathaniel Bordruff")] }
            ),
            loreMerit(
                "Collaborator",
                2,
                "Receba Recursos 1 e Status 1 por meio de favores que aprofundam o controle de Bordruff.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Recursos", 1, "Bordruff"),
                        bonusMerit("Status", 1, "favores de Bordruff")
                    ]
                }
            ),
            loreMerit(
                "Accomplice",
                3,
                "Receba um Refúgio em sala segura, Contatos no consistório e informações sobre a causa anti-Membros de Bordruff.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Refúgio", 1, "sala segura"),
                        bonusMerit("Contatos", 1, "consistório")
                    ]
                }
            ),
            loreMerit(
                "Conspirator",
                4,
                "Receba Aliados 4 na rede eclesiástica de carniçais de Bordruff dedicada a destruir mortos-vivos.",
                { meritsOrFlaws: [bonusMerit("Aliados", 4, "rede eclesiástica de carniçais de Bordruff")] }
            ),
            loreMerit(
                "Betrayer",
                5,
                "Escolha entre trair Bordruff ou os Membros, com grandes consequências de Status, Mawla e inimigos."
            )
        ]
    },
    {
        title: "A Dama Pintada",
        summary:
            "Um convite para o salão exclusivo de arte corporal, BDSM e contracultura de Edith Beaubien em Chicago.",
        source: "Chicago by Night p282",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Plus One",
                1,
                "Depois de visitar como convidado de alguém, receba 2 dados em Persuasão e Status temporário com fãs por uma semana."
            ),
            loreMerit(
                "Engraved Invitation",
                2,
                "Receba Influência 2 entre Entusiastas da Painted Lady e acesso a alimentação consensual com jogos de sangue."
            ),
            loreMerit(
                "Schedule an Appointment",
                3,
                "Frequente semanalmente, receba um admirador Lacaio de 2 pontos e melhore Status na contracultura se fizer algum trabalho corporal.",
                { meritsOrFlaws: [bonusMerit("Lacaio", 2, "admirador da Painted Lady")] }
            ),
            loreMerit(
                "VIP",
                4,
                "Receba Rebanho 3 e Contatos 2 na Comunidade BDSM por meio de acesso VIP completo.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Rebanho", 3, "Painted Lady VIP"),
                        bonusMerit("Contatos", 2, "BDSM Community")
                    ]
                }
            ),
            loreMerit(
                "A Beaubien Original",
                5,
                "Receba 2 dados em Manha e Status permanente entre devotos da Painted Lady e Membros de Chicago."
            )
        ]
    },
    {
        title: "Família Revenante: Ducheski",
        summary:
            "Acesso Tremere a uma família revenante em declínio de estudiosos, assistentes e inventores ocultistas.",
        source: "Chicago by Night p283",
        requirementFunctions: [isClan("Tremere")],
        merits: [
            loreMerit(
                "Nourishing Blood",
                1,
                "Receba um Lacaio Ducheski cujo sangue sustenta sem risco de Laço de Sangue."
            ),
            loreMerit(
                "Personal Library",
                2,
                "Escolha duas perícias acadêmicas; especialidades nelas concedem 1 dado extra por meio da biblioteca revenante."
            ),
            loreMerit(
                "Research Team",
                3,
                "Receba um grupo de Lacaios Ducheski e reduza pela metade o tempo para aprender rituais uma vez por história."
            ),
            loreMerit(
                "Ritual Assistant",
                4,
                "Um assistente revenante reduz a dificuldade de rituais em 1, com equipes maiores adicionando dados."
            ),
            loreMerit(
                "Ducheski Invention",
                5,
                "Possua um dispositivo Ducheski personalizado que atua como uma especialidade poderosa para uma perícia."
            )
        ]
    },
    {
        title: "A Sociedade de São Leopoldo",
        summary:
            "Conhecimento interno sobre os antigos caçadores de vampiros da Igreja e seu papel moderno ao lado da FIRSTLIGHT.",
        source: "Chicago by Night p285",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Postulant",
                1,
                "Uma vez por história, peça informações conhecidas sobre a Sociedade."
            ),
            loreMerit("Noviço", 2, "Receba Contatos de 2 pontos em sua antiga comunidade religiosa.", {
                meritsOrFlaws: [bonusMerit("Contatos", 2, "antiga comunidade religiosa")]
            }),
            loreMerit(
                "Brother or Sister",
                3,
                "Receba 2 dados em Acadêmicos e Ocultismo em distritos religiosos e, uma vez por história, encontre um Refúgio 1 em uma igreja.",
                { meritsOrFlaws: [bonusMerit("Refúgio", 1, "igreja")] }
            ),
            loreMerit(
                "Father or Mother",
                4,
                "Receba Influência diocesana 3 contra a Sociedade e Refúgio 2, mas receba Infâmia.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Refúgio", 2, "diocese"),
                        bonusFlaw("Infâmia", 1, "Society of St. Leopold")
                    ]
                }
            ),
            loreMerit(
                "Inquisitor",
                5,
                "Uma vez por história, peça informações verdadeiras sobre a Sociedade e suas atividades atuais."
            )
        ]
    },
    {
        title: "Talley",
        summary:
            "Um vínculo com o assassino e guarda-costas Lasombra, seu senso de perigo, canais secretos e violência profissional.",
        source: "Chicago by Night p286",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Reconhecer os Sinais",
                1,
                "Uma vez por história, pergunte se uma ação provavelmente causará forte retaliação social."
            ),
            loreMerit(
                "Secret Communications",
                2,
                "Uma vez por crônica, reivindique um membro proeminente da Camarilla como Mawla de 3 pontos por uma sessão."
            ),
            loreMerit(
                "Tangled Strings",
                3,
                "Receba 2 dados para detectar manipulação e 2 dados para manipular socialmente o manipulador."
            ),
            loreMerit(
                "Trained Killer",
                4,
                "Uma vez por crônica, Talley atua como Mawla 4 e concede acesso ao seu arsenal portátil.",
                { meritsOrFlaws: [bonusMerit("Mawla", 4, "Talley")] }
            ),
            loreMerit(
                "Personal Defender",
                5,
                "Por uma sessão, Talley serve como seu guarda-costas silencioso sob contrato."
            )
        ]
    },
    {
        title: "Wauneka",
        summary:
            "Confiança e informações da rede de sussurros de rua dos Nosferatu entre os invisíveis e descartados de Chicago.",
        source: "Chicago by Night p287",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Secluded Meetup",
                1,
                "Uma vez por história, encontre Wauneka para receber um segredo de sua rede."
            ),
            loreMerit(
                "Spy Paths",
                2,
                "Uma vez por história, use caminhos ocultos e pontos de observação para espionar sem ser notado."
            ),
            loreMerit(
                "Insider Connections",
                3,
                "Uma vez por história, Wauneka fornece um Lacaio infiltrado temporário 2 que pode se tornar um Contato.",
                { meritsOrFlaws: [bonusMerit("Lacaio", 2, "infiltrado de Wauneka")] }
            ),
            loreMerit(
                "Spy Skills",
                4,
                "Uma vez por história, receba três segredos e especialidades de Investigação e Sagacidade."
            ),
            loreMerit(
                "Darkest Whispers",
                5,
                "Receba Wauneka e seus associados subterrâneos como Aliados 3 e, uma vez por história, aconselhe uma jogada política.",
                { meritsOrFlaws: [bonusMerit("Aliados", 3, "associados subterrâneos de Wauneka")] }
            )
        ]
    },
    {
        title: "Agente da Justicar Parr",
        summary:
            "Serviço como observador, investigador ou arconte de confiança sob a Justicar Malkaviana Juliette Parr.",
        source: "Fall of London p231",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Information Drop",
                1,
                "Uma vez por história, peça informações relevantes para investigação à rede de Parr."
            ),
            loreMerit(
                "Camarilla Conditioning",
                2,
                "Receba 1 dado em testes de Força de Vontade ligados ao dever e para resistir a intimidação ou compulsão que o afastaria do dever."
            ),
            loreMerit(
                "Request Backup",
                3,
                "Uma vez por história, chame um Aliado de 5 pontos para uma cena de apoio da Camarilla."
            ),
            loreMerit(
                "Favored Protege",
                4,
                "Conte Parr como uma Mawla de 5 pontos, mas ela faz exigências possessivas frequentes.",
                { meritsOrFlaws: [bonusMerit("Mawla", 5, "Justicar Parr")] }
            ),
            loreMerit(
                "Camarilla Archon",
                5,
                "Possua um mandado de Arconte que exige cooperação da Camarilla, atraindo respeito, ressentimento e inimigos."
            )
        ]
    },
    {
        title: "Corte das Sombras",
        summary:
            "Serviço ao Rei das Sombras de Londres, obtendo alimento, rumores, contrabando, santuário e raro favor pessoal.",
        source: "Fall of London p232",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Free Meals",
                1,
                "Uma vez por sessão, receba da Corte um recipiente compatível e disposto."
            ),
            loreMerit(
                "Rumor Mill",
                2,
                "Uma vez por sessão, troque informações úteis por rumores ou serviços."
            ),
            loreMerit(
                "Contraband",
                3,
                "Uma vez por história, obtenha drogas ilegais, armas, explosivos ou bens semelhantes por um preço."
            ),
            loreMerit(
                "Santuário",
                4,
                "Uma vez por história, peça à Corte que esconda você com segurança em um dos locais secretos do Rei."
            ),
            loreMerit(
                "Favorecido pelo Rei",
                5,
                "Uma vez por história, recorra diretamente ao Rei das Sombras para obter ajuda materialmente útil."
            )
        ]
    },
    {
        title: "Clube de Caça",
        summary:
            "Filiação à sociedade secreta de Londres dedicada a caçar Membros, infame por caçadas esportivas e diablerie.",
        source: "Fall of London p233",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Huntsman's Newsletter",
                1,
                "Receba aviso sobre Caçadas de Sangue e oportunidades importantes de caça uma vez por história."
            ),
            loreMerit(
                "Experienced Diablerist",
                2,
                "Receba 1 dado em futuras rolagens de absorção de diablerie, arriscando manchas visíveis na aura."
            ),
            loreMerit(
                "Huntsman's Dossier",
                3,
                "Uma vez por história, pergunte ao clube sobre o paradeiro ou refúgios favoritos de um Membro local nomeado."
            ),
            loreMerit(
                "Huntsman's Steed",
                4,
                "Possua um veículo de caça discreto e reforçado, projetado para conter presas Membros."
            ),
            loreMerit(
                "Líder da Caça",
                5,
                "Uma vez por história, nomeie um Membro como presa para assédio e ataques organizados pelo Hunt Club."
            )
        ]
    },
    {
        title: "Londres Sob Londres",
        summary:
            "Domínio Nosferatu dos túneis, estações, passagens de serviço, vermes, esconderijos e rotas invisíveis de Londres.",
        source: "Fall of London p234",
        requirementFunctions: [isClan("Nosferatu")],
        merits: [
            loreMerit(
                "Tube Safety",
                1,
                "Use conhecimento das estações para atravessar ou caçar no metrô sem ser detectado em um teste bem-sucedido de Furtividade."
            ),
            loreMerit(
                "Somewhere to Hide",
                2,
                "Encontre um esconderijo subterrâneo oculto com um teste bem-sucedido de Furto."
            ),
            loreMerit(
                "Network of Vermin",
                3,
                "Encontre animais subterrâneos com mais facilidade e receba 1 dado em poderes relevantes de Animalismo abaixo de Londres."
            ),
            loreMerit(
                "Personal Bolt-Hole",
                4,
                "Mantenha um refúgio subterrâneo mundano secreto e local de armazenamento."
            ),
            loreMerit(
                "Liberdade da Cidade",
                5,
                "Uma vez por história, viaje entre locais da superfície por rotas subterrâneas sem detecção ao nível da rua."
            )
        ]
    },
    {
        title: "Operação Antigen",
        summary:
            "Contatos, vantagem e falso acesso dentro da operação antivampiro que expurgou Londres.",
        source: "Fall of London p235",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Early Warning",
                1,
                "Uma vez, um informante avisa você se a Antigen planejar capturá-lo."
            ),
            loreMerit(
                "Tactical Dossier",
                2,
                "Use os procedimentos da Antigen para superá-los por uma cena antes que eles se adaptem."
            ),
            loreMerit(
                "Sympathetic Insider",
                3,
                "Uma vez por história, pergunte a um Contato cauteloso de 4 pontos sobre atividades da Antigen.",
                { meritsOrFlaws: [bonusMerit("Contatos", 4, "Operação Antigen")] }
            ),
            loreMerit(
                "Get Out of Jail Free",
                4,
                "Chantageie uma figura sênior da Antigen para obter um grande serviço e depois entre na lista de observação deles."
            ),
            loreMerit(
                "Official Credentials",
                5,
                "Use credenciais falsas da Antigen uma vez para comandar pessoal, apreender evidências ou se infiltrar em uma operação."
            )
        ]
    },
    {
        title: "Oskar Anasov",
        summary:
            "Uma relação de trabalho com o mensageiro, contrabandista, executor de pactos e convocador dos Landlords Nosferatu de Londres.",
        source: "Fall of London p236",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Messaging Service",
                1,
                "Pague Anasov para entregar mensagens seguras a outros Membros de Londres."
            ),
            loreMerit(
                "Personal Introduction",
                2,
                "Uma vez por história, pague Anasov para organizar uma reunião presencial com um Membro de Londres."
            ),
            loreMerit(
                "Safe Passage",
                3,
                "Uma vez por história, faça Anasov contrabandear até seis pessoas para dentro ou fora de Londres."
            ),
            loreMerit(
                "Mentor",
                4,
                "Conte Anasov como um Mawla de 4 pontos, com serviços com desconto e pedidos recorrentes.",
                { meritsOrFlaws: [bonusMerit("Mawla", 4, "Oskar Anasov")] }
            ),
            loreMerit(
                "Landlord Council",
                5,
                "Receba convites para reuniões dos Landlords e, uma vez por história, peça a Anasov que convoque uma por um motivo justificável."
            )
        ]
    }
    // {
    //     title: "Sample",
    //     summary: "Sample",
    //     source: "Core V5 p394",
    //     requirementFunctions: [],
    //     merits: [
    //         { name: "Sample", cost: [1], summary: "SampleSummary" },
    //         { name: "Sample", cost: [2], summary: "SampleSummary" },
    //         { name: "Sample", cost: [3], summary: "SampleSummary" },
    //         { name: "Sample", cost: [4], summary: "SampleSummary" },
    //         { name: "Sample", cost: [5], summary: "SampleSummary" },
    //     ]
    // },
]
