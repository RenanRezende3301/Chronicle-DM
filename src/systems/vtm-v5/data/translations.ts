import { skillNames, SkillsKey } from "./Skills";
import { attributeNames, AttributesKey } from "./Attributes";

/** Maps English discipline keys to official V5 pt-BR names */
export const disciplineTranslations: Record<string, string> = {
  animalism: "Animalismo",
  auspex: "Auspícios",
  celerity: "Rapidez",
  dominate: "Dominação",
  fortitude: "Fortitude",
  obfuscate: "Ofuscação",
  potence: "Potência",
  presence: "Presença",
  protean: "Proteanismo",
  "blood sorcery": "Feitiçaria de Sangue",
  oblivion: "Oblívio",
  "thin-blood alchemy": "Alquimia Sangue-Ralo",
  alchemy: "Alquimia Sangue-Ralo",
};

/**
 * Translates an English discipline name to pt-BR.
 * Falls back to capitalizing the first letter if no translation is found.
 */
export const translateDiscipline = (name: string): string =>
  disciplineTranslations[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);

/**
 * Translates an English skill key (e.g. "athletics") to the official V5 pt-BR name.
 */
export const translateSkill = (key: string): string =>
  skillNames[key as SkillsKey] || key.charAt(0).toUpperCase() + key.slice(1);

/**
 * Translates an English attribute key (e.g. "strength") to the official V5 pt-BR name.
 */
export const translateAttribute = (key: string): string =>
  attributeNames[key as AttributesKey] || key.charAt(0).toUpperCase() + key.slice(1);

/** Maps English merit/flaw names to official V5 pt-BR names */
export const meritFlawTranslations: Record<string, string> = {
  // --- Backgrounds / Vantagens de Background ---
  Allies: "Aliados",
  Contacts: "Contatos",
  Contact: "Contato",
  Fame: "Fama",
  Haven: "Refúgio",
  Herd: "Rebanho",
  Influence: "Influência",
  Mentor: "Mentor",
  Resources: "Recursos",
  Retainers: "Lacaios",
  Retainer: "Lacaio",
  Status: "Status",
  "Blood Resonance": "Ressonância do Sangue",
  "Hand of the Heresy": "Mão da Heresia",
  // --- Merits ---
  Beautiful: "Belo(a)",
  Stunning: "Deslumbrante",
  Bloodhound: "Cão Farejador",
  "Criminal Contacts": "Contatos Criminais",
  "Iron Gullet": "Estômago de Ferro",
  Diablerist: "Diabolista",
  // --- Flaws ---
  "Dark Secret": "Segredo Sombrio",
  Disliked: "Impopular",
  Enemy: "Inimigo",
  Enemies: "Inimigos",
  "Folkloric Bane": "Perdição Folclórica",
  "Folkloric Block": "Bloqueio Folclórico",
  "Masquerade Breacher": "Violador da Máscara",
  "Obvious Predator": "Predador Óbvio",
  "Prey Exclusion": "Exclusão de Presa",
  "Prey Exclusion (another scene)": "Exclusão de Presa (outra cena)",
  Shunned: "Rejeitado",
  "Stake Bait": "Isca de Estaca",
  Stigmata: "Estigmas",
  Farmer: "Fazendeiro",
  Creepy: "Sinistro",
  Haunted: "Assombrado",
  "No Haven": "Sem Refúgio",
  Ugly: "Feio(a)",
  Repulsive: "Repulsivo(a)",
  Destitute: "Miserável",
};

/**
 * Translates an English merit/flaw name to pt-BR.
 * Falls back to the original name if no translation is found.
 */
export const translateMeritFlaw = (name: string): string => meritFlawTranslations[name] || name;
