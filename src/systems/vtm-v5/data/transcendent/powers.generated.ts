// GERADO por scripts/extractSangueImemorial.mjs — não editar à mão.
// Fonte: Sangue Imemorial, Capítulo IV (Disciplinas Transcendentes).
import type { Power } from "../Disciplines"

export const transcendentPowers: Power[] = [
    {
        "name": "Voz da Matilha",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Dificuldade 3; animais sobrenaturais podem usar Perseverança + Autocontrole\nDuração: Uma cena\nLimites: A ordem não concede conhecimento humano, estratégia militar nem capacidade física que os animais não possuem.",
        "summary": "Escolha uma espécie existente num raio aproximado de um bairro e formule uma ordem curta: buscar, vigiar, fugir, distrair, cercar ou atacar. Role a parada uma vez. Em sucesso, todos os animais comuns da espécie compreendem a ordem e tentam cumpri-la durante a cena. Animais sobrenaturais fazem uma defesa própria; apenas os que perderem obedecem.",
        "dicePool": "Carisma + Animalismo",
        "level": 6,
        "discipline": "animalism",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Mão sobre a Fera",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Perseverança + Potência de Sangue de um alvo resistente\nDuração: Uma cena ou até o alvo sofrer nova provocação",
        "summary": "Um alvo voluntário tem uma Compulsão suspensa ou sai de um frenesi automaticamente. Contra um alvo resistente, faça a disputa. Em vitória, a Compulsão fica suspensa ou o frenesi é interrompido por um número de turnos igual à margem, com mínimo 1 e máximo igual ao Animalismo do usuário. Depois disso, o alvo repete o teste de frenesi original com Dificuldade reduzida em 1.",
        "dicePool": "Autocontrole + Animalismo",
        "level": 6,
        "discipline": "animalism",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Mestre da Caçada",
        "description": "Custo: 1 Teste de Despertar e 1 ponto de Força de Vontade\nDuração: Uma cena\nLimites: O benefício termina para quem abandonar deliberadamente o alvo ou agir contra outro objetivo.",
        "summary": "Escolha até um número de aliados igual ao Animalismo do usuário e um alvo comum que todos possam identificar. Os aliados recebem +2 dados para localizar, perseguir, cercar e impedir a fuga desse alvo. Uma vez por turno, cada aliado ignora a primeira penalidade por defender-se de múltiplos oponentes, desde que sua ação contribua diretamente para a caçada.",
        "dicePool": "",
        "level": 7,
        "discipline": "animalism",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Enxame de Olhos",
        "description": "Custo: 2 Testes de Despertar\nDuração: Até o amanhecer\nLimites: O poder transmite sentidos e voz; não concede controle fino sobre ações complexas sem outra capacidade de Animalismo.",
        "summary": "Escolha até Animalismo animais que o usuário possa ver ou que tenham bebido uma gota de sua vitae naquela noite. Ele percebe simultaneamente pelos sentidos de todos, pode falar por qualquer um deles e transfere seu foco entre os hospedeiros sem nova ativação. O corpo pode agir, mas sofre −2 dados em ações que exijam atenção enquanto mais de um hospedeiro estiver ativo.",
        "dicePool": "",
        "level": 7,
        "discipline": "animalism",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Corpo da Matilha",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Autocontrole para animais sobrenaturais\nDuração: Uma noite\nLimites: A mesma criatura não pode receber mais de uma ação por turno e não pode usar Disciplinas do usuário.",
        "summary": "Marque com uma gota de vitae até um número de animais igual ao dobro do Animalismo. Animais comuns são marcados automaticamente; animais sobrenaturais resistem. O usuário conhece a posição e o estado geral de cada marcado. Uma vez por turno, pode ordenar que um deles faça uma ação física usando a parada normal do animal ou Carisma + Animalismo, o que for maior. O usuário continua agindo com o próprio corpo.",
        "dicePool": "Carisma + Animalismo",
        "level": 8,
        "discipline": "animalism",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Rasgar a Jaula",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Potência de Sangue de cada alvo\nDuração: Uma cena",
        "summary": "Escolha os vampiros dentro de alcance médio que serão afetados e faça uma única rolagem. Cada alvo faz sua própria defesa. Quem perder manifesta imediatamente a Compulsão de Clã. Um alvo que já esteja sob Compulsão faz também um teste de frenesi de fúria, Dificuldade 4. O usuário pode excluir até Autocontrole alvos antes da rolagem.",
        "dicePool": "Manipulação + Animalismo",
        "level": 8,
        "discipline": "animalism",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Alma da Espécie",
        "description": "Custo: 2 Testes de Despertar e 1 ponto de Força de Vontade\nOposição / Dificuldade: Dificuldade 5 para marcar a espécie; reconstrução por teste estendido, 10 sucessos\nDuração: Até ser encerrado\nLimites: A reconstrução reduz a Humanidade em 1 e destrói todos os portadores restantes. Essa consequência ocorre apenas quando o poder evita a Morte Final.",
        "summary": "Escolha uma espécie presente no domínio e faça o primeiro teste contra Dificuldade 5. Em sucesso, um número de animais igual à margem, com mínimo 1, torna-se portador de um fragmento da consciência do usuário. Ele pode perceber por esses animais. Se seu corpo sofrer Morte Final enquanto ao menos um portador sobreviver, inicia um teste estendido padrão de Perseverança + Animalismo: uma rolagem por noite, acumulando todos os sucessos até alcançar 10. Uma falha comum não acrescenta progresso. Uma falha total apaga os sucessos acumulados e destrói um portador; se nenhum portador restar, a reconstrução termina e a Morte Final torna-se definitiva. Ao alcançar 10 sucessos, o usuário desperta em torpor dentro do último portador.",
        "dicePool": "Perseverança + Animalismo",
        "level": 9,
        "discipline": "animalism",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Predador Primordial",
        "description": "Custo: 2 Testes de Despertar\nDuração: Uma cena\nLimites: Quando o avatar perde toda a Vitalidade, desaparece; o usuário sofre 2 pontos de dano Superficial de Força de Vontade.",
        "summary": "A Besta manifesta-se como um avatar semimaterial ao lado do usuário. O avatar usa Animalismo + Potência de Sangue para ações físicas, possui Vitalidade igual à metade da Vitalidade máxima do usuário e causa dano Agravado a criaturas sobrenaturais com garras ou presas. O usuário e o avatar agem no mesmo turno, mas apenas um deles pode realizar uma ação ofensiva principal.",
        "dicePool": "",
        "level": 9,
        "discipline": "animalism",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Palavra Antes da Linguagem",
        "description": "Custo: 3 Testes de Despertar e 1 ponto de Força de Vontade\nOposição / Dificuldade: Autocontrole + Potência de Sangue de cada criatura sobrenatural\nDuração: Uma hora\nLimites: O poder não fornece informações, não cria alvos inexistentes e não permite ordens compostas.",
        "summary": "Escolha um impulso básico — fugir, calar, caçar, proteger, reunir-se ou devorar — e uma região de até alguns quilômetros. Mortais e animais comuns seguem o impulso quando isso for fisicamente possível. Cada criatura sobrenatural faz uma defesa própria; em derrota, deve orientar suas ações pelo impulso durante a duração. Exceções precisam ser nomeadas antes da rolagem.",
        "dicePool": "Carisma + Animalismo",
        "level": 10,
        "discipline": "animalism",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Silêncio da Besta",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Perseverança + Potência de Sangue\nDuração: Até o próximo amanhecer\nLimites: Um mesmo usuário só pode manter uma Besta selada por vez.",
        "summary": "Toque um vampiro e faça a disputa. Em vitória, a Besta do alvo é separada e selada num animal vivo escolhido durante a ativação. O alvo não usa Dados de Fome, não entra em frenesi e não sofre Compulsões, mas também não pode usar Surto de Sangue, reparar dano nem ativar poderes que exijam Teste de Despertar. Se o receptáculo morrer, a Besta retorna e o alvo faz imediatamente um teste de frenesi de fome, Dificuldade 5.",
        "dicePool": "Perseverança + Animalismo",
        "level": 10,
        "discipline": "animalism",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Memória do Sangue",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Perseverança + Autocontrole do doador; Dificuldade 3 se a amostra estiver separada\nDuração: Uma cena de leitura\nLimites: O poder recupera uma lembrança vivida pelo doador; não revela fatos que ele nunca percebeu.",
        "summary": "Prove uma gota de vitae e descreva uma pessoa, lugar, objeto ou acontecimento específico. Se o doador estiver presente e não consentir, faça a disputa indicada. Se a amostra estiver separada do doador, faça o teste contra Dificuldade 3. Em vitória ou sucesso, o usuário revive uma lembrança real ligada ao tema, com os sentidos e emoções originais. A margem determina o alcance da busca: 1, mesma noite; 2, último mês; 3, último ano; 4, último século; 5 ou mais, qualquer período ainda preservado pelo Sangue.",
        "dicePool": "Inteligência + Auspícios",
        "level": 6,
        "discipline": "auspex",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Padrão Impossível",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Raciocínio + Disciplina de quem ocultou os vestígios; Dificuldade 3 sem ocultação\nDuração: Uma cena de análise\nLimites: O poder identifica vestígios e relações; não fornece automaticamente o nome do responsável.",
        "summary": "Examine uma pessoa, objeto ou local. Se alguém ocultou deliberadamente os vestígios, faça a disputa indicada; caso contrário, faça o teste contra Dificuldade 3. Em vitória ou sucesso, identifique quais categorias de efeito sobrenatural atuaram ali no último mês — alteração mental, mudança de forma, sangue, sombra, presença espiritual ou deslocamento impossível. Cada ponto de margem revela um detalhe adicional: sequência dos efeitos, nível aproximado, direção de fuga ou uma assinatura recorrente do usuário.",
        "dicePool": "Inteligência + Auspícios",
        "level": 6,
        "discipline": "auspex",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Olhos do Passado",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Dificuldade 3 a 7 conforme a antiguidade e a ocultação\nDuração: Até uma cena observada\nLimites: A visão mostra o que ocorreu naquele espaço, não pensamentos privados nem áreas fora de alcance.",
        "summary": "Permaneça imóvel num local por um turno e escolha uma data ou acontecimento. Role contra Dificuldade 3 para a mesma noite, 4 para o último mês, 5 para o último ano, 6 para o último século ou 7 para períodos mais antigos. Em sucesso, o usuário observa uma cena passada a partir daquele local. A margem define a duração vista: 1, alguns segundos; 2, um minuto; 3, uma cena curta; 4 ou mais, uma cena completa.",
        "dicePool": "Perseverança + Auspícios",
        "level": 7,
        "discipline": "auspex",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Roubo de Segredos",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Perseverança + Autocontrole\nDuração: Instantânea; a lacuna dura uma noite\nLimites: O usuário não pode procurar “todos os segredos”; cada ativação exige uma lembrança ou assunto definido.",
        "summary": "Toque a cabeça, o coração ou um objeto de forte valor emocional do alvo e formule com clareza a lembrança procurada. Faça a disputa indicada. Em vitória, o usuário recebe a memória como experiência própria. Com margem 3 ou mais, o alvo perde acesso consciente a essa lembrança até o próximo amanhecer.",
        "dicePool": "Inteligência + Auspícios",
        "level": 7,
        "discipline": "auspex",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Passo Fora do Instante",
        "description": "Custo: 2 Testes de Despertar\nDuração: Um uso por cena\nLimites: O poder não altera Testes de Despertar, dano já anotado ou acontecimentos fora da cena.",
        "summary": "Depois que qualquer personagem termina uma rolagem, mas antes que o resultado produza consequências, o usuário escolhe um dos efeitos: mover-se até alcance curto; acrescentar +2 sucessos à própria defesa; ou obrigar um oponente a repetir até três dados comuns da rolagem. A mudança precisa ser algo que uma advertência ou um reposicionamento rápido poderia causar.",
        "dicePool": "",
        "level": 8,
        "discipline": "auspex",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Corpo Astral Soberano",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Parada ou Dificuldade da barreira mística\nDuração: Até o amanhecer\nLimites: A forma astral não manipula matéria, não transporta objetos e continua impedida por proteções espirituais ou psíquicas.",
        "summary": "A ativação não exige rolagem: a consciência abandona o corpo e assume forma astral. Ela atravessa matéria comum e cruza uma cidade em minutos. Ao tentar atravessar uma barreira espiritual ou psíquica, faça o teste ou a disputa indicada. Na forma astral, o usuário pode empregar Auspícios, Presença e Dominação quando cumprir os demais requisitos. O corpo fica em torpor aparente e desperta imediatamente se sofrer dano.",
        "dicePool": "Raciocínio + Auspícios",
        "level": 8,
        "discipline": "auspex",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Mapa das Possibilidades",
        "description": "Custo: 2 Testes de Despertar e 1 ponto de Força de Vontade\nOposição / Dificuldade: Dificuldade 4\nDuração: Uma cena\nLimites: Só um ponto de Previsão pode afetar cada rolagem.",
        "summary": "No início da cena, faça o teste. Em sucesso, receba um número de pontos de Previsão igual à margem, com mínimo 1 e máximo igual ao Auspícios. Antes de uma rolagem feita por alguém que o usuário possa perceber, gaste um ponto para: conceder +2 dados a um aliado; impor −2 dados a um oponente; ou perguntar ao Narrador qual consequência imediata é mais provável entre duas ações declaradas.",
        "dicePool": "Raciocínio + Auspícios",
        "level": 9,
        "discipline": "auspex",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Prisão Psíquica",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Autocontrole\nDuração: Até o usuário encerrar ou perder a concentração",
        "summary": "Faça contato visual ou toque o alvo e vença a disputa. A consciência do alvo é aprisionada numa paisagem mental criada pelo usuário. O corpo permanece imóvel e indefeso. No fim de cada turno, o alvo pode repetir a defesa; ao acumular uma margem total igual ao Auspícios do usuário, escapa. Dano sofrido pelo corpo concede +2 dados à próxima tentativa.",
        "dicePool": "Manipulação + Auspícios",
        "level": 9,
        "discipline": "auspex",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Olho de Caim",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Dificuldade 6; proteção de nível 10 usa Raciocínio + Disciplina do criador\nDuração: Uma cena de transe\nLimites: O poder não prevê escolhas futuras e não revela algo apagado por uma força de nível superior sem vencer a disputa.",
        "summary": "Formule uma pergunta factual sobre um vampiro, linhagem, pacto ou acontecimento que tenha deixado marca no Sangue. Faça o teste contra Dificuldade 6. Se uma proteção de nível 10 ocultar a resposta, faça a disputa indicada no lugar do teste simples. Em sucesso ou vitória, o Narrador fornece uma resposta verdadeira e direta. Cada ponto de margem permite uma pergunta complementar sobre causa, consequência, localização ou participante.",
        "dicePool": "Inteligência + Auspícios",
        "level": 10,
        "discipline": "auspex",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Reescrever o Destino",
        "description": "Custo: 3 Testes de Despertar e 1 ponto de dano Agravado de Força de Vontade\nDuração: Instantânea; uma vez por história\nLimites: Não desfaz Morte Final, diablerie concluída, amanhecer ou acontecimentos anteriores à cena atual.",
        "summary": "Depois que uma ação na cena for resolvida, o usuário declara um único resultado alternativo plausível que poderia ter ocorrido com outras escolhas ou circunstâncias. A cena é ajustada para esse resultado: um tiro errou, uma porta permaneceu aberta, um aliado chegou alguns instantes antes. Rolagens diretamente afetadas são refeitas, e o novo resultado substitui o anterior.",
        "dicePool": "",
        "level": 10,
        "discipline": "auspex",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Tempestade de Golpes",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Cada alvo faz sua defesa normal\nDuração: Instantânea\nLimites: Não há divisão da parada. Bônus de dano ou poderes ativados junto ao ataque aplicam-se apenas ao alvo principal, salvo quando forem passivos.",
        "summary": "Declare um ataque principal e escolha um número de alvos adicionais igual à metade da Celeridade, arredondada para baixo. Todos precisam estar ao alcance da arma ou dentro do alcance normal do ataque à distância. Role o ataque uma vez. Cada alvo rola sua defesa separadamente. Para cada alvo, calcule a margem usando os sucessos dessa defesa; se a margem for positiva, ele sofre dano igual à margem mais o modificador normal da arma.",
        "dicePool": "Parada normal do ataque",
        "level": 6,
        "discipline": "celerity",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Retaliação Impossível",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Defesa normal do agressor\nDuração: Instantânea; uma vez por turno",
        "summary": "Quando o usuário vence ou empata uma defesa corpo a corpo, pode realizar imediatamente um contra-ataque contra o agressor. O contra-ataque usa a parada completa e não substitui a ação principal do próximo turno. O agressor defende-se normalmente, mas sofre −2 dados porque ainda está comprometido com o ataque anterior.",
        "dicePool": "Parada normal do contra-ataque",
        "level": 6,
        "discipline": "celerity",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Tempo Roubado",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Raciocínio + Celeridade ou Auspícios\nDuração: Três turnos",
        "summary": "Escolha um alvo visível e faça a disputa. Em vitória, o alvo percebe e reage ao mundo em atraso: sofre −3 dados em defesas e não pode realizar reações ou interrupções. Se a margem for 3 ou mais, ele também precisa escolher entre mover-se ou realizar sua ação principal em cada turno; não consegue fazer ambos.",
        "dicePool": "Raciocínio + Celeridade",
        "level": 7,
        "discipline": "celerity",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Projétil Impossível",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Defesa normal à distância\nDuração: Instantânea\nLimites: O poder não transforma líquidos, poeira ou objetos que o usuário não consiga segurar.",
        "summary": "Arremesse uma moeda, faca, pedra, cartucho ou objeto de tamanho semelhante e faça o ataque à distância indicado. O alvo faz sua defesa normal. O ataque alcança até 100 metros, ignora a penalidade por ausência de arma apropriada e recebe modificador de dano igual à metade da Celeridade, arredondada para baixo. Objetos frágeis são destruídos pelo impacto.",
        "dicePool": "Destreza + Celeridade",
        "level": 7,
        "discipline": "celerity",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Sequência Impossível",
        "description": "Custo: 2 Testes de Despertar\nDuração: Um turno\nLimites: A sequência não inclui ataques, alimentação, ativação de outros poderes ou ações que normalmente consumiriam uma cena inteira.",
        "summary": "Durante o turno, o usuário pode realizar até um número de ações menores igual à Celeridade: deslocar-se, abrir ou fechar portas, sacar ou guardar objetos, recarregar, libertar alguém, desarmar um mecanismo simples, levantar uma pessoa ou assumir cobertura. Essas ações ocorrem na ordem declarada e não exigem testes quando seriam rotineiras.",
        "dicePool": "",
        "level": 8,
        "discipline": "celerity",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Flor da Morte",
        "description": "Custo: 2 Testes de Despertar e 1 ponto de Força de Vontade\nOposição / Dificuldade: Defesa normal do alvo em cada ataque\nDuração: Instantânea\nLimites: Só o primeiro ataque pode receber o benefício de outro poder ativado no mesmo turno.",
        "summary": "Escolha um único alvo e faça um número de ataques igual à metade da Celeridade, arredondada para baixo. Role cada ataque separadamente. O primeiro usa a parada completa; cada ataque posterior sofre −2 dados cumulativos. O alvo faz uma defesa própria contra cada ataque e anota o dano de cada acerto separadamente.",
        "dicePool": "Parada normal do ataque",
        "level": 8,
        "discipline": "celerity",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Fora da Causalidade",
        "description": "Custo: 2 Testes de Despertar\nDuração: Instantânea; uma vez por cena\nLimites: Não evita efeitos puramente mentais, dano solar que preencha toda a área ou uma consequência já sofrida antes da ativação.",
        "summary": "Quando um ataque, armadilha ou poder que dependa de posição ou contato físico acertaria o usuário, ele desaparece do instante e reaparece em qualquer ponto visível de alcance curto. O efeito é negado contra ele, mesmo depois de a rolagem ter sido feita.",
        "dicePool": "",
        "level": 9,
        "discipline": "celerity",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Caçada Relâmpago",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Destreza + Atletismo ou Raciocínio + Celeridade do alvo\nDuração: Uma cena",
        "summary": "Escolha um alvo que o usuário veja ou cuja posição exata conheça. Em vitória, ele alcança o alvo no fim do turno, desde que exista uma rota física dentro da mesma cidade. Durante a cena, o alvo não consegue romper a perseguição por meios mundanos; cada tentativa sobrenatural de fuga exige nova disputa. Ao alcançar, o usuário pode iniciar imediatamente um conflito corpo a corpo, mas não recebe um ataque automático.",
        "dicePool": "Destreza + Celeridade",
        "level": 9,
        "discipline": "celerity",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Intervalo Sem Fim",
        "description": "Custo: 3 Testes de Despertar\nDuração: Até um minuto subjetivo\nLimites: O usuário não pode causar dano, alimentar-se, ativar outro poder, mover um ser resistente contra a vontade nem deixar a área da cena.",
        "summary": "O tempo externo quase para para o usuário. Ele pode deslocar-se pela cena, observar, ler, recolher ou posicionar objetos sem resistência, libertar pessoas e preparar cobertura. Ao terminar, todas as mudanças físicas compatíveis com essas ações aparecem de uma vez.",
        "dicePool": "",
        "level": 10,
        "discipline": "celerity",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Primeiro Movimento",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Raciocínio + Celeridade entre usuários do mesmo poder\nDuração: Primeiro turno de um conflito; uma vez por cena\nLimites: Dois usuários deste poder fazem a disputa indicada; o vencedor resolve seus três turnos primeiro.",
        "summary": "Depois que todos declararem suas ações, o usuário realiza três turnos completos antes do primeiro adversário agir. Ele pode atacar em cada turno. Quando atacar o mesmo alvo mais de uma vez, esse alvo recebe +2 dados cumulativos na defesa de cada ataque posterior. Depois dos três turnos, a ordem normal de iniciativa começa.",
        "dicePool": "",
        "level": 10,
        "discipline": "celerity",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Corrente de Comando",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Perseverança + Inteligência do intermediário\nDuração: Até o nascer do sol\nLimites: O intermediário não aprende Dominação e não pode alterar as palavras da ordem sem encerrar a transmissão.",
        "summary": "Escolha um intermediário que possa ouvir o usuário e vença a disputa. Durante a duração, ordens de Dominação pronunciadas pelo intermediário carregam a voz sobrenatural do usuário. O usuário paga os custos do poder transmitido e usa sua própria parada; o alvo final precisa ouvir o intermediário e resiste normalmente.",
        "dicePool": "Manipulação + Dominação",
        "level": 6,
        "discipline": "dominate",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Prisão de Obediência",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Perseverança + Autocontrole\nDuração: Um mês\nLimites: A proibição precisa descrever uma ação observável. Não pode proibir pensamentos, emoções ou toda forma de resistência ao usuário.",
        "summary": "Formule uma proibição objetiva, como “não atravesse esta porta”, “não pronuncie este nome” ou “não ataque esta pessoa”, e faça a disputa. Em vitória, o alvo é incapaz de realizar voluntariamente a ação proibida. Quando uma circunstância o força a tentar, ele pode gastar 1 ponto de Força de Vontade e repetir a defesa; uma vitória encerra o poder.",
        "dicePool": "Carisma + Dominação",
        "level": 6,
        "discipline": "dominate",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Hierarquia Imposta",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência de cada alvo\nDuração: Uma cena\nLimites: A hierarquia não permite ordens suicidas sem o poder apropriado e termina para quem deixa de perceber os demais participantes.",
        "summary": "Escolha até Dominação alvos que possam ouvir o usuário, defina uma cadeia de autoridade entre eles e faça uma única rolagem. Cada alvo se defende separadamente. Quem perder reconhece as posições designadas e obedece às ordens de qualquer participante colocado acima dele como se fossem ordens simples do usuário.",
        "dicePool": "Carisma + Dominação",
        "level": 7,
        "discipline": "dominate",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Reescrever Lealdade",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Perseverança + Autocontrole\nDuração: Um mês\nLimites: O poder não cria amor nem Laço de Sangue e não apaga automaticamente compromissos incompatíveis; eles tornam-se fontes de conflito.",
        "summary": "Nomeie uma pessoa, grupo, causa ou instituição e faça a disputa. Em vitória, o alvo passa a tratar esse objeto de lealdade como se ocupasse o lugar de uma fidelidade existente escolhida pelo usuário. O alvo conserva memória e personalidade, mas reorganiza prioridades, segredos e riscos em torno da nova lealdade.",
        "dicePool": "Manipulação + Dominação",
        "level": 7,
        "discipline": "dominate",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Voz no Sangue",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência\nDuração: Até a ordem ser cumprida ou o nascer do sol",
        "summary": "Com uma amostra de vitae, pronuncie uma ordem curta para um descendente de sangue identificável dentro da mesma cidade. Faça a disputa indicada. Em vitória, o alvo ouve a voz internamente e executa a ordem como uma instrução de Dominação recebida em pessoa. A distância não remove as demais limitações da ordem.",
        "dicePool": "Manipulação + Dominação",
        "level": 8,
        "discipline": "dominate",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Arquitetura da Mente",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência\nDuração: Um ano e uma noite\nLimites: O poder reorganiza material que existe na mente; não concede Habilidades, conhecimentos ou experiências nunca adquiridas.",
        "summary": "Durante uma cena de contato, faça a disputa. Em vitória, construa até Dominação compartimentos mentais: memórias inacessíveis, identidades de cobertura, gatilhos de comportamento ou barreiras contra leitura. Cada compartimento precisa ter conteúdo e condição de acesso definidos. Poderes que investiguem ou alterem a mente precisam vencer a margem original para atravessá-lo.",
        "dicePool": "Inteligência + Dominação",
        "level": 8,
        "discipline": "dominate",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Trono Interior",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Autocontrole\nDuração: Uma cena",
        "summary": "Faça contato visual e vença a disputa. O alvo permanece consciente, mas o usuário pode substituir uma decisão voluntária por turno por outra ação que o corpo consiga realizar. Antes da substituição, o alvo pode gastar 1 ponto de Força de Vontade para agir livremente naquele turno. Ordens autodestrutivas exigem que o usuário também conheça Decreto Terminal ou poder equivalente.",
        "dicePool": "Manipulação + Dominação",
        "level": 9,
        "discipline": "dominate",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Dinastia de Marionetes",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência de cada alvo\nDuração: Uma cena; pode ser renovada\nLimites: O usuário não acessa Disciplinas, memórias profundas ou especialidades corporais das marionetes.",
        "summary": "O usuário precisa possuir vitae recente de até Dominação alvos dentro da mesma cidade. Faça uma rolagem; cada alvo se defende separadamente. Quem perder torna-se uma marionete remota. O corpo do usuário fica imóvel. Em cada turno ele escolhe uma marionete para realizar uma ação completa com os traços físicos dela e os próprios traços mentais; as demais seguem uma instrução simples previamente dada.",
        "dicePool": "Manipulação + Dominação",
        "level": 9,
        "discipline": "dominate",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Lei Encarnada",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência de cada vampiro relevante\nDuração: Uma noite\nLimites: A lei precisa ser observável e vale também para aliados. O usuário só fica isento se declarar essa exceção antes da rolagem.",
        "summary": "Declare uma regra comportamental simples para uma área de até um bairro: ninguém mente, ninguém atravessa uma fronteira, armas não são sacadas ou um nome não é pronunciado. Role Carisma + Dominação uma vez. Mortais obedecem automaticamente. Cada criatura sobrenatural relevante rola Perseverança + Inteligência separadamente contra os sucessos do usuário; quem obtiver menos sucessos fica incapaz de violar voluntariamente a regra.",
        "dicePool": "Carisma + Dominação",
        "level": 10,
        "discipline": "dominate",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Apagar o Eu",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência\nDuração: Indefinida\nLimites: O poder não apaga a alma, a Besta, a Perdição de Clã nem Laços de Sangue.",
        "summary": "Durante uma cena de contato, faça a disputa. Em vitória, escolha uma identidade completa do alvo — nome, vínculos, lealdades e narrativa pessoal — e remova seu acesso consciente a ela. O corpo, as Habilidades e memórias factuais permanecem, mas o alvo não as relaciona a um “eu” anterior. Restaurar a identidade exige derrotar a margem original com Dominação, Auspícios ou um Projeto de Memoriam.",
        "dicePool": "Manipulação + Dominação",
        "level": 10,
        "discipline": "dominate",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Carne que Não Cede",
        "description": "Custo: 1 Teste de Despertar\nDuração: Uma cena\nLimites: Não reduz dano causado diretamente por luz solar. Nunca converte dano Agravado em Superficial.",
        "summary": "Depois de sofrer dano, reduza em 2 o dano Agravado ou em 4 o dano Superficial antes de marcá-lo. O poder pode reduzir uma fonte de dano por turno e é decidido depois que o valor final do dano é conhecido.",
        "dicePool": "",
        "level": 6,
        "discipline": "fortitude",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Vontade de Ferro",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Parada do poder mental ou social\nDuração: Uma cena",
        "summary": "Enquanto o poder estiver ativo, sempre que Dominação, Presença, Auspícios invasivo ou outro efeito tentar alterar a mente do usuário, faça a disputa indicada mesmo que o efeito normalmente não ofereça defesa. Em vitória, o efeito falha. Se a margem for 3 ou mais, o usuário também identifica a intenção imediata do agressor.",
        "dicePool": "Autocontrole + Fortitude",
        "level": 6,
        "discipline": "fortitude",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Recusar a Morte Final",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Dificuldade 4\nDuração: Instantânea; uma vez por noite",
        "summary": "Quando o dano preencher a Vitalidade com Agravado e causaria Morte Final, faça o teste. Em sucesso, apague um número de pontos de dano Agravado igual à margem, com mínimo 1, e entre em torpor em vez de ser destruído. O corpo permanece reconhecível e pode ser destruído normalmente enquanto estiver indefeso.",
        "dicePool": "Vigor + Fortitude",
        "level": 7,
        "discipline": "fortitude",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Muralha de Sangue",
        "description": "Custo: 1 Teste de Despertar\nDuração: Uma cena",
        "summary": "Escolha até Fortitude aliados em alcance curto. Uma vez por turno, quando um deles sofrer dano, o usuário pode receber até Fortitude pontos desse dano em seu lugar, respeitando o tipo original. A transferência ocorre antes de qualquer redução aplicada pelo aliado; o usuário pode então usar as próprias reduções de Fortitude.",
        "dicePool": "",
        "level": 7,
        "discipline": "fortitude",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Carne que Aprende",
        "description": "Custo: 2 Testes de Despertar\nDuração: Uma cena\nLimites: Pode adaptar-se a duas categorias por ativação. Luz solar nunca pode ser escolhida.",
        "summary": "A primeira vez que o usuário sofre uma categoria de dano na cena — balístico, lâmina, impacto, fogo, eletricidade, frio, garras sobrenaturais ou outra definida pelo Narrador — ele anota a categoria. Contra novas fontes da mesma categoria, reduz o dano em metade da Fortitude, arredondada para cima.",
        "dicePool": "",
        "level": 8,
        "discipline": "fortitude",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Invulnerável ao Mundo",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Poderes de nível 8 ou maior podem fazer uma disputa\nDuração: Três turnos",
        "summary": "Durante três turnos, ataques e perigos mundanos causam no máximo 1 ponto de dano por fonte, depois de todos os modificadores. Um poder sobrenatural de nível inferior a 8 segue a mesma limitação. Contra um poder de nível 8 ou maior, o usuário faz a disputa; em derrota, o dano é resolvido normalmente.",
        "dicePool": "Vigor + Fortitude",
        "level": 8,
        "discipline": "fortitude",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Caminhar sob o Sol",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Dificuldade 5\nDuração: Um número de turnos igual à margem, mínimo 1\nLimites: O poder não protege durante o sono diurno e não pode ser renovado enquanto o usuário estiver sob luz solar direta.",
        "summary": "Ative o poder imediatamente antes da exposição e faça o teste. Durante a duração, cada turno de luz solar causa 1 ponto de dano Agravado, independentemente da intensidade, e o usuário ainda faz os testes de terror apropriados. Quando a duração termina, a luz volta a causar o dano normal.",
        "dicePool": "Vigor + Fortitude",
        "level": 9,
        "discipline": "fortitude",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Coração Imóvel",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Poderes de nível 9 ou maior fazem uma disputa contra Autocontrole + Fortitude\nDuração: Uma cena",
        "summary": "Laços de Sangue, Compulsões, possessão, alterações de memória e comandos sobrenaturais ficam suspensos. Um efeito de nível 9 ou maior pode tentar atravessar a proteção; seu usuário disputa contra Autocontrole + Fortitude. Ao fim da cena, efeitos anteriores retornam com a duração que ainda restaria.",
        "dicePool": "",
        "level": 9,
        "discipline": "fortitude",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Indestrutível",
        "description": "Custo: 3 Testes de Despertar\nDuração: Um turno; uma vez por cena\nLimites: Não impede torpor causado por fome, estaca ou poder que não dependa de dano.",
        "summary": "Até o início do próximo turno do usuário, nenhum dano reduz sua Vitalidade abaixo de uma caixa desmarcada. Fontes que causariam Morte Final destroem roupas, carne e ossos, mas o corpo continua funcional e recompõe sua forma mínima ao fim do efeito.",
        "dicePool": "",
        "level": 10,
        "discipline": "fortitude",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Eternidade na Carne",
        "description": "Custo: Passivo\nDuração: Permanente\nLimites: Esta proteção não substitui uma Âncora da Morte Final e não impede diablerie.",
        "summary": "O corpo não pode ser destruído definitivamente enquanto o coração e a cabeça não forem separados e ambos reduzidos a cinzas, dissolvidos ou expostos à luz solar. Dano suficiente ainda causa torpor, desmembramento e incapacidade. Partes separadas movem-se lentamente em direção ao maior fragmento e regeneram-se ao longo de noites.",
        "dicePool": "",
        "level": 10,
        "discipline": "fortitude",
        "rouseChecks": 0,
        "amalgamPrerequisites": []
    },
    {
        "name": "Ação sem Autor",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Raciocínio + Percepção de cada observador relevante\nDuração: Instantânea",
        "summary": "Antes de realizar uma ação visível, declare que o poder a encobre e faça uma única rolagem. Cada observador faz sua defesa. Quem perder percebe o resultado — a porta aberta, o disparo, o objeto desaparecido — mas não consegue identificar o usuário como responsável. Em combate, o alvo do ataque sempre sabe que foi atacado e pode defender-se; o poder oculta apenas a autoria para os demais.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 6,
        "discipline": "obfuscate",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Ausência da Memória",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Perseverança + Inteligência\nDuração: Indefinida\nLimites: Cada ativação afeta uma cena e um alvo.",
        "summary": "Escolha um alvo que tenha percebido o usuário durante a cena e faça a disputa. Em vitória, o alvo conserva os acontecimentos, mas remove o usuário de suas lembranças: falas parecem vir de outra pessoa, objetos mudam de mãos sem autor e lacunas são preenchidas por explicações plausíveis. Provas materiais não desaparecem.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 6,
        "discipline": "obfuscate",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Conspiração sem Rostos",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência de cada observador\nDuração: Uma noite\nLimites: O poder não torna ninguém invisível e não apaga provas físicas explícitas.",
        "summary": "Marque até Ofuscação participantes voluntários. Faça uma rolagem quando alguém de fora tenta observá-los, investigá-los ou relacioná-los. Cada observador se defende separadamente. Quem perder pode interagir com indivíduos isolados, mas não percebe que eles formam um grupo, não recorda reuniões coletivas e não conecta seus atos a uma mesma conspiração.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 7,
        "discipline": "obfuscate",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Identidade Incontestável",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Raciocínio + Percepção ou Inteligência + Investigação\nDuração: Até o próximo despertar\nLimites: A identidade não concede acesso físico, senha, Habilidade, idioma ou autoridade que dependa de uma pessoa específica já conhecida pelo observador.",
        "summary": "Defina uma identidade completa: nome, aparência, voz, função social e histórico plausível. O usuário assume a identidade, e testemunhas, câmeras comuns e cadastros consultados durante a cena fornecem informações superficiais coerentes com ela. Nenhuma rolagem é necessária até que um observador tenha motivo concreto para desconfiar. Nesse momento, faça a disputa indicada. Se o usuário vencer, a identidade continua coerente para esse observador; se o observador vencer, ele percebe contradições e passa a enxergar através do poder.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 7,
        "discipline": "obfuscate",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Roubar Atenção",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Inteligência de cada alvo\nDuração: Uma cena\nLimites: O foco precisa permanecer perceptível. Quando desaparece, o poder termina para aquele alvo.",
        "summary": "Escolha uma pessoa, objeto ou acontecimento visível como foco. Faça uma rolagem; cada alvo se defende separadamente. Quem perder concentra a atenção no foco e sofre −4 dados para perceber, perseguir ou defender-se de qualquer outra coisa. Em combate, o alvo ainda pode reagir a um ataque direto, mas com −2 dados.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 8,
        "discipline": "obfuscate",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Labirinto Mental (Nível 8)",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência\nDuração: Uma noite",
        "summary": "Faça a disputa contra um alvo que possa perceber o usuário. Em vitória, o alvo perde a capacidade de formar uma rota coerente para um local, pessoa ou objetivo nomeado. Cada tentativa o conduz a desvios plausíveis. Para romper o efeito, ele precisa acumular uma margem total igual à Ofuscação do usuário em testes de Raciocínio + Percepção, uma tentativa por cena.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 8,
        "discipline": "obfuscate",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Cidade Cega",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Raciocínio + Percepção dos investigadores centrais\nDuração: Até o nascer do sol\nLimites: O poder não destrói provas. Uma demonstração direta e repetida concede nova defesa com +2 dados.",
        "summary": "Defina uma pessoa, objeto ou acontecimento dentro de uma cidade. Mortais e sistemas comuns deixam de relacionar pistas a esse foco. Quando um investigador sobrenatural central inicia uma investigação direta, faça a disputa indicada. Se o usuário vencer, o investigador interpreta provas corretas como irrelevantes ou pertencentes a outro caso. Se o investigador vencer, ele relaciona as pistas normalmente e fica imune a este uso do poder.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 9,
        "discipline": "obfuscate",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Ninguém",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Poderes de nível 9 ou maior fazem disputa contra Raciocínio + Ofuscação\nDuração: Uma cena",
        "summary": "A ativação não exige rolagem. O usuário deixa de ocupar uma categoria social reconhecível: pessoas o veem e ouvem, mas não o tratam como intruso, autoridade, vítima, agressor ou testemunha. Ele pode atravessar uma barreira social e falar sem que alguém se pergunte quem é. Quando um poder de nível 9 ou maior tenta identificá-lo, classificá-lo ou obrigar alguém a reconhecê-lo, faça a disputa entre a parada desse poder e Raciocínio + Ofuscação. Ações hostis encerram o efeito para quem for diretamente afetado.",
        "dicePool": "",
        "level": 9,
        "discipline": "obfuscate",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Fora da História",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência de cada guardião relevante\nDuração: Um ano e uma noite\nLimites: O poder não altera objetos, cadáveres ou consequências físicas; ele rompe a ligação entre as provas e o foco.",
        "summary": "Escolha uma pessoa, organização, local ou acontecimento e faça uma rolagem. Cada guardião sobrenatural ou testemunha central faz sua defesa. Para quem perder, lembranças e registros ainda existem, mas o foco deixa de aparecer em buscas, narrativas e associações espontâneas. Localizá-lo exige uma pista externa e uma investigação deliberada.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 10,
        "discipline": "obfuscate",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Segredo Absoluto",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Poderes de nível 10 podem fazer uma disputa\nDuração: Uma história\nLimites: O segredo precisa ser específico. Não pode ocultar “tudo sobre” uma pessoa, cidade ou linhagem.",
        "summary": "Defina uma informação expressável em uma frase. Enquanto o poder durar, pessoas que a descubram são incapazes de comunicá-la de forma compreensível: palavras falham, gravações corrompem o trecho e símbolos perdem sentido. Um poder de nível 10 pode tentar atravessar o efeito pela disputa indicada.",
        "dicePool": "Raciocínio + Ofuscação",
        "level": 10,
        "discipline": "obfuscate",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Fome das Sombras",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Vigor + Ocultismo de cada alvo\nDuração: Uma cena\nLimites: Luz solar e fogo sobrenatural de nível igual ou maior dissipam a área após vencerem uma disputa contra a margem original.",
        "summary": "Escuridão viva ocupa uma área de até 20 metros. Faça uma rolagem; cada criatura escolhida na área se defende separadamente. Quem perder sofre 2 pontos de dano Superficial de Vitalidade no início de cada turno e não recupera Vitalidade enquanto permanecer na sombra. Mortais cuja Vitalidade seja preenchida desmaiam; vampiros não entram em torpor apenas por esse dano.",
        "dicePool": "Perseverança + Oblívio",
        "level": 6,
        "discipline": "oblivion",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Mãos do Submundo",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Força + Atletismo ou Perseverança + Ocultismo\nDuração: Uma cena",
        "summary": "Escolha até Oblívio alvos que estejam tocando uma superfície escura. Faça uma única rolagem; cada alvo se defende separadamente. Mãos espectrais emergem e agarram quem perder. O alvo fica imobilizado e sofre 1 ponto de dano Superficial de Força de Vontade no início de cada turno. No fim do turno, pode repetir a defesa para escapar.",
        "dicePool": "Perseverança + Oblívio",
        "level": 6,
        "discipline": "oblivion",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Ferida no Sudário",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Dificuldade 4; local protegido usa Raciocínio + Disciplina do criador\nDuração: Uma cena\nLimites: A ruptura não transporta automaticamente ninguém e não concede controle sobre os mortos.",
        "summary": "Escolha um ponto visível e faça o teste contra Dificuldade 4. Se uma proteção sobrenatural guardar o local, faça a disputa indicada no lugar do teste simples. Em sucesso ou vitória, abra uma ruptura de até dez metros de raio entre o mundo físico e as Terras Sombrias. Fantasmas e seres físicos dentro da área percebem e podem tocar uns aos outros, e poderes e armas atravessam a barreira sem Cerimônia adicional. A margem determina a estabilidade: 1–2, três turnos; 3–4, uma cena; 5 ou mais, uma hora.",
        "dicePool": "Inteligência + Oblívio",
        "level": 7,
        "discipline": "oblivion",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Fome do Vazio",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Vigor + Autocontrole\nDuração: Três turnos",
        "summary": "Escolha um alvo visível e faça a disputa. Em vitória, o alvo sente sua vitalidade ser puxada para o vazio. No início de cada turno, sofre 1 ponto de dano Superficial de Vitalidade e perde um dado de sua próxima parada física. Com margem 3 ou mais, vampiros também fazem um Teste de Despertar; uma falha aumenta a Fome.",
        "dicePool": "Perseverança + Oblívio",
        "level": 7,
        "discipline": "oblivion",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Cidade dos Mortos",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Dificuldade 5\nDuração: Uma noite\nLimites: Cada viajante precisa permanecer próximo do usuário; quem se separar precisa encontrar outra saída por Cerimônia ou poder próprio.",
        "summary": "Escolha um bairro e faça o teste num local em que o Sudário seja fino. Em sucesso, o usuário e até Oblívio acompanhantes atravessam para a réplica espectral da área. Podem deslocar-se por rotas destruídas ou inexistentes no mundo físico e retornar por qualquer ponto correspondente. A margem original é a Dificuldade para perseguidores tentarem seguir a passagem.",
        "dicePool": "Inteligência + Oblívio",
        "level": 8,
        "discipline": "oblivion",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Eclipse Interior",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Autocontrole\nDuração: Um mês",
        "summary": "Toque a sombra do alvo e faça a disputa. Em vitória, escolha esperança, desejo, afeição ou coragem. O alvo continua entendendo o conceito, mas deixa de senti-lo. Testes que dependam diretamente da emoção escolhida sofrem −3 dados. Uma experiência decisiva ligada à emoção concede nova defesa para encerrar o poder.",
        "dicePool": "Manipulação + Oblívio",
        "level": 8,
        "discipline": "oblivion",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Sepultar o Nome",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Ocultismo\nDuração: Um ano e uma noite",
        "summary": "Pronuncie o nome de um morto ou fantasma diante de um vínculo material e faça a disputa. Em vitória, o nome deixa de ancorar a entidade: invocações por nome falham, cultos perdem acesso direto e o fantasma não consegue atravessar o Sudário usando lembranças desse nome. O efeito termina se alguém reconstruir publicamente sua identidade por um Projeto de crônica.",
        "dicePool": "Inteligência + Oblívio",
        "level": 9,
        "discipline": "oblivion",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Maré do Oblívio",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Ocultismo de cada criatura sobrenatural\nDuração: Instantânea",
        "summary": "Uma onda de anulação atravessa uma área de até 30 metros. Faça uma rolagem; cada criatura sobrenatural se defende separadamente. Em derrota, sofre dano Superficial de Força de Vontade igual à margem individual e um poder ativo de nível 8 ou menor escolhido pelo usuário é encerrado. Objetos mundanos envelhecem décadas em segundos.",
        "dicePool": "Perseverança + Oblívio",
        "level": 9,
        "discipline": "oblivion",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Porta do Nada",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Vigor ou Perseverança + Ocultismo\nDuração: Um turno\nLimites: A porta afeta um alvo por ativação e não aprisiona permanentemente Antediluvianos ou entidades equivalentes.",
        "summary": "Abra uma fenda até alcance curto, escolha um alvo e faça a disputa indicada. Em vitória, o alvo é lançado para uma região vazia do Oblívio durante um turno externo. Ao retornar, sofre dano Agravado de Força de Vontade igual à margem da disputa e aparece caído no ponto de partida. Se a margem for 5 ou mais, o usuário pode escolher outro ponto visível para o retorno.",
        "dicePool": "Inteligência + Oblívio",
        "level": 10,
        "discipline": "oblivion",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Coroa do Abismo",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Dificuldade 5; entidade nomeada usa seus dois maiores traços mentais\nDuração: Uma noite\nLimites: O domínio termina ao amanhecer e não apaga pactos, âncoras ou hierarquias espirituais anteriores.",
        "summary": "Faça o teste contra Dificuldade 5 para estabelecer autoridade sobre uma região das Terras Sombrias equivalente a um bairro. Em sucesso, fantasmas sem nome obedecem ordens simples, sombras e portais respondem ao usuário e Cerimônias de nível 5 ou menor realizadas no domínio recebem +3 dados. Quando uma ordem afeta diretamente uma entidade nomeada, compare os sucessos da ativação com uma defesa formada pelos dois maiores traços mentais da entidade. Se ela igualar ou superar os sucessos do usuário, recusa a ordem.",
        "dicePool": "Carisma + Oblívio",
        "level": 10,
        "discipline": "oblivion",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Pegada da Montanha",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Força + Atletismo ou Vigor + Potência\nDuração: Uma cena ou até soltar\nLimites: O poder não aumenta alcance e exige um ponto físico de apoio ou contato.",
        "summary": "O usuário pode agarrar e conter criaturas ou objetos de qualquer tamanho que consiga alcançar fisicamente. Contra uma criatura, faça a disputa; em vitória, ela fica imobilizada. No fim de cada turno pode repetir a defesa. Contra veículos, máquinas ou estruturas sem vontade, role contra Dificuldade 3–6 conforme a escala; em sucesso, o usuário interrompe o movimento, sustenta o peso ou impede a ruptura.",
        "dicePool": "Força + Potência",
        "level": 6,
        "discipline": "potence",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Quebra-Guarda",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Defesa normal, reduzida pela metade da Potência\nDuração: Instantânea\nLimites: Não se combina com outro efeito que reduza a mesma parada de defesa; use apenas a maior redução.",
        "summary": "Antes de o alvo rolar, reduza sua parada de defesa em metade da Potência do usuário, arredondada para baixo, até o mínimo de um dado. Depois resolva o ataque e o dano normalmente. A redução representa armas quebradas, postura vencida e cobertura arrancada no impacto.",
        "dicePool": "Parada normal do ataque corpo a corpo",
        "level": 6,
        "discipline": "potence",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Levantar o Impossível",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Dificuldade 3–7 conforme massa e estabilidade\nDuração: Uma cena",
        "summary": "Escolha a massa e faça o teste indicado; o Narrador define a Dificuldade entre 3 e 7 conforme peso, estabilidade e pontos de apoio. Em sucesso, o usuário ergue, arrasta, sustenta ou gira a massa durante a cena sem novos testes, salvo mudança brusca de condição. A margem indica controle: 1, movimento lento; 2, caminhar; 3, arremessar a curta distância; 4 ou mais, manipular com precisão suficiente para proteger pessoas próximas.",
        "dicePool": "Força + Potência",
        "level": 7,
        "discipline": "potence",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Onda de Impacto",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Destreza + Atletismo de cada alvo\nDuração: Instantânea",
        "summary": "Golpeie o ar, o solo ou uma superfície sólida e escolha um cone de 20 metros. Faça uma rolagem; cada alvo no cone se defende separadamente. Quem perder sofre dano Superficial igual à margem individual +2, é lançado até alcance curto e cai. Cobertura comum é destruída ou deslocada.",
        "dicePool": "Força + Potência",
        "level": 7,
        "discipline": "potence",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Ruína em Cadeia",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Dificuldade da estrutura inicial\nDuração: Instantânea",
        "summary": "Ataque uma estrutura, veículo ou objeto conectado a outros. Em sucesso, a força percorre junções, colunas, trilhos, tubulações ou fundações. O usuário destrói o ponto inicial e um número de segmentos adicionais igual à margem, escolhendo a direção da propagação. Pessoas nas áreas atingidas defendem-se com Destreza + Atletismo contra os sucessos do usuário.",
        "dicePool": "Força + Potência",
        "level": 8,
        "discipline": "potence",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Agarrar o Intangível",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Defesa normal da entidade\nDuração: Uma cena",
        "summary": "Durante a cena, o usuário trata fantasmas manifestos, sombras animadas, corpos astrais e formas gasosas como matéria sólida. Para cada ataque ou agarrão contra uma dessas entidades, role Força + Potência contra a defesa normal da entidade. Uma entidade derrotada num agarrão não pode atravessar paredes nem retornar ao estado intangível até escapar.",
        "dicePool": "Força + Potência",
        "level": 8,
        "discipline": "potence",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Quebrar a Montanha",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Destreza + Atletismo de cada alvo na área\nDuração: Instantânea",
        "summary": "Depois de um turno de preparação, golpeie uma estrutura ou o solo. Faça uma única rolagem. O efeito destrói uma fortificação, derruba um edifício pequeno, vira um trem ou abre uma cratera de dezenas de metros. Cada criatura na área faz sua defesa; quem perder sofre dano Superficial igual à margem individual +5 e fica soterrado ou lançado conforme a ficção.",
        "dicePool": "Força + Potência",
        "level": 9,
        "discipline": "potence",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Força Compartilhada",
        "description": "Custo: 2 Testes de Despertar\nDuração: Uma cena\nLimites: Nenhum aliado recebe mais pontos do que sua Potência de Sangue.",
        "summary": "Escolha até cinco aliados que tenham bebido uma gota da vitae do usuário. Distribua entre eles até Potência pontos. O usuário reduz temporariamente sua própria Potência pelo total distribuído; cada aliado adiciona os pontos recebidos a testes de Força e ao dano desarmado. A distribuição pode ser alterada no início do turno do usuário.",
        "dicePool": "",
        "level": 9,
        "discipline": "potence",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Golpe do Primeiro",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Defesa normal\nDuração: Instantânea; uma vez por cena\nLimites: O poder afeta um único alvo e não transforma margem negativa em acerto.",
        "summary": "Faça um ataque desarmado. Em acerto, o dano é Agravado, recebe +5 e ignora até cinco pontos de redução concedidos por Fortitude, armadura ou poder equivalente. Se o ataque preencher a Vitalidade do alvo, um vampiro entra em torpor imediatamente; um mortal morre.",
        "dicePool": "Parada normal do ataque desarmado",
        "level": 10,
        "discipline": "potence",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Peso da Vontade",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Força ou Vigor + Atletismo\nDuração: Uma cena\nLimites: A manipulação não realiza movimentos delicados, não aciona mecanismos internos e exige linha de visão.",
        "summary": "A força do usuário alcança tudo o que ele veja a até 20 metros. Para mover objetos sem vontade, role contra Dificuldade 3–7 conforme massa e fixação. Contra uma criatura, faça a disputa. Em vitória, o usuário empurra, segura, ergue ou esmaga o alvo como se o tocasse; dano de esmagamento é igual à margem individual +3.",
        "dicePool": "Carisma + Potência",
        "level": 10,
        "discipline": "potence",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Autoridade Inquestionável",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Autocontrole + Inteligência de cada alvo\nDuração: Uma cena",
        "summary": "Declare a posição social, função ou autoridade que o usuário reivindica e faça uma rolagem. Cada alvo se defende separadamente. Quem perder aceita que o usuário possui legitimidade para ocupar a posição e interpreta protocolos, dúvidas e ordens razoáveis de acordo com ela. O poder não cria documentos nem conhecimento técnico.",
        "dicePool": "Carisma + Presença",
        "level": 6,
        "discipline": "presence",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Confissão Irresistível",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Autocontrole + Inteligência\nDuração: Uma cena de conversa\nLimites: O poder revela o que o alvo sente e acredita, não uma verdade factual que ele desconhece.",
        "summary": "Faça uma pergunta sobre desejo, medo, culpa, amor ou ressentimento e faça a disputa. Em vitória, o alvo precisa responder com sinceridade emocional, embora possa escolher palavras cuidadosas. Cada ponto de margem permite uma pergunta adicional sobre a mesma emoção ou relação.",
        "dicePool": "Manipulação + Presença",
        "level": 6,
        "discipline": "presence",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Corte Emocional",
        "description": "Custo: 2 Testes de Despertar\nDuração: Uma noite\nLimites: O benefício termina para quem agir deliberadamente contra o usuário durante a duração.",
        "summary": "Escolha até Presença aliados voluntários. Enquanto puderem perceber o usuário, recebem +2 dados em testes sociais e podem usar a maior Força de Vontade atual entre os membros da corte para resistir a medo, intimidação ou Presença. Uma vez por turno, o usuário pode transmitir a todos uma emoção simples que eles reconhecem como própria, mas não é obrigado a obedecer a ações específicas.",
        "dicePool": "",
        "level": 7,
        "discipline": "presence",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Luto Antecipado",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Autocontrole + Perseverança\nDuração: Uma semana",
        "summary": "Nomeie uma pessoa, relação, causa ou objeto que o alvo valorize e faça a disputa. Em vitória, o alvo sente a perda futura desse vínculo como se já fosse certa. Sofre −3 dados para agir diretamente contra ele e recebe +2 dados para protegê-lo ou impedir sua perda. Uma prova inequívoca de segurança permite nova defesa.",
        "dicePool": "Manipulação + Presença",
        "level": 7,
        "discipline": "presence",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Paixão Epidêmica",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Inteligência de cada alvo\nDuração: Uma cena; ecos por uma noite",
        "summary": "Escolha uma emoção e um ponto de origem dentro de alcance médio. Faça uma rolagem; cada alvo se defende separadamente. Quem perder sente a emoção e a transmite a pessoas com quem interagir de modo intenso. Novos alvos usam a margem do transmissor como Dificuldade para resistir. O contágio termina quando a margem cair a zero ou ao amanhecer.",
        "dicePool": "Carisma + Presença",
        "level": 8,
        "discipline": "presence",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Trono Invisível",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Inteligência de cada alvo\nDuração: Uma noite",
        "summary": "Em uma reunião, domínio ou organização presente, declare uma única prioridade política. Faça uma rolagem; cada líder ou participante relevante se defende separadamente. Quem perder reorganiza decisões da noite para favorecer essa prioridade, desde que não exija autodestruição evidente. O poder influencia escolhas; não fornece ordens detalhadas.",
        "dicePool": "Carisma + Presença",
        "level": 8,
        "discipline": "presence",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Adoração de Sangue",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Inteligência ao beber\nDuração: Um mês\nLimites: O efeito não cria Laço de Sangue, não concede telepatia e termina se o usuário contradisser de modo inequívoco a doutrina apresentada.",
        "summary": "Misture uma gota de vitae a uma bebida ou oferenda. Quando alguém a consumir, faça a disputa indicada. Em vitória do usuário, o alvo passa a considerá-lo uma figura sagrada, exemplar ou profética. Recebe +2 dados quando age para proteger o culto e −3 dados para desafiar publicamente a autoridade do usuário.",
        "dicePool": "Carisma + Presença",
        "level": 9,
        "discipline": "presence",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Quebrar o Coração",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Perseverança\nDuração: Uma cena",
        "summary": "Escolha um vínculo emocional do alvo, descreva sua perda ou traição e faça a disputa indicada. Em vitória, o alvo sofre dano Superficial de Força de Vontade igual à margem da disputa +2 e fica incapaz de receber benefícios daquele vínculo durante a cena. Com margem 5 ou mais, também manifesta uma Compulsão apropriada à perda.",
        "dicePool": "Manipulação + Presença",
        "level": 9,
        "discipline": "presence",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Nome que Governa",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Inteligência de cada alvo que conheça o nome\nDuração: Uma noite",
        "summary": "Escolha um nome, título ou símbolo publicamente associado ao usuário numa cidade. Todos que o reconheçam e estejam na cidade sentem sua presença. Faça uma rolagem; cada criatura sobrenatural relevante se defende separadamente. Quem perder trata uma única declaração pública do usuário como a prioridade emocional da noite.",
        "dicePool": "Carisma + Presença",
        "level": 10,
        "discipline": "presence",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Êxtase ou Terror",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Perseverança de cada alvo\nDuração: Três turnos",
        "summary": "Escolha êxtase ou terror e uma área de até 100 metros. Faça uma rolagem; cada alvo se defende separadamente. Em derrota, fica incapaz de realizar ações ofensivas no primeiro turno e sofre 3 pontos de dano Superficial de Força de Vontade. Nos turnos seguintes pode agir, mas orienta cada ação para aproximar-se da fonte do êxtase ou fugir da fonte do terror. Mortais reduzidos a zero ficam catatônicos.",
        "dicePool": "Carisma + Presença",
        "level": 10,
        "discipline": "presence",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Metamorfose Instantânea",
        "description": "Custo: 1 Teste de Despertar\nDuração: Uma cena\nLimites: Cada forma continua obedecendo às próprias limitações. O poder não concede formas desconhecidas.",
        "summary": "Durante a cena, o usuário pode assumir ou abandonar qualquer forma concedida por um poder de Proteanismo que já conheça no início de seu turno, sem pagar novamente o custo desse poder e sem gastar a ação principal. A primeira transformação ocorre na ativação.",
        "dicePool": "",
        "level": 6,
        "discipline": "protean",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Moldar a Besta",
        "description": "Custo: 1 Teste de Despertar\nDuração: Uma cena\nLimites: A mesma adaptação não pode ser escolhida duas vezes e a forma é claramente monstruosa.",
        "summary": "Escolha três adaptações ao ativar: carapaça (+2 dados para resistir a dano físico), guelras, escavação, voo limitado, membros adicionais (+2 dados para agarrar), sentidos especiais (+2 dados de Percepção), veneno (alvos feridos sofrem 2 dano Superficial de Força de Vontade) ou tamanho aumentado (+2 dados de Força). As adaptações aparecem imediatamente.",
        "dicePool": "",
        "level": 6,
        "discipline": "protean",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Terra Obediente",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Dificuldade 3–6 conforme a escala\nDuração: Uma cena\nLimites: Metal maciço, solo consagrado e água corrente extensa exigem Dificuldade 6 ou bloqueiam o efeito, conforme a ficção.",
        "summary": "Enquanto tocar solo, pedra ou fundações, o usuário pode abrir túneis, levantar barreiras, fechar passagens e mover-se sob a superfície. Faça um teste quando a alteração superar uma sala ou encontrar material reforçado. Em sucesso, modifique uma área de até 20 metros; cada ponto de margem acrescenta mais 10 metros ou permite uma alteração estrutural adicional.",
        "dicePool": "Vigor + Proteanismo",
        "level": 7,
        "discipline": "protean",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Corpo de Mil Formas",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Dificuldade 4 para uma espécie nunca assumida\nDuração: Uma noite\nLimites: Não copia memórias, Habilidades aprendidas nem capacidades sobrenaturais da espécie.",
        "summary": "Assuma a forma completa de qualquer criatura viva cujo sangue o usuário tenha provado e cuja anatomia tenha estudado. Formas já usadas são automáticas; uma espécie nova exige o teste. O usuário conserva mente, Potência de Sangue e poderes compatíveis e adota tamanho, sentidos e locomoção da criatura.",
        "dicePool": "Inteligência + Proteanismo",
        "level": 7,
        "discipline": "protean",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Forma Mítica",
        "description": "Custo: 2 Testes de Despertar\nDuração: Uma cena\nLimites: A forma é fixa, enorme e impossível de esconder pela aparência comum.",
        "summary": "Defina ao adquirir o poder uma forma lendária exclusiva. Ao ativar, distribua seis benefícios entre: +2 dados de Força; +2 dados de Vigor; armadura 2; dano natural +3; voo ou escavação veloz; alcance longo de membros ou sopro; sentidos sobrenaturais; ou aura de terror Dificuldade 4. Um benefício pode ser escolhido duas vezes quando fizer sentido.",
        "dicePool": "",
        "level": 8,
        "discipline": "protean",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Forma de Enxame",
        "description": "Custo: 2 Testes de Despertar\nDuração: Uma cena\nLimites: Fogo, luz solar, explosões e ataques de área afetam o enxame normalmente. O usuário precisa reunir ao menos metade das criaturas para reassumir forma sólida.",
        "summary": "O corpo se divide num enxame de animais pequenos apropriados ao usuário: morcegos, ratos, serpentes, corvos, insetos ou equivalentes. O enxame atravessa frestas, ocupa uma área de até dez metros e é imune a ataques de alvo único. Uma vez por turno pode atacar todos os inimigos na área; cada um defende-se contra Destreza + Proteanismo e sofre dano Superficial igual à margem individual +1.",
        "dicePool": "",
        "level": 8,
        "discipline": "protean",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Avatar do Território",
        "description": "Custo: 3 Testes de Despertar\nDuração: Uma noite\nLimites: O corpo original fica fundido a um ponto do território e pode ser encontrado e atacado.",
        "summary": "Escolha uma área contínua de até um bairro que o usuário tenha percorrido e marcado com vitae. Sua consciência ocupa raízes, rachaduras, canos, animais e superfícies. Ele percebe acontecimentos físicos importantes em qualquer ponto e pode manifestar olhos, voz, garras ou membros num ponto por turno. A manifestação usa Vigor + Proteanismo para ações físicas.",
        "dicePool": "",
        "level": 9,
        "discipline": "protean",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Semente da Reencarnação",
        "description": "Custo: 2 Testes de Despertar\nDuração: Um ano ou até ser ativada\nLimites: A ativação destrói a semente e reduz permanentemente a Potência de Sangue em 1. A semente conta como Âncora e pode ser detectada ou destruída.",
        "summary": "Durante uma hora, deposite carne e vitae num receptáculo vivo ou terreno preparado. Se o usuário sofrer Morte Final enquanto a semente existir, o corpo começa a reconstruir-se ali e desperta em torpor depois de sete noites.",
        "dicePool": "",
        "level": 9,
        "discipline": "protean",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Forma sem Limites",
        "description": "Custo: 3 Testes de Despertar\nDuração: Uma cena\nLimites: Nenhum Atributo ultrapassa 10 ou o limite geracional. A forma sempre conserva uma assinatura reconhecível do usuário.",
        "summary": "No início de cada turno, o usuário redistribui até cinco pontos entre Força, Destreza e Vigor e escolhe até três capacidades físicas plausíveis, como voo, escavação, forma líquida, carapaça, membros múltiplos ou tamanho colossal. A mudança não consome a ação principal.",
        "dicePool": "",
        "level": 10,
        "discipline": "protean",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Carne do Mundo",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Defesas individuais contra as manifestações\nDuração: Uma cena\nLimites: Quando a Vitalidade do ambiente chega a zero, o poder termina. Alterações físicas não essenciais regridem ao fim da cena.",
        "summary": "A ativação não exige rolagem. Transforme uma área de até 50 metros como extensão do corpo: paredes fecham, pisos agarram, árvores golpeiam e superfícies desenvolvem olhos ou bocas. Uma vez por turno, o cenário realiza uma ação usando Vigor + Proteanismo; cada alvo faz sua defesa normal contra essa ação. O ambiente possui Vitalidade 20, reduzida por dano de área ou destruição estrutural.",
        "dicePool": "Vigor + Proteanismo para cada ação do ambiente",
        "level": 10,
        "discipline": "protean",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Combustão Hemática",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Dificuldade 3 para vitae exposta; Destreza + Atletismo para alvos na área\nDuração: Uma cena\nLimites: O poder não inflama vitae dentro de um corpo e não funciona sem sangue exposto.",
        "summary": "Toque ou veja sangue exposto e faça o teste. Em sucesso, até cinco porções de sangue num raio de 20 metros tornam-se chamas sobrenaturais sob comando do usuário. Uma vez por turno, ele move uma chama ou a lança contra um alvo; o alvo defende-se e sofre dano Agravado igual à margem individual +1. As chamas só queimam matéria tocada por sangue.",
        "dicePool": "Inteligência + Feitiçaria de Sangue",
        "level": 6,
        "discipline": "blood sorcery",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Selo de Vitae",
        "description": "Custo: 1 Teste de Despertar\nOposição / Dificuldade: Perseverança + Ocultismo de um alvo resistente\nDuração: Uma semana\nLimites: Cada ativação mantém um selo. O alvo pode remover o selo por ritual, troca completa de sangue ou vitória num Projeto de purificação.",
        "summary": "Misture uma gota da vitae do usuário ao sangue do alvo, por toque, ferimento ou ingestão, e faça a disputa quando houver resistência. Em vitória, o usuário conhece a direção e a distância aproximada do alvo enquanto estiverem na mesma cidade. Também percebe quando ele se alimenta, usa Surto de Sangue ou ativa um poder com Teste de Despertar.",
        "dicePool": "Inteligência + Feitiçaria de Sangue",
        "level": 6,
        "discipline": "blood sorcery",
        "rouseChecks": 1,
        "amalgamPrerequisites": []
    },
    {
        "name": "Interditar o Sangue",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Vigor + Potência de Sangue\nDuração: Uma cena",
        "summary": "Toque sangue exposto do alvo, escolha uma função — Surto de Sangue, reparação de dano, criação de Laços ou uma Disciplina específica que o usuário tenha presenciado — e faça a disputa indicada. Em vitória, a função escolhida fica indisponível durante a cena. Poderes já ativos não são encerrados, mas não podem ser renovados.",
        "dicePool": "Perseverança + Feitiçaria de Sangue",
        "level": 7,
        "discipline": "blood sorcery",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Hemorragia do Poder",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Potência de Sangue\nDuração: Uma cena\nLimites: O teste adicional não se aplica a poderes passivos. Quando a crônica usa Reserva Rubra, esse teste adicional não pode ser cancelado pela Reserva.",
        "summary": "Marque o alvo com sangue e faça a disputa. Em vitória, toda vez que ele ativa um poder com Teste de Despertar, precisa fazer um Teste adicional depois da ativação. Uma falha nesse teste adicional aumenta a Fome normalmente; se já estiver no máximo, aplica a regra de frenesi do sistema de Fome usado pela crônica.",
        "dicePool": "Inteligência + Feitiçaria de Sangue",
        "level": 7,
        "discipline": "blood sorcery",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Tempestade Rubra",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Vigor + Ocultismo de cada alvo\nDuração: Três turnos\nLimites: Cobertura totalmente fechada protege. O sangue desaparece ao fim da cena, mas danos e provas permanecem.",
        "summary": "Escolha uma área de até um quarteirão alimentada por chuva, névoa ou encanamentos. Sangue corrosivo precipita durante três turnos. Faça uma rolagem por turno; cada alvo exposto se defende separadamente. Mortais sofrem dano Superficial igual à margem individual +1. Vampiros sofrem 1 ponto de dano Agravado em vitória do conjurador e fazem um teste de frenesi de fome, Dificuldade 3, se estiverem em Fome 3 ou maior.",
        "dicePool": "Inteligência + Feitiçaria de Sangue",
        "level": 8,
        "discipline": "blood sorcery",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Coração Alquímico",
        "description": "Custo: 2 Testes de Despertar\nDuração: Uma cena\nLimites: Cada propriedade adicional é comprada como nova escolha deste poder.",
        "summary": "Escolha ao adquirir o poder uma alteração para a própria vitae: venenosa; incapaz de formar Laço; compatível para alimentar outro Clã sem provocar rejeição; sem Ressonância; ou portadora de uma mensagem que o bebedor ouve mentalmente. Ao ativar, toda vitae que sair do corpo durante a cena possui essa propriedade.",
        "dicePool": "",
        "level": 8,
        "discipline": "blood sorcery",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Maldição da Linhagem",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Perseverança + Potência de Sangue de cada alvo central\nDuração: Um mês\nLimites: A maldição alcança no máximo três gerações de sangue a partir dos doadores e não se acumula consigo mesma.",
        "summary": "Reúna sangue de três membros da mesma linhagem e defina uma maldição: agravar a Perdição em 1, bloquear um poder específico de nível 5 ou menor ou impor uma Compulsão em uma circunstância objetiva. Faça uma rolagem; cada descendente central da crônica se defende separadamente. Mortais e figurantes ligados à linhagem são afetados automaticamente quando apropriado.",
        "dicePool": "Inteligência + Feitiçaria de Sangue",
        "level": 9,
        "discipline": "blood sorcery",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Beber o Milagre",
        "description": "Custo: 2 Testes de Despertar\nOposição / Dificuldade: Dificuldade igual ao nível do poder copiado\nDuração: Até o próximo amanhecer ou até o uso\nLimites: Não copia rituais, cerimônias, poderes passivos, amálgamas cujos requisitos físicos sejam impossíveis nem poderes que gastem Potência permanente.",
        "summary": "Depois de testemunhar um poder de nível 8 ou menor e beber vitae de seu usuário, faça o teste. Em sucesso, o feiticeiro armazena uma cópia desse poder e pode ativá-la uma vez usando Feitiçaria de Sangue no lugar da Disciplina original. Ele paga o custo normal e usa as demais paradas e requisitos do poder.",
        "dicePool": "Perseverança + Feitiçaria de Sangue",
        "level": 9,
        "discipline": "blood sorcery",
        "rouseChecks": 2,
        "amalgamPrerequisites": []
    },
    {
        "name": "Lei do Sangue",
        "description": "Custo: 3 Testes de Despertar\nOposição / Dificuldade: Perseverança + Ocultismo de vampiros com Potência 9 ou maior\nDuração: Uma noite\nLimites: A regra também afeta o conjurador e precisa ser igual para todos os alvos da categoria escolhida.",
        "summary": "Declare uma regra que afete toda vitae numa área de até um bairro: sangue não sacia; Laços de Sangue não se formam; uma linhagem não pode usar Surto de Sangue; ou todo Teste de Despertar exige dois dados, resolvidos separadamente, de modo que cada resultado de falha aumenta a Fome em 1. Quando a Potência de Sangue permitir rerrolar um Teste de Despertar, apenas um dos dois dados pode ser rerrolado. Role Inteligência + Feitiçaria de Sangue uma vez. Vampiros de Potência 8 ou menor são afetados automaticamente. Cada vampiro de Potência 9 ou maior rola Perseverança + Ocultismo contra os sucessos do conjurador; quem igualar ou superar esse resultado resiste à regra.",
        "dicePool": "Inteligência + Feitiçaria de Sangue",
        "level": 10,
        "discipline": "blood sorcery",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    },
    {
        "name": "Gênese Rubra",
        "description": "Custo: 3 Testes de Despertar e perda permanente de 1 Potência de Sangue\nOposição / Dificuldade: Projeto estendido: 25 sucessos acumulados\nDuração: Permanente\nLimites: A Potência é perdida somente quando o Projeto é concluído. XP não recupera o ponto; apenas diablerie ou acontecimento equivalente pode fazê-lo.",
        "summary": "Defina com o Narrador uma nova expressão estável do Sangue — linhagem menor, maldição hereditária, criatura hemática ou ritual autossustentado — incluindo propósito, fraqueza, modo de transmissão e forma de destruição. Depois de dedicar uma noite inteira de trabalho, role Inteligência + Feitiçaria de Sangue, no máximo uma vez por semana, e some todos os sucessos obtidos ao total do Projeto. Ao alcançar 25 sucessos acumulados, a criação passa a existir no cenário. Uma falha comum não acrescenta progresso. Uma falha total apaga todos os sucessos acumulados e consome o ingrediente central do Projeto, obrigando o feiticeiro a recomeçar caso ainda possua meios para isso.",
        "dicePool": "Inteligência + Feitiçaria de Sangue",
        "level": 10,
        "discipline": "blood sorcery",
        "rouseChecks": 3,
        "amalgamPrerequisites": []
    }
]
