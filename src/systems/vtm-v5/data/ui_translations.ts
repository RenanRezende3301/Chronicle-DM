import { disciplineTranslations, meritFlawTranslations } from "./translations"

const rulesTerms: Record<string, string> = {
    // Atributos
    "Strength": "Força",
    "Dexterity": "Destreza",
    "Stamina": "Vigor",
    "Charisma": "Carisma",
    "Manipulation": "Manipulação",
    "Composure": "Autocontrole",
    "Intelligence": "Inteligência",
    "Wits": "Raciocínio",
    "Resolve": "Determinação",
    // Perícias
    "Athletics": "Atletismo",
    "Brawl": "Briga",
    "Craft": "Ofícios",
    "Drive": "Condução",
    "Firearms": "Armas de Fogo",
    "Melee": "Armas Brancas",
    "Larceny": "Ladroagem",
    "Stealth": "Furtividade",
    "Survival": "Sobrevivência",
    "Animal Ken": "Empatia com Animais",
    "Etiquette": "Etiqueta",
    "Insight": "Sagacidade",
    "Intimidation": "Intimidação",
    "Leadership": "Liderança",
    "Performance": "Performance",
    "Persuasion": "Persuasão",
    "Streetwise": "Manha",
    "Subterfuge": "Subterfúgio",
    "Academics": "Erudição",
    "Awareness": "Percepção",
    "Finance": "Finanças",
    "Investigation": "Investigação",
    "Medicine": "Medicina",
    "Occult": "Ocultismo",
    "Politics": "Política",
    "Science": "Ciência",
    "Technology": "Tecnologia",
    // Regras e ficha
    "Health": "Vitalidade",
    "Willpower": "Força de Vontade",
    "Humanity": "Humanidade",
    "Hunger": "Fome",
    "Blood Potency": "Potência de Sangue",
    "Blood Surge": "Surto de Sangue",
    "Rouse Check": "Checagem de Sangue",
    "Rouse Checks": "Checagens de Sangue",
    "Touchstone": "Pilar",
    "Touchstones": "Pilares",
    "Conviction": "Convicção",
    "Convictions": "Convicções",
    "Sire": "Senhor",
    "Ambition": "Ambição",
    "Desire": "Desejo",
    "Generation": "Geração",
    "Concept": "Conceito",
    "Chronicle": "Crônica",
    "Clan": "Clã",
    "Bane": "Maldição",
    "Compulsion": "Compulsão",
    "Predator Type": "Tipo de Predador",
    "Predator": "Predador",
    "Advantages": "Vantagens",
    "Backgrounds": "Antecedentes",
    "Merit": "Vantagem",
    "Merits": "Vantagens",
    "Flaw": "Defeito",
    "Flaws": "Defeitos",
    "Loresheet": "Folha de Conhecimento",
    "Loresheets": "Folhas de Conhecimento",
    "Discipline": "Disciplina",
    "Disciplines": "Disciplinas",
    "Ritual": "Ritual",
    "Rituals": "Rituais",
    "Ceremony": "Cerimônia",
    "Ceremonies": "Cerimônias",
    "Power": "Poder",
    "Powers": "Poderes",
    "Dice Pool": "Parada de Dados",
    "Difficulty": "Dificuldade",
    "Storyteller": "Narrador",
    "Kindred": "Membro",
    "Kindreds": "Membros",
    "Vampire": "Vampiro",
    "Vampires": "Vampiros",
    "Mortal": "Mortal",
    "Mortals": "Mortais",
    "Masquerade": "Máscara",
    "Beast": "Besta",
    "Frenzy": "Frenesi",
    "Bestial Failure": "Falha Bestial",
    "Messy Critical": "Crítico Bestial",
    "Vitae": "Vitae",
    "Blood": "Sangue"
}

const powerNameTranslations: Record<string, string> = {
    "Bond Famulus": "Vínculo Familiar",
    "Sense the Beast": "Sentir a Besta",
    "Feral Whispers": "Sussurros Selvagens",
    "Atavism": "Atavismo",
    "Leash the Beast": "Coleira da Besta",
    "Animal Messenger": "Mensageiro Animal",
    "Animal Succulence": "Suculência Animal",
    "Scent of Prey": "Faro da Presa",
    "Messenger's Command": "Comando do Mensageiro",
    "Plague of Beasts": "Praga de Bestas",
    "Augury": "Augúrio",
    "Awaken the Parasite": "Despertar o Parasita",
    "Quell the Beast": "Acalmar a Besta",
    "Unliving Hive": "Colmeia Não-Viva",
    "Subsume the Spirit": "Subsumir o Espírito",
    "Sway the Flock": "Influenciar o Bando",
    "Animal Dominion": "Domínio Animal",
    "Drawing Out the Beast": "Extrair a Besta",
    "Coax the Bestial Temper": "Instigar o Temperamento Bestial",
    "Panacea": "Panaceia",
    "Reveal Temperament": "Revelar Temperamento",
    "Unerring Pursuit": "Perseguição Infalível",
    "Fatal Flaw": "Falha Fatal",
    "Scry the Soul": "Perscrutar a Alma",
    "Share the Senses": "Compartilhar os Sentidos",
    "Spirit's Touch": "Toque do Espírito",
    "Haruspex": "Harúspice",
    "Heart Laid Bare": "Coração Exposto",
    "Clairvoyance": "Clarividência",
    "Possession": "Possessão",
    "Unburdening the Bestial Soul": "Aliviar a Alma Bestial",
    "Telepathy": "Telepatia",
    "Cat's Grace": "Graça Felina",
    "Rapid Reflexes": "Reflexos Rápidos",
    "Fleetness": "Rapidez",
    "Rush Job": "Trabalho Relâmpago",
    "Blink": "Piscar",
    "Traversal": "Travessia",
    "Weaving": "Zigue-zague",
    "A Thousand Cuts": "Mil Cortes",
    "Blurred Momentum": "Impulso Borrado",
    "Draught of Elegance": "Elixir da Elegância",
    "Faster Than Light": "Mais Rápido que a Luz",
    "Unerring Aim": "Mira Infalível",
    "Unseen Strike": "Golpe Invisível",
    "Lightning Strike": "Golpe Relâmpago",
    "Split Second": "Fração de Segundo",
    "Domitor's Favor": "Favor do Domitor",
    "Slavish Devotion": "Devoção Servil",
    "Dementation": "Demência",
    "The Stolen Voice": "A Voz Roubada",
    "Forgetful Mind": "Mente Esquecida",
    "Implant Suggestion": "Implantar Sugestão",
    "Submerged Directive": "Diretiva Submersa",
    "Rationalize": "Racionalizar",
    "Ancestral Dominion": "Domínio Ancestral",
    "Tabula Rasa": "Tabula Rasa",
    "Mass Manipulation": "Manipulação em Massa",
    "Terminal Decree": "Decreto Terminal",
    "Resilience": "Resiliência",
    "Unswayable Mind": "Mente Inabalável",
    "Toughness": "Robustez",
    "Self-Assurance": "Autoconfiança",
    "Earth's Perseverance": "Perseverança da Terra",
    "Invigorating Vitae": "Vitae Revigorante",
    "Enduring Beasts": "Bestas Duradouras",
    "Obdurate": "Obstinado",
    "Defy Bane": "Desafiar Perdição",
    "Fortify the Inner Facade": "Fortificar a Fachada Interior",
    "Seal the Beast's Maw": "Selar a Goela da Besta",
    "Calloused Soul": "Alma Calejada",
    "Valeren": "Valeren",
    "Draught of Endurance": "Elixir da Resistência",
    "Gorgon's Scales": "Escamas da Górgona",
    "Shatter": "Despedaçar",
    "Flesh of Marble": "Carne de Mármore",
    "Prowess from Pain": "Proeza da Dor",
    "Meat Shields": "Escudos de Carne",
    "Cloak of Shadows": "Manto das Sombras",
    "Mask of Ages": "Máscara das Idades",
    "Silence of Death": "Silêncio da Morte",
    "Doubletalk": "Fala Dupla",
    "Unseen Passage": "Passagem Invisível",
    "Chimerstry": "Quimerismo",
    "Ghost's Passing": "Passagem Fantasma",
    "Ventriloquism": "Ventriloquismo",
    "Fata Morgana": "Fata Morgana",
    "Ghost in the Machine": "Fantasma na Máquina",
    "Mask of a Thousand Faces": "Máscara das Mil Faces",
    "Guise of the Departed": "Aparência dos Falecidos",
    "Mental Maze": "Labirinto Mental",
    "Mask of Isolation": "Máscara do Isolamento",
    "Mind Masque": "Máscara Mental",
    "Conceal": "Ocultar",
    "Seclusion": "Reclusão",
    "Vanish": "Desaparecer",
    "Cloak the Gathering": "Encobrir o Grupo",
    "Impostor's Guise": "Aparência do Impostor",
    "Lethal Body": "Corpo Letal",
    "Soaring Leap": "Salto Elevado",
    "Prowess": "Proeza",
    "Relentless Grasp": "Agarrão Implacável",
    "Brutal Feed": "Alimentação Brutal",
    "Uncanny Grip": "Aderência Sobrenatural",
    "Wrecker": "Demolidor",
    "Exuberance": "Exuberância",
    "Spark of Rage": "Centelha da Fúria",
    "Draught of Might": "Elixir do Poder",
    "Crash Down": "Queda Devastadora",
    "Earthshock": "Tremor de Terra",
    "Subtle Hammer": "Martelo Sutil",
    "Fist of Caine": "Punho de Caim",
    "Awe": "Fascínio",
    "Daunt": "Amedrontar",
    "Eyes of the Serpent": "Olhos da Serpente",
    "Lingering Kiss": "Beijo Persistente",
    "Melpominee": "Melpômene",
    "Dread Gaze": "Olhar Aterrador",
    "Entrancement": "Encantamento",
    "Invigorating Display": "Exibição Revigorante",
    "Passion Leech": "Sanguessuga de Paixão",
    "True Love's Face": "Face do Amor Verdadeiro",
    "Thrown Voice": "Voz Projetada",
    "Irresistible Voice": "Voz Irresistível",
    "Suffuse the Edifice": "Saturar o Edifício",
    "Inflame Desire": "Inflamar Desejo",
    "Wingman": "Ala",
    "Summon": "Convocação",
    "Majesty": "Majestade",
    "Star Magnetism": "Magnetismo Estelar",
    "Eyes of the Beast": "Olhos da Besta",
    "Squirm": "Contorcer-se",
    "Weight of the Feather": "Peso Pena",
    "Feral Weapons": "Armas Ferais",
    "Serpent's Kiss": "Beijo da Serpente",
    "The False Sip": "O Gole Falso",
    "Vicissitude": "Vicissitude",
    "Earth Meld": "Fusão com a Terra",
    "Shapechange": "Mudança de Forma",
    "Fleshcrafting": "Escultura da Carne",
    "Masque of Death": "Máscara da Morte",
    "Metamorphosis": "Metamorfose",
    "Horrid Form": "Forma Horrenda",
    "Mist Form": "Forma de Névoa",
    "One With the Land": "Um com a Terra",
    "The Heart of Darkness": "O Coração das Trevas",
    "The Unfettered Heart": "O Coração Desimpedido",
    "Face of the Victim": "Rosto da Vítima",
    "Swarm": "Enxame",
    "Corrosive Vitae": "Vitae Corrosiva",
    "A Taste for Blood": "Um Gosto por Sangue",
    "Shape of the Sanguine Sacrament": "Forma do Sacramento Sanguíneo",
    "Koldunic Sorcery": "Feitiçaria Koldúnica",
    "Extinguish Vitae": "Extinguir Vitae",
    "Scour Secrets": "Vasculhar Segredos",
    "Blood of Potency": "Sangue Potente",
    "Scorpion's Touch": "Toque do Escorpião",
    "Transitive Bond": "Laço Transitivo",
    "Ripples of the Heart": "Ondulações do Coração",
    "Theft of Vitae": "Roubo de Vitae",
    "Blood Aegis": "Égide de Sangue",
    "Fulminating Vitae": "Vitae Fulminante",
    "Marionette": "Marionete",
    "Baal's Caress": "Carícia de Baal",
    "Cauldron of Blood": "Caldeirão de Sangue",
    "Reclamation of Vitae": "Recuperação de Vitae",
    "Shadow Cloak": "Manto Sombrio",
    "Oblivion's Sight": "Visão do Oblívio",
    "Ashes to Ashes": "Cinzas às Cinzas",
    "The Binding Fetter": "Grilhão Vinculante",
    "Shadow Cast": "Conjurar Sombra",
    "Where the Shroud Thins": "Onde o Sudário Afina",
    "Arms of Ahriman": "Braços de Ahriman",
    "Fatal Prediction": "Previsão Fatal",
    "Aura of Decay": "Aura de Decomposição",
    "Shadow Perspective": "Perspectiva Sombria",
    "Shadow Servant": "Servo Sombrio",
    "Touch of Oblivion": "Toque do Oblívio",
    "Passion Feast": "Banquete de Paixão",
    "Necrotic Plague": "Praga Necrótica",
    "Stygian Shroud": "Sudário Estígio",
    "Profane the Sanctified": "Profanar o Santificado",
    "Skuld Fulfilled": "Skuld Cumprido",
    "Shadow Step": "Passo das Sombras",
    "Tenebrous Avatar": "Avatar Tenebroso",
    "Withering Spirit": "Espírito Definhante",
    "The Darkness Within": "A Escuridão Interior",
    "Far Reach": "Alcance Distante",
    "Haze": "Bruma",
    "Mercurian Tongue": "Língua Mercurial",
    "Plug-In": "Conectar",
    "Profane Hieros Gamos": "Hieros Gamos Profano",
    "Portable Shade": "Sombra Portátil",
    "Body Paint": "Pintura Corporal",
    "Checkout Time": "Hora do Check-out",
    "Elevate": "Elevar",
    "Food Stain": "Marca de Alimento",
    "Speak from the Heart": "Falar do Coração",
    "Envelop": "Envolver",
    "Friends List": "Lista de Amigos",
    "Advanced Torpor": "Torpor Avançado",
    "Blacklight Surprise": "Surpresa de Luz Negra",
    "Blue State": "Estado Azul",
    "Defractionate": "Defracionar",
    "Concoct Ashe": "Concoctar Ashe",
    "Mandagloire": "Mandagloire",
    "Rumor": "Rumor",
    "Tank": "Tanque",
    "Chemically-Induced Flashback": "Flashback Quimicamente Induzido",
    "On-Demand Sunburn": "Queimadura Solar Sob Demanda",
    "Bleed Out": "Sangrar Até o Fim",
    "Saraimu": "Saraimu",
    "Diamond Skin": "Pele de Diamante",
    "Fireskin": "Pele de Fogo",
    "Hospital Chains": "Correntes Hospitalares",
    "Martian Purity": "Pureza Marciana",
    "Mask Off": "Sem Máscara",
    "TLC": "Cuidado Carinhoso",
    "Troll the Pious": "Provocar os Piedosos",
    "Airborne Momentum": "Impulso Aéreo",
    "Short Circuit": "Curto-Circuito",
    "Toxic Personality": "Personalidade Tóxica",
    "Discipline Channeling": "Canalização de Disciplina",
    "Copycat": "Imitador",
    "Half-Living Conductor": "Condutor Meio-Vivo",
    "Red State": "Estado Vermelho",
    "Vitae MSG": "MSG de Vitae",
    "Flowering Amaranth": "Amaranto Florescente",
    "Moment of Clarity": "Momento de Clareza",
    "Awaken the Sleeper": "Despertar o Adormecido",
    "Saturn's Flux": "Fluxo de Saturno",
    "Da Bomb": "A Bomba"
}

const powerSummaryTranslations: Record<string, string> = {
    "bond an animal companion. It will listen to basic commands, but full communication is not possible (unless you have Feral Whispers)":
        "vincule-se a um companheiro animal. Ele obedece comandos básicos, mas comunicação completa só é possível com Sussurros Selvagens",
    "sense hostility and supernatural traits in people":
        "sinta hostilidade e traços sobrenaturais em pessoas",
    "communicate with animals. You can also call for animals and if they are nearby, they will come.":
        "comunique-se com animais. Você também pode chamar animais próximos, e eles virão até você",
    "make an animal enrage or flee": "faça um animal se enfurecer ou fugir",
    "spend vitae to soften a critical, bestial failure, or failed frenzy resistance die":
        "gaste vitae para suavizar um crítico, uma falha bestial ou um dado falho para resistir ao frenesi",
    "send your famulus to deliver a short spoken message in your voice":
        "envie seu famulus para entregar uma mensagem curta falada com sua voz",
    "Feed more effectively on animals. You can consume your famulus to temporarily gain their aspect":
        "alimente-se de animais com mais eficiência. Você pode consumir seu famulus para ganhar temporariamente o aspecto dele",
    "Detect Mortals who saw Masquerade breaches":
        "detecte mortais que testemunharam violações da Máscara",
    "send Compel or Mesmerize through a message delivered by your famulus":
        "envie Compelir ou Hipnotizar por meio de uma mensagem entregue por seu famulus",
    "mark a target so nearby animals harass them and make them easier to track":
        "marque um alvo para que animais próximos o perturbem e facilitem seu rastreamento",
    "force a swarm, flock, or school to form an answer to one question about its range":
        "force um enxame, bando ou cardume a formar uma resposta para uma pergunta sobre a área em que está",
    "make vermin erupt inside a nearby body, harming speech, focus, and mortal survival":
        "faça parasitas irromperem dentro de um corpo próximo, prejudicando fala, concentração e a sobrevivência de mortais",
    "Shut down a target's drives and desires, pull vampires out of frenzy":
        "suprima impulsos e desejos de um alvo, tirando vampiros do frenesi",
    "project your Beast at the moment of frenzy, transferring it into a nearby subject":
        "projete sua Besta no momento do frenesi, transferindo-a para um sujeito próximo",
    "shift the mood of animals across a large area toward calm or aggression":
        "altere o humor de animais em uma grande área para calma ou agressividade",
    "command flocks and packs of animals as extensions of your own body":
        "comande bandos e matilhas de animais como extensões do seu próprio corpo",
    "extend animal influence to swarms of insects, treating a swarm as a single creature":
        "estenda sua influência animal a enxames de insetos, tratando um enxame como uma única criatura",
    "transfer your mind into an animal's body, controlling it and using its senses":
        "transfira sua mente para o corpo de um animal, controlando-o e usando seus sentidos",
    "your senses become supernaturally sharp; add Auspex rating to perception rolls":
        "seus sentidos se tornam sobrenaturalmente aguçados; adicione o nível de Auspícios às rolagens de percepção",
    "sinta atividades sobrenaturais": "sinta atividades sobrenaturais",
    "ganhe visões do futuro": "ganhe visões do futuro",
    "acalmE o tormento psicológico de uma pessoa":
        "acalme o tormento psicológico de uma pessoa",
    "heal another person's Willpower damage and calm mortal distress":
        "cure dano à Força de Vontade de outra pessoa e acalme sofrimento mortal",
    "smell a target's resonance, dyscrasias, or a vampire's last victim":
        "fareje a ressonância, discrasias ou a última vítima de um vampiro",
    "create a bond with a target to spy on them":
        "crie um vínculo com um alvo para espioná-lo",
    "determine a target's weakness": "determine a fraqueza de um alvo",
    "see people's auras": "veja as auras das pessoas",
    "sense through another person (eg. see through their eyes)":
        "perceba pelos sentidos de outra pessoa, como enxergar por seus olhos",
    "sense emotional residue left by those who handled an object or visited a location":
        "sinta resíduos emocionais deixados por quem manuseou um objeto ou visitou um local",
    "read a fresh death to prepare for one later dice pool with a potent reroll":
        "leia uma morte recente para preparar uma rolagem futura com uma repetição poderosa",
    "learn a target's strongest hidden fear or desire through conversation":
        "descubra, em conversa, o medo ou desejo oculto mais forte de um alvo",
    "gather information from a city-block sized area through mystical connection":
        "reúna informações de uma área do tamanho de um quarteirão por conexão mística",
    "strip the will of a mortal and completely possess their body":
        "remova a vontade de um mortal e possua completamente seu corpo",
    "read minds and project thoughts into the minds of others":
        "leia mentes e projete pensamentos nas mentes de outros",
    "automatically pass balance tests": "passe automaticamente em testes de equilíbrio",
    "faster reactions & free minor actions":
        "reações mais rápidas e ações menores gratuitas",
    "add Celerity rating for defense and Dexterity rolls":
        "adicione o nível de Rapidez às rolagens de defesa e Destreza",
    "perform non-combat skill tasks in seconds or as minor actions":
        "execute tarefas de perícia fora de combate em segundos ou como ações menores",
    "dash up to 50m at supernatural speed":
        "dispare até 50 m em velocidade sobrenatural",
    "run across liquids or walls": "corra sobre líquidos ou paredes",
    "add Celerity rating to defense against ranged (Requires 'Rapid Reflexes')":
        "adicione o nível de Rapidez à defesa contra ataques à distância (requer Reflexos Rápidos)",
    "add Celerity to a claw or edged attack that leaves victims bleeding and exposed":
        "adicione Rapidez a um ataque com garras ou lâmina que deixa vítimas sangrando e vulneráveis",
    "convey temporary Celerity power to anyone who drinks your Blood":
        "conceda poder temporário de Rapidez a quem beber seu Sangue",
    "move as a blur so weak attacks miss even when you cannot defend":
        "mova-se como um borrão, fazendo ataques fracos errarem mesmo quando você não puder se defender",
    "use Blink to cross a brief patch of fire or sunlight without taking damage":
        "use Piscar para atravessar uma pequena área de fogo ou luz solar sem sofrer dano",
    "aim and fire any weapon at a target as if the target were stationary":
        "mire e dispare qualquer arma contra um alvo como se ele estivesse parado",
    "vanish, instantly close with an enemy, and potentially strike as a surprise attack":
        "desapareça, aproxime-se instantaneamente de um inimigo e possivelmente ataque de surpresa",
    "strike with fist or melee weapon at such speed that the opponent cannot defend":
        "ataque com punho ou arma corpo a corpo em velocidade tão alta que o oponente não possa se defender",
    "react to events at a moment's notice, superseding the Storyteller's narration":
        "reaja a eventos no mesmo instante, sobrepondo-se à narração do Narrador",
    "fazer uma pessoa esquecer o último minuto":
        "faça uma pessoa esquecer o último minuto",
    "um comando único e curto com efeito imediato":
        "emita um comando único e curto com efeito imediato",
    "permite dar comandos mais complexos": "permita comandos mais complexos",
    "make it harder for thralls to resist you":
        "torne mais difícil para servos resistirem a você",
    "strengthen the mind of your dominated victims against interference from other kindred":
        "fortaleça a mente de suas vítimas dominadas contra interferência de outros Membros",
    "trigger psychotic breaks or nervous breakdowns in others":
        "provoque surtos psicóticos ou colapsos nervosos em outros",
    "When using Mesmerize you can give a command that stays dormant until triggered (requires Mesmerize)":
        "ao usar Hipnotizar, você pode dar um comando que permanece dormente até ser acionado (requer Hipnotizar)",
    "Rewrite memories": "reescreva memórias",
    "temporarily alter a target's desires, opinions, or intentions":
        "altere temporariamente desejos, opiniões ou intenções de um alvo",
    "victims believe anything they do under Dominate was their own free will":
        "as vítimas acreditam que qualquer coisa feita sob Dominação foi fruto de sua própria vontade",
    "command a descendant through the Blood, even without eye contact or spoken orders":
        "comande um descendente pelo Sangue, mesmo sem contato visual ou ordens faladas",
    "erase a restrained victim's memories and identity while leaving skills and powers":
        "apague memórias e identidade de uma vítima contida, preservando perícias e poderes",
    "amplify any Dominate power to affect a group of people at once":
        "amplie qualquer poder de Dominação para afetar um grupo de pessoas de uma só vez",
    "issue commands that directly lead to the harm or death of the victim":
        "emita comandos que levem diretamente a vítima a sofrer dano ou morrer",
    "add Fortitude rating to health track":
        "adicione o nível de Fortitude à trilha de Vitalidade",
    "add extra defense against mind-swaying":
        "adicione defesa extra contra influência mental",
    "reduce Superficial physical damage sustained":
        "reduza dano físico superficial sofrido",
    "absorb superficial Willpower damage during social conflict before it reaches you":
        "absorva dano superficial à Força de Vontade durante conflito social antes que ele o afete",
    "root yourself in place so only you can choose to move":
        "enraíze-se no lugar para que apenas você escolha quando se mover",
    "your vitae heals living beings more effectively than normal":
        "sua vitae cura seres vivos com mais eficiência que o normal",
    "share a portion of your unnatural toughness with animals you influence":
        "compartilhe parte de sua resistência sobrenatural com animais que você influencia",
    "maintain steady footing even when struck by massive force":
        "mantenha o equilíbrio mesmo quando atingido por força massiva",
    "turn aggravated damage to superficial": "transforme dano agravado em superficial",
    "resist auspex and similar powers": "resista a Auspícios e poderes semelhantes",
    "ignore hunger for one scene": "ignore a Fome por uma cena",
    "while Toughness is active, reflect some absorbed damage back into attackers or weapons":
        "enquanto Robustez estiver ativa, reflita parte do dano absorvido de volta contra atacantes ou armas",
    "use your blood to heal other vampires": "use seu sangue para curar outros vampiros",
    "convey temporary Fortitude power to anyone who drinks your Blood":
        "conceda poder temporário de Fortitude a quem beber seu Sangue",
    "harden skin so some cutting, piercing, or impact aggravated damage becomes superficial":
        "endureça a pele para transformar parte do dano agravado por corte, perfuração ou impacto em superficial",
    "you no longer suffer dice penalties from health damage. Activate to increase a physical stat by 1 for each damaged health":
        "você não sofre mais penalidades de dados por dano à Vitalidade. Ative para aumentar um atributo físico em 1 para cada caixa de Vitalidade danificada",
    "draw strength from weak or injured mortals nearby, temporarily raising Fortitude":
        "extraia força de mortais fracos ou feridos próximos, elevando temporariamente Fortitude",
    "harden your skin to marble-like sheen, ignoring the first source of physical damage each turn":
        "endureça sua pele com brilho marmóreo, ignorando a primeira fonte de dano físico a cada turno",
    "push Potence beyond its rating at the risk of aggravated self-inflicted strain":
        "force Potência além do seu nível, arriscando esforço agravado autoinfligido",
    "blend into surroundings while motionless":
        "misture-se ao ambiente enquanto permanecer imóvel",
    "make yourself appear significantly older or younger until dawn":
        "faça-se parecer muito mais velho ou mais jovem até o amanhecer",
    "mute all sounds you make": "abafe todos os sons que você produz",
    "hide a short private message inside ordinary speech for one intended listener":
        "oculte uma mensagem privada curta dentro de uma fala comum para um ouvinte escolhido",
    "move while remaining hidden": "mova-se enquanto permanece oculto",
    "create brief sensory hallucinations": "crie breves alucinações sensoriais",
    "create an elaborate multi-sense hallucination that affects everyone who perceives it":
        "crie uma alucinação elaborada multissensorial que afeta todos que a percebem",
    "extend your obfuscate powers to animals under your influence":
        "estenda seus poderes de Ofuscação a animais sob sua influência",
    "choose who can and cannot hear you when speaking":
        "escolha quem pode ou não ouvir você quando fala",
    "Obfuscate affects technology (eg. hide yourself from recordings)":
        "Ofuscação afeta tecnologia, por exemplo ocultando você de gravações",
    "make yourself appear as a non-descript stranger to others":
        "faça-se parecer um estranho genérico para os outros",
    "hide your real mind behind a crafted false persona against supernatural reading":
        "oculte sua mente real atrás de uma persona falsa contra leituras sobrenaturais",
    "prevent someone from perceiving any exits or means of escape":
        "impeça alguém de perceber saídas ou meios de fuga",
    "make a victim appear unrecognizable even to those who know them well":
        "faça uma vítima parecer irreconhecível até para quem a conhece bem",
    "cloak an inanimate object such as a door, car, or small house":
        "encubra um objeto inanimado, como uma porta, carro ou casa pequena",
    "activate Cloak of Shadows and Unseen Passage even while under direct observation":
        "ative Manto das Sombras e Passagem Invisível mesmo sob observação direta",
    "shelter your companions under the cloak of Obfuscate":
        "abrigue seus companheiros sob o manto da Ofuscação",
    "make yourself appear as a specific individual of any build and gender":
        "faça-se parecer uma pessoa específica de qualquer porte e gênero",
    "cause serious physical damage to a mortals":
        "cause dano físico grave a mortais",
    "jump over long distance": "salte longas distâncias",
    "add Potence rating to strength checks":
        "adicione o nível de Potência aos testes de Força",
    "add Potence as automatic successes when holding on or maintaining a grapple":
        "adicione Potência como sucessos automáticos ao segurar algo ou manter um agarrão",
    "drain a person in seconds": "drene uma pessoa em segundos",
    "grip and hold onto any surface, including walls and ceilings":
        "agarre-se e mantenha-se preso a qualquer superfície, incluindo paredes e tetos",
    "add double Potence rating to strength when destroying objects (requires 'Prowess')":
        "adicione o dobro do nível de Potência à Força ao destruir objetos (requer Proeza)",
    "add Potence to any roll to incite violence; force Vampires to make frenzy tests":
        "adicione Potência a qualquer rolagem para incitar violência; force vampiros a fazer testes de frenesi",
    "temporarily convey half your Potence power to anyone who drinks your Blood":
        "conceda temporariamente metade do seu poder de Potência a quem beber seu Sangue",
    "land from Soaring Leap with a damaging area impact":
        "aterrisse após Salto Elevado com um impacto em área que causa dano",
    "slam fist or foot into the ground, creating a shockwave that throws opponents prone":
        "esmague punho ou pé contra o chão, criando uma onda de choque que derruba oponentes",
    "channel full-body strength through small movements as minor actions":
        "canalize a força do corpo inteiro por pequenos movimentos como ações menores",
    "bare hands can inflict grievous injuries, aggravated damage to both mortals and vampires":
        "mãos nuas podem infligir ferimentos graves, causando dano agravado a mortais e vampiros",
    "become attractive and charismatic; add Presence rating to Persuasion and Performance checks":
        "torne-se atraente e carismático; adicione o nível de Presença a testes de Persuasão e Performance",
    "push people away and intimidate; add Presence rating to Intimidation checks":
        "afaste e intimide pessoas; adicione o nível de Presença a testes de Intimidação",
    "Immobilize someone with eye contact":
        "imobilize alguém por contato visual",
    "make mortals you feed from love you":
        "faça mortais dos quais você se alimenta amarem você",
    "use Presence powers against targets that can't see, but only hear you.":
        "use poderes de Presença contra alvos que não podem vê-lo, mas podem ouvi-lo",
    "terrify an individual, causing them to submit, freeze, flee or terror-frenzy":
        "aterrorize um indivíduo, fazendo-o se submeter, congelar, fugir ou entrar em frenesi de terror",
    "cause infatuation, making a target do almost anything to remain in your good graces":
        "cause fascinação, fazendo um alvo quase qualquer coisa para permanecer em suas boas graças",
    "draw a crowd's heightened resonance into yourself after a successful performance":
        "atraia para si a ressonância elevada de uma multidão após uma performance bem-sucedida",
    "drain a mortal's powerful emotion to briefly feel more human while emptying them":
        "drene uma emoção poderosa de um mortal para sentir-se mais humano por um breve momento enquanto o esvazia",
    "appear to a victim as someone they feel strongly about, helping manipulate emotions and resonance":
        "apareça para uma vítima como alguém por quem ela sente algo intenso, ajudando a manipular emoções e ressonância",
    "project your voice to anywhere you can see":
        "projete sua voz para qualquer lugar que possa ver",
    "use your voice alone to employ Dominate powers":
        "use apenas sua voz para empregar poderes de Dominação",
    "imbue a building with a Presence power that affects those inside":
        "imbua uma construção com um poder de Presença que afeta quem está dentro",
    "magnify a touched target's current desire into a scene-long obsession":
        "amplie o desejo atual de um alvo tocado em uma obsessão que dura a cena",
    "extend one of your active Presence powers to another willing vampire instead of yourself":
        "estenda um de seus poderes ativos de Presença a outro vampiro voluntário em vez de a si mesmo",
    "Presence powers affect people viewing you on live feeds or hearing you over the phone":
        "poderes de Presença afetam pessoas que veem você em transmissões ao vivo ou o ouvem pelo telefone",
    "call to yourself any person upon whom you've previously used Awe, Entrancement, or Majesty":
        "chame até você qualquer pessoa sobre quem já tenha usado Fascínio, Encantamento ou Majestade",
    "amplify your countenance to supernatural levels, making everyone unable to act against you":
        "amplie sua presença a níveis sobrenaturais, tornando todos incapazes de agir contra você",
    "your eyes start glowing and you can see in total darkness":
        "seus olhos começam a brilhar e você enxerga na escuridão total",
    "dislocate and soften your body to escape restraints or squeeze through gaps":
        "desloque e amoleça seu corpo para escapar de amarras ou passar por frestas",
    "become weightless": "torne-se sem peso",
    "grow deadly claws": "desenvolva garras mortais",
    "grow hollow fangs that push your vitae into a victim during a bite or kiss":
        "desenvolva presas ocas que injetam sua vitae na vítima durante uma mordida ou beijo",
    "hold swallowed blood outside your system for a scene, avoiding feeding effects until you expel it":
        "mantenha sangue engolido fora do seu sistema por uma cena, evitando efeitos da alimentação até expeli-lo",
    "reshape your own skin, muscles and bone at will":
        "remodele sua própria pele, músculos e ossos à vontade",
    "meld into the soil": "funda-se ao solo",
    "turn into a human-sized animal": "transforme-se em um animal de tamanho humano",
    "reshape another creature's flesh through Vicissitude":
        "remodele a carne de outra criatura por meio de Vicissitude",
    "assume the appearance of a corpse, able to endure harm while lying still":
        "assuma a aparência de um cadáver, capaz de suportar dano enquanto permanece imóvel",
    "grant an additional animal form, enabling you to change your size":
        "conceda uma forma animal adicional, permitindo alterar seu tamanho",
    "twist your body into a monstrous battle form with enhanced physical power":
        "torça seu corpo em uma forma de batalha monstruosa com poder físico ampliado",
    "turn into a cloud of mist, perceivable but untouchable by anything save fire and sunlight":
        "transforme-se em uma nuvem de névoa, perceptível mas intocável exceto por fogo e luz solar",
    "sense through the land around you while merged with earth":
        "perceba através da terra ao redor enquanto estiver fundido ao solo",
    "remove and hide your heart, making staking much harder while dulling remorse":
        "remova e esconda seu coração, tornando o empalamento muito mais difícil enquanto embota seu remorso",
    "your heart detaches and moves freely within your chest, making you exceedingly hard to stake":
        "seu coração se solta e se move livremente no peito, tornando você extremamente difícil de empalar",
    "dissolve into a swarm of small creatures that can attack several targets at once":
        "dissolva-se em um enxame de pequenas criaturas capaz de atacar vários alvos ao mesmo tempo",
    "make your blood corrosive to dead substances":
        "torne seu sangue corrosivo para substâncias mortas",
    "Discern traits about someone by tasting a drop of their blood":
        "discernir traços de alguém ao provar uma gota de seu sangue",
    "manipulate blood to show simple messages or shapes":
        "manipule sangue para exibir mensagens ou formas simples",
    "treat animal blood so vampires can feed from it as though it were human blood":
        "trate sangue animal para que vampiros possam se alimentar dele como se fosse sangue humano",
    "increase another vampire's hunger":
        "aumente a Fome de outro vampiro",
    "locate particular information in text":
        "localize informações específicas em um texto",
    "temporarily increase your Blood Potency":
        "aumente temporariamente sua Potência de Sangue",
    "turn your blood into paralyzing poison":
        "transforme seu sangue em veneno paralisante",
    "hide a short message, image, or emotion in a carrier's blood for the next drinker":
        "oculte uma mensagem curta, imagem ou emoção no sangue de um portador para o próximo bebedor",
    "your blood can retain Blood Bonding properties even when stored in an object or a ghoul":
        "seu sangue pode reter propriedades de laço de sangue mesmo armazenado em um objeto ou carniçal",
    "form your vitae into a floating barrier that absorbs ranged damage":
        "forme uma barreira flutuante de vitae que absorve dano à distância",
    "charge a vial of your Blood to burst into cutting shrapnel when broken":
        "carregue um frasco do seu Sangue para explodir em estilhaços cortantes quando quebrado",
    "transmute your Blood into an extremely aggressive poison, lethal to mortal and Kindred alike":
        "transmute seu Sangue em um veneno extremamente agressivo, letal para mortais e Membros",
    "call back vitae from your ghouls at any distance, sating Hunger while harming them":
        "recupere vitae de seus carniçais a qualquer distância, saciando a Fome enquanto os fere",
    "boil the blood of a victim in their own veins, doing aggravated damage per margin over their Composure + Occult roll":
        "ferva o sangue de uma vítima em suas próprias veias, causando dano agravado por margem acima da rolagem de Autocontrole + Ocultismo dela",
    "bind yourself to one chosen element and suffer harm to extend your senses through it":
        "vincule-se a um elemento escolhido e sofra dano para estender seus sentidos por meio dele",
    "manipulate shadows for stealth or intimidation":
        "manipule sombras para furtividade ou intimidação",
    "see in darkness and see ghosts": "enxergue no escuro e veja fantasmas",
    "use your vitae to disintegrate non-vampire corpses":
        "use sua vitae para desintegrar cadáveres não vampíricos",
    "identify objects and locations that are connected to ghosts":
        "identifique objetos e locais conectados a fantasmas",
    "summon a supernatural shadow you control":
        "convoque uma sombra sobrenatural sob seu controle",
    "find places where ghosts can cross between worlds":
        "encontre lugares onde fantasmas podem cruzar entre mundos",
    "conjures shadow appendages that the user can control but the user is unable to do anything else":
        "conjura apêndices sombrios que o usuário controla, mas o impede de fazer qualquer outra coisa",
    "foresee a mortal's likely death and exploit the omen":
        "preveja a provável morte de um mortal e explore esse presságio",
    "decay everything around": "decomponha tudo ao redor",
    "project senses through shadows": "projete seus sentidos através das sombras",
    "detach and animate your shadow as an independent servant":
        "separe e anime sua sombra como um servo independente",
    "decay a living or unliving body": "decomponha um corpo vivo ou não-vivo",
    "feed on a wraith's driving passions, briefly reducing Hunger while damaging the spirit's will":
        "alimente-se das paixões motrizes de uma aparição, reduzindo brevemente a Fome enquanto fere a vontade do espírito",
    "create a field of mist that follows you, rendering you more difficult to target with ranged weapons":
        "crie um campo de névoa que segue você, tornando-o mais difícil de alvejar com armas à distância",
    "spread suffocating supernatural darkness over a nearby area":
        "espalhe uma escuridão sobrenatural sufocante por uma área próxima",
    "rot holy symbols or briefly smother a true believer's sacred protection":
        "apodreça símbolos sagrados ou sufoque brevemente a proteção sagrada de um crente verdadeiro",
    "draw out a victim's violent shadow-self as a hostile double bent on destroying them":
        "extraia o eu sombrio violento de uma vítima como um duplo hostil empenhado em destruí-la",
    "step into one shadow and emerge from another shadow in sight":
        "entre em uma sombra e emerja de outra sombra à vista",
    "become a two-dimensional shadow harmed only by fire and sunlight":
        "torne-se uma sombra bidimensional ferida apenas por fogo e luz solar",
    "channel entropy into a victim's spirit, causing aggravated Willpower damage and risking their soul's destruction":
        "canalize entropia no espírito de uma vítima, causando dano agravado à Força de Vontade e arriscando a destruição de sua alma",
    "use your mind to grab, hold, and push objects or people without touching them":
        "use sua mente para agarrar, segurar e empurrar objetos ou pessoas sem tocá-los",
    "create a mist that clings to a victim, blinding them and causing suffocation in mortals":
        "crie uma névoa que gruda na vítima, cegando-a e causando sufocamento em mortais",
    "lift yourself from the ground, achieving a state of swift flight or floating":
        "eleve-se do chão, alcançando voo rápido ou flutuação",
    "speak the native language of the mortal whose blood fueled the formula":
        "fale o idioma nativo do mortal cujo sangue abasteceu a fórmula",
    "generate a low electrical current to power small devices by touch":
        "gere uma corrente elétrica baixa para alimentar pequenos dispositivos por toque",
    "change your gender permanently through alchemical transformation":
        "mude seu gênero permanentemente por transformação alquímica",
    "brew sun protection that delays daylight damage for several hours":
        "prepare uma proteção solar que adia dano de luz do dia por várias horas",
    "store a single charge of sunlight in your body to burn yourself and a target":
        "armazene uma única carga de luz solar em seu corpo para queimar você e um alvo",
    "take on the physical appearance and voice of the last person you fed from":
        "assuma a aparência física e a voz da última pessoa de quem se alimentou",
    "burn a blood-borne infection out through the carrier's skin in a painful flare":
        "queime uma infecção transmitida pelo sangue através da pele do portador em uma explosão dolorosa",
    "brew a euphoric party drug that sharpens Dexterity and intensifies sensation":
        "prepare uma droga eufórica de festa que aguça Destreza e intensifica sensações",
    "alter blood resonance or seed a compulsion into blood the next vampire drinks":
        "altere a ressonância do sangue ou plante uma compulsão no sangue que o próximo vampiro beber",
    "create an elixir that returns fractionated medical-supply blood to freshness":
        "crie um elixir que devolve frescor a sangue fracionado de suprimento médico",
    "mark a vessel so you can recognize the next person who drinks from them":
        "marque um recipiente para reconhecer a próxima pessoa que beber dele",
    "emit noxious gas that paralyzes mortals and cramps supernatural creatures":
        "emita gás nocivo que paralisa mortais e causa cãibras em criaturas sobrenaturais",
    "place a vampire into corpse-like torpor until a written end time, protecting them from daylight mishaps":
        "coloque um vampiro em torpor cadavérico até uma hora final escrita, protegendo-o de acidentes com luz do dia",
    "induce torpor that improves healing chances and can preserve Hunger for thin-bloods":
        "induza torpor que melhora chances de cura e pode preservar a Fome de sangue-ralos",
    "see silver threads connecting mortals to Kindred they are tied to":
        "veja fios prateados conectando mortais aos Membros aos quais estão ligados",
    "make a vessel's blood irresistibly appetizing, pressuring nearby vampires to feed":
        "torne o sangue de um recipiente irresistivelmente apetitoso, pressionando vampiros próximos a se alimentar",
    "create gas that strips Blush of Life from true vampires caught in the blast":
        "crie um gás que remove Rubor de Vida de vampiros verdadeiros atingidos pela explosão",
    "create an elixir which, when added to human blood, can awaken a vampire from Torpor":
        "crie um elixir que, adicionado a sangue humano, pode despertar um vampiro do torpor",
    "temporarily sharpen mental focus, resist mental Disciplines, and avoid bestial interference":
        "aguce temporariamente o foco mental, resista a Disciplinas mentais e evite interferência bestial",
    "make a target believe they freely agreed with a statement":
        "faça um alvo acreditar que concordou livremente com uma declaração",
    "blur your face and hair toward a blood donor's appearance for a brief disguise":
        "desfoque seu rosto e cabelo para se aproximar da aparência de um doador de sangue como disfarce breve",
    "reduce the first damage you take in a scene":
        "reduza o primeiro dano que sofrer em uma cena",
    "distill a destroyed vampire's ashes into Ashe, a dangerous drug that carries a trace of vampiric power":
        "destile as cinzas de um vampiro destruído em Ashe, uma droga perigosa que carrega traço de poder vampírico",
    "make ultraviolet light burn vampires like weak sunlight and provoke terror frenzy":
        "faça luz ultravioleta queimar vampiros como luz solar fraca e provocar frenesi de terror",
    "create supernatural tattoo fluid that can mark skin permanently or reshape itself":
        "crie tinta sobrenatural de tatuagem capaz de marcar a pele permanentemente ou se remodelar",
    "create a short-lived sentient slime familiar from three vampires' vitae":
        "crie um familiar de limo senciente e breve a partir da vitae de três vampiros",
    "infect a mortal by touch with a supernatural wasting disease that may become contagious":
        "infecte um mortal por toque com uma doença debilitante sobrenatural que pode se tornar contagiosa",
    "open a wound in a major artery of a mortal victim, blood shooting out toward your open mouth":
        "abra uma ferida em uma artéria principal de uma vítima mortal, fazendo o sangue jorrar até sua boca aberta",
    "turn a mortal victim's blood into a gruesome shared meal for a duskborn coterie":
        "transforme o sangue de uma vítima mortal em uma refeição macabra compartilhada por uma coterie de sangue-ralos",
    "modify Ashe to temporarily channel one or two Discipline powers from the destroyed vampire":
        "modifique Ashe para canalizar temporariamente um ou dois poderes de Disciplina do vampiro destruído",
    "modify Ashe with a vampire's possession to relive one of the destroyed vampire's memories":
        "modifique Ashe com uma posse de vampiro para reviver uma memória do vampiro destruído",
    "force old injuries, illnesses, or age back onto a victim who had escaped them":
        "force ferimentos antigos, doenças ou idade a retornarem a uma vítima que havia escapado deles",
    "prevent an injured target from healing physical damage for several days":
        "impeça um alvo ferido de curar dano físico por vários dias",
    "break a Blood Bond within a day through a painful and politically dangerous purge":
        "quebre um Laço de Sangue em um dia por meio de uma purga dolorosa e politicamente perigosa",
    "silently overload electronics or electrical systems by touch":
        "sobrecarregue silenciosamente eletrônicos ou sistemas elétricos por toque",
    "secrete caustic bile that corrodes materials and enhances touch attacks":
        "secrete bile cáustica que corrói materiais e fortalece ataques por toque",
    "ignore electrical harm and redirect electricity as a ranged alchemical attack":
        "ignore dano elétrico e redirecione eletricidade como ataque alquímico à distância",
    "silence a victim so speech, writing, gestures, and other communication fail":
        "silencie uma vítima para que fala, escrita, gestos e outras formas de comunicação falhem",
    "superheat your body, ignore fire for a scene, and add fire damage to touch attacks":
        "superaqueça seu corpo, ignore fogo por uma cena e adicione dano de fogo a ataques por toque",
    "share diablerie among thin-bloods to gain a first dot of a victim's clan Discipline":
        "compartilhe diablerie entre sangue-ralos para ganhar o primeiro ponto da Disciplina de clã da vítima",
    "make a target fixate on the next betrayal or Conviction breach by an ally":
        "faça um alvo se fixar na próxima traição ou quebra de Convicção cometida por um aliado",
    "remove another vampire's Stains or shield them from future Stains, at a cost":
        "remova Máculas de outro vampiro ou proteja-o de Máculas futuras, a um custo",
    "turn a mortal vessel into a delayed explosive burst of gore and aggravated damage":
        "transforme um recipiente mortal em uma explosão retardada de vísceras e dano agravado",
    "coat a person, object, or place with paste that unsettles the religious and torments the faithful":
        "cubra uma pessoa, objeto ou lugar com uma pasta que perturba religiosos e atormenta fiéis",
    "commit a planned atrocity to numb your conscience against further Stains that night":
        "cometa uma atrocidade planejada para anestesiar sua consciência contra novas Máculas naquela noite",
    "blind a victim to all people nearby, leaving them isolated and disoriented":
        "cegue uma vítima para todas as pessoas próximas, deixando-a isolada e desorientada",
    "erase a target's memory of one trusted ally's next betrayal or harmful act":
        "apague da memória de um alvo a próxima traição ou ação nociva de um aliado confiável",
    "puppet spilled blood or a living victim's blood into violent physical action":
        "manipule sangue derramado ou o sangue de uma vítima viva em ações físicas violentas",
    "use your last-fed resonance for a specific defense against banes or powers":
        "use a última ressonância da qual se alimentou como defesa específica contra perdições ou poderes",
    "subtly raise or lower the frenzy difficulty of nearby vampires while you hum or growl":
        "eleve ou reduza sutilmente a dificuldade de frenesi de vampiros próximos enquanto cantarola ou rosna"
}

const riteNameTranslations: Record<string, string> = {
    "Blood Walk": "Caminhada de Sangue",
    "Clinging of the Insect": "Aderência do Inseto",
    "Craft Bloodstone": "Criar Pedra de Sangue",
    "Wake with Evenings Freshness": "Despertar com o Frescor da Noite",
    "Ward against Ghouls": "Proteção contra Carniçais",
    "Coax the Garden": "Instigar o Jardim",
    "Dampen the Fear": "Abafar o Medo",
    "Seal the Brand": "Selar a Marca",
    "Letter Ward": "Proteção de Carta",
    "Bloody Message": "Mensagem Sangrenta",
    "Beelzebeatit": "Beelzebeatit",
    "Enrich the Blood": "Enriquecer o Sangue",
    "Astromancy": "Astromancia",
    "Bind the Accusing Tongue": "Amarrar a Língua Acusadora",
    "As Fog on Water": "Como Névoa sobre a Água",
    "Calix Secretus": "Calix Secretus",
    "Soporific Touch": "Toque Soporífero",
    "The Shroud of Silence": "O Sudário do Silêncio",
    "Enhance Dyscrasia": "Intensificar Discrasia",
    "Craftmaster": "Mestre Artesão",
    "Depths of Nightmare": "Profundezas do Pesadelo",
    "Elemental Grasp": "Agarre Elemental",
    "Le Sang de l'Amour": "Le Sang de l'Amour",
    "Silentia Mortis": "Silentia Mortis",
    "Tiamat Glistens": "Tiamat Reluz",
    "Viscera Garden": "Jardim de Vísceras",
    "Fire in the Blood": "Fogo no Sangue",
    "One With the Blade": "Um com a Lâmina",
    "Herd Ward": "Proteção do Rebanho",
    "Sleep of Judas": "Sono de Judas",
    "Communal Vigor": "Vigor Comunitário",
    "Galvanic Ruination": "Ruína Galvânica",
    "Bloodless Feast": "Banquete sem Sangue",
    "Grim Chrysalis": "Crisálida Sombria",
    "Feast of Ashes": "Banquete de Cinzas",
    "Guided Memory": "Memória Guiada",
    "Invisible Chains of Binding": "Correntes Invisíveis de Aprisionamento",
    "Seek the Gathered Vitae": "Buscar a Vitae Reunida",
    "The Balm of Bathory": "O Bálsamo de Bathory",
    "Eden's Bounty": "Dádiva do Éden",
    "Blood Sigil": "Sigilo de Sangue",
    "Elemental Shelter": "Abrigo Elemental",
    "Nepenthe": "Nepente",
    "Seeing with the Sky's Eyes": "Ver com os Olhos do Céu",
    "Seeking Tiamat": "Buscando Tiamat",
    "Soul of the Hemonculus": "Alma do Hemonculus",
    "Stone of the True Form": "Pedra da Forma Verdadeira",
    "Trespass": "Transgressão",
    "Viral Haruspex": "Harúspice Viral",
    "Creatio Ignis": "Creatio Ignis",
    "Dominion": "Domínio",
    "Compel the Inanimate": "Compelir o Inanimado",
    "Egregore Consultation": "Consulta ao Egrégoro",
    "Land's Sustenance": "Sustento da Terra",
    "Riding the Earth's Veins": "Cavalgando as Veias da Terra",
    "Elemental Attack": "Ataque Elemental",
    "Fisher King": "Rei Pescador",
    "Simulacrum Gate": "Portal do Simulacro",
    "The Gift of False Life": "O Dom da Vida Falsa",
    "Summon Spirit": "Convocar Espírito",
    "Traveler's Call": "Chamado do Viajante",
    "Awaken the Homuncular Servant": "Despertar o Servo Homuncular",
    "Blinding the Alloy Eye": "Cegar o Olho de Liga",
    "Compel Spirit": "Compelir Espírito",
    "Maw of Ahriman": "Goela de Ahriman",
    "Host Spirit": "Hospedar Espírito",
    "Shambling Hordes": "Hordas Cambaleantes",
    "Name of the Father": "Nome do Pai",
    "Harrowhaunt": "Assombração Atormentadora",
    "Fortezza Sindonica": "Fortezza Sindonica",
    "Knit the Veil": "Remendar o Véu",
    "Craft Flesh Golem": "Criar Golem de Carne",
    "Create Corpse Suit": "Criar Traje de Cadáver",
    "Bind the Spirit": "Vincular o Espírito",
    "Split the Shroud": "Fender o Sudário",
    "Befoul Vessel": "Macular Recipiente",
    "Death Rattle": "Estertor da Morte",
    "Bind to Mortal Form": "Vincular à Forma Mortal",
    "Ex Nihilo": "Ex Nihilo",
    "Lazarene Blessing": "Bênção Lazarena",
    "Pit of Contemplation": "Poço de Contemplação",
    "Gift of True Life": "Dom da Vida Verdadeira"
}

const meritAndLoresheetTranslations: Record<string, string> = {
    ...meritFlawTranslations,
    "Hidden Armory": "Arsenal Oculto",
    "Cell": "Cela",
    "Watchmen": "Vigias",
    "Luxury": "Luxo",
    "Compromised": "Comprometido",
    "Check the Trunk": "Confira o Porta-malas",
    "High-functioning addict": "Viciado Funcional",
    "Methusela's Thirst": "Sede de Matusalém",
    "Organovore": "Organívoro",
    "Addiction": "Vício",
    "Hopeless Addiction": "Vício Irremediável",
    "Living in the Past": "Vivendo no Passado",
    "Archaic": "Arcaico",
    "Eat Food": "Comer Comida",
    "Zeroed": "Apagado",
    "Cobbler": "Falsificador",
    "Known Corpse": "Cadáver Conhecido",
    "Known Blankbody": "Corpo-Branco Conhecido",
    "Linguistics": "Linguística",
    "Illiterate": "Analfabeto",
    "Mawla": "Mawla",
    "Adversary": "Adversário",
    "Suspect": "Suspeito",
    "Long Bond": "Laço Longo",
    "Bond Junkie": "Viciado em Laço",
    "Bondslave": "Escravo de Laço",
    "Stalkers": "Perseguidores",
    "Infamy": "Infâmia",
    "Dangerous Reputation": "Reputação Perigosa",
    "Anarch Comrades": "Camaradas Anarquistas",
    "Camarilla Contact": "Contato na Camarilla",
    "Catenating Blood": "Sangue Catenante",
    "Day Drinker": "Bebedor Diurno",
    "Discipline Affinity": "Afinidade com Disciplina",
    "Lifelike": "Verossímil",
    "Thin-blood Alchemist": "Alquimista Sangue-Ralo",
    "Vampiric Resilience": "Resiliência Vampírica",
    "Memories of the Fallen": "Memórias dos Caídos",
    "Baby Teeth": "Dentes de Leite",
    "Bestial Temper": "Temperamento Bestial",
    "Branded by the Camarilla": "Marcado pela Camarilla",
    "Shunned by the Anarchs": "Rejeitado pelos Anarquistas",
    "Clan Curse": "Maldição do Clã",
    "Dead Flesh": "Carne Morta",
    "Mortal Frailty": "Fragilidade Mortal",
    "Vitae Dependency": "Dependência de Vitae",
    "Ashe Addiction": "Vício em Ashe",
    "Business Establishment": "Estabelecimento Comercial",
    "Furcus": "Furcus",
    "Laboratory": "Laboratório",
    "Library": "Biblioteca",
    "Location": "Localização",
    "Machine Shop": "Oficina Mecânica",
    "Postern": "Porta Secreta",
    "Security System": "Sistema de Segurança",
    "Surgery": "Sala Cirúrgica",
    "Warding": "Proteção Mística",
    "Mobile": "Móvel",
    "Armored": "Blindado",
    "Smugglers Stash": "Esconderijo de Contrabandista",
    "Spare Plates": "Placas Sobressalentes",
    "Holy Ground": "Solo Sagrado",
    "Shrine": "Santuário",
    "Shared": "Compartilhado",
    "On the Rails": "Nos Trilhos",
    "Temperamental": "Temperamental",
    "Looks": "Aparência",
    "Feeding": "Alimentação",
    "Mythic": "Mítico",
    "Cult": "Culto",
    "Bonding": "Laços",
    "Boons and Debts": "Favores e Dívidas",
    "Mental": "Mental",
    "Other": "Outros",
    "Famous Face": "Rosto Famoso",
    "Ingénue": "Ingênuo",
    "Remarkable Feature": "Traço Marcante",
    "Semblance of the Methuselah": "Semblante do Matusalém",
    "Scene Kid": "Jovem da Cena",
    "Up All Night": "Acordado a Noite Toda",
    "Stench": "Fedor",
    "Transparent": "Transparente",
    "Vessel Recognition": "Reconhecimento de Recipiente",
    "Drive-thru": "Drive-thru",
    "Vegan": "Vegano",
    "Vein Tapper": "Puncionador de Veias",
    "Resonance Sensitivity": "Sensibilidade à Ressonância",
    "Resonance Mimic": "Mímico de Ressonância",
    "Sloppy Feeder": "Alimentador Descuidado",
    "Luck of the Devil": "Sorte do Diabo",
    "Nuit Mode": "Modo Nuit",
    "Ley Line Leech": "Sanguessuga de Linha Ley",
    "Persistent Blush": "Rubor Persistente",
    "Cold Dead Hunger": "Fome Fria e Morta",
    "Starving Decay": "Decadência Faminta",
    "Twice-Cursed": "Duas Vezes Amaldiçoado",
    "Land Locked": "Preso à Terra",
    "Resistant Blush": "Rubor Resistente",
    "Corpse Flesh": "Carne de Cadáver",
    "Disease Vector": "Vetor de Doença",
    "Plaguebringer": "Portador da Praga",
    "Ingrained Discipline": "Disciplina Enraizada",
    "Side Hustler": "Trabalho Paralelo",
    "Influencer": "Influenciador",
    "Enduring Fame": "Fama Duradoura",
    "Streamer": "Streamer",
    "Apocryphal Texts": "Textos Apócrifos",
    "Inspired Artist": "Artista Inspirado",
    "Traveling Preacher": "Pregador Viajante",
    "Gardener": "Jardineiro",
    "Dark Mother's Song": "Canção da Mãe Sombria",
    "Fire Resistant": "Resistente ao Fogo",
    "Fixer": "Facilitador",
    "Go to Ground": "Ir para o Subterrâneo",
    "Vigilant": "Vigilante",
    "Gematria": "Gematria",
    "Insidious Whispers": "Sussurros Insidiosos",
    "Bargainer": "Negociador",
    "Bull-Slayer": "Matador de Touros",
    "Archangel's Grace": "Graça do Arcanjo",
    "Mystic of the Void": "Místico do Vazio",
    "Excommunicated": "Excomungado",
    "Faithless": "Sem Fé",
    "Schism": "Cisma",
    "False Alarms": "Alarmes Falsos",
    "Empty": "Vazio",
    "Failed Initiate": "Iniciado Fracassado",
    "Yearning": "Anseio",
    "Bond Resistance": "Resistência ao Laço",
    "Short Bond": "Laço Curto",
    "Unbondable": "Inlaçável",
    "City Secrets": "Segredos da Cidade",
    "Untouchable": "Intocável",
    "Despised": "Desprezado",
    "Minor Boon": "Favor Menor",
    "Major Boon": "Favor Maior",
    "Minor Debt": "Dívida Menor",
    "Major Debt": "Dívida Maior",
    "Life Debt": "Dívida de Vida",
    "Tempered Will": "Vontade Temperada",
    "Penitence": "Penitência",
    "Unholy Will": "Vontade Profana",
    "Zealotry": "Fanatismo",
    "Soothed Beast": "Besta Acalmada",
    "False Love": "Amor Falso",
    "Weak-Willed": "Vontade Fraca",
    "Horrible Scars of Penitence": "Cicatrizes Horríveis de Penitência",
    "Groveling Worm": "Verme Rastejante",
    "Beacon of Profanity": "Farol de Profanação",
    "Crisis of Faith": "Crise de Fé",
    "Pack Diablerie": "Diablerie da Matilha",
    "Knowledge Hungry": "Faminto por Conhecimento",
    "Prestation Debts": "Dívidas de Prestação",
    "Risk-Taker": "Assume-Riscos",
    "Mortal Pretender": "Pretendente Mortal",
    "Two Masters": "Dois Mestres",
    "The Bahari": "Os Bahari",
    "Cainite Heresy": "Heresia Cainita",
    "The Circulatory System": "O Sistema Circulatório",
    "Convention of Thorns": "Convenção dos Espinhos",
    "The First Inquisition": "A Primeira Inquisição",
    "The Trinity": "A Trindade",
    "The Week of Nightmares": "A Semana dos Pesadelos",
    "High Clan": "Alto Clã",
    "Low Clan": "Baixo Clã",
    "Children of Tenochtitlan": "Filhos de Tenochtitlan",
    "Flesh-Eaters": "Devoradores de Carne",
    "The Pony Express": "O Pony Express",
    "The Red Lady": "A Dama Vermelha",
    "The Blue Velvet": "O Blue Velvet",
    "The Book of Nod": "O Livro de Nod",
    "The Cobweb": "A Teia",
    "The Labyrinth": "O Labirinto",
    "The Painted Lady": "A Dama Pintada",
    "The Society of St. Leopold": "A Sociedade de São Leopoldo"
}

const uiTranslations: Record<string, string> = {
    "Select a Ritual": "Selecionar um Ritual",
    "Select a Ceremony": "Selecionar uma Cerimônia",
    "No available rituals to add.": "Nenhum ritual disponível para adicionar.",
    "No available ceremonies to add.": "Nenhuma cerimônia disponível para adicionar.",
    "Add Ritual": "Adicionar Ritual",
    "Add Ceremony": "Adicionar Cerimônia",
    "Create Custom Ritual": "Criar Ritual Personalizado",
    "Create Custom Ceremony": "Criar Cerimônia Personalizada",
    "Create Custom Power": "Criar Poder Personalizado",
    "Edit Custom Ritual": "Editar Ritual Personalizado",
    "Edit Custom Ceremony": "Editar Cerimônia Personalizada",
    "Edit Custom Power": "Editar Poder Personalizado",
    "Dice Pool Warning": "Aviso de Parada de Dados",
    "Custom": "Personalizado",
    "Selected Pool": "Parada Selecionada",
    "No successes": "Nenhum sucesso",
    "Merits & Flaws": "Vantagens e Defeitos",
    "Touchstones & Convictions": "Pilares e Convicções",
    "Touchstones are humans in your life that tie you to your humanity":
        "Pilares são humanos em sua vida que prendem você à sua Humanidade",
    "Touchstone Name": "Nome do Pilar",
    "Delete Touchstone?": "Excluir Pilar?",
    "Edit Touchstone": "Editar Pilar",
    "Add Touchstone": "Adicionar Pilar",
    "Default": "Padrão",
    "Default (clan)": "Padrão (clã)",
    "Cancel": "Cancelar",
    "Delete": "Excluir",
    "Save": "Salvar",
    "Load": "Carregar",
    "Share": "Compartilhar",
    "Summary": "Resumo",
    "Owner": "Dono",
    "User Profile": "Perfil do Usuário",
    "Create Coterie": "Criar Coterie",
    "Edit Coterie": "Editar Coterie",
    "Delete Coterie": "Excluir Coterie",
    "Create Empty Character": "Criar Personagem Vazio",
    "Character Name": "Nome do Personagem",
    "Delete Character": "Excluir Personagem",
    "Share Character": "Compartilhar Personagem",
    "Load Character?": "Carregar Personagem?",
    "Overwrite Character?": "Sobrescrever Personagem?",
    "Reset Character?": "Redefinir Personagem?",
    "Character Data Error": "Erro nos Dados do Personagem",
    "Download Broken Save Data": "Baixar Dados de Salvamento Corrompidos",
    "Reset to Empty Character": "Redefinir para Personagem Vazio",
    "Online Character Sheet": "Ficha de Personagem Online",
    "Private Notes": "Notas Privadas",
    "Past versions": "Versões anteriores",
    "No past versions yet": "Ainda não há versões anteriores",
    "Coterie unavailable": "Coterie indisponível",
    "No coteries available": "Nenhuma coterie disponível",
    "Save JSON": "Salvar JSON",
    "Load JSON": "Carregar JSON",
    "Download PDF": "Baixar PDF",
    "Save Current Character": "Salvar Personagem Atual",
    "Load Anyway": "Carregar Mesmo Assim",
    "Overwrite DB version": "Sobrescrever versão do banco",
    "Load older version": "Carregar versão antiga",
    "XP": "XP",
    "Insufficient XP": "XP insuficiente",
    "Need": "Precisa de",
    "have": "tem",
    "Level": "Nível",
    "Lv.": "Nv.",
    "Time": "Tempo",
    "Requires": "Requer",
    "Required": "Requerido",
    "Prerequisite Powers": "Poderes Requisito",
    "Rouse Checks": "Checagens de Sangue",
    "Ritual Name": "Nome do Ritual",
    "Ceremony Name": "Nome da Cerimônia",
    "Power Name": "Nome do Poder",
    "Alleycat": "Gato de Beco",
    "Extortionist": "Extorsionista",
    "Roadside Killer": "Assassino de Estrada",
    "Montero": "Montero",
    "Cleaver": "Sanguessuga Familiar",
    "Consensualist": "Consensualista",
    "Osiris": "Osíris",
    "Scene Queen": "Rainha da Cena",
    "Siren": "Sereia",
    "Sandman": "João Pestana",
    "Graverobber": "Ladrão de Sepulturas",
    "Grim Reaper": "Ceifador",
    "Pursuer": "Rastreador",
    "Trapdoor": "Alçapão",
    "Bagger": "Ensacador",
    "Blood Leech": "Sanguessuga",
    "Farmer": "Fazendeiro",
    "Ministry": "Ministério",
    "Thin-blood": "Sangue-Ralo"
}

const exactTranslations: Record<string, string> = {
    ...disciplineTranslations,
    ...rulesTerms,
    ...powerNameTranslations,
    ...powerSummaryTranslations,
    ...riteNameTranslations,
    ...meritAndLoresheetTranslations,
    ...uiTranslations
}

export const ptBRDictionary = exactTranslations

const phraseTranslations: Record<string, string> = {
    "Descendant of": "Descendente de",
    "Child of": "Cria de",
    "Children of": "Filhos de",
    "Revenant Family": "Família Revenante",
    "Level ": "Nível ",
    "Lv.": "Nv.",
    "Time:": "Tempo:",
    "Requires:": "Requer:",
    "Insufficient XP. Need": "XP insuficiente. Precisa de",
    "have": "tem",
    "once per story": "uma vez por história",
    "Once per story": "Uma vez por história",
    "once per session": "uma vez por sessão",
    "Once per session": "Uma vez por sessão",
    "once per scene": "uma vez por cena",
    "Once per scene": "Uma vez por cena",
    "per scene": "por cena",
    "per session": "por sessão",
    "per story": "por história",
    "per chronicle": "por crônica",
    "Social tests": "testes Sociais",
    "social tests": "testes Sociais",
    "Physical Attributes": "Atributos Físicos",
    "Mental Attributes": "Atributos Mentais",
    "Social Attributes": "Atributos Sociais",
    "automatic successes": "sucessos automáticos",
    "extra dice": "dados extras",
    "add 1 die": "adicione 1 dado",
    "Add 1 die": "Adicione 1 dado",
    "add 2 dice": "adicione 2 dados",
    "Add 2 dice": "Adicione 2 dados",
    "add 3 dice": "adicione 3 dados",
    "Add 3 dice": "Adicione 3 dados",
    "gain 1 die": "ganhe 1 dado",
    "Gain 1 die": "Ganhe 1 dado",
    "gain 2 dice": "ganhe 2 dados",
    "Gain 2 dice": "Ganhe 2 dados",
    "gain 3 dice": "ganhe 3 dados",
    "Gain 3 dice": "Ganhe 3 dados",
    "reroll": "role novamente",
    "Reroll": "Role novamente",
    "re-roll": "role novamente",
    "Re-roll": "Role novamente",
    "difficulty": "dificuldade",
    "Difficulty": "Dificuldade",
    "test": "teste",
    "tests": "testes",
    "roll": "rolagem",
    "rolls": "rolagens",
    "pool": "parada",
    "pools": "paradas",
    "damage": "dano",
    "superficial": "superficial",
    "aggravated": "agravado",
    "scene": "cena",
    "session": "sessão",
    "story": "história",
    "chronicle": "crônica",
    "vessel": "recipiente",
    "vessels": "recipientes",
    "target": "alvo",
    "targets": "alvos",
    "caster": "conjurador",
    "ghoul": "carniçal",
    "ghouls": "carniçais",
    "wraith": "aparição",
    "wraiths": "aparições",
    "ghost": "fantasma",
    "ghosts": "fantasmas",
    "fetter": "grilhão",
    "fetters": "grilhões",
    "sunlight": "luz solar",
    "daylight": "luz do dia",
    "fire": "fogo",
    "flames": "chamas",
    "blood bond": "laço de sangue",
    "Blood Bond": "Laço de Sangue",
    "Blood Bonds": "Laços de Sangue",
    "Blood Alchemy": "Alquimia de Sangue",
    "Thin-blood Alchemy": "Alquimia Sangue-Ralo",
    "Thin-blood": "Sangue-Ralo",
    "Thin-bloods": "Sangue-Ralos",
    "Camarilla": "Camarilla",
    "Anarch": "Anarquista",
    "Anarchs": "Anarquistas",
    "Sabbat": "Sabá",
    "Mask": "Máscara",
    "Zeroed": "Apagado",
    "Haven": "Refúgio",
    "Herd": "Rebanho",
    "Retainers": "Lacaios",
    "Retainer": "Lacaio",
    "Contacts": "Contatos",
    "Allies": "Aliados",
    "Resources": "Recursos",
    "Fame": "Fama",
    "Influence": "Influência",
    "Status": "Status",
    "Enemy": "Inimigo",
    "Enemies": "Inimigos",
    "Dark Secret": "Segredo Sombrio",
    "No Haven": "Sem Refúgio",
    "Blush of Life": "Rubor de Vida",
    "daysleep": "sono diurno",
    "day sleep": "sono diurno",
    "fed on": "usado como alimento",
    "feeding": "alimentação",
    "feed": "alimentar-se",
    "slake": "saciar",
    "slakes": "sacia",
    "slaked": "saciou",
    "Hunger die": "dado de Fome",
    "Hunger dice": "dados de Fome",
    "Formula": "Fórmula",
    "formula": "fórmula",
    "formulae": "fórmulas",
    "alchemy": "alquimia",
    "ritual": "ritual",
    "rituals": "rituais",
    "ceremony": "cerimônia",
    "ceremonies": "cerimônias",
    "power": "poder",
    "powers": "poderes",
    "Discipline": "Disciplina",
    "Disciplines": "Disciplinas",
    "discipline": "disciplina",
    "disciplines": "disciplinas",
    "amalgam": "amálgama",
    "amalgams": "amálgamas"
}

const exactTranslationEntries = Object.entries(exactTranslations).sort(
    ([a], [b]) => b.length - a.length
)
const phraseTranslationEntries = Object.entries(phraseTranslations).sort(
    ([a], [b]) => b.length - a.length
)

const escapeRegExp = (value: string): string =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const replaceAllCaseInsensitive = (text: string, search: string, replacement: string): string =>
    text.replace(new RegExp(escapeRegExp(search), "gi"), replacement)

const replaceTerm = (text: string, search: string, replacement: string): string =>
    text.replace(
        new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapeRegExp(search)})(?=$|[^\\p{L}\\p{N}_])`, "giu"),
        `$1${replacement}`
    )

const replacePhrase = (text: string, search: string, replacement: string): string => {
    const hasPunctuation = /[^\p{L}\p{N}_\s-]/u.test(search)
    return hasPunctuation
        ? replaceAllCaseInsensitive(text, search, replacement)
        : replaceTerm(text, search, replacement)
}

export const translateText = (text: string | undefined | null): string => {
    if (!text) return ""
    if (exactTranslations[text]) return exactTranslations[text]

    let translated = text

    for (const [english, portuguese] of phraseTranslationEntries) {
        translated = replacePhrase(translated, english, portuguese)
    }

    for (const [english, portuguese] of exactTranslationEntries) {
        translated = replaceTerm(translated, english, portuguese)
    }

    return translated
}
