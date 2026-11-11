import { z } from "zod"
import banuHaqimLogo from "../resources/clanIcons/BanuHaqim.webp"
import brujahLogo from "../resources/clanIcons/Brujah.webp"
import gangrelLogo from "../resources/clanIcons/Gangrel.webp"
import hecataLogo from "../resources/clanIcons/Hecata.webp"
import lasombraLogo from "../resources/clanIcons/Lasombra.webp"
import malkavianLogo from "../resources/clanIcons/Malkavian.webp"
import ministryLogo from "../resources/clanIcons/Ministry.webp"
import nosferatuLogo from "../resources/clanIcons/Nosferatu.webp"
import ravnosLogo from "../resources/clanIcons/Ravnos.webp"
import salubriLogo from "../resources/clanIcons/Salubri.webp"
import caitiffLogo from "../resources/clanIcons/logoCaitiff.png"
import thinbloodLogo from "../resources/clanIcons/logoThinblood.png"
import toreadorLogo from "../resources/clanIcons/Toreador.webp"
import tremereLogo from "../resources/clanIcons/Tremere.webp"
import tzimisceLogo from "../resources/clanIcons/Tzimisce.webp"
import ventrueLogo from "../resources/clanIcons/Ventrue.webp"
import bloodSorceryLogo from "../resources/Rombo_Disciplines/rombo_BloodSorcery.svg"
import animalismLogo from "../resources/Rombo_Disciplines/rombo_Animalism.svg"
import auspexLogo from "../resources/Rombo_Disciplines/rombo_Auspex.svg"
import celerityLogo from "../resources/Rombo_Disciplines/rombo_Celerity.svg"
import fortitudeLogo from "../resources/Rombo_Disciplines/rombo_Fortitude.svg"
import oblivionLogo from "../resources/Rombo_Disciplines/rombo_Oblivion.svg"
import presenceLogo from "../resources/Rombo_Disciplines/rombo_Presence.svg"
import { ClanName, clanNameSchema, disciplineNameSchema } from "./NameSchemas"

export const clanSchema = z.object({
    name: clanNameSchema,
    displayName: z.string().optional(),
    description: z.string(),
    logo: z.string(),
    bane: z.string(),
    compulsion: z.string(),
    nativeDisciplines: disciplineNameSchema.array(),
    excludedPredatorTypes: z.array(z.string()).default([]).optional(),
    excludedMeritsAndFlaws: z.array(z.string()).default([]).optional()
})
export type Clan = z.infer<typeof clanSchema>
export const clanKeySchema = clanSchema.keyof()
export type ClanKey = z.infer<typeof clanKeySchema>

export const clans: Record<ClanName, Clan> = {
    Brujah: {
        name: "Brujah",
        description: "Rebeldes que sempre lutam contra o poder, fáceis de se irritar",
        logo: brujahLogo,
        bane: "Temperamento Violento: Todas as dificuldades para resistir ao Frenesi aumentam em 2 (máximo de 10).",
        compulsion:
            "Rebelião: Rebele-se contra as ordens ou expectativas de uma autoridade, ou mude a opinião de alguém (pela força, se necessário). Até lá, receba uma penalidade de dois dados em todas as rolagens.",
        nativeDisciplines: ["celerity", "potence", "presence"]
    },
    Gangrel: {
        name: "Gangrel",
        description: "Mais próximos da Fera e ligados à natureza",
        logo: gangrelLogo,
        bane: "Traços Bestiais: No frenesi, você ganha um ou mais traços animais (traço físico, cheiro, comportamento...). Dura até a noite seguinte.",
        compulsion:
            "Impulsos Ferais: Por uma cena, sofra uma penalidade de três dados em Manipulação e Inteligência. Só pode falar em frases de uma palavra.",
        nativeDisciplines: ["animalism", "fortitude", "protean"]
    },
    Nosferatu: {
        name: "Nosferatu",
        description: "Espreitadores desfigurados das sombras",
        logo: nosferatuLogo,
        bane: "Repulsividade: Você é considerado como tendo o Defeito Repulsivo (-2) e nunca pode aumentar sua Vantagem Aparência. Qualquer tentativa de se disfarçar como não deformado (mesmo sobrenatural) sofre uma penalidade de dados igual à GRAVIDADE_DA_MALDICAO.",
        compulsion:
            "Criptofilia: Fique obcecado em obter segredos. Recuse-se a compartilhar segredos com outros, exceto em troca estrita de segredos maiores.",
        nativeDisciplines: ["animalism", "obfuscate", "potence"],
        excludedMeritsAndFlaws: ["Belo(a)", "Deslumbrante"]
    },
    Malkavian: {
        name: "Malkavian",
        description: "Clarividentes que são levados à loucura por seu dom",
        logo: malkavianLogo,
        bane: "Perspectiva Fraturada: Você é amaldiçoado com pelo menos um tipo de perturbação mental.",
        compulsion:
            "Delírio: Penalidade de dois dados em Destreza, Manipulação, Autocontrole e Raciocínio, bem como resistência a frenesi de terror por uma cena.",
        nativeDisciplines: ["auspex", "dominate", "obfuscate"]
    },
    Tremere: {
        name: "Tremere",
        description: "Feiticeiros de sangue, movidos por sua fome de conhecimento",
        logo: tremereLogo,
        bane: "Sangue Deficiente: Não pode criar laços de sangue com outros membros, criar carniçais exige goles adicionais iguais à GRAVIDADE_DA_MALDICAO.",
        compulsion:
            "Perfeccionismo: Até obter um sucesso crítico, todas as ações têm uma penalidade de dois dados. A penalidade é reduzida em um dado para cada repetição de uma ação.",
        nativeDisciplines: ["auspex", "dominate", "blood sorcery"]
    },
    Ventrue: {
        name: "Ventrue",
        description: "Governantes elevados e poderosos, continuamente em busca de mais poder",
        logo: ventrueLogo,
        bane: "Gostos Refinados: Escolha um grupo de vítimas preferidas. Alimentar-se de qualquer pessoa fora desse grupo custa pontos de Força de Vontade iguais à GRAVIDADE_DA_MALDICAO.",
        compulsion:
            "Arrogância: Até que alguém obedeça a uma ordem sua (não forçada por Dominação), você sofre uma penalidade de dois dados em todas as rolagens não relacionadas à liderança.",
        nativeDisciplines: ["dominate", "fortitude", "presence"],
        excludedPredatorTypes: ["Bagger", "Farmer"],
        excludedMeritsAndFlaws: ["Fazendeiro"]
    },
    Toreador: {
        name: "Toreador",
        description: "Artistas obcecados pela beleza, elegantes e muitas vezes esnobes",
        logo: toreadorLogo,
        bane: "Fixação Estética: Enquanto estiver em um ambiente que não seja belo, você sofre uma penalidade igual à GRAVIDADE_DA_MALDICAO nas rolagens de Disciplina.",
        compulsion:
            "Obsessão: Fique obcecado por algo na cena. Sofra uma penalidade de dois dados em quaisquer ações que não estejam diretamente relacionadas a essa coisa. Dura até você não conseguir perceber a coisa ou a cena terminar.",
        nativeDisciplines: ["auspex", "celerity", "presence"]
    },

    Lasombra: {
        name: "Lasombra",
        description: "Predadores sombrios e alpinistas sociais implacáveis",
        logo: lasombraLogo,
        bane: "Imagem Distorcida: Reflexos e gravações (áudio/vídeo) suas distorcem e falham. Telas de toque não respondem.",
        compulsion:
            "Crueldade: A próxima falha após a compulsão faz com que todas as rolagens recebam uma penalidade até que uma tentativa futura da mesma ação seja bem-sucedida.",
        nativeDisciplines: ["dominate", "potence", "oblivion"]
    },
    "Banu Haqim": {
        name: "Banu Haqim",
        description: "Assassinos e juízes com uma paixão distorcida por justiça",
        logo: banuHaqimLogo,
        bane: "Vício de Sangue: Beber de outro vampiro provoca um teste de Frenesi de Fome com dificuldade 2 + GRAVIDADE_DA_MALDICAO.",
        compulsion:
            "Julgamento: Beba pelo menos 1 nível de fome de sangue de alguém que atue contra uma de suas convicções pessoais. Se não puder, sofra uma penalidade de três dados em todas as rolagens até que a compulsão seja satisfeita ou a cena termine.",
        nativeDisciplines: ["celerity", "obfuscate", "blood sorcery"]
    },
    Ministry: {
        name: "Ministry",
        displayName: "Ministério",
        description: "Clã com ares de culto que usa a tentação como arma",
        logo: ministryLogo,
        bane: "Pena da Luz: Sob luz forte, sofra uma penalidade de GRAVIDADE_DA_MALDICAO em todas as rolagens. Receba dano adicional igual à GRAVIDADE_DA_MALDICAO do sol.",
        compulsion:
            "Transgressão: Sofra uma penalidade de dois dados em todas as rolagens não relacionadas a tentar alguém (mesmo a si mesmos) a quebrar um Princípio da Crônica ou Convicção pessoal, causando pelo menos uma Mancha e terminando esta Compulsão.",
        nativeDisciplines: ["obfuscate", "presence", "protean"]
    },
    Ravnos: {
        name: "Ravnos",
        description: "Ilusionistas que estão sempre em movimento",
        logo: ravnosLogo,
        bane: "Condenado: Se você dormir de dia no mesmo lugar mais de uma vez em 7 dias, role dados iguais à GRAVIDADE_DA_MALDICAO e sofra dano agravado igual aos 10s rolados. Precisa estar pelo menos a 1 milha do último local de sono.",
        compulsion:
            "Tentar a Sorte: Da próxima vez que enfrentar um problema, você deve escolher a solução mais perigosa e ousada, ou sofrer uma penalidade de dois dados. Dura até o problema ser resolvido ou novas tentativas serem impossíveis.",
        nativeDisciplines: ["animalism", "obfuscate", "presence"]
    },
    Tzimisce: {
        name: "Tzimisce",
        description: "Moldadores de carne gananciosos e territoriais",
        logo: tzimisceLogo,
        bane: "Enraizado: Escolha um lugar ou grupo. Se dormir longe disso durante o dia, você sofre dano agravado de Força de Vontade igual à GRAVIDADE_DA_MALDICAO.",
        compulsion:
            "Cobiça: Fique obcecado em possuir algo na cena. Qualquer ação que não seja direcionada a esse propósito sofre penalidade de dois dados. Persiste até você possuí-lo ou a posse se tornar impossível.",
        nativeDisciplines: ["animalism", "dominate", "protean"]
    },
    Hecata: {
        name: "Hecata",
        description: "Vampiros especializados em necromancia",
        logo: hecataLogo,
        bane: "O Beijo Doloroso: O seu beijo é extremamente doloroso e não traz nenhum prazer à sua presa.",
        compulsion:
            "Morbidez: Até que você tenha previsto uma morte ou solucionado a causa de uma local, você sofre uma penalidade de três dados em outras rolagens. As conclusões não precisam estar corretas, mas devem fazer sentido.",
        nativeDisciplines: ["auspex", "fortitude", "oblivion"]
    },
    Salubri: {
        name: "Salubri",
        description: "Linhagem quase extinta de vampiros místicos",
        logo: salubriLogo,
        bane: "Caçados: Seu sangue é muito saboroso. Quando outros bebem de você, precisam passar num teste de Frenesi de Fome para parar. Você tem um terceiro olho na testa que não pode ser obscurecido (mesmo de forma sobrenatural), mas pode ser coberto com roupas. Quando usa disciplinas, o olho chora sangue e vampiros com Fome >= 4 devem passar num teste de Frenesi de Fome.",
        compulsion:
            "Empatia Afetiva: Sinta-se sobrecarregado com um problema pessoal de alguém. Sofra uma penalidade de dois dados em todas as ações que não visem resolver o problema. Dura até o problema ser amenizado, uma crise imediata substituí-lo ou a cena terminar.",
        nativeDisciplines: ["auspex", "dominate", "fortitude"]
    },
    Caitiff: {
        name: "Caitiff",
        description: "Vampiros sem clã, frequentemente desconfiados por todos",
        logo: caitiffLogo,
        bane: "Párea: Aumentar níveis de disciplina custa XP igual a 6x o novo nível (em vez de 5x).",
        compulsion: "Caitiffs não possuem compulsão.",
        nativeDisciplines: [
            "animalism",
            "auspex",
            "celerity",
            "dominate",
            "fortitude",
            "obfuscate",
            "potence",
            "presence",
            "protean",
            "blood sorcery",
            "oblivion"
        ]
    },
    "Thin-blood": {
        name: "Thin-blood",
        displayName: "Sangue-Ralo",
        description: "Meio vampiro, meio humano. Desprezados por todos.",
        logo: thinbloodLogo,
        bane: "Párea: Aumentar níveis de disciplina custa XP igual a 6x o novo nível (em vez de 5x).",
        compulsion: "Sangue-Ralos não possuem compulsão.",
        nativeDisciplines: ["thin-blood alchemy"]
    },

    // Sangue Esquecido: estas opções são linhagens completas para fins de criação.
    // Os poderes característicos são Legados (Amálgamas), não Disciplinas paralelas.
    Baali: {
        name: "Baali",
        description: "Profanadores e corruptores que transformam culpa, desejo e medo em instrumentos.",
        logo: bloodSorceryLogo,
        bane: "Repulsa ao Sagrado: quando um símbolo, local ou rito sinceramente sagrado é usado deliberadamente para repelir o Baali, subtraia a Severidade de Maldição de paradas para aproximar-se, tocar, atacar ou afetar diretamente seu portador.",
        compulsion: "Corrupção: descubra, exponha ou explore uma fraqueza íntima de alguém. Até fazê-lo de modo significativo, sofra −2 dados em ações que não contribuam para isso.",
        nativeDisciplines: ["auspex", "presence", "blood sorcery"]
    },
    "Blood Brothers": {
        name: "Blood Brothers",
        displayName: "Irmãos de Sangue",
        description: "Vampiros criados para funcionarem como um Círculo, um organismo distribuído.",
        logo: bloodSorceryLogo,
        bane: "Sangue Estéril: não podem realizar um Abraço verdadeiro. Ao trair, abandonar em perigo evitável ou ferir intencionalmente um integrante do Círculo, sofrem a Severidade de Maldição em todas as paradas até reparar a ruptura por proteção, sacrifício ou partilha de vitae.",
        compulsion: "Conformidade: coordene uma ação com o Círculo ou divida concretamente risco, ferimento, recurso ou responsabilidade com um aliado; caso contrário, sofra −2 dados em ações puramente individuais.",
        nativeDisciplines: ["fortitude", "potence", "protean"]
    },
    "Daughters of Cacophony": {
        name: "Daughters of Cacophony",
        displayName: "Filhas da Cacofonia",
        description: "Sereias vampíricas cuja voz é presença, comunicação e intrusão mental.",
        logo: presenceLogo,
        bane: "Coro Incessante: subtraia a Severidade de Maldição de Percepção baseada apenas em audição e concentração silenciosa. Cantar ignora a penalidade de concentração, mas facilita localizá-la pelo som.",
        compulsion: "Ressonância: transforme o estado emocional de alguém por voz, música ou performance; até fazê-lo, sofra −2 dados em ações que não conduzam a esse momento.",
        nativeDisciplines: ["fortitude", "presence", "dominate"]
    },
    Gargoyles: {
        name: "Gargoyles",
        displayName: "Gárgulas",
        description: "Sentinelas e construtos de carne mineral, feitos para vigiar e sobreviver.",
        logo: fortitudeLogo,
        bane: "Marca do Construto: traços não humanos são evidentes; subtraia a Severidade de Maldição de testes Sociais para passar por humano sob observação próxima.",
        compulsion: "Sentinela: proteja uma pessoa, objeto, passagem ou território contra uma ameaça percebida. Até confrontá-la ou garantir segurança, sofra −2 dados em outras ações.",
        nativeDisciplines: ["fortitude", "potence", "protean"]
    },
    Kiasyd: {
        name: "Kiasyd",
        description: "Sábios azuis e enigmáticos marcados por verdades de outro mundo.",
        logo: auspexLogo,
        bane: "Ferro Frio: armas de ferro frio convertem dano Superficial causado ao Kiasyd em dano Agravado igual à Severidade de Maldição, após as reduções normais.",
        compulsion: "Enigma: desvende uma mentira, código, contradição, segredo ou problema genuíno; até obter informação que resolva parte dele, sofra −2 dados em ações alheias à investigação.",
        nativeDisciplines: ["auspex", "dominate", "oblivion"]
    },
    "True Brujah": {
        name: "True Brujah",
        displayName: "Brujah Verdadeiros",
        description: "Cronistas de causalidade que percebem e deformam a sequência dos acontecimentos.",
        logo: celerityLogo,
        bane: "Atrofia Emocional: subtraia a Severidade de Maldição de Intuição e de testes Sociais que dependam de empatia, afeto genuíno ou sintonia emocional; testes de Remorso nunca ficam abaixo de um dado.",
        compulsion: "Causalidade: formule uma causa plausível sustentada por observação, investigação ou evidência; até isso, sofra −2 dados em ações que não reconstruam a cadeia causal.",
        nativeDisciplines: ["auspex", "celerity", "potence"]
    },
    Ahrimanes: {
        name: "Ahrimanes",
        description: "Caçadoras espirituais que negociam com animais, natureza e espíritos do ermo.",
        logo: animalismLogo,
        bane: "Esterilidade Espiritual: não podem realizar um Abraço verdadeiro; a força de Laços de Sangue que criam é reduzida pela Severidade de Maldição, até o mínimo de 0.",
        compulsion: "Presságio: responda a um acontecimento natural, animal ou espiritual interpretado como presságio; até fazê-lo, sofra −2 dados em ações sem relação com ele.",
        nativeDisciplines: ["animalism", "blood sorcery", "protean"]
    },
    "Children of Osiris": {
        name: "Children of Osiris",
        displayName: "Filhos de Osíris",
        description: "Penitentes ascetas que transformam Humanidade, ritual e autocontrole em poder.",
        logo: bloodSorceryLogo,
        bane: "Ascetismo do Sangue: ao receber Máculas ou encerrar um frenesi, sofra a Severidade de Maldição em paradas de Disciplina até passar uma cena em expiação genuína. A penalidade não acumula.",
        compulsion: "Expiação: corrija um dano, contenha violência ou assuma um custo pelo bem de outro; até isso, sofra −2 dados em ações sem relação com a expiação.",
        nativeDisciplines: ["blood sorcery", "fortitude", "presence"]
    },
    Lhiannan: {
        name: "Lhiannan",
        description: "Bruxas do bosque cujo sangue se prende à terra, símbolos e território consagrado.",
        logo: bloodSorceryLogo,
        bane: "Raiz Territorial: depois da terceira noite inteira fora do Domínio Vinculado, acumule um Definhamento por noite até a Severidade de Maldição; cada ponto subtrai um dado de paradas de Disciplina. Um repouso diurno no Domínio remove todos.",
        compulsion: "Territorialidade: marque, defenda ou reafirme uma fronteira considerada sua; até isso, sofra −2 dados em ações sem relação com o território.",
        nativeDisciplines: ["animalism", "blood sorcery", "presence"]
    },
    Maeghar: {
        name: "Maeghar",
        description: "Vampiros fae-tocados, deformados por uma herança liminar e instável.",
        logo: oblivionLogo,
        bane: "Repulsa ao Sangue Quente: ao alimentar-se diretamente de mortal vivo, teste Autocontrole + Perseverança contra Dificuldade 2 + Severidade de Maldição. Em falha, o sangue não sacia Fome.",
        compulsion: "Estranhamento: fixe-se no elemento mais estranho ou impossível da cena; até tocá-lo, compreendê-lo, segui-lo ou incorporá-lo, sofra −2 dados em tarefas que o ignorem.",
        nativeDisciplines: ["auspex", "oblivion", "protean"]
    },

    "": {
        name: "",
        description: "",
        logo: "",
        bane: "",
        compulsion: "",
        nativeDisciplines: []
    }
}
