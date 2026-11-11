import type { AttributesKey } from "../data/Attributes";
import type { SkillsKey } from "../data/Skills";
import type { Character } from "../data/Character";
import { disciplines } from "../data/Disciplines";
import type { Power } from "../data/Disciplines";

type ApplicablePower = {
  power: Power;
  disciplineRating: number;
};

const powerMatchingRules: Array<{
  powerName: string;
  discipline: string;
  matches: (attribute: AttributesKey | null, skill: SkillsKey | null) => boolean;
  requiresPrerequisite?: string;
}> = [
  {
    powerName: "Sentidos Aguçados",
    discipline: "auspex",
    matches: (attribute, skill) => {
      return skill === "awareness";
    },
  },
  {
    powerName: "Rapidez",
    discipline: "celerity",
    matches: (attribute, skill) => {
      return attribute === "dexterity";
    },
  },
  {
    powerName: "Zigue-zague",
    discipline: "celerity",
    matches: (attribute, skill) => {
      return attribute === "dexterity" && skill === "athletics";
    },
  },
  {
    powerName: "Proeza",
    discipline: "potence",
    matches: (attribute, skill) => {
      return attribute === "strength";
    },
  },
  {
    powerName: "Demolidor",
    discipline: "potence",
    matches: (attribute, skill) => {
      return attribute === "strength";
    },
    requiresPrerequisite: "Proeza",
  },
  {
    powerName: "Centelha da Fúria",
    discipline: "potence",
    matches: (attribute, skill) => {
      return attribute === "manipulation" || attribute === "charisma";
    },
  },
  {
    powerName: "Fascínio",
    discipline: "presence",
    matches: (attribute, skill) => {
      return (
        attribute === "charisma" ||
        attribute === "manipulation" ||
        skill === "persuasion" ||
        skill === "performance"
      );
    },
  },
  {
    powerName: "Amedrontar",
    discipline: "presence",
    matches: (attribute, skill) => {
      return attribute === "charisma" || attribute === "manipulation" || skill === "intimidation";
    },
  },
  {
    powerName: "Mente Inabalável",
    discipline: "fortitude",
    matches: (attribute, skill) => {
      return attribute === "resolve" || attribute === "composure";
    },
  },
];

export const getApplicableDisciplinePowers = (
  character: Character | undefined,
  attribute: AttributesKey | null,
  skill: SkillsKey | null,
): ApplicablePower[] => {
  if (!character) return [];

  const applicablePowers: ApplicablePower[] = [];

  for (const rule of powerMatchingRules) {
    if (!rule.matches(attribute, skill)) continue;

    const discipline = disciplines[rule.discipline as keyof typeof disciplines];
    if (!discipline) continue;

    const power = discipline.powers.find((p) => p.name === rule.powerName);
    if (!power) continue;

    const characterHasPower = character.disciplines.some(
      (p) => p.discipline === rule.discipline && p.name === rule.powerName,
    );
    if (!characterHasPower) continue;

    if (rule.requiresPrerequisite) {
      const hasPrerequisite = character.disciplines.some(
        (p) => p.discipline === rule.discipline && p.name === rule.requiresPrerequisite,
      );
      if (!hasPrerequisite) continue;
    }

    const disciplinePowers = character.disciplines.filter((p) => p.discipline === rule.discipline);
    const disciplineRating = disciplinePowers.length;

    applicablePowers.push({
      power,
      disciplineRating,
    });
  }

  return applicablePowers;
};
