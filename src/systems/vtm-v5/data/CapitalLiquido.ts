import type { Character } from "./Character"

// Capital Líquido — sourcebook homebrew de mesmo nome.
//
// Recursos produz riqueza; Capital Líquido é a riqueza disponível para gastar.
// Recursos quase nunca diminui. CL entra, sai, é transferido, roubado ou perdido.
//
// Aqui implementamos apenas o contador: o valor inicial e a leitura da escala.
// Ciclo Financeiro, custos de compra e compra de Antecedentes com CL ficam na
// mesa — o projeto não rola dados.

/** CL inicial = Recursos. O Defeito Desprovido começa com 0. */
export const getInitialCapitalLiquido = (character: Character): number => {
    const isDestitute = character.flaws.some((flaw) => flaw.name === "Desprovido")
    if (isDestitute) return 0

    const resources = character.merits.find((merit) => merit.name === "Recursos")
    return Math.max(0, resources?.level ?? 0)
}

/** Nível de Recursos na ficha, para exibir ao lado do Capital Líquido. */
export const getResourcesLevel = (character: Character): number => {
    const resources = character.merits.find((merit) => merit.name === "Recursos")
    return Math.max(0, resources?.level ?? 0)
}

/**
 * Leitura da escala econômica de uma reserva. CL não tem teto: acumular 20 não
 * muda a classe econômica, só indica quantas despesas grandes cabem antes de
 * esgotar o caixa.
 */
export const getCapitalLiquidoReading = (capitalLiquido: number): string => {
    if (capitalLiquido <= 0) return "Sem reserva disponível"
    if (capitalLiquido === 1) return "Uma despesa importante de escala modesta"
    if (capitalLiquido === 2) return "Uma despesa de classe média ou duas menores"
    if (capitalLiquido === 3) return "Uma compra digna de um personagem rico"
    if (capitalLiquido === 4) return "Uma operação opulenta imediatamente acessível"
    if (capitalLiquido === 5) return "Uma despesa extraordinária de escala ultra-rica"
    return `Reserva acumulada: ${capitalLiquido} despesas de escala variada`
}
