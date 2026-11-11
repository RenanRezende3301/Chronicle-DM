import type { Power } from './Disciplines'
import type { DisciplineName } from './NameSchemas'

/**
 * Sangue Esquecido 1.1. Os Legados são deliberadamente catalogados nas
 * Disciplinas principais da V5; `legacy` mantém a origem visível na ficha.
 * Texto mecânico condensado a partir do suplemento para uso no Chronicle.
 */
type Requirement = [DisciplineName, number]
type PowerSeed = [string, string, number, DisciplineName, Requirement[], number, string, string, string?]

const power = ([legacy, name, level, discipline, prerequisites, rouseChecks, dicePool, summary, description = summary]: PowerSeed): Power => ({
  name,
  level,
  discipline,
  amalgamPrerequisites: prerequisites.map(([requiredDiscipline, requiredLevel]) => ({ discipline: requiredDiscipline, level: requiredLevel })),
  rouseChecks,
  dicePool,
  summary,
  description,
  legacy,
})

export const sangueEsquecidoPowers: Power[] = [
  // Daimoinon — Baali
  power(['Daimoinon', 'Sentir o Pecado', 1, 'auspex', [['presence', 1]], 0, 'Raciocínio + Auspícios', 'Revela medo, desejo, culpa/vergonha ou Convicção vulnerável; uma vez na cena, concede +1 dado para explorá-la.']),
  { ...power(['Daimoinon', 'Medo do Vazio Inferior', 2, 'presence', [['auspex', 1]], 1, 'Manipulação + Presença', 'Transforma uma fraqueza percebida em terror; vampiros testam Frenesi de Terror e alvos resistindo sofrem −2 dados para aproximar-se ou desafiar o usuário.']), requiredPowerNames: ['Sentir o Pecado'] },
  power(['Daimoinon', 'Conflagração Negra', 3, 'blood sorcery', [['presence', 1]], 1, 'Perseverança + Feitiçaria de Sangue', 'Projeta chama negra: 1 dano Agravado a mortos-vivos (2 com margem 3+) e conta como fonte sobrenatural de fogo.']),
  power(['Daimoinon', 'Psicomaquia', 4, 'presence', [['auspex', 2]], 1, 'Manipulação + Presença', 'Materializa medo, culpa ou desejo: 2 dano superficial de Força de Vontade e −2 dados em ações que não confrontem a manifestação.']),
  power(['Daimoinon', 'Condenação', 5, 'blood sorcery', [['presence', 2]], 2, 'Inteligência + Feitiçaria de Sangue', 'Impõe uma maldição de Fraqueza, Isolamento ou Dúvida até que o alvo cumpra uma condição simbólica e realizável.']),

  // Sanguinus — Blood Brothers
  power(['Sanguinus', 'Sangue do Irmão', 1, 'protean', [['fortitude', 1]], 1, '', 'Transfere até 2 dano superficial de Vitalidade de um membro do Círculo para o usuário; um segundo despertar transfere 1 agravado.']),
  power(['Sanguinus', 'Octópode', 2, 'protean', [['potence', 1]], 1, '', 'Membros do Círculo redistribuem massa ou membros: receptor recebe +2 dados físicos estreitos e doador sofre −2 no uso da parte cedida.']),
  power(['Sanguinus', 'Gestalt', 3, 'fortitude', [['protean', 2]], 1, '', 'Cria rede sensorial/emocional do Círculo a 30m, com direção, estado geral e +1 dado em trabalho em equipe.']),
  power(['Sanguinus', 'Caminho de Caim', 4, 'potence', [['fortitude', 2]], 1, '', 'Até dois irmãos voluntários transferem 1 Potência de Sangue efetiva cada para um receptor durante a cena, máximo +2.']),
  power(['Sanguinus', 'Entidade Coagulada', 5, 'protean', [['potence', 3]], 1, '', 'De dois a cinco membros fundem-se em uma entidade de ação única, usando os melhores Atributos Físicos e Vitalidade ampliada.']),

  // Melpominee — Daughters of Cacophony
  power(['Melpominee', 'A Voz Ausente', 1, 'dominate', [['presence', 1]], 0, 'Manipulação + Performance', 'Projeta a voz para qualquer ponto visível a 30m e imita uma voz ouvida por um minuto.']),
  power(['Melpominee', 'Melpominee — Ponte Oficial', 2, 'presence', [], 0, '', 'Poder oficial de Presença que integra este Legado; use a regra oficial da mesa.']),
  power(['Melpominee', 'Madrigal', 3, 'presence', [['dominate', 1]], 1, 'Carisma + Performance', 'Uma canção impõe uma emoção: +2 dados para agir em conformidade e −2 contra ela.']),
  power(['Melpominee', 'Chamado da Sereia', 4, 'dominate', [['presence', 2]], 1, 'Manipulação + Performance', 'Pela voz, induz Aproximar-se, Afastar-se, Confessar, Calar-se ou Fixar-se; o alvo sofre −3 ao contrariar o impulso.']),
  power(['Melpominee', 'Virtuosa', 5, 'presence', [['dominate', 3]], 2, 'Parada do poder ampliado', 'Amplia A Voz Ausente, Madrigal ou Chamado da Sereia para até Presença alvos que ouçam a performance.']),

  // Visceratika — Gargoyles
  power(['Visceratika', 'Voo', 1, 'protean', [['potence', 1]], 0, 'Força + Atletismo', 'As asas ou membranas permitem voo em velocidade de corrida; manobras difíceis pedem teste.']),
  power(['Visceratika', 'Pele do Camaleão', 1, 'protean', [['fortitude', 1]], 0, 'Destreza + Furtividade', 'Pele mineral copia o ambiente e concede +2 dados de Furtividade quando imóvel ou em movimento lento.']),
  power(['Visceratika', 'Perscrutar a Pedra do Lar', 2, 'fortitude', [['protean', 1]], 1, 'Raciocínio + Fortitude', 'Lendo vibrações de uma estrutura, percebe salas, danos e criaturas conectadas num raio de 10m por ponto de Fortitude.']),
  power(['Visceratika', 'Laço com a Montanha', 3, 'protean', [['fortitude', 1]], 1, '', 'Funde-se a pedra, concreto ou alvenaria, ficando imóvel e podendo emergir no início de um turno.']),
  power(['Visceratika', 'Armadura de Terra', 4, 'fortitude', [['protean', 2]], 1, '', 'Uma vez por turno converte 1 dano agravado físico em superficial e recebe +2 contra empalar, desmembrar ou derrubar.']),
  power(['Visceratika', 'Fluir pela Montanha', 5, 'protean', [['fortitude', 3]], 2, '', 'Move-se através de pedra, concreto ou alvenaria contínua em ritmo de caminhada.']),

  // Mytherceria — caminhos Kiasyd e Maeghar
  { ...power(['Mytherceria', 'Palavra sem Véu', 1, 'auspex', [], 0, 'Raciocínio + Auspícios', 'Detecta se alguém acredita estar mentindo deliberadamente; um crítico identifica o ponto dissonante.']), amalgamPrerequisiteOptions: [[{ discipline: 'dominate', level: 1 }, { discipline: 'protean', level: 1 }]] },
  power(['Mytherceria', 'Visão Feérica', 2, 'auspex', [['oblivion', 1]], 1, 'Raciocínio + Auspícios', 'Percebe presenças feéricas, encantamentos e lugares liminares; +2 em Ocultismo para identificá-los.']),
  power(['Mytherceria', 'Absorção da Aura', 3, 'auspex', [['oblivion', 1]], 1, 'Perseverança + Auspícios', 'Lendo um objeto ou superfície, revela emoção/evento, imagem/voz ou detalhe factual conforme a margem.']),
  { ...power(['Mytherceria', 'Símbolo Chanjelin', 4, 'oblivion', [], 1, 'Inteligência + Ocultismo', 'Inscreve um símbolo que desorienta invasores, impedindo aproximação e impondo −2 a navegação e percepção.']), amalgamPrerequisiteOptions: [[{ discipline: 'dominate', level: 2 }, { discipline: 'protean', level: 2 }]] },
  { ...power(['Mytherceria', 'Enigma Fantástico — Kiasyd', 5, 'dominate', [['auspex', 3]], 1, 'Manipulação + Dominação', 'Um paradoxo prende a mente do alvo e impõe −3 dados até ele obter três sucessos de solução.']), availableForClans: ['Kiasyd'] },
  { ...power(['Mytherceria', 'Enigma Fantástico — Maeghar', 5, 'auspex', [['oblivion', 3]], 1, 'Perseverança + Auspícios', 'Um paradoxo prende a mente do alvo e impõe −3 dados até ele obter três sucessos de solução.']), availableForClans: ['Maeghar'] },

  // Temporis — True Brujah
  power(['Temporis', 'Sintonia Temporal', 1, 'auspex', [['celerity', 1]], 0, '', 'Percebe o tempo com precisão e recebe +2 dados em estimativa, sincronização, emboscadas por timing e sequência recente.']),
  power(['Temporis', 'Recursão Interna', 2, 'celerity', [['auspex', 1]], 1, 'Perseverança + Celeridade', 'Faz o alvo repetir gesto, deslocamento curto ou frase do turno anterior, consumindo movimento/ação menor ou impondo −2 à ação principal.']),
  power(['Temporis', 'Lapso', 3, 'celerity', [['auspex', 2]], 1, 'Perseverança + Celeridade', 'O alvo sofre −2 em Defesa e reações e precisa escolher entre mover-se ou agir sem penalidade.']),
  power(['Temporis', 'Suspensão Subjetiva', 4, 'auspex', [['celerity', 2]], 1, 'Inteligência + Auspícios', 'Remove objeto inanimado de tamanho humano da sequência normal: fica imóvel, intocável e inoperante.']),
  power(['Temporis', 'Dom de Cloto', 5, 'celerity', [['auspex', 3]], 2, '', 'Concede por três turnos uma ação adicional apenas preparatória, defensiva ou de deslocamento; nunca um segundo ataque.']),

  // Spiritus — Ahrimanes
  power(['Spiritus', 'Sussurro aos Espíritos', 1, 'animalism', [['blood sorcery', 1]], 0, 'Carisma + Animalismo', 'Permite perceber e conversar com espíritos menores de animais, plantas, clima e lugares naturais.']),
  power(['Spiritus', 'Feras do Outro Lado', 2, 'animalism', [['blood sorcery', 1]], 1, 'Carisma + Animalismo', 'Invoca um espírito animal para rastrear, vigiar, levar mensagem ou ajudar; somente uma Fera por usuário.']),
  power(['Spiritus', 'Aspecto da Fera', 3, 'protean', [['animalism', 1]], 1, '', 'Assume por uma cena um aspecto de Sentidos, Garras, Couro, Nado ou Asas.']),
  power(['Spiritus', 'Fúria Engling', 4, 'blood sorcery', [['animalism', 2]], 1, 'Perseverança + Feitiçaria de Sangue', 'Absorve um espírito para curar Força de Vontade superficial conforme a margem, ou 1 agravado com margem 4+.']),
  power(['Spiritus', 'Fera Totêmica', 5, 'protean', [['animalism', 3]], 2, '', 'Assume forma híbrida/bestial: +1 em dois Atributos Físicos, +2 dano natural e ataques alcançam espíritos manifestados.']),

  // Bardo — Children of Osiris
  { ...power(['Bardo', 'Restaurar Humanitas', 1, 'presence', [['fortitude', 1]], 1, 'Carisma + Presença', 'Após orientação voluntária, concede +2 dados ao próximo teste de Remorso pelas Máculas já existentes.']), minimumHumanity: 1 },
  { ...power(['Bardo', 'Sinal de Banimento de Thoth', 2, 'blood sorcery', [['fortitude', 1]], 1, 'Parada de resistência original +2 dados', 'Depois de falhar contra coerção sobrenatural mental/emocional/espiritual, repete a resistência com +2 dados.']), minimumHumanity: 2 },
  { ...power(['Bardo', 'Dádiva de Ápis', 3, 'fortitude', [['blood sorcery', 1]], 1, '', 'Permite que até dois pontos de Fome de sangue animal saciem normalmente, sem reduzir Fome abaixo de 1.']), minimumHumanity: 3 },
  { ...power(['Bardo', 'Pilar de Osíris', 4, 'blood sorcery', [['presence', 2]], 2, 'Inteligência + Feitiçaria de Sangue', 'Consagra área de 10m: aliados recebem +2 para resistir Frenesi, Compulsões e coerção; Remorso recebe +1.']), minimumHumanity: 4 },
  { ...power(['Bardo', 'Paradoxo', 5, 'presence', [['fortitude', 3]], 2, 'Carisma + Presença', 'Impede que alvo derrotado inicie violência contra o usuário enquanto durar, salvo nova resistência com Força de Vontade.']), minimumHumanity: 5 },

  // Ogham — Lhiannan
  power(['Ogham', 'Consagrar o Bosque', 1, 'blood sorcery', [['animalism', 1]], 1, 'Inteligência + Feitiçaria de Sangue', 'Consagra área de 10m: sente entradas de criaturas e recebe +1 em Sobrevivência e Animalismo no local.']),
  power(['Ogham', 'Guado Carmesim', 2, 'blood sorcery', [['presence', 1]], 1, '', 'Runas de Caça dão +2 Intimidação e +1 dano no primeiro ataque; Guarda dá +2 contra derrubada, imobilização e Frenesi de Terror.']),
  power(['Ogham', 'Inscrever a Maldição', 3, 'blood sorcery', [['presence', 1]], 1, 'Inteligência + Feitiçaria de Sangue', 'Grava uma restrição estreita em objeto, pele ou passagem; derrotados sofrem −3 ao tentar violá-la.']),
  power(['Ogham', 'Woad de Taranis', 4, 'blood sorcery', [['animalism', 2]], 1, '', 'Lua concede +2 em Percepção/Furtividade/rastreamento na escuridão; Sol converte 1 agravado de fogo por turno em superficial.']),
  power(['Ogham', 'Sede de Donn', 5, 'blood sorcery', [['animalism', 3]], 2, 'Perseverança + Feitiçaria de Sangue', 'Em território consagrado, drena a terra para curar 2 Vitalidade superficial e tornar o próximo despertar fracassado um sucesso.']),

  // Legados Imemoriais (Sangue Imemorial): mantêm os requisitos, custos de despertar
  // e níveis de origem. Seus efeitos completos continuam descritos no suplemento.
  power(['Daimoinon', 'Investidura da Voz Interior', 6, 'blood sorcery', [['auspex', 3]], 2, '', 'Legado Imemorial de Daimoinon; exige 1 Mácula além dos dois Testes de Despertar.']),
  power(['Daimoinon', 'Pacto Profano', 7, 'presence', [['blood sorcery', 4]], 2, '', 'Legado Imemorial de Daimoinon.']),
  power(['Daimoinon', 'Arauto do Sangue', 8, 'blood sorcery', [['presence', 4]], 2, '', 'Legado Imemorial de Daimoinon; Máculas variam com o nível da entidade.']),
  power(['Daimoinon', 'Grande Maldição', 9, 'blood sorcery', [['presence', 5]], 3, '', 'Legado Imemorial de Daimoinon; causa 1 dano agravado de Força de Vontade.']),
  power(['Daimoinon', 'Portão do Pecado', 10, 'blood sorcery', [['auspex', 5]], 3, '', 'Legado Imemorial de Daimoinon; exige 2 dano agravado de Força de Vontade e 2 Máculas.']),
  power(['Sanguinus', 'Circuito de Carne', 6, 'protean', [['fortitude', 3]], 1, '', 'Legado Imemorial de Sanguinus.']),
  power(['Sanguinus', 'Coração Distribuído', 8, 'fortitude', [['protean', 4]], 2, '', 'Legado Imemorial de Sanguinus.']),
  power(['Sanguinus', 'Colosso Carmesim', 10, 'protean', [['potence', 5]], 2, '', 'Legado Imemorial de Sanguinus; um Teste de Despertar por participante.']),
  power(['Melpominee', 'Coro de Uma Só', 6, 'presence', [['dominate', 3]], 2, '', 'Legado Imemorial de Melpominee.']),
  power(['Melpominee', 'Ópera da Multidão', 8, 'presence', [['dominate', 4]], 2, '', 'Legado Imemorial de Melpominee.']),
  power(['Melpominee', 'Última Nota', 10, 'presence', [['dominate', 5]], 3, '', 'Legado Imemorial de Melpominee; causa 2 dano agravado de Força de Vontade.']),
  power(['Visceratika', 'Consciência da Cidadela', 6, 'fortitude', [['protean', 3]], 1, '', 'Legado Imemorial de Visceratika.']),
  power(['Visceratika', 'Fortaleza Viva', 8, 'fortitude', [['protean', 4]], 2, '', 'Legado Imemorial de Visceratika.']),
  power(['Visceratika', 'Tornar-se a Cidadela', 10, 'protean', [['fortitude', 5]], 3, '', 'Legado Imemorial de Visceratika.']),
  { ...power(['Mytherceria', 'Roubar o Saber', 6, 'auspex', [], 2, '', 'Legado Imemorial de Mytherceria.']), amalgamPrerequisiteOptions: [[{ discipline: 'dominate', level: 3 }, { discipline: 'protean', level: 3 }]] },
  power(['Mytherceria', 'Absorver a Mente', 8, 'auspex', [['oblivion', 4]], 2, '', 'Legado Imemorial de Mytherceria; causa 1 dano agravado de Força de Vontade.']),
  power(['Mytherceria', 'Lei do Outro Lado', 9, 'oblivion', [['auspex', 4]], 3, '', 'Legado Imemorial de Mytherceria.']),
  power(['Temporis', 'Beijo de Láquesis', 6, 'celerity', [['auspex', 3]], 2, '', 'Legado Imemorial de Temporis.']),
  power(['Temporis', 'Fora da Ampulheta', 7, 'celerity', [['auspex', 4]], 2, '', 'Legado Imemorial de Temporis.']),
  power(['Temporis', 'Bolso Fora do Tempo', 8, 'auspex', [['celerity', 4]], 2, '', 'Legado Imemorial de Temporis; causa 1 dano agravado de Força de Vontade.']),
  power(['Temporis', 'Rebobinar o Fio', 9, 'celerity', [['auspex', 5]], 3, '', 'Legado Imemorial de Temporis; causa 2 dano agravado de Força de Vontade.']),
  power(['Temporis', 'Convocar a História', 10, 'auspex', [['celerity', 5]], 3, '', 'Legado Imemorial de Temporis; causa 1 dano agravado de Força de Vontade.']),
  power(['Spiritus', 'Corpo de Essência', 6, 'protean', [['animalism', 3]], 2, '', 'Legado Imemorial de Spiritus.']),
  power(['Spiritus', 'Estrada dos Espíritos', 7, 'animalism', [['blood sorcery', 4]], 2, '', 'Legado Imemorial de Spiritus.']),
  power(['Spiritus', 'Matilha dos Ancestrais', 8, 'animalism', [['protean', 4]], 2, '', 'Legado Imemorial de Spiritus.']),
  power(['Spiritus', 'Avatar do Ermo', 9, 'protean', [['animalism', 5]], 3, '', 'Legado Imemorial de Spiritus.']),
  { ...power(['Bardo', 'Benção de Anúbis', 6, 'blood sorcery', [['fortitude', 3]], 2, '', 'Legado Imemorial de Bardo.']), minimumHumanity: 6 },
  { ...power(['Bardo', 'Trazer a Aurora', 7, 'presence', [['blood sorcery', 4]], 2, '', 'Legado Imemorial de Bardo.']), minimumHumanity: 7 },
  { ...power(['Bardo', 'Mumificação', 8, 'fortitude', [['blood sorcery', 4]], 2, '', 'Legado Imemorial de Bardo.']), minimumHumanity: 8 },
  { ...power(['Bardo', 'Benção de Rá', 9, 'fortitude', [['presence', 5]], 3, '', 'Legado Imemorial de Bardo.']), minimumHumanity: 9 },
  { ...power(['Bardo', 'Renascimento', 10, 'blood sorcery', [['fortitude', 5]], 3, '', 'Legado Imemorial de Bardo; prepara receptáculo e perde 1 Potência de Sangue permanentemente ao retornar.']), minimumHumanity: 10 },
  power(['Ogham', 'Nomes Esquecidos', 6, 'blood sorcery', [['animalism', 3]], 2, '', 'Legado Imemorial de Ogham.']),
  power(['Ogham', 'Estrada das Raízes', 7, 'blood sorcery', [['animalism', 4]], 2, '', 'Legado Imemorial de Ogham.']),
  power(['Ogham', 'Véu do Território', 8, 'blood sorcery', [['presence', 4]], 2, '', 'Legado Imemorial de Ogham.']),
  power(['Ogham', 'Genius Loci', 9, 'blood sorcery', [['animalism', 5]], 3, '', 'Legado Imemorial de Ogham.']),
  power(['Ogham', 'Coração da Terra', 10, 'blood sorcery', [['animalism', 5]], 3, '', 'Legado Imemorial de Ogham; exige 1 dano agravado de Força de Vontade.']),
]
