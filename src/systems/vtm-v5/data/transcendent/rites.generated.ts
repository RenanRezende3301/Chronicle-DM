// GERADO por scripts/extractSangueImemorial.mjs — não editar à mão.
// Fonte: Sangue Imemorial, Capítulo VI (Ritos do Impossível).
import type { Ritual } from "../Disciplines"
import type { Ceremony } from "../Ceremonies"

export const transcendentRituals: Ritual[] = [
    {
        "name": "Cálice da Noite Profunda",
        "summary": "em sucesso, o cálice conserva cinco porções de vitae por um ano. Cada porção sacia 1 de Fome, não cria Laço de Sangue e concede, por uma cena, o bônus de Surto do doador de maior Potência. O bebedor recebe apenas um desses benefícios por noite.",
        "rouseChecks": 0,
        "requiredTime": "três horas gravando os nomes dos doadores e aquecendo a mistura sem chama.",
        "dicePool": "Inteligência + Feitiçaria de Sangue, Dificuldade 5.",
        "ingredients": "cálice metálico enterrado por cem anos, sangue do conjurador e vitae de três gerações diferentes.",
        "level": 6
    },
    {
        "name": "Mapa das Veias da Cidade",
        "summary": "por uma noite, o mapa marca deslocamentos significativos de vitae, locais de alimentação intensa, domínios saturados e rupturas sobrenaturais. Uma consulta revela um ponto ou trajeto. Para localizar um indivíduo, é necessária uma amostra de seu sangue; compare os sucessos do ritual com Perseverança + Ocultismo do alvo.",
        "rouseChecks": 0,
        "requiredTime": "uma hora lavando o mapa com o sangue e recitando os nomes antigos das ruas.",
        "dicePool": "Inteligência + Ocultismo, Dificuldade 5.",
        "ingredients": "mapa físico, sangue colhido em sete pontos da cidade e uma pedra de fundação.",
        "level": 7
    },
    {
        "name": "Prisão de Geração",
        "summary": "se o conjurador vencer, a Potência de Sangue do alvo é tratada como 1 por uma noite e poderes acima do nível 3 ficam indisponíveis. Se o alvo vencer, o ritual falha. Romper fisicamente o círculo encerra o efeito.",
        "rouseChecks": 0,
        "requiredTime": "o alvo permanece dentro do círculo durante uma hora, contido ou voluntário.",
        "dicePool": "disputa estendida de Inteligência + Feitiçaria de Sangue contra Perseverança + Potência de Sangue. A cada quinze minutos, ambos rolam; subtraia os sucessos do perdedor dos sucessos do vencedor e acrescente apenas essa margem ao total do vencedor. O primeiro lado a acumular 6 pontos de margem vence a disputa.",
        "ingredients": "correntes temperadas com vitae de geração igual ou menor à vítima e cinzas de um senhor destruído.",
        "level": 8
    },
    {
        "name": "Eclipse Carmesim",
        "summary": "durante a primeira hora após o nascer do sol, uma área de até um quarteirão fica coberta por penumbra vermelha. A luz solar dentro dela conta como intensidade baixa: causa 1 ponto de dano Agravado por turno a vampiros expostos. Testes de terror contra o sol continuam obrigatórios.",
        "rouseChecks": 0,
        "requiredTime": "seis horas, terminando imediatamente antes do amanhecer.",
        "dicePool": "Inteligência + Feitiçaria de Sangue, Dificuldade 6.",
        "ingredients": "sangue de cem mortais, um relógio solar e terra de um local onde muitos morreram ao meio-dia.",
        "level": 9
    },
    {
        "name": "Trono de Vitae",
        "summary": "o Trono torna-se Âncora da Morte Final e centro de um domínio de sangue. Dentro do domínio, o conjurador percebe quando sua linhagem usa vitae, transmite uma frase por noite a cada descendente presente e, ao anoitecer, reduz 1 de Fome. Quando a crônica usa Reserva Rubra, o conjurador pode restaurar uma caixa da Reserva em vez de reduzir a Fome. Destruir o Trono causa 5 pontos de dano Agravado de Força de Vontade e suspende um ponto de Potência de Sangue até o fim da história.",
        "rouseChecks": 0,
        "requiredTime": "Projeto de trinta noites.",
        "dicePool": "teste estendido padrão de Inteligência + Feitiçaria de Sangue, Dificuldade 20; uma rolagem por semana. Some todos os sucessos de cada rolagem até alcançar a Dificuldade. Uma falha comum não acrescenta progresso; uma falha total apaga os sucessos acumulados e exige reconstruir os componentes centrais antes de recomeçar.",
        "ingredients": "um trono, altar ou fundação construído com relíquias de todos os descendentes conhecidos e dez porções de vitae potente.",
        "level": 10
    }
]

export const transcendentCeremonies: Ceremony[] = [
    {
        "name": "Vigília dos Sem Nome",
        "summary": "por uma cena, todos os sinais de morte inquieta numa área de até um bairro tornam-se visíveis: trajetos de fantasmas, pontos de assassinato, objetos usados como grilhões e locais onde o Sudário está fino. Cada ponto de margem permite ao celebrante fazer uma pergunta factual sobre uma dessas marcas.",
        "rouseChecks": 0,
        "requiredTime": "uma procissão silenciosa de uma hora pelos limites da área.",
        "dicePool": "Perseverança + Oblívio, Dificuldade 5.",
        "ingredients": "máscaras funerárias sem inscrição, velas feitas com gordura humana e terra do local investigado.",
        "level": 6,
        "prerequisitePowers": []
    },
    {
        "name": "Tribunal dos Mortos",
        "summary": "os mortos manifestam-se durante uma cena para responder sobre um acontecimento que todos testemunharam ou investigaram em vida. Eles não são obrigados a concordar, mas não conseguem mentir deliberadamente dentro do tribunal. Podem recusar perguntas que não estejam relacionadas ao caso convocado.",
        "rouseChecks": 0,
        "requiredTime": "os objetos são dispostos como assentos e cada nome é pronunciado diante da balança.",
        "dicePool": "Carisma + Oblívio, Dificuldade 5; um fantasma nomeado pode resistir com Perseverança + Autocontrole.",
        "ingredients": "objetos ligados a até sete mortos, uma balança e sangue de uma testemunha viva.",
        "level": 7,
        "prerequisitePowers": []
    },
    {
        "name": "Cidade Invertida",
        "summary": "por uma noite, cria uma réplica espectral de um bairro, acessível por até três superfícies escuras marcadas. Ruas e edifícios refletem memórias e mortes e permitem rotas que não existem no mundo físico. Para encontrar uma saída não preparada, um viajante realiza um teste estendido padrão de Raciocínio + Ocultismo, Dificuldade 5, com uma rolagem por cena. Cada sucesso obtido é acrescentado ao total; ao alcançar 5 sucessos, ele encontra uma saída.",
        "rouseChecks": 0,
        "requiredTime": "vigília da meia-noite até uma hora antes do amanhecer.",
        "dicePool": "Inteligência + Oblívio, Dificuldade 6.",
        "ingredients": "planta urbana desenhada em fuligem, moedas funerárias e terra de cada limite do domínio.",
        "level": 8,
        "prerequisitePowers": []
    },
    {
        "name": "Banquete dos Nomes Mortos",
        "summary": "fantasmas convidados manifestam-se com clareza durante uma cena e podem compartilhar uma memória, segredo ou perícia. Cada participante vivo escolhe uma Habilidade demonstrada por um dos mortos e recebe +3 dados nela até o fim da cena. O mesmo fantasma não concede o bônus a mais de uma pessoa.",
        "rouseChecks": 0,
        "requiredTime": "cada convidado pronuncia um nome verdadeiro e oferece uma lembrança.",
        "dicePool": "Carisma + Oblívio, Dificuldade 6.",
        "ingredients": "mesa posta para treze, obituários, sangue e alimentos apreciados pelos mortos em vida.",
        "level": 9,
        "prerequisitePowers": []
    },
    {
        "name": "Funeral de um Deus",
        "summary": "em sucesso, a entidade perde a capacidade sobrenatural de reconstruir-se, reencarnar ou retornar por suas Âncoras. A partir desse momento, pode sofrer Morte Final pelas formas que normalmente destruiriam seu corpo ou essência.",
        "rouseChecks": 0,
        "requiredTime": "três noites de cerimônia, encerradas com a destruição pública do símbolo central.",
        "dicePool": "teste estendido padrão de Perseverança + Oblívio, Dificuldade 25; uma rolagem ao fim de cada noite de cerimônia. Some todos os sucessos obtidos até alcançar a Dificuldade. Uma falha comum não acrescenta progresso; uma falha total apaga os sucessos acumulados e obriga a cerimônia a recomeçar, desde que a Âncora verdadeira continue sob controle do celebrante.",
        "ingredients": "a Âncora da Morte Final da entidade, um local de culto destruído e o testemunho de alguém que a venerou.",
        "level": 10,
        "prerequisitePowers": []
    }
]
