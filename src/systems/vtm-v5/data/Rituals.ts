import { Ritual } from "./Disciplines"
import { transcendentRituals } from "./transcendent/rites.generated"

const baseRituals: Ritual[] = [
    {
        name: "Caminhada de Sangue",
        summary: "Use sangue para descobrir a geração, nome, senhor e, em um crítico, quaisquer Laços de Sangue ativos de um alvo.",
        rouseChecks: 1,
        requiredTime: "1 hora",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Sangue do alvo",
        level: 1
    },
    {
        name: "Aderência do Inseto",
        summary: "Beba sangue misturado a uma aranha recém-esmagada para aderir a paredes como um inseto.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Aranha viva e seu próprio sangue",
        level: 1
    },
    {
        name: "Criar Pedra de Sangue",
        summary: "Embeba lentamente um pequeno ímã com sangue. Depois de pronto, você sente a direção e a distância aproximada da pedra por uma semana.",
        rouseChecks: 1,
        requiredTime: "3 noites",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Pequeno ímã e seu sangue",
        level: 1
    },
    {
        name: "Despertar com o Frescor da Noite",
        summary: "Quando ameaçado durante o dia após realizar este ritual, desperte e ignore penalidades diurnas por uma cena.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Ossos queimados de um galo",
        level: 1
    },
    {
        name: "Proteção contra Carniçais",
        summary: "Coloque uma proteção em um pequeno objeto. Quando um carniçal tenta tocá-lo, use sua rolagem de Ritual; em caso de sucesso, o carniçal não consegue tocá-lo e sofre dano.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "A critério do Narrador",
        level: 1
    },
    {
        name: "Instigar o Jardim",
        summary: "Anime plantas próximas para atrapalhar e ferir qualquer pessoa na área do ritual, exceto o conjurador.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Sangue humano e sementes de papoula",
        level: 1
    },
    {
        name: "Abafar o Medo",
        summary: "Firme-se brevemente contra o fogo, ganhando bônus para resistir ao frenesi de terror causado por chamas.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Objeto sagrado exposto à chama",
        level: 1
    },
    {
        name: "Selar a Marca",
        summary: "Torne permanente uma tatuagem, cicatriz, marca a ferro ou modificação corporal semelhante na carne vampírica.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Prata derretida derramada sobre a modificação corporal",
        level: 1
    },
    {
        name: "Proteção de Carta",
        summary: "Sele uma carta para que qualquer pessoa além do destinatário pretendido seja queimada e a mensagem seja destruída.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Sangue de pombo, cera e sangue de cachorro",
        level: 1
    },
    {
        name: "Mensagem Sangrenta",
        summary: "Escreva uma mensagem de sangue sobre uma superfície reflexiva lembrada para um tipo escolhido de observador.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Espelho, sangue humano e luz UV",
        level: 1
    },
    {
        name: "Beelzebeatit",
        summary: "Torne uma pequena área repelente para animais, vermes, plantas e outras criaturas vivas menores.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Vinagre ou álcool",
        level: 1
    },
    {
        name: "Enriquecer o Sangue",
        summary: "Torne o sangue de um recipiente humano mais rico, para que uma bebida menor sacie mais Fome por pouco tempo.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Frasco do sangue do alvo e sangue humano fresco",
        level: 1
    },
    {
        name: "Astromancia",
        summary: "Leia aptidões, Ambição e motivações profundas de um alvo por meio do sangue dele e do céu noturno.",
        rouseChecks: 1,
        requiredTime: "30 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Céu noturno limpo, superfície de prata e vestígio biológico do alvo",
        level: 1
    },
    {
        name: "Amarrar a Língua Acusadora",
        summary: "Impeça um alvo de comunicar diretamente informações nocivas ou críticas sobre o conjurador.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Imagem do alvo, cabelo dele e cordão de seda preta",
        level: 1
    },
    {
        name: "Como Névoa sobre a Água",
        summary: "Caminhe silenciosamente sobre a superfície de um corpo d'água pelo resto da noite.",
        rouseChecks: 1,
        requiredTime: "10 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Pedaço de madeira de um navio e água",
        level: 2
    },
    {
        name: "Calix Secretus",
        summary: "Armazene sua vitae dentro de um pequeno objeto e libere-a mais tarde com uma palavra de comando.",
        rouseChecks: 1,
        requiredTime: "1 hora",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Objeto do tamanho de uma mão e sangue do conjurador",
        level: 2
    },
    {
        name: "Toque Soporífero",
        summary: "Transforme sua vitae em um narcótico ativado por toque que enfraquece resistências de Autocontrole e Determinação.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Haxixe ou outra substância narcótica",
        level: 2
    },
    {
        name: "O Sudário do Silêncio",
        summary: "Sele uma sala para que nenhum som escape até que o foco seja removido ou a cena termine.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Tecido trançado, anel de ouro e vitae de um usuário de Ofuscação",
        level: 2
    },
    {
        name: "Intensificar Discrasia",
        summary: "Amplie a Discrasia de um recipiente para que vários Membros possam se beneficiar dela ao longo de três noites.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Objeto pessoal ressonante pertencente ao alvo",
        level: 2
    },
    {
        name: "Mestre Artesão",
        summary: "Beba o sangue de um indivíduo talentoso para copiar temporariamente uma de suas perícias acadêmicas ou criativas.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Sangue de um indivíduo talentoso, objeto simbólico de ofício e ossos de abutre",
        level: 2
    },
    {
        name: "Profundezas do Pesadelo",
        summary: "Aflija um alvo com pesadelos repetidos que causam dano à Força de Vontade e não curam normalmente.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Cabelo do alvo, cera e natrão",
        level: 2
    },
    {
        name: "Agarre Elemental",
        summary: "Comande seu elemento koldúnico para atrapalhar e golpear um alvo percebido até que seu foco se quebre.",
        rouseChecks: 1,
        requiredTime: "1 ação",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Requer Feitiçaria Koldúnica; uma amostra ou símbolo do elemento escolhido",
        level: 2
    },
    {
        name: "Le Sang de l'Amour",
        summary: "Crie frascos de sangue pareados que permitem a dois amantes desejosos sentir a localização aproximada um do outro.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Sangue dos dois amantes e dois frascos de vidro em correntes",
        level: 2
    },
    {
        name: "Silentia Mortis",
        summary: "Encante um talismã que envolve seu portador em uma zona temporária de silêncio mágico.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Pata de animal silencioso, sangue, vela de cera cadavérica e uma rosa branca",
        level: 2
    },
    {
        name: "Tiamat Reluz",
        summary: "Sintonize um lugar de poder para que o conjurador possa levar seu bônus a rituais realizados ali.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Um furcus ou outro lugar de poder e pó de um metal precioso apropriado",
        level: 2
    },
    {
        name: "Jardim de Vísceras",
        summary: "Cultive plantas alimentadas por Sangue que vampiros conseguem manter no estômago e que preparam mortais para influência.",
        rouseChecks: 1,
        requiredTime: "1 hora",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Terreno, cadáver de um dia, plantas e vitae contínua",
        level: 2
    },
    {
        name: "Fogo no Sangue",
        summary: "Queime o sangue de um alvo à distância, causando dano superficial doloroso e penalidades físicas.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Sangue do alvo, imagem dele e uma vela vermelha ou isqueiro de ferro",
        level: 3
    },
    {
        name: "Um com a Lâmina",
        summary: "Dedique uma arma corpo a corpo a si mesmo para que ela resista à decomposição e possa ser ungida para combate.",
        rouseChecks: 1,
        requiredTime: "1 noite",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Arma corpo a corpo imersa na vitae do conjurador",
        level: 3
    },
    {
        name: "Proteção do Rebanho",
        summary: "Proteja um mortal ou abrigo para que outro vampiro seja queimado e repelido ao tentar se alimentar ali.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Veneno de escorpião e vitae do conjurador",
        level: 3
    },
    {
        name: "Sono de Judas",
        summary: "Prepare um narcótico sobrenatural capaz de incapacitar vampiros e matar mortais ou carniçais.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Sangue de um marco místico e ópio",
        level: 3
    },
    {
        name: "Vigor Comunitário",
        summary: "Fortaleça a Vaulderie de um bando para que seus membros compartilhem a Potência de Sangue do sacerdote pela noite.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Uma unha do sacerdote do bando",
        level: 3
    },
    {
        name: "Ruína Galvânica",
        summary: "Destrua sistemas elétricos próximos, geralmente apagando luzes, alarmes, carros e câmeras.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Moeda de cobre untada com o sangue do conjurador",
        level: 3
    },
    {
        name: "Banquete sem Sangue",
        summary: "Transmute a vida de um humano inconsciente em vitae clara capaz de saciar Fome, mas que convida à diablerie.",
        rouseChecks: 1,
        requiredTime: "3 horas",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Humano inconsciente e cálice de cristal impecável",
        level: 3
    },
    {
        name: "Crisálida Sombria",
        summary: "Cuspa um casulo protetor que o abriga da luz solar e acelera cura ou remodelagem.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Cabelo humano e uma mariposa ou borboleta",
        level: 3
    },
    {
        name: "Banquete de Cinzas",
        summary: "Amaldiçoe um vampiro para que ele vomite sangue por uma noite e só possa saciar Fome com cinzas.",
        rouseChecks: 1,
        requiredTime: "20 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Pergaminho com o nome do alvo, queimado até virar cinzas",
        level: 4
    },
    {
        name: "Memória Guiada",
        summary: "Beba a vitae preparada de um Membro voluntário para reviver suas memórias e desbloquear dons temporariamente.",
        rouseChecks: 1,
        requiredTime: "20 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Vitae de outro vampiro, alecrim seco e papoulas ou miosótis",
        level: 4
    },
    {
        name: "Correntes Invisíveis de Aprisionamento",
        summary: "Prepare um elo de corrente capaz de prender um alvo no lugar e dificultar suas defesas físicas.",
        rouseChecks: 1,
        requiredTime: "1 hora",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Elo de corrente inscrito com o sangue do conjurador",
        level: 4
    },
    {
        name: "Buscar a Vitae Reunida",
        summary: "Sinta uma concentração próxima de vitae de Membros e rastreie sua direção por uma hora.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Tinta vermelha, suco de romã, papel ou tecido branco e um pião grande",
        level: 4
    },
    {
        name: "O Bálsamo de Bathory",
        summary: "Prepare um bálsamo de sangue que restaura temporariamente a beleza juvenil, mas se torna viciante e tóxico.",
        rouseChecks: 1,
        requiredTime: "1 hora",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Vitae do conjurador, sangue mortal jovem, camomila e gordura ou manteiga",
        level: 4
    },
    {
        name: "Dádiva do Éden",
        summary: "Extraia pequenas quantidades de sangue de mortais próximos por meio de uma árvore para reduzir a Fome do conjurador.",
        rouseChecks: 1,
        requiredTime: "25 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Cadáver, árvore viva, maçã fresca e maçã podre",
        level: 5
    },
    {
        name: "Sigilo de Sangue",
        summary: "Preserve permanentemente uma mensagem ou imagem oculta dentro de uma tatuagem em outro vampiro.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Pigmentos de tatuagem misturados com sangue, uma mensagem ou imagem e uma ferramenta afiada aquecida",
        level: 3
    },
    {
        name: "Abrigo Elemental",
        summary: "Funda-se ao seu elemento koldúnico para obter abrigo, percepção e proteção contra a maior parte dos danos.",
        rouseChecks: 1,
        requiredTime: "1 ação",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Requer Feitiçaria Koldúnica; quantidade suficiente do elemento escolhido para envolvê-lo",
        level: 3
    },
    {
        name: "Nepente",
        summary: "Prepare uma poção que suprime Máculas antes do Remorso, arriscando dependência e culpa permanente.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Papoula, flor-de-estrela, mel, lágrimas do alvo e Sangue do conjurador",
        level: 3
    },
    {
        name: "Ver com os Olhos do Céu",
        summary: "Entre em transe para fazer perguntas sobre a localização, arredores e impulsos interiores de um alvo.",
        rouseChecks: 1,
        requiredTime: "30 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Sangue eufórico, incenso, braseiro e imagem do alvo",
        level: 3
    },
    {
        name: "Buscando Tiamat",
        summary: "Use uma vara de adivinhação dolorosa em sua veia para localizar o furcus ou veia da terra mais próximo.",
        rouseChecks: 1,
        requiredTime: "15 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Hamamélis afiada ou ferro magnetizado",
        level: 3
    },
    {
        name: "Alma do Hemonculus",
        summary: "Crie uma duplicata em miniatura e debilitada do seu eu mortal, obrigada a obedecer seus comandos.",
        rouseChecks: 1,
        requiredTime: "1 mês",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Garrafa de vidro, terra de cemitério, sêmen, vitae, um polegar morto e um porco morto",
        level: 3
    },
    {
        name: "Pedra da Forma Verdadeira",
        summary: "Prepare uma pedra arremessável que remove brevemente ilusões, corpos moldados ou metamorfoses.",
        rouseChecks: 1,
        requiredTime: "1 hora",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Esfera entalhada de pedra metamórfica revestida com Sangue fervente",
        level: 3
    },
    {
        name: "Transgressão",
        summary: "Misture-se a uma estrutura preparada e deslize por frestas por onde sangue líquido poderia passar.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Fragmento do local, sangue de ladrão e linha",
        level: 3
    },
    {
        name: "Harúspice Viral",
        summary: "Consulte mortais próximos resfriados para obter impressões sobrepostas ou fatos lembrados.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Rinovírus vivo no Sangue do conjurador, um rato e uma tigela",
        level: 3
    },
    {
        name: "Creatio Ignis",
        summary: "Cubra seus braços com vitae que pega fogo primeiro, permitindo manejar chamas por toque por uma cena.",
        rouseChecks: 1,
        requiredTime: "25 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Vitae suficiente para cobrir ambos os braços e uma fonte de chama",
        level: 5
    },
    {
        name: "Domínio",
        summary: "Reivindique uma construção como seu domínio, impedindo outros de usar Animalismo, Auspícios, Dominação ou Presença ali.",
        rouseChecks: 1,
        requiredTime: "3 horas",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Selos de ferro incrustados sobre todas as portas",
        level: 5
    },
    {
        name: "Compelir o Inanimado",
        summary: "Marque um objeto com sangue para que ele execute um comando simples mais tarde naquela noite.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Objeto inanimado marcado com o Sangue do conjurador",
        level: 4
    },
    {
        name: "Consulta ao Egrégoro",
        summary: "Recorra às perícias de mortais próximos doentes de gripe para aprimorar seus próximos usos de uma Perícia.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Influenza viva no Sangue do conjurador, parasitas, uma faca e um ímã",
        level: 4
    },
    {
        name: "Sustento da Terra",
        summary: "Transforme um lugar de poder em um domínio faminto que mais tarde recompensa o conjurador poupando Checagens de Sangue.",
        rouseChecks: 1,
        requiredTime: "5 noites",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Lugar de poder, marcadores de fronteira e uma adaga",
        level: 4
    },
    {
        name: "Cavalgando as Veias da Terra",
        summary: "Escape de um furcus pelas veias da terra, reaparecendo em outro lugar de poder.",
        rouseChecks: 1,
        requiredTime: "10 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Um furcus e um símbolo de entrada, como uma chave ou bilhete",
        level: 4
    },
    {
        name: "Ataque Elemental",
        summary: "Comande seu elemento koldúnico para atacar um alvo e continuar ferindo-o até que ele escape.",
        rouseChecks: 1,
        requiredTime: "1 ação",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Requer Feitiçaria Koldúnica; uma arma ligada ao elemento escolhido",
        level: 5
    },
    {
        name: "Rei Pescador",
        summary: "Vincule sua percepção a uma região do tamanho de um domínio e faça perguntas verdadeiras sobre a terra.",
        rouseChecks: 1,
        requiredTime: "5 min",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Marco regional, terra local e pincel de crina de cavalo",
        level: 5
    },
    {
        name: "Portal do Simulacro",
        summary: "Construa uma porta réplica sacrificial que permite a vários vampiros cruzar grandes distâncias.",
        rouseChecks: 1,
        requiredTime: "semanas",
        dicePool: "Inteligência + Feitiçaria de Sangue",
        ingredients: "Materiais da réplica, sacrifícios mortais e um sacrifício vampírico",
        level: 5
    }
]

// Sangue Imemorial, Capítulo VI — Rituais de nível 6 a 10.
export const Rituals: Ritual[] = [...baseRituals, ...transcendentRituals]
