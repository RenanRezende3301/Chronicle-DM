import type { MeritsAndFlaws } from "./MeritsAndFlaws"

export const advancedMeritsAndFlaws: MeritsAndFlaws[] = [
    {
        title: "Refúgio",
        complexity: "advanced",
        merits: [
            {
                name: "Estabelecimento Comercial",
                cost: [2, 3],
                summary: "seu refúgio contém um negócio lucrativo com acesso local útil",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Furcus",
                cost: [1, 2, 3],
                summary: "cruzamento místico no seu refúgio auxilia rituais ou cerimônias realizados ali",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Laboratório",
                cost: [1, 2, 3],
                summary: "laboratório equipado no refúgio para trabalhos de Ciência, Tecnologia ou alquimia",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Biblioteca",
                cost: [1, 2, 3],
                summary: "acervo de pesquisa ligado a uma especialidade acadêmica por ponto",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Localização",
                cost: [1],
                summary: "localização privilegiada do refúgio que ajuda em caça, política ou segurança nas proximidades",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Oficina Mecânica",
                cost: [1, 2, 3],
                summary: "ferramentas e maquinário para construir, consertar ou desmontar equipamentos",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Porta Secreta",
                cost: [1, 2, 3],
                summary: "saída oculta ou rota de fuga do seu refúgio",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Sistema de Segurança",
                cost: [1, 2, 3],
                summary: "alarmes e defesas melhores contra invasões",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Sala Cirúrgica",
                cost: [1],
                summary: "sala médica que ajuda testes de Medicina no seu refúgio",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Proteção Mística",
                cost: [1, 2, 3],
                summary: "proteção mística contra vidência ou intrusão sobrenatural",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Móvel",
                cost: [1, 2, 3],
                summary: "seu refúgio é um veículo, de uma pequena condução à prova de sol a um grande transporte",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Blindado",
                cost: [1],
                summary: "refúgio móvel reforçado resiste a dano e protege melhor os passageiros",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Esconderijo de Contrabandista",
                cost: [1, 2],
                summary: "compartimento oculto em um refúgio móvel para carga ou sono diurno",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Placas Sobressalentes",
                cost: [2],
                summary: "troque rapidamente identificadores do refúgio móvel para escapar da maioria das buscas comuns",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Solo Sagrado",
                cost: [1],
                summary: "local de refúgio significativo para um culto pode convocar defensores uma vez por história",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Santuário",
                cost: [1, 2, 3],
                summary: "santuário no refúgio ajuda a reunir ou preparar ingredientes de rituais e cerimônias",
                excludes: ["Sem Refúgio"]
            }
        ],
        flaws: [
            {
                name: "Compartilhado",
                cost: [1, 2],
                summary: "outro Membro tem acesso ou autoridade sobre seu refúgio",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Nos Trilhos",
                cost: [1],
                summary:
                    "refúgio móvel segue rotas ou destinos fixos fora do seu controle total",
                excludes: ["Sem Refúgio"]
            },
            {
                name: "Temperamental",
                cost: [1],
                summary: "refúgio móvel quebra no pior momento após falhas em testes de Condução",
                excludes: ["Sem Refúgio"]
            }
        ]
    },
    {
        title: "Aparência",
        complexity: "advanced",
        merits: [
            {
                name: "Rosto Famoso",
                cost: [1],
                summary: "parece uma celebridade; ajuda socialmente, mas torna você memorável",
                excludes: []
            },
            {
                name: "Ingênuo",
                cost: [1],
                summary: "parece inocente, adicionando dados para desviar culpa ou suspeita",
                excludes: []
            },
            {
                name: "Traço Marcante",
                cost: [1],
                summary: "traço marcante ajuda primeiras impressões, mas atrapalha disfarces",
                excludes: []
            },
            {
                name: "Semblante do Matusalém",
                cost: [1, 2],
                summary:
                    "assemelha-se a um ancestral antigo, ajudando com quem o respeita ou teme",
                excludes: []
            },
            {
                name: "Jovem da Cena",
                cost: [1],
                summary: "encarna o estilo de uma subcultura, ajudando rolagens sociais com quem entende dela",
                excludes: []
            },
            {
                name: "Acordado a Noite Toda",
                cost: [2, 4],
                summary:
                    "trate Humanidade como mais alta para Rubor de Vida, comer, beber e intimidade mortal",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Fedor",
                cost: [1],
                summary: "odor fétido prejudica sedução e esconder-se de quem consegue sentir cheiro",
                excludes: []
            },
            {
                name: "Transparente",
                cost: [1],
                summary: "mente mal; perde dados em Subterfúgio e não pode melhorá-lo",
                excludes: []
            }
        ]
    },
    {
        title: "Alimentação",
        complexity: "advanced",
        merits: [
            {
                name: "Reconhecimento de Recipiente",
                cost: [1],
                summary: "sinta pelo cheiro se um mortal foi usado recentemente como alimento",
                excludes: []
            },
            {
                name: "Drive-thru",
                cost: [1],
                summary: "uma vez por sessão, aumente a Dificuldade da caçada para concluir a alimentação em minutos",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Vegano",
                cost: [2],
                summary: "alimente-se apenas de animais; sangue humano custa Força de Vontade",
                excludes: ["Fazendeiro"]
            },
            {
                name: "Puncionador de Veias",
                cost: [1],
                summary: "não pode se alimentar de mortais enquanto está sendo observado",
                excludes: []
            },
            {
                name: "Sensibilidade à Ressonância",
                cost: [1],
                summary:
                    "uma ressonância intensa aciona uma Compulsão personalizada persistente após a alimentação",
                excludes: []
            },
            {
                name: "Mímico de Ressonância",
                cost: [2],
                summary: "memórias e personalidades das vítimas invadem você após a alimentação",
                excludes: []
            },
            {
                name: "Alimentador Descuidado",
                cost: [2],
                summary:
                    "sua alimentação deixa um padrão reconhecível útil para autoridades ou caçadores",
                excludes: []
            }
        ]
    },
    {
        title: "Mítico",
        complexity: "advanced",
        merits: [
            {
                name: "Sorte do Diabo",
                cost: [4],
                summary: "uma vez por sessão, transfira um infortúnio para alguém próximo",
                excludes: []
            },
            {
                name: "Modo Nuit",
                cost: [2],
                summary: "com baixa Potência de Sangue, mantenha modificações corporais escolhidas após o repouso",
                excludes: []
            },
            {
                name: "Sanguessuga de Linha Ley",
                cost: [1],
                summary:
                    "após uma viagem significativa, desperte na noite seguinte sem Checagem de Sangue ao se erguer",
                excludes: []
            },
            {
                name: "Rubor Persistente",
                cost: [3],
                summary: "uma ativação de Rubor de Vida dura uma semana",
                excludes: []
            },
            {
                name: "Fome Fria e Morta",
                cost: [3],
                summary: "adicione dados para resistir a frenesi de Fome",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Decadência Faminta",
                cost: [2],
                summary: "com Fome 3+, a decomposição prejudica testes físicos e testes Sociais com mortais",
                excludes: []
            },
            {
                name: "Duas Vezes Amaldiçoado",
                cost: [2],
                summary: "sofra a Maldição variante do seu clã além da Maldição normal",
                excludes: []
            },
            {
                name: "Preso à Terra",
                cost: [1],
                summary: "viagens aéreas ou marítimas provocam frenesi de terror em sua Besta",
                excludes: []
            },
            {
                name: "Rubor Resistente",
                cost: [1],
                summary: "role duas vezes e fique com o pior resultado ao usar Rubor de Vida",
                excludes: []
            },
            {
                name: "Carne de Cadáver",
                cost: [2],
                summary: "seu corpo não se beneficia de Rubor de Vida",
                excludes: []
            },
            {
                name: "Vetor de Doença",
                cost: [1],
                summary: "recipientes doentes sempre infectam você e sua próxima vítima de alimentação",
                excludes: []
            },
            {
                name: "Portador da Praga",
                cost: [1, 2],
                summary: "uma doença persistente vive na sua vitae e se espalha pela sua mordida",
                excludes: []
            },
            {
                name: "Disciplina Enraizada",
                cost: [0],
                summary:
                    "assuma uma desvantagem específica de Disciplina para desbloquear poderes extras compráveis nessa Disciplina",
                excludes: []
            }
        ]
    },
    {
        title: "Recursos",
        complexity: "advanced",
        merits: [
            {
                name: "Trabalho Paralelo",
                cost: [2],
                summary: "uma vez por sessão, obtenha de sua rede um item pequeno, uma pista ou acesso",
                excludes: []
            }
        ],
        flaws: []
    },
    {
        title: "Fama",
        complexity: "advanced",
        merits: [
            {
                name: "Influenciador",
                cost: [1],
                summary: "use temporariamente Fama como uma Influência mais restrita uma vez por história",
                excludes: []
            },
            {
                name: "Fama Duradoura",
                cost: [1],
                summary: "Fama perdida retorna no início da próxima história",
                excludes: []
            },
            {
                name: "Streamer",
                cost: [2],
                summary: "uma vez por história, mobilize seguidores online para uma ação simples e não violenta",
                excludes: []
            }
        ],
        flaws: []
    },
    {
        title: "Culto",
        complexity: "advanced",
        merits: [
            {
                name: "Textos Apócrifos",
                cost: [1],
                summary: "possui escritos controversos que ajudam rolagens relacionadas de Inteligência",
                excludes: []
            },
            {
                name: "Artista Inspirado",
                cost: [2],
                summary: "arte temática do culto torna espectadores mais suscetíveis à pressão social do culto",
                excludes: []
            },
            {
                name: "Pregador Viajante",
                cost: [2],
                summary: "rotas seguras mapeadas reduzem a atenção de caçadores durante viagens",
                excludes: []
            },
            {
                name: "Jardineiro",
                cost: [1, 2, 3, 4, 5],
                summary: "lidere um jardim Bahari que atua como Rebanho e Influência seletivos",
                excludes: []
            },
            {
                name: "Canção da Mãe Sombria",
                cost: [2],
                summary:
                    "ganhe dados ao recrutar outros para a adoração de Lilith por meio de luto ou dor",
                excludes: []
            },
            {
                name: "Resistente ao Fogo",
                cost: [1],
                summary: "converta um pouco de dano agravado por fogo durante o sono diurno com mais eficiência",
                excludes: []
            },
            {
                name: "Facilitador",
                cost: [2],
                summary: "uma vez por história, acione vantagem sobre alguém para quem você obteve segredos",
                excludes: []
            },
            {
                name: "Ir para o Subterrâneo",
                cost: [1],
                summary: "adicione dados para fugir de perseguição usando rotas de escape e bolsas de fuga preparadas",
                excludes: []
            },
            {
                name: "Vigilante",
                cost: [2],
                summary:
                    "sempre saiba quando está sendo observado, a menos que ocultação sobrenatural esconda isso",
                excludes: []
            },
            {
                name: "Gematria",
                cost: [1],
                summary:
                    "entenda a cifra Shalimita bem o bastante para criptografar e descriptografar mensagens",
                excludes: []
            },
            {
                name: "Sussurros Insidiosos",
                cost: [2],
                summary: "obtenha críticos com mais facilidade ao minar a Convicção de um alvo",
                excludes: []
            },
            {
                name: "Negociador",
                cost: [1],
                summary: "reduza a Dificuldade ao avaliar um acordo ou transação",
                excludes: []
            },
            {
                name: "Matador de Touros",
                cost: [3],
                summary:
                    "role dados normais novamente durante testes estendidos enquanto se adapta a um alvo escolhido",
                excludes: []
            },
            {
                name: "Graça do Arcanjo",
                cost: [3],
                summary: "troque Performance e Atletismo em arte atlética, lutas ou dança",
                excludes: []
            },
            {
                name: "Místico do Vazio",
                cost: [1, 2],
                summary: "conte poderes selecionados de Oblívio como conhecidos para pré-requisitos de cerimônia",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Excomungado",
                cost: [1, 2],
                summary: "seu antigo culto rejeita você ou trabalha ativamente para sua ruína",
                excludes: []
            },
            {
                name: "Sem Fé",
                cost: [2],
                summary:
                    "você finge crença e sofre ao agir pelo culto ou avançar dentro dele",
                excludes: []
            },
            {
                name: "Cisma",
                cost: [1],
                summary: "sua linhagem ou história faz seu culto suspeitar de sua lealdade",
                excludes: []
            },
            {
                name: "Alarmes Falsos",
                cost: [1],
                summary: "falhas em rolagens de Percepção viram falhas totais sob paranoia constante",
                excludes: []
            },
            {
                name: "Vazio",
                cost: [1],
                summary: "seu vazio inquieta forasteiros e penaliza rolagens sociais",
                excludes: []
            },
            {
                name: "Iniciado Fracassado",
                cost: [1],
                summary: "um vigia do culto examina e interrompe você após um passo falho",
                excludes: []
            },
            {
                name: "Anseio",
                cost: [1],
                summary: "agir contra os objetivos de um mestre perdido custa Força de Vontade",
                excludes: []
            }
        ]
    },
    {
        title: "Laços",
        complexity: "advanced",
        merits: [
            {
                name: "Resistência ao Laço",
                cost: [1, 2, 3],
                summary: "adicione dados para resistir a laços de sangue",
                excludes: ["Escravo de Laço"]
            },
            {
                name: "Laço Curto",
                cost: [2],
                summary: "laços de sangue sobre você desaparecem mais rápido que o normal",
                excludes: ["Laço Longo"]
            },
            {
                name: "Inlaçável",
                cost: [5],
                summary: "você não pode sofrer laço de sangue",
                excludes: ["Escravo de Laço", "Viciado em Laço", "Laço Longo"]
            }
        ],
        flaws: []
    },
    {
        title: "Influência",
        complexity: "advanced",
        merits: [
            {
                name: "Influência",
                cost: [1, 2, 3, 4, 5],
                summary: "influência sobre um grupo mortal, instituição ou região da cidade",
                excludes: ["Impopular", "Desprezado"]
            },
            {
                name: "Segredos da Cidade",
                cost: [1],
                summary: "guarde um segredo local perigoso que pode proteger você ou servir como vantagem",
                excludes: []
            },
            {
                name: "Intocável",
                cost: [5],
                summary: "uma vez por história, evite punição oficial por uma ofensa grave",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Impopular",
                cost: [1],
                summary: "perca um dado socialmente com a maioria dos grupos locais",
                excludes: ["Influência", "Desprezado"]
            },
            {
                name: "Desprezado",
                cost: [2],
                summary: "um grupo ou região local trabalha ativamente contra você",
                excludes: ["Influência", "Impopular"]
            }
        ]
    },
    {
        title: "Favores e Dívidas",
        complexity: "advanced",
        merits: [
            {
                name: "Favor Menor",
                cost: [1, 2, 3],
                summary: "favor registrado devido por outro vampiro, escalado pelo status dele",
                excludes: []
            },
            {
                name: "Favor Maior",
                cost: [2, 3, 4],
                summary: "favor sério devido por outro vampiro, escalado pelo status dele",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Dívida Menor",
                cost: [1, 2],
                summary: "você deve um favor menor a outro vampiro",
                excludes: []
            },
            {
                name: "Dívida Maior",
                cost: [1, 2, 3],
                summary: "você deve um favor perigoso a outro vampiro",
                excludes: []
            },
            {
                name: "Dívida de Vida",
                cost: [2, 3],
                summary: "você deve uma dívida esmagadora a outro vampiro",
                excludes: []
            }
        ]
    },
    {
        title: "Mental",
        complexity: "advanced",
        merits: [
            {
                name: "Vontade Temperada",
                cost: [3],
                summary: "perceba Dominação ou Presença e resista melhor a elas uma vez por sessão",
                excludes: []
            },
            {
                name: "Penitência",
                cost: [1, 2, 3, 4, 5],
                summary: "autoflagelação converte dano superficial de Vitalidade em cura de Força de Vontade",
                excludes: ["Verme Rastejante"]
            },
            {
                name: "Vontade Profana",
                cost: [2, 4],
                summary: "resista melhor a efeitos de Fé Verdadeira e reduza dano sagrado",
                excludes: []
            },
            {
                name: "Fanatismo",
                cost: [1, 2, 3],
                summary: "transforme sucessos normais alinhados à Convicção em críticos bestiais",
                excludes: []
            },
            {
                name: "Besta Acalmada",
                cost: [1],
                summary:
                    "ignore um crítico bestial ou falha bestial perto de uma obsessão escolhida de personagem do Narrador",
                excludes: []
            },
            {
                name: "Amor Falso",
                cost: [1],
                summary:
                    "trate Humanidade como mais alta para mimetismo mortal enquanto perto de uma obsessão escolhida de personagem do Narrador",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Vontade Fraca",
                cost: [2],
                summary:
                    "tem dificuldade para resistir à influência de um líder e não pode resistir ativamente a influência mental",
                excludes: []
            },
            {
                name: "Cicatrizes Horríveis de Penitência",
                cost: [1],
                summary: "cicatrizes de fé tornam você socialmente repulsivo fora do seu culto",
                excludes: []
            },
            {
                name: "Verme Rastejante",
                cost: [2],
                summary: "deve flagelar a si mesmo a cada sessão ou sofrer dano agravado à Força de Vontade",
                excludes: ["Penitência"]
            },
            {
                name: "Farol de Profanação",
                cost: [1],
                summary: "mortais com mesmo uma centelha de Fé Verdadeira podem sentir sua presença profana",
                excludes: []
            },
            {
                name: "Crise de Fé",
                cost: [1],
                summary: "falhas bestiais também causam dano à sua Força de Vontade",
                excludes: []
            }
        ]
    },
    {
        title: "Outros",
        complexity: "advanced",
        merits: [
            {
                name: "Diablerie da Matilha",
                cost: [2],
                summary:
                    "reivindique o benefício principal ao compartilhar diablerie e ganhe um pequeno eco se ajudar",
                excludes: []
            }
        ],
        flaws: [
            {
                name: "Faminto por Conhecimento",
                cost: [1],
                summary: "deve resistir a perseguir o estudo de um assunto escolhido quando novas fontes aparecem",
                excludes: []
            },
            {
                name: "Dívidas de Prestação",
                cost: [1],
                summary: "deve dois favores menores a um Membro mais influente",
                excludes: []
            },
            {
                name: "Assume-Riscos",
                cost: [1],
                summary: "novas tentações arriscadas distraem você até serem satisfeitas ou a cena terminar",
                excludes: []
            },
            {
                name: "Pretendente Mortal",
                cost: [1],
                summary:
                    "executores da Máscara desconfiam da sua tentativa de viver demais como mortal",
                excludes: []
            },
            {
                name: "Dois Mestres",
                cost: [1],
                summary: "você pode estar sob Laço de Sangue com dois regentes ao mesmo tempo",
                excludes: []
            }
        ]
    }
]
