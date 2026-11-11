export const quickReference = {
  diceMechanics: {
    id: 'diceMechanics',
    title: 'Mecanica de Dados',
    summary: [
      'Monte o pool somando Atributo + Habilidade.',
      'Cada d10 com resultado 6 ou maior conta como sucesso.',
      'Dados de Fome substituem dados comuns em quantidade igual a Fome atual.',
    ],
    difficulties: [
      { label: '1 - Rotina:', description: '(Ex: Pular uma cerca baixa)' },
      { label: '2 - Simples:', description: '(Ex: Seduzir alguém que já está interessado)' },
      { label: '3 - Médio:', description: '(Ex: Arrombar uma fechadura padrão)' },
      { label: '4 - Desafiador:', description: '(Ex: Encontrar pistas ocultas em uma cena limpa)' },
      { label: '5 - Difícil:', description: '(Ex: Convencer um oficial de segurança a ignorar uma infração)' },
      { label: '6 - Muito Difícil:', description: '(Ex: Hackear um sistema de alta segurança)' },
      { label: '7 - Quase Impossível:', description: '(Ex: Desarmar uma bomba complexa sem equipamento)' },
    ],
    opposedTests: [
      { label: 'Vencedor:', description: 'Quem obtém mais sucessos na rolagem.' },
      { label: 'Margem:', description: 'A diferença de sucessos entre o vencedor e o perdedor (ex: 4 sucessos vs 2 sucessos = Margem 2). Usado para calcular dano e efeitos.' },
      { label: 'Empate:', description: 'O defensor vence. Se não houver um defensor claro (ex: duas pessoas correndo para pegar o mesmo objeto), o personagem com a maior Parada de Dados vence, ou o Narrador decide que o impasse continua e a situação piora.' },
    ],
    criticals: [
      { label: 'Acerto Crítico Padrão:', description: 'Rolar um par de "10" na sua parada de dados normal. Eles contam como **4 sucessos no total** (cada "10" vale 1 sucesso, e o par concede +2 sucessos de bônus).' },
      { label: 'Crítico Bagunçado (Messy Critical):', description: 'Ocorre se você obtiver um Acerto Crítico e **pelo menos um desses "10" for em um Dado de Fome**. O personagem tem sucesso na ação, mas a Besta se manifesta violentamente (quebra de Máscara, perda de vantagem, ferir aliado, ou +1 Ponto de Mácula).' },
    ],
    failures: [
      { label: 'Falha Padrão:', description: 'Não alcançar a Dificuldade exigida no teste. *(Nota de regra: No V5, rolar o número "1" em dados normais não anula sucessos)*.' },
      { label: 'Falha Total:', description: 'Não obter nenhum sucesso na rolagem (0 sucessos). O personagem falha na ação de forma drástica.' },
      { label: 'Falha Bestial (Bestial Failure):', description: 'Ocorre se o teste falhar e houver **um ou mais resultados "1" em um Dado de Fome**. A Besta assume o controle parcial. O personagem age por instinto, sofre uma Compulsão ou a situação piora drasticamente devido à sua natureza animalesca.' },
    ],
  },
  hungerRules: {
    id: 'hungerRules',
    title: 'Fome e Rouse Check',
    summary: [],
    rouseCheck: [
      { label: 'Sucesso (6 a 10):', description: 'A Fome do personagem **não** aumenta.' },
      { label: 'Falha (1 a 5):', description: 'A Fome do personagem **aumenta em 1**.' },
    ],
    whenToRouse: [
      { label: 'Despertar Diário:', description: 'Obrigatório toda noite ao acordar (se falhar e já estiver com Fome 5, o vampiro cai em Torpor ou entra em Frenesi).' },
      { label: 'Surto de Sangue (Blood Surge):', description: 'Adiciona dados bônus a uma única rolagem (Teste de Atributo ou Habilidade). O bônus exato depende da Potência de Sangue do vampiro (geralmente +1 a +3 dados).' },
      { label: 'Cura Vampírica:', description: 'Usado para curar Dano Superficial no momento (a quantidade curada varia conforme a Potência de Sangue, geralmente 1 nível por teste). Curar 1 Dano Agravado exige 3 Testes de Despertar e um dia inteiro de sono.' },
      { label: 'Rubor da Vida:', description: 'Faz o vampiro parecer humano (respiração, calor corporal, batimento cardíaco) pelo resto da cena, permitindo-lhe comer comida normal (mas ele vomitará depois).' },
      { label: 'Uso de Disciplinas:', description: 'Muitos poderes sobrenaturais exigem um ou mais Testes de Despertar para serem ativados.' },
      { label: 'Abraço e Vínculo de Sangue:', description: 'Criar um novo vampiro ou um Carniçal exige que o vampiro doe do seu sangue.' },
    ],
    hungerLimit: [
      { label: 'Ações Proibidas:', description: 'Quando chega a Fome 5, o vampiro não pode realizar **nenhuma ação** que exija um Teste de Despertar intencional (como ativar um Surto de Sangue ou usar uma Disciplina que custe sangue).' },
      { label: 'Risco de Frenesi:', description: 'Se o vampiro for forçado a fazer um Teste de Despertar (como ao acordar à noite) ou for exposto a um gatilho de Fome, e falhar estando no nível 5, ele entra automaticamente em um **Frenesi de Fome**.' },
      { label: 'Como reduzir:', description: 'A Fome só pode ser reduzida abaixo de 1 se o vampiro **matar um ser humano** durante a alimentação (beber até a morte). Animais e bolsas de sangue não saciam níveis altos de Fome.' },
    ],
  },
  damageRules: {
    id: 'damageRules',
    title: 'Saude e Dano',
    damageTypes: [
      { label: 'Dano Superficial:', description: 'Marcado com uma barra diagonal (`/`). Contra vampiros, a maioria dos danos físicos (socos, armas brancas, tiros de armas de fogo) é **reduzida pela metade (arredondada para cima)** antes de ser aplicada na barra.' },
      { label: 'Dano Agravado:', description: 'Marcado com um `X`. É aplicado diretamente, sem reduções. Para vampiros, as fontes mais comuns são **Fogo, Luz do Sol** e garras/presas sobrenaturais (como o poder de Proteanismo).' },
      { label: 'Cura Vampírica:', description: 'Remedia apenas Dano Superficial. Exige 1 Teste de Despertar o Sangue (Rouse Check) por turno e cura uma quantidade de caixas que depende da Potência de Sangue do vampiro (Mínimo de 1 caixa).' },
    ],
    states: [
      { state: 'OK', condition: 'Pelo menos uma caixa da barra de Saúde está totalmente vazia.', effect: 'Sem penalidades especiais aplicadas.' },
      { state: 'Prejudicado (Impaired)', condition: 'Todas as caixas da barra de Saúde foram preenchidas (geralmente por dano Superficial).', effect: 'Aplica uma **penalidade de -2 dados** em todas as paradas de dados físicas. Além disso, qualquer novo dano recebido (seja Superficial ou Agravado) converte o Dano Superficial mais à esquerda em Dano Agravado (`/` vira `X`).' },
      { state: 'Torpor', condition: 'A barra de Saúde está **100% preenchida por Dano Agravado** (`X`).', effect: 'O vampiro cai inconsciente, fica completamente indefeso e permanece fora de cena. A duração do sono depende do nível de Humanidade do personagem.' },
    ],
  },
  willpowerRules: {
    id: 'willpowerRules',
    title: 'Forca de Vontade',
    summary: [
      'Gaste 1 ponto para rerrolar ate 3 dados que nao sejam Dados de Fome.',
      'Tambem pode ser usada para resistir a certos poderes sociais ou mentais.',
      'Recuperacao vem de descanso, objetivos pessoais, conviccoes e resolucao narrativa.',
    ],
  },
  combat: {
    id: 'combat',
    title: 'Combate',
    sequence: [
      { step: '1. Defina a Cena', description: 'Identifique quem está na cena e quais são as suas intenções.' },
      { step: '2. Determine a Ordem', description: '*(Padrão do V5)*: Resolva primeiro os combates corpo a corpo já engajados, depois ataques à distância, seguidos por novos engajamentos e outras ações.<br/><br/>*(Opcional)*: Utilize o valor fixo de **Autocontrole + Prontidão** (sem rolagens, quem tiver o maior valor age primeiro).' },
      { step: '3. Resolva as Ações', description: 'Os testes de combate corpo a corpo costumam ser resistidos (ambos atacam/defendem simultaneamente).' },
      { step: '4. Aplique as Conseq.', description: 'Calcule os danos na Vitalidade (ou Força de Vontade), estados e penalidades.' },
      { step: '5. Avance a Rodada', description: 'Incremente a rodada e limpe o ciclo de ações.' }
    ],
    actions: [
      { action: 'Soco / Chute / Mordida', attack: 'Força + Briga', defense: 'Destreza + Esportes *(Esquiva)* ou Força + Briga *(Contra-ataque)*', damage: '**Margem de Sucessos + 0** *(Superficial)*' },
      { action: 'Arma Branca (1 mão)', attack: 'Destreza + Armas Brancas', defense: 'Destreza + Esportes *(Esquiva)* ou Armas Brancas *(Contra-ataque)*', damage: '**Margem de Sucessos + Mod. da Arma**' },
      { action: 'Arma Branca (2 mãos)', attack: 'Força + Armas Brancas', defense: 'Destreza + Esportes *(Esquiva)* ou Armas Brancas *(Contra-ataque)*', damage: '**Margem de Sucessos + Mod. da Arma**' },
      { action: 'Arma de Fogo', attack: 'Destreza + Armas de Fogo', defense: 'Destreza + Esportes *(Para buscar abrigo)*', damage: '**Margem de Sucessos + Mod. da Arma**' },
      { action: 'Agarrar / Imobilizar', attack: 'Força + Briga', defense: 'Destreza + Esportes ou Força + Briga', damage: '**Nenhum no 1º turno** *(Prende o alvo se vencer)*. Nos turnos seguintes, testes disputados permitem causar dano da margem ou morder.' },
    ],
    cover: [
      { type: 'Sem Cobertura', modifier: '**Penalidade de -2 dados** na rolagem de defesa.' },
      { type: 'Apenas Encoberto (Arbusto, árvore pequena)', modifier: '**Penalidade de -1 dado** na rolagem de defesa.' },
      { type: 'Cobertura Forte (Atrás de um carro, mureta)', modifier: '**Bônus de +1 ou +2 dados** na rolagem de defesa.' },
      { type: 'Trincheira', modifier: '**Bônus de +3 dados** na rolagem de defesa.' },
      { type: 'Fresta de Disparo (Inacessível)', modifier: '**Bônus de +4 dados** na rolagem de defesa.' },
    ]
  },
  humanity: {
    id: 'humanity',
    title: 'Humanidade e Manchas',
    rules: [
      { label: 'Humanidade (0 a 10):', description: 'Mede o quanto de alma humana ainda resta no vampiro. Quanto mais alta, mais fácil é se passar por humano. Quanto mais baixa, mais o personagem se torna um monstro frio e predatório.' },
      { label: 'Como surgem as Manchas:', description: 'Ocorrem quando o vampiro viola os **Princípios da Crônica** ou quando um de seus **Pilares (Touchstones)** mortais é ferido, corrompido ou morto.' },
      { label: 'Mitigação por Convicções:', description: 'Se o vampiro violar um Princípio da Crônica, mas o fizer para defender uma de suas **Convicções** pessoais, o ganho de Manchas é reduzido ou anulado (a critério do Narrador).' },
    ],
    levels: [
      { range: '8 - 10', meaning: 'Altamente Humana', effect: 'Aparência perfeitamente humana (pele quente, pulso). Pode comer comida mortal (e sentir o gosto) e manter relações íntimas naturalmente. O Torpor dura apenas de 1 a 3 noites.' },
      { range: '5 - 7', meaning: 'Controle Instável', effect: 'É a média dos Membros. Precisa ativar o *Rubor da Vida* (Rouse Check) para parecer humano. Relações íntimas exigem esforço/testes e os mortais sentem um leve desconforto instintivo perto do vampiro. O Torpor dura semanas ou meses.' },
      { range: '3 - 4', meaning: 'Distanciamento Perceptível', effect: 'O vampiro entra no "vale da estranheza". Em testes sociais com mortais (exceto Intimidação), a parada de dados máxima do jogador **fica limitada ao seu valor de Humanidade**. O Torpor dura décadas.' },
      { range: '1 - 2', meaning: 'Monstruosidade Dominante', effect: 'O personagem age puramente por instinto predatório, mal consegue falar frases complexas e repudia interações humanas. O olhar é completamente morto. O Torpor dura séculos.' },
      { range: '0', meaning: 'Perda Final para a Besta', effect: 'O personagem perde toda a consciência e se torna um **Wight** (um espécime puramente animalesco controlado pela Besta). O personagem é permanentemente retirado do jogador e vira um NPC do Narrador.' },
    ],
    frenzy: [
      { label: 'Risco de Frenesi:', description: 'Uma Humanidade baixa não reduz diretamente a sua parada de dados para resistir ao Frenesi, mas torna os gatilhos disparados pela Besta muito mais fáceis de acontecer e mais difíceis de controlar narrativamente.' },
      { label: 'Trilha de Humanidade:', description: 'As Manchas preenchem a trilha de Humanidade da direita para a esquerda. Se a trilha ficar totalmente cheia (sem caixas vazias para rolar o Remorso no final da sessão), o vampiro entra em estado de **Crise de Consciência**, sofrendo dano agravado em sua Força de Vontade.' },
    ]
  },
  compulsions: {
    id: 'compulsions',
    title: 'Compulsoes por Cla',
    rules: [
      { label: 'Regra Geral de Compulsões (V5)', description: 'Uma Compulsão (seja Geral ou de Clã) é ativada por uma **Falha Bestial** ou por eventos narrativos. Enquanto estiver sob o efeito de uma Compulsão, o personagem sofre uma **penalidade de -2 dados** em todas as paradas de dados que não colaborem diretamente para resolver ou satisfazer a sua Compulsão. A Compulsão termina apenas quando for cumprida ou ao fim da cena.' },
    ],
    rows: [
      { clan: 'Brujah', compulsion: 'Rebelde', effect: 'O vampiro deve se opor ativamente a quem estiver no comando ou à autoridade mais próxima na cena.' },
      { clan: 'Gangrel', compulsion: 'Feral', effect: 'A Besta domina a mente. O vampiro adota maneirismos animais e não consegue falar frases complexas (limite de poucas palavras por frase).' },
      { clan: 'Malkaviano', compulsion: 'Delírio', effect: 'O vampiro sofre com vozes ou alucinações. Ele recebe a penalidade de -2 dados em qualquer teste que não seja para interagir com o seu delírio.' },
      { clan: 'Nosferatu', compulsion: 'Criptofilia', effect: 'Obsessão por segredos. O vampiro precisa descobrir uma informação oculta, segredo ou fofoca de alguém na cena antes de fazer outra coisa.' },
      { clan: 'Toreador', compulsion: 'Obsessão', effect: 'O vampiro fica hipnotizado pela beleza ou arte próxima (ou por uma pessoa). Ele não consegue desviar a atenção do objeto de sua obsessão.' },
      { clan: 'Tremere', compulsion: 'Perfeccionismo', effect: 'Qualquer falha ou sucesso comum frustra o vampiro. Ele exige refazer a sua última ação até alcançar um resultado perfeito (Acerto Crítico).' },
      { clan: 'Ventrue', compulsion: 'Arrogância', effect: 'O vampiro precisa afirmar a sua superioridade. Ele deve ordenar que alguém faça algo e essa pessoa precisa obedecer voluntariamente ou por coação.' },
      { clan: 'Lasombra', compulsion: 'Crueldade', effect: 'O vampiro se recusa a falhar. Para atingir o seu objetivo atual, ele deve usar de força excessiva, frieza ou punir severamente quem falhar com ele.' },
      { clan: 'Banu Haqim', compulsion: 'Julgamento', effect: 'O vampiro é impelido a agir como juiz e carrasco. Ele precisa punir fisicamente ou socialmente alguém que tenha quebrado uma lei ou código moral.' },
      { clan: 'Ministério', compulsion: 'Subversão', effect: 'O vampiro precisa corromper. Ele deve fazer com que alguém quebre um de seus próprios Princípios da Crônica, tabus ou Convicções.' },
      { clan: 'Hecata', compulsion: 'Morbidez', effect: 'O vampiro é atraído pela morte. Ele precisa gastar o seu tempo estudando cadáveres, prevendo a morte de alguém ou interagindo com fantasmas.' },
      { clan: 'Ravnos', compulsion: 'Desafiar o Destino', effect: 'O vampiro rejeita a segurança. Sempre que precisar tomar uma decisão ou realizar uma ação, ele é obrigado a escolher a opção mais arriscada e perigosa.' },
      { clan: 'Tzimisce', compulsion: 'Cobiça', effect: 'O vampiro desenvolve uma fixação obsessiva por um objeto, pessoa ou território que não possui (leia-se: cobiça algo de outro) ou cuja posse sente que está ameaçada.' },
      { clan: 'Salubri', compulsion: 'Aflição', effect: 'O vampiro sente a dor do mundo e é dominado pela necessidade de ajudar alguém. Ele deve aliviar o sofrimento (físico ou mental) de outro personagem próximo ou assumir um problema/fardo de outra pessoa como se fosse seu.' },
    ],
  },
  bloodResonance: {
    id: 'bloodResonance',
    title: 'Ressonancias Sanguineas',
    rules: [
      { label: 'O que e Ressonancia:', description: 'O sangue mortal carrega o gosto das emocoes fortes, chamadas de Humores. Cacar presas com humores especificos confere bonus mecanicos e frequentemente e necessario para aprender ou aumentar o nivel de uma Disciplina.' },
      { label: 'Sangue Ensacadado / Velho:', description: 'Nao possui ressonancia ou bonus, oferecendo apenas nutricao esteril (e apagando ressonancias anteriores).' },
    ],
    temperaments: [
      { label: 'Fugaz (Fleeting):', description: 'Uma emocao momentanea ou fraca. Substitui ressonancias anteriores, mas **nao concede bonus de dados** (geralmente conta apenas como requisito narrativo para aprender a Disciplina).' },
      { label: 'Intensa (Intense):', description: 'Uma emocao forte e verdadeira. Concede **+1 dado** em rolagens que utilizem as Disciplinas associadas aquele Humor. Dura ate a proxima alimentacao ou ate a Fome atingir 5.' },
      { label: 'Aguda (Acute):', description: 'Uma emocao obsessiva e dominadora. Concede **+1 dado**, alem da possibilidade de formar uma **Discrasia** se a vitima for bebida ate quase a morte (ou morta). Requisito para niveis altos de Disciplinas.' },
    ],
    resonances: [
      { humor: 'Colerica', emotion: 'Raiva, agressao, violencia, inveja.', disciplines: 'Potencia, Rapidez' },
      { humor: 'Melancolica', emotion: 'Tristeza, medo, depressao, luto.', disciplines: 'Fortitude, Ofuscacao' },
      { humor: 'Flematica', emotion: 'Calma, apatia, preguica, relaxamento.', disciplines: 'Auspicios, Dominacao' },
      { humor: 'Sanguinea', emotion: 'Alegria, amor, tesao, paixao.', disciplines: 'Feiticaria de Sangue, Presenca' },
      { humor: 'Sangue Animal', emotion: 'Feral, bestial, panico animal.', disciplines: 'Animalismo, Metamorfose' },
    ]
  },
}

export const quickReferenceSections = Object.values(quickReference)
