// GERADO por scripts/extractSangueImemorial.mjs — não editar à mão.
// Fonte: Sangue Imemorial, Capítulo V (Legados do Sangue).
import type { Power } from "../Disciplines"

export const transcendentAmalgams: Power[] = [
    {
        "name": "Catedral de Carne",
        "description": "Legado: Vicissitude\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Dificuldade 4; seres conscientes usam Vigor + Autocontrole\nDuração: Uma noite",
        "summary": "Reúna matéria orgânica suficiente numa construção ou câmara e faça o teste. Em sucesso, o ambiente torna-se tecido obediente: portas fecham, corredores mudam, paredes agarram e superfícies desenvolvem sentidos. Uma vez por turno, o local pode realizar uma ação usando Inteligência + Proteanismo. Cada alvo faz sua própria defesa. O ambiente possui Vitalidade igual ao dobro do Proteanismo do usuário.",
        "dicePool": "Inteligência + Proteanismo",
        "level": 6,
        "discipline": "protean",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "dominate",
                "level": 3
            }
        ]
    },
    {
        "name": "Carne da Linhagem",
        "description": "Legado: Vicissitude\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Vigor + Autocontrole de alvo involuntário\nDuração: Permanente em voluntário; uma cena em involuntário",
        "summary": "Toque o próprio corpo ou o de outro vampiro. Em alvo voluntário, mova até três pontos entre Força, Destreza e Vigor, respeitando o limite geracional, e crie uma adaptação física menor ou altere a aparência. Em alvo involuntário, faça a disputa; em vitória, aplique apenas uma alteração simples, como fundir uma mão, fechar os olhos ou deformar uma articulação, durante uma cena.",
        "dicePool": "Inteligência + Proteanismo",
        "level": 8,
        "discipline": "protean",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "dominate",
                "level": 4
            }
        ]
    },
    {
        "name": "Voz do Azhi Dahaka",
        "description": "Legado: Vicissitude\nCusto: 3 Testes de Despertar\nOposição / Dificuldade: Vigor + Potência de Sangue de cada alvo\nDuração: Três turnos",
        "summary": "Escolha uma alteração corporal simples — joelhos cedem, olhos fecham, mãos se fundem ou bocas se calam — e faça uma rolagem. Cada criatura viva num raio de 20 metros faz sua defesa separadamente. Quem perder sofre a alteração durante a duração. Uma alteração que impediria respirar, circular sangue ou manter a integridade do corpo causa, em vez disso, dano Agravado igual à margem individual, máximo 5.",
        "dicePool": "Carisma + Proteanismo",
        "level": 9,
        "discipline": "protean",
        "rouseChecks": 3,
        "amalgamPrerequisites": [
            {
                "discipline": "dominate",
                "level": 5
            }
        ]
    },
    {
        "name": "Contágio de Delírio",
        "description": "Legado: Demência\nCusto: 1 Teste de Despertar\nOposição / Dificuldade: Perseverança + Inteligência\nDuração: Uma cena",
        "summary": "Implante no primeiro alvo uma interpretação delirante concreta, como “as saídas estão seladas” ou “todos usam o rosto do meu senhor”. Em vitória, o alvo percebe a ilusão como verdade. Quando ele descreve ou reage ao delírio diante de outra pessoa, essa pessoa resiste contra uma quantidade de sucessos igual à margem anterior menos 1. O contágio continua usando a nova margem.",
        "dicePool": "Manipulação + Dominação",
        "level": 6,
        "discipline": "dominate",
        "rouseChecks": 1,
        "amalgamPrerequisites": [
            {
                "discipline": "obfuscate",
                "level": 3
            }
        ]
    },
    {
        "name": "Rede de Loucura",
        "description": "Legado: Demência\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Inteligência de cada alvo\nDuração: Uma cena",
        "summary": "Escolha até cinco alvos que o usuário possa perceber e faça uma rolagem. Cada alvo se defende separadamente. Os derrotados formam uma rede mental. No início de cada turno, o usuário pode transferir uma Compulsão, emoção intensa ou até 2 pontos de dano Superficial de Força de Vontade de um membro para outro. A transferência não exige nova rolagem.",
        "dicePool": "Manipulação + Dominação",
        "level": 8,
        "discipline": "dominate",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "auspex",
                "level": 4
            }
        ]
    },
    {
        "name": "Mundo Quimérico",
        "description": "Legado: Quimerismo\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Raciocínio + Percepção de cada alvo\nDuração: Uma cena",
        "summary": "Crie uma realidade ilusória multissensorial do tamanho de uma casa, rua ou veículo e faça uma rolagem. Cada alvo se defende separadamente. Para quem perder, a ilusão reage de maneira coerente a falas, movimento e dano: portas parecem abrir, pessoas ilusórias respondem e ameaças perseguem. Uma ameaça ilusória pode causar dano Superficial de Força de Vontade igual à margem individual, uma vez por turno.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 6,
        "discipline": "obfuscate",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "presence",
                "level": 3
            }
        ]
    },
    {
        "name": "Labirinto de Maya",
        "description": "Legado: Quimerismo\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Inteligência de cada alvo\nDuração: Uma cena",
        "summary": "Escolha até dez alvos numa área de 30 metros e faça uma rolagem. Cada alvo se defende separadamente. Quem perder percebe uma geografia ilusória compartilhada e não consegue sair da área física. No fim de cada turno, o alvo pode iniciar ou continuar um teste estendido difícil de Raciocínio + Percepção. A Dificuldade de cada tentativa é igual à margem obtida pelo usuário contra aquele alvo, com mínimo 2; somente a margem de cada tentativa bem-sucedida é acrescentada ao progresso. Ao acumular 6 pontos de margem, o alvo escapa do labirinto.",
        "dicePool": "Manipulação + Ofuscação",
        "level": 8,
        "discipline": "obfuscate",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "presence",
                "level": 5
            }
        ]
    },
    {
        "name": "Forma de Set",
        "description": "Legado: Serpentis\nCusto: 1 Teste de Despertar\nDuração: Uma cena",
        "summary": "Assuma uma forma serpentina humanoide ou colossal. Receba +2 dados em agarrões, sentidos térmicos, movimento sem membros e presas com dano +2. Um alvo ferido pelas presas testa Autocontrole + Vigor contra Dificuldade 4; em falha, sofre 2 pontos de dano Superficial de Força de Vontade e fica incapaz de atacar o usuário no próximo turno.",
        "dicePool": "",
        "level": 6,
        "discipline": "protean",
        "rouseChecks": 1,
        "amalgamPrerequisites": [
            {
                "discipline": "presence",
                "level": 3
            }
        ]
    },
    {
        "name": "Sopro de Apep",
        "description": "Legado: Serpentis\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Vigor + Ocultismo de cada alvo\nDuração: Três turnos",
        "summary": "Exale uma nuvem de escuridão venenosa num cone de 20 metros e faça uma rolagem. Cada alvo se defende separadamente. Quem perder sofre 1 ponto de dano Agravado e fica cego enquanto permanecer na nuvem. Mortais também ficam sufocados e perdem a ação principal no primeiro turno. O usuário enxerga e respira normalmente dentro dela.",
        "dicePool": "Vigor + Proteanismo",
        "level": 8,
        "discipline": "protean",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "presence",
                "level": 4
            }
        ]
    },
    {
        "name": "Silêncio Absoluto",
        "description": "Legado: Quietus\nCusto: 1 Teste de Despertar\nOposição / Dificuldade: Dificuldade 3; proteção sonora sobrenatural usa sua potência\nDuração: Uma cena",
        "summary": "Escolha uma esfera de até 15 metros e faça o teste. Em sucesso, nenhum som, vibração transmitida pelo ar ou comunicação eletrônica baseada em áudio entra, sai ou circula dentro dela. O usuário pode excluir até três pessoas, que ouvem umas às outras normalmente. Leitura labial e comunicação mental continuam possíveis.",
        "dicePool": "Inteligência + Ofuscação",
        "level": 6,
        "discipline": "obfuscate",
        "rouseChecks": 1,
        "amalgamPrerequisites": [
            {
                "discipline": "blood sorcery",
                "level": 4
            }
        ]
    },
    {
        "name": "Sangue da Morte",
        "description": "Legado: Quietus\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Vigor + Ocultismo do alvo\nDuração: Até o amanhecer",
        "summary": "A vitae do usuário torna-se veneno sobrenatural. Quando alguém a ingere ou é ferido por uma arma banhada nela, faça a disputa. Em vitória, o alvo sofre dano Agravado igual à metade da margem dessa disputa, arredondada para cima, com mínimo 1, e perde acesso ao Surto de Sangue por uma cena.",
        "dicePool": "Perseverança + Feitiçaria de Sangue",
        "level": 7,
        "discipline": "blood sorcery",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "obfuscate",
                "level": 4
            }
        ]
    },
    {
        "name": "Instante Repetido",
        "description": "Técnica avançada\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Dificuldade 5\nDuração: Até três turnos refeitos; uma vez por história",
        "summary": "Depois de uma sequência de no máximo três turnos, faça o teste. Em sucesso, o usuário retorna mentalmente ao início da sequência. A posição inicial e as declarações dos demais se repetem, mas o usuário conserva as lembranças e pode escolher outras ações. Todas as rolagens são feitas novamente; o segundo resultado é definitivo.",
        "dicePool": "Raciocínio + Celeridade",
        "level": 7,
        "discipline": "celerity",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "auspex",
                "level": 4
            }
        ]
    },
    {
        "name": "Roubar o Segundo",
        "description": "Técnica avançada\nCusto: 3 Testes de Despertar\nOposição / Dificuldade: Raciocínio + Celeridade ou Auspícios\nDuração: Até o fim do próximo turno",
        "summary": "Quando um alvo declara uma ação, faça a disputa. Em vitória, a ação é retirada do fluxo imediato e só acontece no fim do próximo turno, caso ainda seja possível. O usuário e todos os demais agem antes dela. Custos já pagos permanecem pagos, mas efeitos só começam quando a ação finalmente ocorre.",
        "dicePool": "Raciocínio + Celeridade",
        "level": 9,
        "discipline": "celerity",
        "rouseChecks": 3,
        "amalgamPrerequisites": [
            {
                "discipline": "auspex",
                "level": 5
            }
        ]
    },
    {
        "name": "Mãos do Curador",
        "description": "Legado: Valeren\nCusto: 1 Teste de Despertar\nOposição / Dificuldade: Dificuldade 3; Dificuldade 5 para dano solar ou fogo\nDuração: Instantânea",
        "summary": "Toque outro personagem e faça o teste. Em sucesso, converta até um número de pontos de dano Agravado igual à margem, máximo 3, em dano Superficial. O curador sofre 1 ponto de dano Superficial de Força de Vontade por ponto convertido.",
        "dicePool": "Inteligência + Fortitude",
        "level": 6,
        "discipline": "fortitude",
        "rouseChecks": 1,
        "amalgamPrerequisites": [
            {
                "discipline": "auspex",
                "level": 4
            }
        ]
    },
    {
        "name": "Julgamento da Alma",
        "description": "Legado: Valeren\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Autocontrole + Perseverança\nDuração: Instantânea; efeito por uma cena",
        "summary": "Encare o alvo e faça a disputa. Em vitória, o usuário identifica a culpa que o alvo considera mais grave. Em seguida escolhe: impor dano Superficial de Força de Vontade igual à margem individual +2; ou oferecer absolvição, suspendendo uma Compulsão e removendo 2 pontos de dano Superficial de Força de Vontade.",
        "dicePool": "Perseverança + Auspícios",
        "level": 8,
        "discipline": "fortitude",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "auspex",
                "level": 5
            }
        ]
    },
    {
        "name": "Canção da Sereia",
        "description": "Técnica avançada\nCusto: 1 Teste de Despertar\nOposição / Dificuldade: Autocontrole + Inteligência de cada ouvinte\nDuração: Enquanto a performance continuar, máximo uma cena",
        "summary": "Escolha uma emoção e uma ação coletiva simples compatível com ela, como dançar, seguir, confessar, permanecer em silêncio ou retirar-se. Faça uma rolagem; cada ouvinte se defende separadamente. Quem perder realiza a ação enquanto ouvir a performance e não enfrentar perigo evidente.",
        "dicePool": "Carisma + Performance",
        "level": 6,
        "discipline": "presence",
        "rouseChecks": 1,
        "amalgamPrerequisites": [
            {
                "discipline": "auspex",
                "level": 3
            }
        ]
    },
    {
        "name": "Voz que Parte Pedra",
        "description": "Técnica avançada\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Vigor + Atletismo de cada criatura\nDuração: Instantânea",
        "summary": "Pronuncie uma palavra ou grito num cone de 20 metros e faça uma rolagem. Objetos e estruturas sofrem dano estrutural igual aos sucessos +3. Cada criatura faz sua defesa separadamente; quem perder é lançado até alcance curto, fica surdo por uma cena e sofre dano Superficial igual à margem individual +2.",
        "dicePool": "Carisma + Potência",
        "level": 8,
        "discipline": "presence",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "potence",
                "level": 4
            }
        ]
    },
    {
        "name": "Juramento de Sangue",
        "description": "Técnica avançada\nCusto: 1 Teste de Despertar por signatário\nOposição / Dificuldade: Dificuldade 4; todos precisam ser voluntários\nDuração: Até o contrato ser cumprido ou rompido",
        "summary": "Escreva ou pronuncie um contrato, faça cada parte prová-lo com vitae e realize o teste. Em sucesso, todos os signatários reconhecem imediatamente qualquer violação literal. O infrator sofre 3 pontos de dano Agravado de Força de Vontade e não pode ocultar dos demais qual cláusula rompeu.",
        "dicePool": "Inteligência + Feitiçaria de Sangue",
        "level": 6,
        "discipline": "blood sorcery",
        "rouseChecks": 1,
        "amalgamPrerequisites": [
            {
                "discipline": "dominate",
                "level": 3
            }
        ]
    },
    {
        "name": "Passagem pelo Espelho",
        "description": "Técnica avançada\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Dificuldade 4; proteções no destino usam sua potência\nDuração: Instantânea",
        "summary": "Toque uma superfície refletora, visualize outra que o usuário conheça dentro da mesma cidade e faça o teste. Em sucesso, ele entra no reflexo e emerge pela superfície de destino. Pode levar uma pessoa voluntária em contato. Uma proteção sobrenatural no destino transforma o teste numa disputa.",
        "dicePool": "Raciocínio + Ofuscação",
        "level": 7,
        "discipline": "obfuscate",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "auspex",
                "level": 4
            }
        ]
    },
    {
        "name": "Nome Verdadeiro",
        "description": "Técnica avançada\nCusto: 2 Testes de Despertar\nOposição / Dificuldade: Perseverança + Autocontrole\nDuração: Até o próximo amanhecer ou até o uso",
        "summary": "Estude o alvo por uma cena e faça a disputa. Em vitória, descubra uma palavra simbólica que define sua identidade atual. Pronunciá-la antes de uma ação social ou sobrenatural contra ele concede +3 dados e impede que Ofuscação esconda sua presença nessa ação. Depois do uso, o nome perde força até nova ativação.",
        "dicePool": "Inteligência + Auspícios",
        "level": 9,
        "discipline": "auspex",
        "rouseChecks": 2,
        "amalgamPrerequisites": [
            {
                "discipline": "obfuscate",
                "level": 5
            }
        ]
    }
]
