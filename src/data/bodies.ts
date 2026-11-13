export type BodyId = 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune'
export interface Body {
  id: BodyId
  name: string
  category: string
  tagline: string
  description: string
  color: string
  radius: number
  orbit: number
  phase: number
  year: number
  day: number
  tilt: number
  diameter: string
  mass: string
  distance: string
  rotation: string
  revolution: string
  temperature: string
  temperatureNote: string
  satellites?: string
  satellitesNote?: string
  facts: string[]
  source: string
  wiki: string
}

// Rounded NASA fact-sheet and dedicated planetary-page values. Display geometry is compressed.
// Giant-planet moon counts are dated below; institutional pages may disagree with older tables.
export const bodies: Body[] = [
  {
    id: 'sun', name: 'Soleil', category: 'Étoile · Naine jaune', tagline: 'Là où tout commence.',
    description: 'Au cœur de notre système, le Soleil transforme l’hydrogène en hélium. La lumière et l’énergie de cette étoile rendent possible la vie sur Terre.',
    color: '#ffc174', radius: 3.2, orbit: 0, phase: 0, year: 0, day: 609.12, tilt: 7.25,
    diameter: '1 392 700 km', mass: '1,989 × 10³⁰ kg', distance: '0 km', rotation: '≈ 25,4 jours', revolution: 'Sans objet',
    temperature: '≈ 5 500 °C', temperatureNote: 'Température de la photosphère ; le cœur atteint environ 15 millions de degrés.',
    facts: ['Il concentre environ 99,8 % de la masse du système solaire.', 'Sa lumière met environ 8 minutes et 20 secondes à nous parvenir.', 'Sa rotation est différentielle : les pôles tournent moins vite que l’équateur.'],
    source: 'https://science.nasa.gov/sun/facts/', wiki: 'https://fr.wikipedia.org/wiki/Soleil',
  },
  {
    id: 'mercury', name: 'Mercure', category: 'Planète tellurique', tagline: 'Le monde des extrêmes.',
    description: 'Petite et criblée de cratères, Mercure est la planète la plus proche du Soleil. Son exosphère ténue ne retient presque aucune chaleur.',
    color: '#bab5ac', radius: .43, orbit: 6, phase: .5, year: 88, day: 1407.6, tilt: .034,
    diameter: '4 879 km', mass: '3,301 × 10²³ kg', distance: '57,9 millions de km', rotation: '58,6 jours', revolution: '88 jours',
    temperature: '167 °C', temperatureNote: 'Moyenne indicative ; environ −180 °C la nuit et 430 °C le jour.', satellites: '0',
    facts: ['Un jour solaire dure deux années mercuriennes.', 'De la glace subsiste dans les cratères polaires toujours à l’ombre.', 'C’est la plus petite des huit planètes.'],
    source: 'https://science.nasa.gov/mercury/facts/', wiki: 'https://fr.wikipedia.org/wiki/Mercure_(planète)',
  },
  {
    id: 'venus', name: 'Vénus', category: 'Planète tellurique', tagline: 'La beauté sous pression.',
    description: 'Sous son épaisse couverture de nuages, Vénus abrite une surface brûlante. Son atmosphère de dioxyde de carbone produit un effet de serre exceptionnel.',
    color: '#e6c092', radius: .84, orbit: 8.5, phase: 2.4, year: 224.7, day: -5832.5, tilt: 2.64,
    diameter: '12 104 km', mass: '4,867 × 10²⁴ kg', distance: '108,2 millions de km', rotation: '243 jours · rétrograde', revolution: '224,7 jours',
    temperature: '464 °C', temperatureNote: 'Température moyenne de surface ; Vénus est plus chaude que Mercure.', satellites: '0',
    facts: ['Elle tourne sur elle-même dans le sens opposé à la Terre.', 'La pression au sol atteint environ 92 fois celle de la Terre.', 'Sa rotation dure plus longtemps que son année.'],
    source: 'https://science.nasa.gov/venus/facts/', wiki: 'https://fr.wikipedia.org/wiki/Vénus_(planète)',
  },
  {
    id: 'earth', name: 'Terre', category: 'Planète tellurique', tagline: 'Notre point bleu pâle.',
    description: 'Un océan de vie dans l’immensité. La Terre est le seul monde connu où l’eau liquide et la vie prospèrent à la surface, protégées par une fine atmosphère.',
    color: '#76adeb', radius: .9, orbit: 11.5, phase: 4.45, year: 365.2, day: 23.9, tilt: 23.44,
    diameter: '12 756 km', mass: '5,972 × 10²⁴ kg', distance: '149,6 millions de km', rotation: '23 h 56 min', revolution: '365,25 jours',
    temperature: '15 °C', temperatureNote: 'Moyenne globale de référence arrondie ; elle varie selon la période et la méthode de mesure.', satellites: '1 · la Lune',
    facts: ['Environ 71 % de sa surface est recouverte d’eau.', 'Son champ magnétique dévie une partie des particules du vent solaire.', 'L’inclinaison de son axe est à l’origine des saisons.'],
    source: 'https://science.nasa.gov/earth/facts/', wiki: 'https://fr.wikipedia.org/wiki/Terre',
  },
  {
    id: 'mars', name: 'Mars', category: 'Planète tellurique', tagline: 'La prochaine frontière.',
    description: 'Des déserts rouges, des volcans géants et les traces d’anciennes rivières. Mars raconte l’histoire d’un monde autrefois plus humide.',
    color: '#d68b6d', radius: .62, orbit: 15, phase: 3.25, year: 687, day: 24.6, tilt: 25.19,
    diameter: '6 792 km', mass: '6,417 × 10²³ kg', distance: '227,9 millions de km', rotation: '24 h 37 min', revolution: '687 jours',
    temperature: '−65 °C', temperatureNote: 'Moyenne indicative de surface, avec de fortes variations locales et saisonnières.', satellites: '2 · Phobos et Déimos',
    facts: ['Olympus Mons s’élève à plus de 20 km au-dessus des plaines environnantes.', 'Son atmosphère est surtout composée de dioxyde de carbone.', 'Un coucher de Soleil martien peut paraître bleu autour du Soleil.'],
    source: 'https://science.nasa.gov/mars/facts/', wiki: 'https://fr.wikipedia.org/wiki/Mars_(planète)',
  },
  {
    id: 'jupiter', name: 'Jupiter', category: 'Géante gazeuse', tagline: 'Un monde démesuré.',
    description: 'Majestueuse et turbulente, Jupiter domine le cortège des planètes. Ses bandes nuageuses et ses immenses tempêtes dessinent une atmosphère en perpétuel mouvement.',
    color: '#dbb594', radius: 2.25, orbit: 21, phase: 5.6, year: 4331, day: 9.9, tilt: 3.13,
    diameter: '142 984 km', mass: '1,898 × 10²⁷ kg', distance: '778,6 millions de km', rotation: '≈ 9 h 55 min', revolution: '11,86 ans',
    temperature: '−110 °C', temperatureNote: 'Valeur indicative au niveau de pression de 1 bar ; Jupiter n’a pas de surface solide accessible.',
    satellites: '115', satellitesNote: 'Nombre indiqué par la page NASA, consultée le 13 novembre 2026. Inventaire évolutif.',
    facts: ['Sa Grande Tache rouge est une tempête observée depuis des siècles.', 'Ganymède, sa plus grande lune, dépasse Mercure en diamètre.', 'C’est la planète dont la rotation est la plus rapide.'],
    source: 'https://science.nasa.gov/jupiter/facts/', wiki: 'https://fr.wikipedia.org/wiki/Jupiter_(planète)',
  },
  {
    id: 'saturn', name: 'Saturne', category: 'Géante gazeuse', tagline: 'L’élégance des anneaux.',
    description: 'Des milliards de fragments de glace et de roche composent ses anneaux. Saturne est une géante légère, enveloppée de nuages aux teintes douces.',
    color: '#e2c89a', radius: 1.85, orbit: 29, phase: .6, year: 10747, day: 10.7, tilt: 26.73,
    diameter: '120 536 km', mass: '5,683 × 10²⁶ kg', distance: '1 433,5 millions de km', rotation: '≈ 10 h 42 min', revolution: '29,45 ans',
    temperature: '−140 °C', temperatureNote: 'Valeur indicative au niveau de pression de 1 bar ; pas de surface solide définie.',
    satellites: '274', satellitesNote: 'Inventaire de mars 2025 cité par la NASA, page consultée le 13 novembre 2026.',
    facts: ['Sa densité moyenne est inférieure à celle de l’eau.', 'Titan possède une atmosphère dense et des lacs d’hydrocarbures.', 'Les anneaux sont très étendus, mais remarquablement fins.'],
    source: 'https://science.nasa.gov/saturn/facts/', wiki: 'https://fr.wikipedia.org/wiki/Saturne_(planète)',
  },
  {
    id: 'uranus', name: 'Uranus', category: 'Géante de glaces', tagline: 'Le monde qui tourne couché.',
    description: 'Bleu pâle et discrète, Uranus présente un axe de rotation presque dans son plan orbital. Cette inclinaison provoque des saisons d’une durée exceptionnelle.',
    color: '#9cd9dd', radius: 1.25, orbit: 36, phase: 2.6, year: 30687, day: -17.2, tilt: 82.23,
    diameter: '51 118 km', mass: '8,681 × 10²⁵ kg', distance: '2 872,5 millions de km', rotation: '≈ 17 h 14 min · rétrograde', revolution: '84,02 ans',
    temperature: '−195 °C', temperatureNote: 'Valeur indicative au niveau de pression de 1 bar, différente du minimum atmosphérique.',
    satellites: '28', satellitesNote: 'Nombre indiqué par la page NASA, consultée le 13 novembre 2026. Inventaire évolutif.',
    facts: ['L’obliquité de son axe est d’environ 98° avec la convention rétrograde.', 'Elle possède un système de fins anneaux sombres.', 'Le méthane atmosphérique absorbe une partie de la lumière rouge.'],
    source: 'https://science.nasa.gov/uranus/facts/', wiki: 'https://fr.wikipedia.org/wiki/Uranus_(planète)',
  },
  {
    id: 'neptune', name: 'Neptune', category: 'Géante de glaces', tagline: 'Aux confins du voyage.',
    description: 'Au-delà d’Uranus, Neptune est un monde froid et venteux. Son atmosphère dynamique est parcourue de nuages et de tempêtes sombres.',
    color: '#6e94e4', radius: 1.22, orbit: 43, phase: 4, year: 60190, day: 16.1, tilt: 28.32,
    diameter: '49 528 km', mass: '1,024 × 10²⁶ kg', distance: '4 495,1 millions de km', rotation: '≈ 16 h 6 min', revolution: '164,8 ans',
    temperature: '−200 °C', temperatureNote: 'Valeur indicative au niveau de pression de 1 bar. La texture historique accentue le bleu.',
    satellites: '16', satellitesNote: 'Nombre indiqué par la page NASA, consultée le 13 novembre 2026. Inventaire évolutif.',
    facts: ['Ses vents peuvent dépasser 1 500 km/h.', 'Son existence a été prédite par le calcul avant son observation en 1846.', 'Triton orbite dans le sens opposé à la rotation de Neptune.'],
    source: 'https://science.nasa.gov/neptune/facts/', wiki: 'https://fr.wikipedia.org/wiki/Neptune_(planète)',
  },
]

export const bodyById = Object.fromEntries(bodies.map(body => [body.id, body])) as Record<BodyId, Body>
export const DATA_REVIEW_DATE = '13 novembre 2026'
export const FACT_SHEET = 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/'
