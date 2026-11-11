import type { Character } from "./Character"
import { clans } from "./Clans"
import type { ClanName } from "./NameSchemas"

export type VariantClanBane = {
    name: string
    text: string
}

export const variantClanBanes: Record<ClanName, VariantClanBane | null> = {
    Brujah: {
        name: "Violência",
        text: "Violência: Em um crítico bagunçado em qualquer teste de Perícia, cause dano físico ou mental ao alvo igual à BANE_SEVERITY, além de qualquer resultado dos dados de Fome. O dano é Agravado, a menos que você gaste 1 ponto de Força de Vontade para torná-lo Superficial."
    },
    Gangrel: {
        name: "Instintos de Sobrevivência",
        text: "Instintos de Sobrevivência: Subtraia BANE_SEVERITY dados de qualquer rolagem para resistir ao Frenesi de medo. Isso não pode reduzir a parada abaixo de um dado."
    },
    Nosferatu: {
        name: "Infestação",
        text: "Infestação: Seu Refúgio está infestado de pragas, causando uma penalidade de 2 + BANE_SEVERITY em atividades baseadas em concentração e testes sociais, a critério do Narrador. Depois de passar uma cena em um local fechado, uma infestação semelhante aparece com penalidade de BANE_SEVERITY. Tentativas de controlar as pragas com Animalismo sofrem penalidade de BANE_SEVERITY."
    },
    Malkavian: {
        name: "Manifestações Antinaturais",
        text: "Manifestações Antinaturais: Quando você usa um poder de Disciplina, mortais próximos ficam inquietos por uma cena. Interações sociais com eles, exceto intimidação, sofrem penalidade de BANE_SEVERITY. Outros vampiros reconhecem você como morto-vivo, mas não sofrem penalidade de interação."
    },
    Tremere: {
        name: "Sangue Roubado",
        text: "Sangue Roubado: Quando você realiza um Surto de Sangue, faça Checagens de Sangue iguais à BANE_SEVERITY. Se essas Checagens de Sangue elevarem sua Fome a 5 ou mais, você pode cancelar o Surto de Sangue ou realizá-lo e então atingir Fome 5 imediatamente."
    },
    Ventrue: {
        name: "Hierarquia",
        text: "Hierarquia: Sofra penalidade de BANE_SEVERITY em paradas de dados de Disciplina ao usar poderes em um vampiro de geração mais baixa. Você também deve gastar Força de Vontade igual à BANE_SEVERITY para atacar diretamente um vampiro de geração mais baixa."
    },
    Toreador: {
        name: "Empatia Agonizante",
        text: "Empatia Agonizante: Quando a alimentação causa dano a um mortal, você sofre dano semelhante, geralmente Agravado, em retorno. Uma única alimentação não pode causar a você mais dano que BANE_SEVERITY."
    },
    Lasombra: {
        name: "Insensibilidade",
        text: "Insensibilidade: Ao fazer um Teste de Remorso, remova BANE_SEVERITY dados. Isso não pode reduzir a parada abaixo de um dado."
    },
    "Banu Haqim": {
        name: "Sangue Nocivo",
        text: "Sangue Nocivo: Mortais que bebem seu Sangue sofrem Dano Agravado igual à BANE_SEVERITY para cada quantidade de Sangue equivalente a uma Checagem de Sangue ingerida. Sua vitae não pode curar ferimentos mortais, mas quantidades menores que as necessárias para um Laço de Sangue não são tóxicas de outro modo."
    },
    Ministry: {
        name: "Sangue-Frio",
        text: "Sangue-Frio: Você só pode usar Rubor de Vida se tiver se alimentado recentemente de um recipiente vivo na mesma cena ou aproximadamente na última hora. Quando fizer isso, ele exige Checagens de Sangue iguais à BANE_SEVERITY em vez de uma."
    },
    Ravnos: {
        name: "Nome de Desnascimento",
        text: "Nome de Desnascimento: Qualquer um que diga seu nome de desnascimento na sua frente ganha bônus de BANE_SEVERITY para resistir aos seus poderes de Disciplina, e você sofre penalidade de BANE_SEVERITY para resistir a poderes sobrenaturais usados por esse oponente."
    },
    Tzimisce: {
        name: "Cortesia Amaldiçoada",
        text: "Cortesia Amaldiçoada: Para entrar sem convite em uma residência ou refúgio, gaste Força de Vontade igual à BANE_SEVERITY e sofra a mesma penalidade nas paradas de Disciplina enquanto estiver dentro. O convite deve vir de alguém que vive ou não-vive ali."
    },
    Hecata: {
        name: "Decadência",
        text: "Decadência: Sofra pontos adicionais de Defeitos iguais à BANE_SEVERITY, divididos entre Defeitos de Lacaio, Refúgio e Recursos. Eles podem ser comprados pelo dobro do custo de pontos de Antecedente, e compras posteriores dessas Vantagens custam experiência adicional igual à BANE_SEVERITY."
    },
    Salubri: {
        name: "Ascetismo",
        text: "Ascetismo: Quando sua Fome está abaixo de três, sofra penalidade de BANE_SEVERITY nas paradas de dados de Disciplina. O terceiro olho permanece parte desta Perdição."
    },
    Caitiff: null,
    "Thin-blood": null,
    Baali: null,
    "Blood Brothers": null,
    "Daughters of Cacophony": null,
    Gargoyles: null,
    Kiasyd: null,
    "True Brujah": null,
    Ahrimanes: null,
    "Children of Osiris": null,
    Lhiannan: null,
    Maeghar: null,
    "": null
}

export const formatBaneText = (text: string, baneSeverity: number) =>
    text.replace(/BANE_SEVERITY/g, `${baneSeverity} (Gravidade da Perdição)`)

export const getClanBaneText = (character: Character, baneSeverity: number) => {
    const clan = clans[character.clan] || clans[""]
    const variantBane = variantClanBanes[character.clan]
    const baneText = character.clanBane === "variant" && variantBane ? variantBane.text : clan.bane

    return baneText ? formatBaneText(baneText, baneSeverity) : ""
}

export const hasVariantClanBane = (clan: ClanName) => variantClanBanes[clan] !== null
