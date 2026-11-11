import type { Character, MeritFlaw } from "./Character"
import { ClanName } from "./NameSchemas"
import type {
    Loresheet,
    LoresheetMeritBonuses,
    MeritOrFlaw,
    MeritsAndFlaws
} from "./MeritsAndFlaws"

// Conteudo customizado da cronica AdN X - Sao Paulo, 1942.
// Mesmo schema e helpers do MeritsAndFlawsEssentials.ts.

const isClan = (clan: ClanName) => (character: Character) => character.clan === clan

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


export const saoPauloLoresheets: Loresheet[] = [
    {
        title: "Devedores do Príncipe",
        summary:
            "Onde Dom Vasco patrocinava artistas, Augusto de Alencar patrocina credores. O Príncipe de São Paulo governa por bancos, casas de câmbio, cartórios, contratos de café e a Light. Sua rede de favores é uma rede de dívidas, oferecida em papel timbrado com a polidez de quem faz caridade. Você aceitou o financiamento da casa e cedo ou tarde descobrirá que assinou mais do que leu.",
        source: "AdN X — São Paulo 1942",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Cliente da Casa",
                1,
                "A casa do Príncipe abriu conta em seu nome: ganhe Contatos 1 entre gerentes de banco, cambistas e escreventes de cartório do Triângulo. Cada consulta sua é anotada em algum livro que você nunca verá.",
                { meritsOrFlaws: [bonusMerit("Contatos", 1, "bancos e cartórios do Triângulo")] }
            ),
            loreMerit(
                "Convidado da Recepção",
                2,
                "Seu nome consta da lista da Mansão: ganhe 2 pontos de Status na Camarilla de São Paulo e convite permanente para as recepções da corte e para o Elísio. A cortesia é real; o preço dela ainda não venceu.",
                { meritsOrFlaws: [bonusMerit("Status", 2, "Camarilla de São Paulo")] }
            ),
            loreMerit(
                "O Cartório Certo",
                3,
                "Uma vez por história, você pode providenciar para que um único documento seja registrado, alterado ou 'perdido' nos cartórios controlados pela corte (como uma escritura, procuração ou óbito). O favor entra nos registros da corte e poderá ser cobrado de você no futuro."
            ),
            loreMerit(
                "Ouvido da Corte",
                4,
                "O Príncipe não recebe devedores; a corte recebe por ele. Ganhe como Mawla 5 um intermediário à sua escolha — Beatriz Azevedo de Sampaio, Dona Guiomar de Alcântara ou o Senescal Aurélio de Vasconcelos —, que leva sua causa aos salões; mas ele cobra seus favores em público, e toda a corte passa a saber exatamente quanto você lhe deve.",
                { meritsOrFlaws: [bonusMerit("Mawla", 5, "um intermediário da corte do Príncipe")] }
            ),
            loreMerit(
                "A Linha de Crédito",
                5,
                "Uma vez por história, o aval do Príncipe concede um recurso de grande valor, como uma soma vultosa em dinheiro, proteção formal da corte ou uma audiência exclusiva. Cada uso aumenta sua dívida com a casa, que será cobrada pela corte posteriormente.",
                {
                    meritsOrFlaws: [
                        bonusFlaw(
                            "Segredo Sombrio",
                            2,
                            "dívida com a corte do Príncipe",
                            "Você deve à casa de Alencar mais do que pode quitar; a cobrança vem em favores, no pior momento."
                        )
                    ]
                }
            )
        ]
    },
    {
        title: "As Casas do Gato Molhado",
        summary: "O circuito de solidariedade operária do Movimento Anarquista, tecido no cinturão operário do Leste em torno de uma rede de casas seguras, a Assembleia, a Célula dos Trilhos e a prensa de Isaac Benaroya. Pertencer custa pureza, pois cada favor vende um pedaço da causa.",
        source: "AdN X — São Paulo 1942",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Porta Aberta",
                1,
                "Uma vez por sessão, você pode se abrigar durante o dia em uma das casas seguras do Movimento sem ser questionado. O sangue fraco oferecido no local reduz sua Fome em no máximo 1 e não concede Ressonância."
            ),
            loreMerit(
                "Camaradas",
                2,
                "Ganhe Aliados 2 entre os operários protegidos do Brás e da Mooca: braços, olhos e portas abertas, nunca soldados.",
                { meritsOrFlaws: [bonusMerit("Aliados", 2, "operários do Brás e da Mooca")] }
            ),
            loreMerit(
                "A Prensa de Isaac",
                3,
                "Uma vez por história, encomende a Isaac Benaroya um jogo de documentos falsos convincente — bom o bastante para um fiscal ou um posto policial, mas não para o escrutínio de um censor."
            ),
            loreMerit(
                "Mensageiro dos Trilhos",
                4,
                "Ganhe Lacaios 1 e Contatos 2 na Célula dos Trilhos. Com eles, você pode fazer mensagens, pequenos itens ou recados viajarem rapidamente e de forma discreta por São Paulo através das linhas ferroviárias.",
                { meritsOrFlaws: [bonusMerit("Lacaio", 1, "ghoul ferroviário"), bonusMerit("Contatos", 2, "rede de ferroviários da Célula dos Trilhos")] }
            ),
            loreMerit(
                "A Assembleia Responde",
                5,
                "Uma vez por história, você pode fazer um pedido drástico à Assembleia para conseguir mobilizações massivas do Movimento Anarquista, como greves e esconderijos coletivos. Quem faz pedidos extravagantes terá que responder politicamente perante a Assembleia."
            )
        ]
    },
    {
        title: "A Capela Sem Sinos",
        summary:
            "A capela oculta que é o coração ritual do Sabá em São Paulo: chão consagrado onde a Vaulderie cimenta bandos e Madre Inocência do Abismo administra culpa e penitência. As ordens de cima descem pela boca dos bispos, e servir aqui é pertencer à Espada de Caim com fé absoluta.",
        source: "AdN X — São Paulo 1940",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Irmão de Bando",
                1,
                "O cálice da Vaulderie o cimentou a um bando e a Capela reconhece seu nome. Ganhe Status 1 no Sabá e, uma vez por sessão, +1 dado em testes Sociais com membros da Espada que reconhecem seu bando.",
                { meritsOrFlaws: [bonusMerit("Status", 1, "Sabá")] }
            ),
            loreMerit(
                "Chão Consagrado",
                2,
                "Uma vez por sessão, você pode usar a Capela para se proteger durante um rito, dificultando o rastreio ou ataques de inimigos leigos e fracos fora da seita."
            ),
            loreMerit(
                "Tutor de Caminho",
                3,
                "Ganhe um sacerdote da Capela como Mawla 3 para assuntos de doutrina e para guiá-lo espiritualmente nos Caminhos de Iluminação do Sabá.",
                { meritsOrFlaws: [bonusMerit("Mawla", 3, "Sacerdote da Capela Sem Sinos")] }
            ),
            loreMerit(
                "Olho de um Templário",
                4,
                "Ganhe um Templário da hierarquia como Mawla 5, que o avisa de acusações que se formam e o protege quando pode — mas cobra serviço, e recusá-lo tem preço.",
                { meritsOrFlaws: [bonusMerit("Mawla", 5, "Templário do Sabá")] }
            ),
            loreMerit(
                "Voz no Consistório",
                5,
                "Uma vez por história, convoque um rito, proteja alguém de acusações ou ganhe direito de fala perante os bispos. Você recebe Status 2 no Sabá, mas corre o risco de ter sua própria fé examinada de perto pelas autoridades da Espada de Caim.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Status", 2, "Sabá"),
                        bonusFlaw(
                            "Segredo Sombrio",
                            2,
                            "Capela Sem Sinos",
                            "Sua fé é examinada no Consistório; uma dúvida revelada é sentença de Morte Final."
                        )
                    ]
                }
            )
        ]
    },
    {
        title: "O Mercado dos Mortos",
        summary:
            "Servir à comitiva Della Passaglia, os Giovanni recém-chegados que fazem o varejo do luto: cemitérios, heranças, funerais e todo o comércio da morte sob a matriarca Emília. Protegidos por uma trégua que a corte respeita, eles precisam de mãos que não sejam as deles, e a sua pode ser uma.",
        source: "AdN X — São Paulo 1942",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Gente do Ofício",
                1,
                "Ganhe Contatos 1 entre coveiros, legistas e agentes funerários da cidade — gente do ofício da morte que atende a um nome da comitiva.",
                { meritsOrFlaws: [bonusMerit("Contatos", 1, "ofício da morte")] }
            ),
            loreMerit(
                "Mesa no Havena",
                2,
                "Ganhe acesso ao ponto de encontro da comitiva na Consolação e Recursos 2 provenientes de heranças administradas em seu nome com paciência veneziana.",
                { meritsOrFlaws: [bonusMerit("Recursos", 2, "heranças Della Passaglia")] }
            ),
            loreMerit(
                "Um Favor dos Mortos",
                3,
                "Uma vez por história, os Giovanni prestam um serviço necromântico em seu nome, como localizar um espírito recém-desperto ou arrancar uma resposta de um fantasma conhecido."
            ),
            loreMerit(
                "Conta em Aberto",
                4,
                "Ganhe Emília Della Passaglia como Mawla 4 — mas a família anota cada favor, e dívida com os Giovanni não prescreve.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Mawla", 4, "Emília Della Passaglia"),
                        bonusFlaw(
                            "Adversário",
                            2,
                            "os Della Passaglia",
                            "A comitiva registra tudo o que você deve, e cobra a conta na hora que mais dói."
                        )
                    ]
                }
            ),
            loreMerit(
                "Luva da Família",
                5,
                "Uma vez por história, obtenha recursos substanciais da comitiva Giovanni, como grande soma em dinheiro, capangas mortais ou encobrimento legal. Se os planos falharem, a família negará qualquer ligação e você ficará em débito pesado com ela."
            )
        ]
    },
    {
        title: "A Consignação de Santos",
        summary:
            "Nazário Queirós, o Consignatário, é o senhor sem-filiação do porto de Santos, vendendo serviços a todos. De cada Cainita que desce a prancha ele cobra a consignação: passagem, silêncio e informação. A dívida contraída com ele nunca é esquecida.",
        source: "AdN X — São Paulo 1940",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Conhecido no Cais",
                1,
                "Ganhe Contatos 1 na rede do porto — estivadores da terceira turma, praticagem e um carimbo amigo na alfândega da noite.",
                { meritsOrFlaws: [bonusMerit("Contatos", 1, "porto de Santos")] }
            ),
            loreMerit(
                "Passagem Limpa",
                2,
                "Uma vez por história, suba ou desça a Serra do Mar com carga ou companhia sem registro, sem manifesto e sem pergunta."
            ),
            loreMerit(
                "O Que o Mar Trouxe",
                3,
                "Uma vez por sessão, após um teste de Raciocínio + Contatos (Dificuldade 3), saiba pela rede do porto quem ou o quê desembarcou nas últimas noites: o nome de um navio, um rosto novo, uma carga estranha."
            ),
            loreMerit(
                "Crédito do Consignatário",
                4,
                "Ganhe Nazário Queirós como Mawla 4, mas apenas em negócios do cais — é relação comercial, não afeto. O Consignatário guarda um marcador seu, algo que você não quer que suba a serra, e um dia cobra.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Mawla", 4, "Nazário Queirós"),
                        bonusFlaw(
                            "Segredo Sombrio",
                            1,
                            "Nazário Queirós",
                            "O Consignatário sabe algo que você não quer que chegue ao planalto, e a consignação venceu."
                        )
                    ]
                }
            ),
            loreMerit(
                "Sócio de Fato",
                5,
                "Uma vez por história, obtenha um grande favor logístico no porto, como liberar contrabando pesado, providenciar um sumiço no cais ou impor falsas quarentenas a navios. O Consignatário anotará a sua dívida."
            )
        ]
    },
    {
        title: "As Linhas da Costureira",
        summary: "Benedita, a Primogênita Nosferatu, costura os boatos de São Paulo com coveiros, mendigos e porteiros, possuindo uma rede que alcança mansões e cortiços. Ela vende informações a todos, mas comprar da Costureira tem sempre um preço dobrado.",
        source: "AdN X — São Paulo 1942",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Um Nó na Linha",
                1,
                "Você amarrou seu primeiro nó na rede da Costureira. Ganhe Contatos 1 na rua e no submundo — porteiros, engraxates e coveiros que ouvem a cidade confessar.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Contatos", 1, "A rede de Benedita", "Rua e submundo: porteiros, engraxates e coveiros.")
                    ]
                }
            ),
            loreMerit(
                "Criança de Recado",
                2,
                "Uma vez por sessão, uma criança de recado da rede leva e traz um recado seu pela cidade em uma única noite. Ela obedece à linha, não a você — e a linha lembra do frete."
            ),
            loreMerit(
                "Porta do Warren",
                3,
                "Uma vez por história, use a rede para alcançar a porta de um abrigo Nosferatu como rota de fuga ou refúgio de emergência. Você entra como hóspede, nunca como dono; a hospitalidade dos ratos tem prazo e preço."
            ),
            loreMerit(
                "Fio Puxado",
                4,
                "Uma vez por história, receba uma pista verdadeira baseada no que a rede de informantes de rua poderia plausivelmente descobrir sobre movimentações locais. Benedita passará a saber qual é o seu interesse atual."
            ),
            loreMerit(
                "Agulha da Costureira",
                5,
                "Ganhe Benedita como Mawla 4 e, uma vez por história, o direito de pedir um Hosting ou encontro mediado que cruza linhas de seita numa mesma sala escura. Mas você também está na linha: o que a rede sabe de você também está à venda.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Mawla", 4, "Benedita, a Costureira"),
                        bonusFlaw("Adversário", 2, "Benedita", "O que a rede sabe de você também está à venda; a Costureira vende a todos e não pertence a ninguém.")
                    ]
                }
            )
        ]
    },
    {
        title: "Contar é Cercar",
        summary:
            "O Estado Novo quer contar cada domicílio de São Paulo em cartões de cartolina. Cartões anômalos, indicando prédios sem consumo diurno e proprietários centenários, caem em uma gaveta secreta. Você entendeu que contra uma máquina de burocracia, a vitória exige guerra de informações.",
        source: "AdN X — São Paulo 1942",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Amigo do Recenseador",
                1,
                "Você cultiva escreventes e comissários da contagem — IBGE, cartórios, os escritórios da Sorocabana. Ganhe Contatos 1 nessa burocracia, boa para farejar de longe que ruas entrarão na próxima leva de recenseamento.",
                { meritsOrFlaws: [bonusMerit("Contatos", 1, "burocracia do recenseamento")] }
            ),
            loreMerit(
                "Lastro de Papel",
                2,
                "Sua identidade de fachada tem lastro: certidões, matrículas e recibos limpos e coerentes entre si. Uma vez por sessão, adicione 2 dados a um teste Social para passar por cidadão documentado diante de uma autoridade."
            ),
            loreMerit(
                "Rasura Providencial",
                3,
                "Uma vez por história, um nome, endereço ou registro seu (ou de um refúgio) é rasurado ou corrigido nos róis antes de subir na cadeia. A contagem recomeça do zero naquele ponto — isso compra atraso, nunca esquecimento."
            ),
            loreMerit(
                "O Comissário no Bolso",
                4,
                "Ganhe Aliados 3: um comissário do censo que responde por um setor inteiro da cidade. Uma vez por história, ele desvia oficialmente uma varredura para longe do seu domínio — remarca quarteirões, troca a ordem de vistoria, perde a papelada certa — e a contagem simplesmente contorna você.",
                { meritsOrFlaws: [bonusMerit("Aliados", 3, "comissário do censo")] }
            ),
            loreMerit(
                "A Gaveta",
                5,
                "Uma vez por história, descubra se um cartão específico foi marcado pelo Estado ou delete permanentemente os rastros numéricos de um indivíduo do censo de São Paulo. Esses buracos geram suspeitas, concedendo automaticamente Inimigo 2 (um auditor implacável).",
                { meritsOrFlaws: [bonusFlaw("Inimigo", 2, "quem audita os auditores", "Alguém que audita os auditores notou os buracos nos números e não larga o osso.")] }
            )
        ]
    },
    {
        title: "A Primeira Capela de São Paulo",
        summary:
            "Emmerich Lang, Regente refugiado da Europa, peticiona a primeira licença de capela que a Camarilla local jamais teve: uma capela endividada e vigiada. Sirva à bancada e a corte ganha proteção ritualística; em troca, você amarra seu destino ao de um Magíster sem casa.",
        source: "AdN X — São Paulo 1942",
        requirementFunctions: [isClan("Tremere")],
        merits: [
            loreMerit(
                "Colega de Bancada",
                1,
                "Ganhe um dos aprendizes da capela como Mawla 1 e receba acesso à modesta biblioteca de Emmerich para realizar pesquisas ocultistas.",
                { meritsOrFlaws: [bonusMerit("Mawla", 1, "Béla ou Ottilie")] }
            ),
            loreMerit(
                "Teto Guardado",
                2,
                "Uma vez por sessão, durma na capela para ganhar +2 dados para resistir a invasões e escrutínio místico no seu descanso."
            ),
            loreMerit(
                "O Selo do Regente",
                3,
                "Uma vez por história, requisite um serviço mágico simples da capela, como colocar um ward temporário em seu refúgio pessoal ou obter a autenticação de ressonância de um objeto."
            ),
            loreMerit(
                "Mão Direita",
                4,
                "Ganhe Emmerich Lang como Mawla 3 e o ghoul Reuben como Lacaio 1 para recados diurnos. Em troca, a Ordem na Europa cobra relatórios da capela, e alguns levam a sua assinatura.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Mawla", 3, "Emmerich Lang"),
                        bonusMerit("Lacaio", 1, "o ghoul Reuben")
                    ]
                }
            ),
            loreMerit(
                "Herdeiro da Petição",
                5,
                "Ganhe acesso pleno à biblioteca mágica da capela, equivalente a Refúgio 2. Uma vez por história, você pode invocar crédito político em nome da capela. Quando o status da capela for oficalizado na Camarilla, isso vira Status 2 garantido. Caso a capela sofra retaliação, você será considerado um alvo.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Refúgio", 2, "biblioteca da capela"),
                        bonusMerit("Status", 2, "corte da Camarilla (se a licença tiver sido concedida na crônica)"),
                        bonusFlaw("Adversário", 2, "inimigos da capela Tremere")
                    ]
                }
            )
        ]
    },
    {
        title: "Sobrevivente da Noite das Cinzas",
        summary:
            "Você estava no Leste na noite em que o Sabá rompeu a trégua e transformou o Gato Molhado em cena de crime. Saiu pela porta certa enquanto outros não saíram, e o cheiro de queimado nunca mais deixou sua roupa. Agora carrega o luto, a paranoia e um punhado de coisas que ninguém mais deveria saber.",
        source: "AdN X — São Paulo 1940",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Eu Estava Lá",
                1,
                "Uma vez por história, adicione 2 dados a testes de Empatia com sobreviventes e enlutados do Leste, que reconhecem em você alguém que também perdeu naquela noite."
            ),
            loreMerit(
                "A Pessoa Que Você Tirou de Lá",
                2,
                "Ganhe como Aliados 2 alguém que você arrancou vivo daquela noite e que não esquece a quem deve a não-morte — leal, mas também um peso a proteger.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Aliados", 2, "sobrevivente que você tirou do Leste")
                    ]
                }
            ),
            loreMerit(
                "A Prova",
                3,
                "Ao exibir uma relíquia antiga provando sua presença, role Manipulação + Subterfúgio adicionando 2 dados para convencer anarquistas céticos ou encurralar rivais políticos do Leste. Ganhe também Contatos 1 entre os sobreviventes do massacre.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Contatos", 1, "sobreviventes da Noite das Cinzas")
                    ]
                }
            ),
            loreMerit(
                "O Nome Que Abre Portas",
                4,
                "Seu nome corre entre os que restaram: ganhe Status 2 no Movimento Anarquista do Leste e, uma vez por história, seja admitido a uma roda fechada de sobreviventes onde forasteiros não passam da porta — lá um veterano do Leste responde por você como seu Mawla.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Status", 2, "Movimento Anarquista do Leste"),
                        bonusMerit("Mawla", 3, "veterano da roda fechada dos sobreviventes do Leste")
                    ]
                }
            ),
            loreMerit(
                "O Que Você Viu",
                5,
                "Uma vez por história, um lampejo daquela noite volta à sua mente, concedendo uma pista ou fragmento essencial sobre as traições. Cada uso atrai mais as ameaças de quem quer o passado apagado.",
                {
                    meritsOrFlaws: [
                        bonusFlaw(
                            "Inimigo",
                            2,
                            "quem quer a Noite das Cinzas esquecida",
                            "Cada verdade que você faz emergir daquela noite desperta quem trabalha para silenciá-la, e essa ameaça cresce."
                        )
                    ]
                }
            )
        ]
    },
    {
        title: "O Salão da Primogênita",
        summary:
            "A Primogênita Toreador rege os camarotes, críticos e boa parte da imprensa cultural de São Paulo. Sua moeda não é dinheiro, é a reputação. Servir ao salão dela é aceitar que a sua lenda passe a ser escrita por outra mão.",
        source: "AdN X — São Paulo 1940",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Convite de Camarote",
                1,
                "Você entra como convidado esperado nos espaços que Beatriz governa — o camarote do Municipal, os saraus, as vernissages — e transita pelo Elísio nas noites de gala sem que soleira alguma lhe pese. Uma vez por sessão, adicione 1 dado a um teste de Etiqueta ou Persuasão feito dentro dos espaços que Beatriz governa. Toreador que a cortejam descobrem que a porta se abre mais fundo."
            ),
            loreMerit(
                "Uma Crítica Favorável",
                2,
                "Um crítico a soldo da Primogênita assina elogios ao seu nome de fachada, e a cidade mortal começa a repeti-lo em cafés e colunas. Ganhe Fama 2.",
                { meritsOrFlaws: [bonusMerit("Fama", 2, "Salão de Beatriz")] }
            ),
            loreMerit(
                "A Pena de Celina",
                3,
                "Uma vez por história, uma matéria na imprensa cultural nasce ou morre a seu pedido: uma reputação plantada, um escândalo abafado, um rival soletrado errado três vezes no mesmo texto. Beatriz cobra o favor em espécie, na hora que lhe convier."
            ),
            loreMerit(
                "Protegido da Casa",
                4,
                "Ganhe a Primogênita como Mawla 4 e dissuasão política contra ataques frontais. Receba Status 1 na Camarilla de São Paulo. Em contrapartida, você deve aceitar pequenas humilhações sociais e sofrer inimizade automática dos rivais da Harpia.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Mawla", 4, "Beatriz Azevedo de Sampaio"),
                        bonusMerit("Status", 1, "Camarilla — manto da Primogênita"),
                        bonusFlaw("Adversário", 1, "rivais de Beatriz")
                    ]
                }
            ),
            loreMerit(
                "Quem Será Lembrado",
                5,
                "Uma vez por história, Beatriz pode destruir ou alavancar a reputação de um Membro no Elísio. Um Status social pode subir ou descer e uma vergonha virar piada. A mudança exige favores sérios, e Beatriz sempre cobrará caro pelo custo da fofoca."
            )
        ]
    },
    {
        title: "O Legado de Nova Cartago",
        summary:
            "Um Brujah antigo sonhou fazer de São Paulo uma Nova Cartago, livre de príncipes e bispos. A tentativa fracassou em 1932, mas a lenda sobrevive através de veteranos calados e correspondência cifrada. Você carrega um fio desse legado revolucionário.",
        source: "AdN X — adaptado de SP By Night (fan-made V5)",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Aluno do Veterano",
                1,
                "Um sobrevivente de 1924 e 1932 lhe ensinou o mapa da guerra urbana. Uma vez por sessão, adicione 1 dado a um teste tático nas ruas do Leste — erguer barricada, traçar rota de fuga ou armar emboscada."
            ),
            loreMerit(
                "O Nome Sussurrado",
                2,
                "Entre os jovens Anarquistas joanistas que veneram o mito de Nova Cartago, seu nome corre ligado ao legado. Você tem 1 ponto de Status nesse círculo.",
                { meritsOrFlaws: [bonusMerit("Status", 1, "jovens Anarquistas joanistas")] }
            ),
            loreMerit(
                "Uma Carta do Sétimo",
                3,
                "Uma vez por história, descubra uma correspondência cifrada, recebendo pistas exclusivas ou avisos do autoproclamado 'Sétimo'. Avaliar se a pista é confiável será sua responsabilidade."
            ),
            loreMerit(
                "Guardião de Relíquia",
                4,
                "Um objeto joanista autêntico está sob sua guarda — uma bandeira, uma prensa clandestina, um diário. Ganhe Contatos 2 entre velhos militantes que reconhecem a peça, mas outros a querem para si.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Contatos", 2, "velhos militantes joanistas"),
                        bonusFlaw(
                            "Adversário",
                            2,
                            "colecionadores da relíquia",
                            "Outros Membros e militantes querem tomar a relíquia joanista sob sua guarda."
                        )
                    ]
                }
            ),
            loreMerit(
                "Herdeiro do Sonho",
                5,
                "Uma vez por crônica, discurse invocando o ideal de Nova Cartago para acender uma revolta anarquista massiva num bairro do Leste. A mobilização trará consequências drásticas, explosivas e difíceis de controlar pacificamente."
            )
        ]
    },
    {
        title: "Sangue de Bandeira",
        summary: "Uma linhagem Gangrel nascida do mato paulista. Dizem que seu fundador foi um bandeirante Abraçado no século XVII. Ele conheceu as trilhas antes das estradas e hoje dorme sob algum marco esquecido de Piratininga. O sangue dele fala com quem caça além da linha das árvores.",
        source: "AdN X — adaptado de Rio de Janeiro by Night (V20)",
        requirementFunctions: [isClan("Gangrel")],
        merits: [
            loreMerit(
                "Faro de Trilha",
                1,
                "Uma vez por história, as rotas antigas falam com seu sangue: adicione 2 dados a um teste de orientação, rastreamento ou deslocamento no mato e nas franjas rurais."
            ),
            loreMerit(
                "Sonhos do Fundador",
                2,
                "Uma vez por história, você recebe lampejos através da conexão de sangue com o ancestral em torpor. Receba imagens, presságios e informações úteis (embora cifradas) em formato de intuição mística."
            ),
            loreMerit(
                "Toca de Raiz",
                3,
                "Ganhe um abrigo natural indetectável escondido no meio da mata, funcionando como Refúgio 3. Ocasionalmente, ele atrai bestas e predadores primais perigosos.",
                { meritsOrFlaws: [bonusMerit("Refúgio", 3, "toca de raiz na mata")] }
            ),
            loreMerit(
                "Parente da Fronteira",
                4,
                "Yara Mirim reconhece o sangue de fronteira em você e o toma como Mawla 4 para assuntos da mata, abrandando a hostilidade inicial e concedendo passagem tolerada pelos territórios que ela guarda. O reconhecimento de sangue apenas abre a conversa: a confiança dela ainda se ganha nas provas da fronteira — trilha, silêncio e limite —, nunca pela linhagem.",
                { meritsOrFlaws: [bonusMerit("Mawla", 4, "Yara Mirim")] }
            ),
            loreMerit(
                "O Marco",
                5,
                "Você conhece pistas vitais de onde o fundador dorme. Uma vez por história, barganhe essa informação para forçar favores de alto calão. A posse do segredo atrai investigadores rivais letais.",
                { meritsOrFlaws: [bonusFlaw("Inimigo", 2, "outros procuram o Marco", "Você não é o único atrás do lugar onde o fundador dorme.")] }
            )
        ]
    },
    {
        title: "As Cordas de 1937",
        summary:
            "Quando o Estado Novo desceu por decreto sobre São Paulo, em 1937, forças ocultas empurraram os papéis certos nas mesas certas. Você esteve perto o bastante do aparato do governo para guardar pontas soltas perigosas. Você sabe que as cordas do poder ainda respondem a um puxão.",
        source: "AdN X — adaptado de Rio de Janeiro by Night (V20)",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Funcionário de Confiança",
                1,
                "Você serve dentro da máquina do Estado Novo — um gabinete da interventoria, uma mesa no DIP, um protocolo que ninguém mais lê. Ganhe Contatos 1 nesse aparato.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Contatos", 1, "máquina do Estado Novo")
                    ]
                }
            ),
            loreMerit(
                "O Envelope de Novembro",
                2,
                "Você possui relatórios proibidos de 1937. Uma vez por história, utilize-os para chantagear burocratas ou ganhar acesso restrito. O uso expõe a terceiros que você detém as provas."
            ),
            loreMerit(
                "Trânsito nos Gabinetes",
                3,
                "Ganhe Influência 2 no baixo escalão da administração estadual. Uma vez por sessão, faça um despacho atrasar ou andar conforme seu interesse, sempre em escala pequena.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Influência", 2, "baixo escalão da administração estadual")
                    ]
                }
            ),
            loreMerit(
                "Você Viu uma Mão",
                4,
                "Uma vez por história, reconheça a interferência das mãos antigas em eventos atuais. Ganhe 2 sucessos automáticos em testes de Investigação para ligar golpes políticos a facções ocultas. Em contrapartida, receba 1 ponto em Defeito Adversário.",
                {
                    meritsOrFlaws: [
                        bonusFlaw(
                            "Adversário",
                            1,
                            "quem esconde a mão",
                            "Alguém que preferiu ficar sem nome sabe que você viu demais em 1937 e o observa."
                        )
                    ]
                }
            ),
            loreMerit(
                "Puxar uma Corda",
                5,
                "Uma vez por história, puxe os cordéis estatais para favores menores. Uma vez por crônica, obtenha uma ação estatal violenta e definitiva, como batidas do DEOPS ou censura do DIP. A conta desses pedidos será cobrada depois."
            )
        ]
    },
    {
        title: "O Santo do Pacaembu",
        summary:
            "Nas entranhas do estádio vive um mendigo Abraçado que zela por engraxates, cambistas e a malandragem. A noite do entorno é dele: a ressaca da geral, os rachas de várzea e os bêbados. Herdar essa lenda é herdar a corte dos esquecidos e suas obrigações.",
        source: "AdN X — adaptado de SP By Night (fan-made V5)",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Gente do Entorno",
                1,
                "Entre os cambistas, engraxates e a malandragem do bairro do estádio, seu nome corre como o de gente de confiança. Ganhe Contatos 1 no entorno do Pacaembu.",
                { meritsOrFlaws: [bonusMerit("Contatos", 1, "entorno do Pacaembu")] }
            ),
            loreMerit(
                "Rebanho das Ruínas da Festa",
                2,
                "Nas noites depois do jogo, do comício ou da quermesse, os que sobram de pileque e exaustos pelo bairro são colheita farta e segura; ganhe Rebanho 2. Mas os desvalidos passam a te chamar de santo e a recorrer a você — e santo tem obrigação.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Rebanho", 2, "ressaca da geral"),
                        bonusFlaw(
                            "Perseguidores",
                            1,
                            "os desvalidos do Pacaembu",
                            "Uma vez por história, você deve atender a um desvalido do entorno. Recusar mancha a lenda e faz você perder temporariamente 1 ponto de reputação (Status no bairro) até reparar o dano."
                        )
                    ]
                }
            ),
            loreMerit(
                "Buraco nas Arquibancadas",
                3,
                "Nas entranhas de concreto do estádio há um vão que ninguém procura: um santuário improvisado de sombra e reboco, modesto, escondido e difícil de alcançar. Ganhe Refúgio 2.",
                { meritsOrFlaws: [bonusMerit("Refúgio", 2, "as entranhas do Pacaembu")] }
            ),
            loreMerit(
                "Manto de Multidão",
                4,
                "Enquanto houver uma aglomeração ativa no entorno — saída de jogo, comício, quermesse, o burburinho de um bar com o rádio ligado — adicione 2 dados a qualquer parada para desaparecer, seguir um alvo ou caçar em meio à massa. Uma vez por história, dissolva-se por completo na multidão e reapareça em qualquer ponto lotado do entorno, encerrando qualquer perseguição que não seja sobrenatural."
            ),
            loreMerit(
                "O Milagre da Geral",
                5,
                "Uma vez por história, invoque os esquecidos para criar um tumulto generalizado, ajudando em fugas em massa ou caçadas. Os envolvidos esperarão retribuições caridosas no futuro."
            )
        ]
    },
    {
        title: "Os Caixões Numerados",
        summary:
            "Você desceu fundo demais sob o Centro Velho, onde caixões têm números riscados em chumbo. Voltou sabendo ler o que dorme ali sem acordá-lo, carregando um inventário secreto. Sua sobrevivência se deve ao fato de nunca tentar abrir os caixões.",
        source: "AdN X — adaptado de Guerra por São Paulo (V20)",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "O Lacre Reconhecido",
                1,
                "Você aprendeu a ler marcas que a cidade esqueceu. Uma vez por história, adicione 2 dados a um teste de Ocultismo ou Acadêmicos sobre selos, criptas e iconografia cainita antiga."
            ),
            loreMerit(
                "O Mapa Parcial",
                2,
                "Você domina o labirinto de galerias periféricas e esgotos sob o Centro Velho de São Paulo. Você recebe acesso para contornar sentinelas da superfície, criando rotas limitadas de infiltração, fuga e transporte furtivo."
            ),
            loreMerit(
                "A Chave da Grade",
                3,
                "Use uma cópia clandestina de chave mestra para acessar pequenas câmaras seguras e cofres esquecidos nas galerias rasas. Funciona como esconderijo temporário restrito."
            ),
            loreMerit(
                "O Inventário Incompleto",
                4,
                "Uma vez por história, obtenha informações limitadas sobre os caixões e ocupantes das criptas nas camadas rasas. O conhecimento adquirido transforma você num alvo para aqueles que protegem o subterrâneo.",
                { meritsOrFlaws: [bonusFlaw("Perseguidores", 1, "O catálogo de alguém", "Um coveiro, um escrivão da Cúria ou um informante soube do seu inventário e passou a seguir seus passos, reportando a quem paga tudo o que você faz.")] }
            ),
            loreMerit(
                "Reconhecido Lá Embaixo",
                5,
                "As antigas entidades das galerias ocasionalmente toleram sua presença. Uma vez por história, você passa ileso por perigos místicos subterrâneos ou ganha um abrigo seguro na escuridão."
            )
        ]
    },
    {
        title: "A Trégua da Serra",
        summary:
            "Dizem que o Sabá ficou fora do planalto por um século. Você conhece a resposta: um contrato selado em 1831, que a Noite das Cinzas rasgou. Guardar essa memória é carregar um documento que ambas as seitas em guerra prefeririam destruir. Recomendado para personagens com trânsito entre o planalto e o porto.",
        source: "AdN X — São Paulo 1942",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Ouvinte do Caminho",
                1,
                "Você sabe a história verdadeira da trégua que ninguém mais conta inteira. Uma vez por sessão, adicione 1 dado a um teste de Raciocínio + Ocultismo ou Política para reconhecer sinais de contrato, trégua ou dívida antiga entre Cainitas — uma cláusula citada pela metade, um gesto de vassalagem fora de moda, um nome que não devia ser lembrado."
            ),
            loreMerit(
                "Pedágio Pago",
                2,
                "Romana do Lorena reconhece em você alguém que ainda honra a forma antiga: ganhe-a como Mawla 1 e, uma vez por história, um recado seu sobe ou desce a serra pelas mãos dela — discreto, sem registro e sem pergunta. O caminho do Lorena cobra pedágio em respeito, nunca em dinheiro.",
                { meritsOrFlaws: [bonusMerit("Mawla", 1, "Romana do Lorena")] }
            ),
            loreMerit(
                "Voz de Testemunha",
                3,
                "Uma vez por história, ao invocar formalmente a Trégua diante de Cainitas — nomeando o ano, a forma e o preço já pago —, adicione 2 dados a um teste Social de parlamentação. A palavra pesa porque testemunha, não porque ameaça; o bônus não é cumulativo com outros bônus de dados desta trilha nem com efeitos de invocação da Trégua na mesma parada."
            ),
            loreMerit(
                "Guarda-Selo",
                4,
                "Romana ditou-lhe, palavra por palavra, o que a carta de 1831 dizia — e o traslado foi lavrado diante dela, com a marca dela ao pé: a recitação juramentada da fiel do caminho, que ambas as seitas reconhecem como fé pública. A carta em si, ninguém sabe onde está; a memória dela, agora, tem uma cópia — a sua. Uma vez por história, em negociações de guerra, o traslado vale como Contatos 2 situacionais: portas que se abrem, emissários que aparecem, audiências que ninguém mais obteria. Quem sabe que você guarda o selo também sabe onde procurá-lo.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Contatos", 2, "portadores e emissários da Trégua, situacionais em negociações de guerra"),
                        bonusFlaw(
                            "Adversário",
                            2,
                            "caçadores do traslado de 1831",
                            "Camarilla e Sabá sabem que você guarda o selo, e ambos o querem. Uma vez por história, um lado (ou os dois) se moverá contra você para tomar ou destruir o documento."
                        )
                    ]
                }
            ),
            loreMerit(
                "A Terceira Assinatura",
                5,
                "Uma vez por crônica, exija parlamento sob os termos antigos do selo, forçando ambas as seitas a suspender conflitos por uma cena para te ouvir. Honrar o acordo pacificamente, no entanto, é incerto."
            )
        ]
    },
    {
        title: "O Círio da Vila",
        summary:
            "Em 1607 nasceu uma confraria de vigília que nunca se dissolveu, e Custódio Vilela aceitou você como membro. As orações vêm em ordem errada e o que se vigia não se nomeia. A confraria não recebe quem perdeu a humanidade, aceitando apenas aqueles que ainda preservam compaixão e devoção real.",
        source: "AdN X — São Paulo 1942, camada histórica",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Orações na Ordem Errada",
                1,
                "Você aprendeu as horas do Círio — os salmos fora de sequência, os sinais deixados em soleiras, o que procurar numa despensa intocada. Uma vez por sessão, adicione 1 dado a um teste de Ocultismo para identificar rastros, hábitos ou fraquezas 'dos que não comem'."
            ),
            loreMerit(
                "O Sobradinho",
                2,
                "Custódio Vilela o recebe no sobradinho da Vila e responde por você perante a confraria. Ganhe-o como Mawla 2: setenta anos de vigília numa cabeça só — arquivos, nomes, datas e o faro de quem nunca dormiu direito —, enquanto essa cabeça durar.",
                { meritsOrFlaws: [bonusMerit("Mawla", 2, "Custódio Vilela")] }
            ),
            loreMerit(
                "Leitor das Entrelinhas",
                3,
                "Custódio lhe abriu o Livro de Horas Queimado — sob as regras dele: na presença dele, nunca fora do sobradinho, nunca copiado. Gaste 1 de Força de Vontade e consulte o Livro de Horas Queimado para adicionar 2 dados em testes de Ocultismo sobre Cainitas. O artefato cede apenas fragmentos e pistas, mas nunca o contexto completo da vigília secular."
            ),
            loreMerit(
                "A Bênção da Vigília",
                4,
                "As horas erradas seguram a mente no lugar. Uma vez por história, ao resistir a uma Disciplina de influência mental, adicione 2 dados ao teste de resistência — você já rezou contra coisas piores do que uma voz mandando obedecer."
            ),
            loreMerit(
                "Herdeiro Designado",
                5,
                "Invoque a autoridade da vigília para impor sua palavra ou barrar uma ameaça por uma cena. O peso secular do ofício rechaça tanto os covardes quanto as feras (compele medos instintivos até mesmo em vampiros, como se portasse Fé Verdadeira). O fardo da missão atrai fatalmente o escrutínio dos mesmos inimigos antigos da vigília.",
                {
                    meritsOrFlaws: [
                        bonusFlaw(
                            "Inimigo",
                            2,
                            "aquilo que a vigília observa",
                            "A coisa vigiada há três séculos passou a observar você de volta e se move contra o herdeiro do ofício."
                        )
                    ]
                }
            )
        ]
    },
    {
        title: "Os Nós do Planalto",
        summary:
            "Você aprendeu que São Paulo possui segredos antigos, amarrados de propósito no mapa. Sobraram apenas fragmentos de mapas proibidos e pedras anômalas. Quem puxa esse fio descobre que há forças buscando esses marcos misteriosos na direção contrária. Você possui as perguntas certas, mas as descobertas devem ocorrer durante o jogo.",
        source: "AdN X — São Paulo 1942, camada histórica",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Olho de Prumo",
                1,
                "Adicione 1 dado em testes de Sagacidade + Investigação para detectar anomalias místicas no prumo geográfico. Você localiza nós de poder arcano, falhas e construções misticamente adulteradas."
            ),
            loreMerit(
                "Compadre do Chão",
                2,
                "Ganhe Abdias Manso como Mawla 2 para conhecimentos em geometria sagrada e topografia oculta. Em troca, você deve apagar e proteger a identidade dele de qualquer registro. Ele divide conhecimento místico em conta-gotas.",
                { meritsOrFlaws: [bonusMerit("Mawla", 2, "Abdias Manso")] }
            ),
            loreMerit(
                "Fragmento do Mapa",
                3,
                "Com uma folha do mapa proibido, você pode atestar se um local específico da cidade abriga um ponto de energia mística ou do círculo. Mostrar a folha a terceiros garante caçada e retaliação absolutas."
            ),
            loreMerit(
                "Guardião de um Nó",
                4,
                "Guarde o Nó de Pedra para ganhar proteção arcana intermitente. Uma vez por história, receba 2 dados adicionais a uma rolagem vital de defesa ou intuição. O item irradia poder perigoso e acabará atraindo caçadores arcanos letais atrás do seu paradeiro.",
                {
                    meritsOrFlaws: [
                        bonusFlaw(
                            "Perseguidores",
                            1,
                            "quem procura peso frio",
                            "Arantes, Lacerda e coisas sem nome sabem reconhecer quem carrega um Nó de Pedra, e seguem o rastro do peso frio até a sua porta."
                        )
                    ]
                }
            ),
            loreMerit(
                "O Nó que Range",
                5,
                "Sinta o exato momento em que um nó geográfico de poder se rompe. Essa habilidade permite a escolha dramática de tentar reatá-lo (correndo riscos mortais com as forças do outro lado) ou deixá-lo colapsar, assumindo grandes consequências na geografia e na política mística."
            )
        ]
    },
    {
        title: "Cinzas da Tribuna",
        summary:
            "Em 1893, a corte destruiu uma célula republicana junto com sua gráfica na Purga dos Panfletos. Sobrou a sua memória do que era impresso e o nome do traidor. Herdar cinzas é herdar perigo, pois aqueles que enterraram 1893 ainda vigiam os escavadores atuais.",
        source: "AdN X — São Paulo 1942, camada histórica",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "A História Proibida",
                1,
                "Você sabe o que a versão oficial de 1893 nega. Uma vez por sessão, ao provar que conhece a Purga dos Panfletos — um nome, uma data, o cheiro da gráfica queimada —, adicione 1 dado a um teste Social com Anarquistas veteranos."
            ),
            loreMerit(
                "Papel Amarelo",
                2,
                "Você possui um panfleto proibido da Tribuna que compromete um membro influente da Camarilla atual. Uma vez por história, use-o para chantagem e coerção direta. Exibir o papel garantirá vitórias táticas, mas criará um inimigo vingativo de longo prazo."
            ),
            loreMerit(
                "O Veterano",
                3,
                "Um Anarquista que sobreviveu à Purga responde por você e ensina o que arquivo nenhum guardou. Ganhe-o como Mawla 2 — mas ele sabe coisas sobre nomes antigos que não conta nem bêbado, e insistir nelas tem preço.",
                { meritsOrFlaws: [bonusMerit("Mawla", 2, "veterano da Purga dos Panfletos")] }
            ),
            loreMerit(
                "A Chapa",
                4,
                "Ganhe Refúgio 2 em um porão oculto sob as ruínas do Brás, cedido pelo insano Nicolau Tipógrafo, abrigando o relicário secreto da gráfica. Tentar furtar ou expor o relicário tornará o Malkaviano um inimigo permanente e mortífero.",
                { meritsOrFlaws: [bonusMerit("Refúgio", 2, "porão do Brás, a duas paredes do Timbre")] }
            ),
            loreMerit(
                "O Nome Antigo",
                5,
                "Você conhece a identidade renegada de um Membro que forjou seu título traindo sua linhagem. Uma vez por crônica, vaze a verdade, diminuindo o Status do traidor permanentemente em 1 ponto. Você passa a ser o inimigo número um do delatado.",
                { meritsOrFlaws: [bonusFlaw("Inimigo", 2, "quem passou meio século enterrando o nome", "Quem enterrou 1893 por meio século não perdoa quem desenterra o nome antigo e vira caçada contra o herdeiro das cinzas.")] }
            )
        ]
    },
    {
        title: "A Adega de Lacre Negro",
        summary:
            "No fundo do porão da Mansão, antigos juram haver uma porta de lacre negro protegendo algo muito mais valioso que vinho. A Guarda-Livros anota quem pergunta. Saber da adega já é contrair uma dívida passiva com a Casa do Príncipe. Cada nível desta Loresheet o aproxima mais do segredo que a Casa protege a todo custo.",
        source: "AdN X — São Paulo 1942, camada histórica",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Rumor de Copeira",
                1,
                "Você ouviu de quem serve há gerações: a adega existe, e a Guarda-Livros é o caminho até ela. Uma vez por sessão, adicione 1 dado a um teste Social com a criadagem antiga da Casa — copeiras, jardineiros, gente que viu mais Príncipes do que admite."
            ),
            loreMerit(
                "A Guarda-Livros",
                2,
                "Leontina Sacramento lhe deve — ou lhe concede — atenção. Ganhe-a como Mawla 2, com um século de dívidas e penhores na cabeça; ela cobra sempre em informação, nunca em dinheiro, e o que você conta entra num livro que você nunca lerá.",
                { meritsOrFlaws: [bonusMerit("Mawla", 2, "Leontina Sacramento, a Guarda-Livros")] }
            ),
            loreMerit(
                "Um Gole Medido",
                3,
                "Você provou um gole, uma única vez que seu corpo não esquece. Uma vez por história, invoque essa força e adicione 2 dados a um único teste de resistência (aguentar dano, veneno, doença, ou resistir a coação ligada à Casa). O gole cobra na hora: ao invocá-lo, suba 1 de Fome e sofra o equivalente a um passo de Laço de Sangue com alguma entidade vinculada à Casa."
            ),
            loreMerit(
                "Uma Garrafa",
                4,
                "Você possui uma garrafa lacrada e intacta. Dizem ser moeda capaz de comprar o Xerife, chantagear o Príncipe ou financiar um Regente. Ela é lacrada por feitiçaria antiga: abri-la desata consequências irreversíveis. Enquanto fechada, serve como alavanca de barganha pesada. Porém, se o segredo vazar, você será caçado impiedosamente.",
                {
                    meritsOrFlaws: [
                        bonusFlaw(
                            "Segredo Sombrio",
                            2,
                            "a garrafa de lacre negro",
                            "Você guarda algo da adega da Casa do Príncipe; se a corte descobrir, a pergunta não será se você devolve, mas o que sobra de você depois."
                        )
                    ]
                }
            ),
            loreMerit(
                "A Noite Marcada",
                5,
                "Você sabe a data exata em que a Casa vai mexer na adega. Este conhecimento vale uma fortuna uma única vez e pode ser vendido como alavanca, mas bisbilhotar ativamente os rituais da Casa garantirá sua morte súbita."
            )
        ]
    },
    {
        title: "O Luto do Paraitinga",
        summary:
            "A loba Jurema Chuva-Brava, assassina implacável de Cainitas, escolheu não te matar, enxergando alguma utilidade. Cada nível desta trilha aproxima você de uma aliança baseada em serviços aos mortos da guerra. Recomendado para personagens dispostos a barganhar com as forças primais e os espíritos inquietos das antigas trincheiras.",
        source: "AdN X — São Paulo 1942",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Cheiro Tolerado",
                1,
                "Jurema Chuva-Brava conhece o seu cheiro e lhe ensinou os sinais das bordas — a marca na porteira, o silêncio errado do mato, a hora de dar meia-volta. Uma vez por sessão, adicione 1 dado a um teste para evitar ou desescalar um encontro com lupinos das bordas do vale."
            ),
            loreMerit(
                "As Oferendas Certas",
                2,
                "Você sabe como procurar Jurema no rancho da serra sem ser caçado. Ganhe Jurema como Mawla 1 relutante, que paga em avisos secos e cobra em silêncio. Uma vez por história, você recebe um aviso vital sobre as bordas da serra ou quem anda medindo o chão do vale.",
                { meritsOrFlaws: [bonusMerit("Mawla", 1, "Jurema Chuva-Brava, relutante")] }
            ),
            loreMerit(
                "Uma Noite com o Dente",
                3,
                "Uma vez por história, Jurema pode ceder-lhe o relicário Dente-Bandeira sob juramento por uma noite. Portá-lo dá +2 dados para parlamentar com lupinos. Ela só o entrega em missões que honrem seus mortos. Quebrar o juramento encerra seu acesso à Loresheet e o marca como alvo."
            ),
            loreMerit(
                "Testemunha das Covas",
                4,
                "Ela lhe mostrou a linha das trincheiras e o buraco aberto de dentro para fora. Jurema passa a contar como Mawla 3 e te arrasta para a cruzada dela; recusar o chamado significa voltar a ser caça. O juramento sombrio aos mortos do vale cobrará um pedágio de sangue no futuro.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Mawla", 3, "Jurema Chuva-Brava"),
                        bonusFlaw("Segredo Sombrio", 1, "o juramento aos mortos do Paraitinga", "Você jurou aos mortos de uma alcateia; se a promessa vazar, ou se você a trair, o que Jurema fez de você deixa de ser refúgio e vira sentença.")
                    ]
                }
            ),
            loreMerit(
                "Lado a Lado",
                5,
                "Uma vez por crônica, Jurema Chuva-Brava surge repentinamente para intervir a seu favor caso uma ameaça ligada ao vale recaia sobre a cena. Ela age de modo letal e imprevisível. Depois, a dívida será cobrada na forma de um serviço impositivo à matilha caída.",
                { meritsOrFlaws: [bonusFlaw("Adversário", 2, "alcateias e caçadores das bordas do vale", "Andar com a última loba do Paraitinga marca você: os inimigos dela — lupinos rivais e caçadores das bordas — passam a tratar você como se fosse dos dela.")] }
            )
        ]
    },
    {
        title: "O Cavalheiro Que Chega",
        summary:
            "O senhor Esselman sabe seu nome e lhe oferece pequenas cortesias que abrem portas importantes. Esta Loresheet mede os favores sutis que você já aceitou dele. Apesar de muito influente, ele misteriosamente nunca cobrou nada em troca. Ainda.",
        source: "AdN X — São Paulo 1942",
        requirementFunctions: [],
        merits: [
            loreMerit(
                "Esperado no Desembarque",
                1,
                "Uma vez por história, um pequeno favor materializa-se sem preço aparente — uma porta social que se abre, um nome que chega num cartão, uma mesa reservada que ninguém reservou. Adicione 1 dado a um teste Social preparado por essa cortesia. Você nunca pediu; alguém avisou que você viria."
            ),
            loreMerit(
                "Correspondência",
                2,
                "Vocês trocam cartas misteriosas. Uma vez por história, uma pista ou um aviso oportuno chega pelo correio na hora estranhamente certa; nunca é uma resposta clara a uma pergunta, mas intuições enviadas pouco antes do momento exato do perigo."
            ),
            loreMerit(
                "Um Favor Grande",
                3,
                "Uma vez por história, Esselman resolve um único problema material do seu tamanho para baixo — o equivalente a dispor de Recursos 4 por uma cena: uma dívida quitada, um transporte que ninguém fiscaliza, um endereço mobiliado com as cortinas já fechadas. Resolvido antes de você terminar de pedir, como se já estivesse pronto há tempo."
            ),
            loreMerit(
                "A Confidência",
                4,
                "Ele lhe contou segredos passados. O senhor Esselman agora o recebe como Mawla 3 (gentil, pontual e influente). No entanto, o livro de contabilidade desse misterioso padrinho é infinito, e cada porta aberta cria dívidas imensas para o futuro.",
                {
                    meritsOrFlaws: [
                        bonusMerit("Mawla", 3, "Nándor Esselman"),
                        bonusFlaw(
                            "Segredo Sombrio",
                            2,
                            "Nándor Esselman",
                            "Cada gentileza aceita é uma dívida impagável nos livros dele; a cobrança chegará nos momentos de maior fragilidade."
                        )
                    ]
                }
            ),
            loreMerit(
                "Às Ordens, Quando For a Hora",
                5,
                "Uma vez por crônica, Esselman intervém pessoal e politicamente a seu favor. Isso fará você ganhar vitórias imensas, seguidas por dívidas arrebatadoras."
            )
        ]
    }
]


export const saoPauloMeritsAndFlaws: MeritsAndFlaws[] = [
    {
        title: "📋 São Paulo 1942 — Papel e Máscara",
        merits: [
            {
                name: "Existência de Papel",
                cost: [2],
                summary:
                    "Ganhe Máscara 2: uma identidade forjada limpa e coerente, do batistério à carteira de trabalho. Se essa identidade for exposta, todas as posses registradas sob ela queimarão junto.",
                excludes: ["Indocumentado"],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Máscara", 2, "existência de papel")]
                }
            },
            {
                name: "Contato no Cartório",
                cost: [1],
                summary:
                    "Uma vez por história, providencie ou oculte certidões civis completas em cartórios da capital. Essa ação deixa você em Dívida Menor com a burocracia humana corrupta de São Paulo.",
                excludes: []
            },
            {
                name: "Amigo no Necrotério",
                cost: [1],
                summary:
                    "Uma vez por história, o escrivão-chefe do IML atrasa laudos de perícias e inquéritos em 48 horas absolutas para o seu bando. A propina deve ser imediata.",
                excludes: []
            },
            {
                name: "Rota Subterrânea",
                cost: [2],
                summary:
                    "Uma vez por sessão, utilize as passagens e encanamentos mortos sob o Centro para escapar furtivamente de caçadores e gangues rivais. Você consegue cruzar os bloqueios, ignorando perigos normais.",
                excludes: []
            },
            {
                name: "Língua de Enclave",
                cost: [2],
                summary:
                    "Você tem fluência completa numa língua ou dialeto estrangeiro restrito da capital (como iídiche ou japonês nativo). Ganhe +2 dados em rolagens Sociais para interagir dentro dessas comunidades fechadas.",
                excludes: []
            },
            {
                name: "Cobertura de Terreiro",
                cost: [2],
                summary:
                    "Uma vez por história, o terreiro do Bexiga garante abrigo comunitário de dia ou silêncio sepulcral de testemunhas da vizinhança. O bônus some para sempre caso haja desrespeito à tradição local.",
                excludes: []
            },
            {
                name: "Mão na Chave da Light",
                cost: [3],
                summary:
                    "Uma vez por história, obrigue um operador de rede elétrica a desligar as luzes e postos de força de todo um quarteirão por alguns preciosos minutos, mergulhando a área na escuridão.",
                excludes: []
            },
            {
                name: "Assinatura no DIP",
                cost: [2],
                summary:
                    "Uma notícia jornalística ou relato policial indesejado cai sob censura estrita e morre antes de chegar aos jornais de amanhã. A censura fica documentada no governo e custa favores sociais.",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Indocumentado",
                cost: [2],
                summary:
                    "Sua total inexistência burocrática atrai suspeitas intensas num Estado autoritário. Você se torna um alvo óbvio em verificações do DIP ou batidas da Força Pública nas ruas.",
                excludes: ["Existência de Papel", "Máscara"]
            },
            {
                name: "Fichado no DEOPS",
                cost: [1],
                summary:
                    "A inteligência estatal (DEOPS) mantém um dossiê e vigia alguns passos do seu personagem com frequência, forçando testes severos caso escorregue na conduta.",
                excludes: []
            },
            {
                name: "Anomalia no Censo",
                cost: [2],
                summary:
                    "Algo nos seus registros caiu numa gaveta de alto risco. A cada batida ou recenseamento em que você falhar, esse dossiê avançará em direção à sua ruína burocrática, ameaçando seu disfarce publicamente.",
                excludes: []
            },
            {
                name: "Na Rota do Plano de Avenidas",
                cost: [1],
                summary:
                    "O plano urbano de Prestes Maia determinou a demolição do bairro onde o seu refúgio está instalado. No curto prazo as escavadeiras irão reduzi-lo a entulho de forma compulsória e violenta.",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Rosto Marcado",
                cost: [2],
                summary:
                    "Investigadores seculares, policiais ou caçadores conhecem as regiões noturnas que você patrulha e possuem retratos falados confiáveis, preparando táticas de rastreio contínuas.",
                excludes: []
            }
        ]
    },
    // Nota de uso: a leva é um fluxo contínuo — gente ainda desembarca pelo funil de
    // Nazário em Santos ao longo de toda a neutralidade brasileira (1939–ago/1942).
    // Este pacote serve tanto à safra de 1940 quanto a quem chega em 1942.
    {
        title: "🚢 A Travessia — os Recém-Desembarcados",
        merits: [
            {
                name: "Contatos da Leva",
                cost: [1],
                summary: "Ganhe Contatos 1 restrito a comunidades de imigrantes e exilados recentes em São Paulo. Facilita obtenção de informações logísticas e avisos prévios nos bairros colonos.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Contatos", 1, "Exilados da leva europeia")]
                }
            },
            {
                name: "Ofício do Velho Mundo",
                cost: [1],
                summary: "Escolha uma perícia extremamente restrita de ofícios refinados (como criptografia de resistência ou restauro milenar europeu). Uma vez por história, você soma 2 dados extras em testes aplicáveis a ela.",
                excludes: []
            },
            {
                name: "Mesa na Chapelaria de Madame Yvonne",
                cost: [1],
                summary: "A loja de Madame Yvonne virou caixa postal de quem chega sem endereço. Uma vez por sessão, colha ali uma notícia da Europa ou uma apresentação a outro recém-desembarcado.",
                excludes: []
            },
            {
                name: "Bagagem do Velho Mundo",
                cost: [2],
                summary: "Inicie o jogo com posses líquidas que não deixam rastros burocráticos e equivalem a Recursos 2. As joias e o ouro maciço podem, entretanto, ser tomados em um único assalto mal sucedido.",
                excludes: [],
                bonuses: {
                    meritsOrFlaws: [bonusMerit("Recursos", 2, "Bagagem do Velho Mundo")]
                }
            },
            {
                name: "Carta de Apresentação",
                cost: [2],
                summary: "Mostre cartas antigas vindas da Europa para acessar príncipes, magistrados e autoridades locais em momento de tensão crítica (como salvo-conduto absoluto). O contato que assinou cobrará uma dívida futura imediata.",
                excludes: []
            },
            {
                name: "Memória da Outra Guerra",
                cost: [2],
                summary: "Você atravessou 1914-18 e conhece a gramática da guerra. Uma vez por sessão, adicione 1 dado a um teste para antecipar lógica militar, racionamento ou pânico de guerra.",
                excludes: []
            },
            {
                name: "Crédito de van Loon",
                cost: [3],
                summary: "Solicite capital obscuro ao tesoureiro Cornelis van Loon na quantia de Recursos 3 (imediato). As taxas punitivas implicarão perigos reais, físicos e sociais a serem coletados no futuro.",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Sangue Apátrida",
                cost: [1],
                summary: "Nenhum sire responde pela sua linhagem. Você não pode comprar Status, e nenhuma etiqueta Cainita o protege de acusação ou desprezo formal.",
                excludes: []
            },
            {
                name: "Papéis do País Errado",
                cost: [1],
                summary: "Sua cidadania é do Eixo sob a Campanha de Nacionalização: cada guichê, quarentena ou blitz é uma ameaça. Perca 1 dado em testes Sociais diante de autoridades do Estado Novo.",
                excludes: []
            },
            {
                name: "Dívida de Consignação",
                cost: [2],
                summary: "O Consignatário possui garantias do seu desembarque ilícito, e, uma vez por história, ele exigirá ações penosas no porto, de assassinatos em cais a extorsões com risco de morte para cobrar as propinas de admissão.",
                excludes: []
            },
            {
                name: "Inimigo do Outro Lado do Mar",
                cost: [2],
                summary: "Um caçador (ou membro vingativo que perdeu tudo para os nazistas) seguiu o seu rastro de fuga transatlântico, aparecendo abruptamente uma vez por história para cobrar vida ou posses em São Paulo.",
                excludes: []
            },
            {
                name: "Nome numa Lista da Rede Parda",
                cost: [2],
                summary: "Facções clandestinas e mortais do extremismo governamental julgam que você está atado a eles. Exigem espionagem, contrabando ou suborno sob a pena iminente de atentados direcionados ou extorsão burocrática severa.",
                excludes: []
            }
        ]
    }
]
