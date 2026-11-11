export const attributes = {
  physical: [
    { key: 'strength', name: 'Forca' },
    { key: 'dexterity', name: 'Destreza' },
    { key: 'stamina', name: 'Vigor' },
  ],
  social: [
    { key: 'charisma', name: 'Carisma' },
    { key: 'manipulation', name: 'Manipulacao' },
    { key: 'composure', name: 'Compostura' },
  ],
  mental: [
    { key: 'intelligence', name: 'Inteligencia' },
    { key: 'wits', name: 'Raciocinio' },
    { key: 'resolve', name: 'Determinacao' },
  ],
}

export const skills = {
  physical: [
    { key: 'athletics', name: 'Atletismo' },
    { key: 'brawl', name: 'Briga' },
    { key: 'craft', name: 'Oficio' },
    { key: 'drive', name: 'Pilotagem' },
    { key: 'firearms', name: 'Armas de Fogo' },
    { key: 'melee', name: 'Melee' },
    { key: 'larceny', name: 'Gatunagem' },
    { key: 'stealth', name: 'Furtividade' },
    { key: 'survival', name: 'Sobrevivencia' },
  ],
  social: [
    { key: 'animalKen', name: 'Adestramento Animal' },
    { key: 'etiquette', name: 'Etiqueta' },
    { key: 'insight', name: 'Perspicacia' },
    { key: 'intimidation', name: 'Intimidacao' },
    { key: 'leadership', name: 'Lideranca' },
    { key: 'performance', name: 'Performance' },
    { key: 'persuasion', name: 'Persuasao' },
    { key: 'streetwise', name: 'Astucia de Rua' },
    { key: 'subterfuge', name: 'Subterfugio' },
  ],
  mental: [
    { key: 'academics', name: 'Academicos' },
    { key: 'awareness', name: 'Percepcao' },
    { key: 'finance', name: 'Financas' },
    { key: 'investigation', name: 'Investigacao' },
    { key: 'medicine', name: 'Medicina' },
    { key: 'occult', name: 'Ocultismo' },
    { key: 'politics', name: 'Politica' },
    { key: 'science', name: 'Ciencia' },
    { key: 'technology', name: 'Tecnologia' },
  ],
}

export const attributeDefaults = Object.values(attributes)
  .flat()
  .reduce((accumulator, attribute) => {
    accumulator[attribute.key] = 1
    return accumulator
  }, {})

export const skillDefaults = Object.values(skills)
  .flat()
  .reduce((accumulator, skill) => {
    accumulator[skill.key] = 0
    return accumulator
  }, {})
