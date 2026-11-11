import { meritFlawTranslations } from "./translations";

const catalogNameAliases = new Map<string, string>([
  ["Contact", "Contacts"],
  ["Enemies", "Enemy"],
  ["Prey Exclusion (another scene)", "Prey Exclusion"],
  ["Retainers", "Retainer"],
  ["Contato", "Contatos"],
  ["Inimigos", "Inimigo"],
  ["Exclusão de Presa (outra cena)", "Exclusão de Presa"],
  ["Lacaios", "Lacaio"],
]);

const translatedName = (name: string): string => meritFlawTranslations[name] ?? name;

export const getCanonicalMeritFlawName = (name: string): string => {
  const translated = translatedName(name);
  return catalogNameAliases.get(translated) ?? translated;
};

export const getEquivalentMeritFlawNames = (name: string): string[] => {
  const canonicalName = getCanonicalMeritFlawName(name);
  const names = new Set<string>([name, translatedName(name), canonicalName]);

  for (const [englishName, portugueseName] of Object.entries(meritFlawTranslations)) {
    if (getCanonicalMeritFlawName(portugueseName) === canonicalName) {
      names.add(englishName);
      names.add(portugueseName);
    }
  }

  for (const [alias, target] of catalogNameAliases) {
    if (getCanonicalMeritFlawName(target) === canonicalName) {
      names.add(alias);
      names.add(target);
    }
  }

  return [...names];
};
