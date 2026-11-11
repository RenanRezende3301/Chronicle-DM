import { z } from "zod"
import { ritualSchema } from "./Disciplines.js"
import { transcendentCeremonies } from "./transcendent/rites.generated"
import type { Character } from "./Character.js"

export const ceremonySchema = ritualSchema.extend({
    prerequisitePowers: z.string().array()
})

export type Ceremony = z.infer<typeof ceremonySchema>

const defaultDicePool = "Determinação + Oblívio"

const baseCeremonies: Ceremony[] = [
    {
        name: "O Dom da Vida Falsa",
        summary: "Anime cadáveres preparados para executar um comando simples até concluírem a tarefa ou serem destruídos.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: defaultDicePool,
        ingredients: "Um ou mais corpos humanos, além de uma mistura de sangue, catarro e bile",
        level: 1,
        discipline: "oblivion",
        prerequisitePowers: ["Cinzas às Cinzas"]
    },
    {
        name: "Convocar Espírito",
        summary: "Chame uma aparição nomeada através do Sudário usando um de seus grilhões, sem forçá-la a obedecer.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: defaultDicePool,
        ingredients: "Grilhão da aparição, sua vitae e uma imagem, assinatura ou nome da aparição",
        level: 1,
        discipline: "oblivion",
        prerequisitePowers: ["Grilhão Vinculante"]
    },
    {
        name: "Chamado do Viajante",
        summary: "Envie uma visão dos seus arredores através do Oblívio para chamar outro Shalimita até você.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: defaultDicePool,
        ingredients: "O livro negro entregue durante a doutrinação Shalimita",
        level: 1,
        discipline: "oblivion",
        prerequisitePowers: ["Visão do Oblívio"]
    },
    {
        name: "Despertar o Servo Homuncular",
        summary: "Crie um espião ou perseguidor leal a partir de uma parte corporal decepada ou de uma pequena carcaça animal.",
        rouseChecks: 1,
        requiredTime: "10 min",
        dicePool: defaultDicePool,
        ingredients: "Parte corporal ou pequena carcaça, a arma usada nela e uma mistura corporal repulsiva",
        level: 2,
        discipline: "oblivion",
        prerequisitePowers: ["Onde o Sudário Afina"]
    },
    {
        name: "Cegar o Olho de Liga",
        summary: "Vincule um espírito da morte para sabotar câmeras e vigilância próximas por uma cena.",
        rouseChecks: 1,
        requiredTime: "1 cena",
        dicePool: defaultDicePool,
        ingredients: "Pequeno pedaço de malha de alumínio",
        level: 2,
        discipline: "oblivion",
        prerequisitePowers: ["Conjurar Sombra"]
    },
    {
        name: "Compelir Espírito",
        summary: "Force uma aparição próxima a servir em uma tarefa limitada, com exigências mais severas possíveis em vitórias maiores.",
        rouseChecks: 1,
        requiredTime: "10 min",
        dicePool: defaultDicePool,
        ingredients: "Grilhão da aparição, sua vitae e vantagem contra o grilhão",
        level: 2,
        discipline: "oblivion",
        prerequisitePowers: ["Onde o Sudário Afina"]
    },
    {
        name: "Goela de Ahriman",
        summary: "Preencha um orifício com vazio abissal que destrói pequenos objetos e faz uma mordida causar dano à Força de Vontade.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: defaultDicePool,
        ingredients: "Sala sem luz ou som",
        level: 2,
        discipline: "oblivion",
        prerequisitePowers: []
    },
    {
        name: "Hospedar Espírito",
        summary: "Convide uma aparição para seu corpo, ganhando força física e vitalidade enquanto arrisca possessão.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: defaultDicePool,
        ingredients: "Tributo para uma aparição, inseto parasita e dois de seus dentes",
        level: 3,
        discipline: "oblivion",
        prerequisitePowers: ["Aura de Decomposição"]
    },
    {
        name: "Hordas Cambaleantes",
        summary: "Erga vários cadáveres agressivos que obedecem comandos e atacam outros quando deixados ociosos.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: defaultDicePool,
        ingredients: "Cadáveres preparados e um sacrifício humano fresco",
        level: 3,
        discipline: "oblivion",
        prerequisitePowers: ["Aura de Decomposição"]
    },
    {
        name: "Nome do Pai",
        summary: "Invoque Shalim para esmagar uma vítima com escuridão sensorial e desespero paralisante.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: defaultDicePool,
        ingredients: "Fala em grego antigo, contato visual com a vítima e cinco bastões de carvão",
        level: 3,
        discipline: "oblivion",
        prerequisitePowers: ["Perspectiva Sombria"]
    },
    {
        name: "Assombração Atormentadora",
        summary: "Faça um lugar irradiar pavor sobrenatural, afastando mortais e testando vampiros contra frenesi de terror.",
        rouseChecks: 1,
        requiredTime: "1 cena",
        dicePool: defaultDicePool,
        ingredients: "Mortais submetidos a terror e sofrimento no local",
        level: 3,
        discipline: "oblivion",
        prerequisitePowers: ["Aura de Decomposição"]
    },
    {
        name: "Fortezza Sindonica",
        summary: "Estabeleça uma proteção de corrente que tortura e atrapalha aparições ao cruzarem sua fronteira.",
        rouseChecks: 3,
        requiredTime: "20 min",
        dicePool: defaultDicePool,
        ingredients: "Ossos em pó, sal, corrente de aço, vitae, um dedo e uma bacia de metal",
        level: 3,
        discipline: "oblivion",
        prerequisitePowers: ["Onde o Sudário Afina"]
    },
    {
        name: "Remendar o Véu",
        summary: "Engrosse o Sudário em uma área marcada, bloqueando passagem e espionagem fantasmagóricas enquanto a vela queima.",
        rouseChecks: 1,
        requiredTime: "20 min",
        dicePool: defaultDicePool,
        ingredients: "Ossos moídos, agulha de ferro, categute, vitae e vela de sebo de cabra",
        level: 3,
        discipline: "oblivion",
        prerequisitePowers: ["Onde o Sudário Afina"]
    },
    {
        name: "Criar Golem de Carne",
        summary: "Anime partes costuradas de cadáver em um golem de carne que obedece aos comandos de seu criador.",
        rouseChecks: 1,
        requiredTime: "1 hora",
        dicePool: defaultDicePool,
        ingredients: "Partes de cadáver, argila do leito do mar, cobre dissolvido em ácido e ferramenta de gravação",
        level: 3,
        discipline: "oblivion",
        prerequisitePowers: ["Aura de Decomposição", "Praga Necrótica"]
    },
    {
        name: "Criar Traje de Cadáver",
        summary: "Costure uma vestimenta senciente de pele que alerta sobre perigo, mas traz fraquezas folclóricas.",
        rouseChecks: 1,
        requiredTime: "1 hora",
        dicePool: defaultDicePool,
        ingredients: "Pele humana, gordura mortal, linha encerada e elementos decorativos",
        level: 3,
        discipline: "oblivion",
        prerequisitePowers: ["Perspectiva Sombria", "Toque do Oblívio"]
    },
    {
        name: "Vincular o Espírito",
        summary: "Ancora uma aparição compelida a um lugar ou pessoa, fazendo suas emoções mais fortes assombrarem o alvo.",
        rouseChecks: 1,
        requiredTime: "20 min",
        dicePool: defaultDicePool,
        ingredients: "Grilhão da aparição, sua vitae, um sacrifício humano, sal e um vínculo com o alvo",
        level: 4,
        discipline: "oblivion",
        prerequisitePowers: ["Praga Necrótica"]
    },
    {
        name: "Fender o Sudário",
        summary: "Rasgue a fronteira para as Terras das Sombras, facilitando a passagem e permitindo que fantasmas atravessem se a abertura for ampliada o suficiente.",
        rouseChecks: 1,
        requiredTime: "20 min",
        dicePool: defaultDicePool,
        ingredients: "Bisturi usado, giz ou carvão, seda e um sacrifício humano",
        level: 4,
        discipline: "oblivion",
        prerequisitePowers: ["Praga Necrótica"]
    },
    {
        name: "Macular Recipiente",
        summary: "Infecte o sangue de um mortal para que qualquer vampiro que se alimente dele ganhe Fome em vez de saciá-la.",
        rouseChecks: 1,
        requiredTime: "1 ação",
        dicePool: defaultDicePool,
        ingredients: "Saliva do vampiro",
        level: 4,
        discipline: "oblivion",
        prerequisitePowers: ["Toque do Oblívio"]
    },
    {
        name: "Estertor da Morte",
        summary: "Force um alvo a experimentar a morte de uma aparição escolhida por meio de um vínculo preparado.",
        rouseChecks: 1,
        requiredTime: "20 min",
        dicePool: defaultDicePool,
        ingredients: "Grilhão de uma aparição, lembrança do alvo, vitae, rum forte, vela e tigela",
        level: 4,
        discipline: "oblivion",
        prerequisitePowers: ["Fatal Precognition"]
    },
    {
        name: "Vincular à Forma Mortal",
        summary: "Acorrente o espírito de um mortal ao corpo envelhecido dele, prolongando sua vida sem transformá-lo em carniçal.",
        rouseChecks: 1,
        requiredTime: "1 hora",
        dicePool: defaultDicePool,
        ingredients: "Um mortal, corrente marcada pelo Oblívio, vela de sebo humano, terra de túmulo e fluido corporal",
        level: 4,
        discipline: "oblivion",
        prerequisitePowers: ["Praga Necrótica", "Skuld Cumprido"]
    },
    {
        name: "Ex Nihilo",
        summary: "Atravesse fisicamente para as Terras das Sombras com companheiros, permanecendo lá até encerrar o poder ou ser destruído.",
        rouseChecks: 3,
        requiredTime: "25 min",
        dicePool: defaultDicePool,
        ingredients: "Máscaras, sua vitae para os pés de cada participante e duas moedas por viajante",
        level: 5,
        discipline: "oblivion",
        prerequisitePowers: ["Espírito Definhante"]
    },
    {
        name: "Bênção Lazarena",
        summary: "Ofereça um corpo recém-morto como recipiente para uma aparição voluntária, restaurando-o a uma frágil imitação de vida.",
        rouseChecks: 1,
        requiredTime: "25 min",
        dicePool: defaultDicePool,
        ingredients: "Sacrifício humano, incenso, coração de mamífero e prata em pó",
        level: 5,
        discipline: "oblivion",
        prerequisitePowers: ["Skuld Cumprido"]
    },
    {
        name: "Poço de Contemplação",
        summary: "Abra uma porta para o Oblívio que puxa vítimas para uma prisão negra e vazia.",
        rouseChecks: 1,
        requiredTime: "25 min",
        dicePool: defaultDicePool,
        ingredients: "Pote de tinta, sangue de uma vítima inocente e uma sala apagada com uma porta pintada",
        level: 5,
        discipline: "oblivion",
        prerequisitePowers: ["Avatar Tenebroso"]
    },
    {
        name: "Dom da Vida Verdadeira",
        summary: "Mova anos de vida mortal de uma pessoa para outra, prolongando uma vida ao encurtar a outra.",
        rouseChecks: 1,
        requiredTime: "1 cena",
        dicePool: defaultDicePool,
        ingredients: "Dois mortais e um comprimento de corda de seda",
        level: 5,
        discipline: "oblivion",
        prerequisitePowers: ["Praga Necrótica", "Banquete de Paixão"]
    }
]

export const containsOblivion = (character: Pick<Character, "disciplines">): boolean =>
    character.disciplines.some((power) => power.discipline === "oblivion")

export const characterHasCeremonyPrerequisite = (
    character: Pick<Character, "disciplines">,
    ceremony: Ceremony
): boolean =>
    ceremony.prerequisitePowers.length === 0 ||
    character.disciplines.some(
        (power) =>
            power.discipline === "oblivion" && ceremony.prerequisitePowers.includes(power.name)
    )

export const getCeremonyPrerequisiteLabel = (ceremony: Pick<Ceremony, "prerequisitePowers">) =>
    ceremony.prerequisitePowers.length === 0 ? "Nenhum" : ceremony.prerequisitePowers.join(" ou ")

// Sangue Imemorial, Capítulo VI — Cerimônias de nível 6 a 10.
export const Ceremonies: Ceremony[] = [...baseCeremonies, ...transcendentCeremonies]
