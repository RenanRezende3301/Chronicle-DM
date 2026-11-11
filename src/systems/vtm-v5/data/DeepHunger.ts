// Fome Expandida — Sangue Imemorial, Capítulo II.
//
// O Sangue antigo suporta uma trilha maior antes que um Teste de Despertar
// falho provoque frenesi imediato. Os pontos acima de 5 não criam novos Dados
// de Fome: representam profundidade da necessidade e só pesam nos testes de
// frenesi de fome e na quantidade de sangue necessária para voltar a níveis
// seguros.

/** Fome máxima: 5, ou a Potência de Sangue, o que for maior. */
export const getMaxHunger = (bloodPotency: number): number => Math.max(5, bloodPotency)

/**
 * Modificador de Dificuldade aplicado somente a testes de frenesi de fome.
 * Não afeta frenesi de fúria ou terror, nem o resultado dos Dados de Fome.
 */
export const getDeepHungerModifier = (hunger: number): number => {
    if (hunger >= 10) return 3
    if (hunger >= 8) return 2
    if (hunger >= 6) return 1
    return 0
}

export const getDeepHungerLabel = (hunger: number): string | null => {
    if (hunger >= 10) return "Limite de um Sangue de Potência 10"
    if (hunger >= 8) return "Fome Profunda severa"
    if (hunger >= 6) return "Fome Profunda"
    return null
}

/**
 * Nunca mais de cinco Dados de Fome numa parada. Com Fome 6+, cinco dados da
 * parada são Dados de Fome e os demais continuam dados comuns.
 */
export const getHungerDice = (hunger: number, poolSize: number): number =>
    Math.min(hunger, 5, poolSize)
