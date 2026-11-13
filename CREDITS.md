# Sources et attributions

## Textures

**Solar System Scope**, par **INOVE**, [Solar System Scope — Solar System Textures](https://www.solarsystemscope.com/textures/), sous licence [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

Page de licence consultée le **13 novembre 2026**. Le fournisseur décrit ces textures comme basées notamment sur des données d’élévation et des images NASA, avec ajustements de couleurs. Leur réutilisation dans ce projet relève de **CC BY 4.0**, et non d’une affirmation que toutes les textures seraient directement dans le domaine public NASA. Aucune approbation par la NASA ou par le fournisseur n’est revendiquée.

Chaque fichier source est accessible sous `https://www.solarsystemscope.com/textures/download/<fichier>` :

| Ressource du dépôt | Fichier original |
| --- | --- |
| sun.jpg | 2k_sun.jpg |
| mercury.jpg | 2k_mercury.jpg |
| venus.jpg | 2k_venus_atmosphere.jpg |
| earth.jpg | 2k_earth_daymap.jpg |
| clouds.jpg | 2k_earth_clouds.jpg |
| mars.jpg | 2k_mars.jpg |
| jupiter.jpg | 2k_jupiter.jpg |
| saturn.jpg | 2k_saturn.jpg |
| uranus.jpg | 2k_uranus.jpg |
| neptune.jpg | 2k_neptune.jpg |

**Modifications** : recompression JPEG et génération des versions 1K/2K avec Sharp (`scripts/prepare-textures.mjs`). Les cartes sont projetées et éclairées dans Three.js ; la carte de nuages sert de masque de transparence. Les miniatures de navigation réutilisent les versions 1K. Les anneaux sont générés par le code du projet et ne proviennent pas de cette collection. L’interface affiche l’attribution dans le pied de page sur bureau et dans les réglages sur toutes les tailles d’écran.

La texture de Neptune emploie un bleu accentué d’imagerie historique ; elle ne doit pas être interprétée comme une mesure colorimétrique actuelle. Vénus est représentée avec son enveloppe nuageuse, pas avec sa surface radar.

## Données astronomiques

Références consultées le **13 novembre 2026** :

- [NASA NSSDC — Planetary Fact Sheet (metric)](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) : diamètres équatoriaux, masses, distances moyennes, périodes et températures de référence.
- NASA Science : [Soleil](https://science.nasa.gov/sun/facts/), [Mercure](https://science.nasa.gov/mercury/facts/), [Vénus](https://science.nasa.gov/venus/facts/), [Terre](https://science.nasa.gov/earth/facts/), [Mars](https://science.nasa.gov/mars/facts/), [Jupiter](https://science.nasa.gov/jupiter/facts/), [Saturne](https://science.nasa.gov/saturn/facts/), [Uranus](https://science.nasa.gov/uranus/facts/), [Neptune](https://science.nasa.gov/neptune/facts/) : descriptions, caractéristiques remarquables et inventaires de satellites.
- Les liens Wikipédia en français dans les fiches sont proposés comme lectures complémentaires ; les statistiques principales proviennent des références institutionnelles.

Les valeurs sont arrondies. Pour les géantes, les températures sont des références atmosphériques à une pression d’environ 1 bar, pas des températures de surface solide. Pour la Terre, 15 °C est une moyenne de référence de la table NSSDC, pas une mesure climatique de l’année en cours. Le sens rétrograde est indiqué pour Vénus et Uranus. Les inclinaisons visuelles de ces deux planètes emploient un axe équivalent et un sens de rotation inversé.

Pour les révolutions d’Uranus et de Neptune, les pages NASA dédiées sont privilégiées à l’ancienne table : respectivement 30 687 et 60 190 jours terrestres, soit environ 84,02 et 164,8 ans.

**Satellites** : la page NASA de Jupiter consultée indique **115** lunes reconnues par l’UAI ; l’ancienne table NSSDC indique encore 95, d’où le choix de la page dédiée. La page de Saturne cite **274** lunes confirmées **en mars 2025**. Les pages d’Uranus et Neptune consultées indiquent respectivement **28** et **16** lunes connues. Chaque valeur est accompagnée d’une date ou de la date de consultation dans l’interface ; ces inventaires ne sont pas actualisés automatiquement.

## Bibliothèques

Les bibliothèques conservent leurs licences respectives : notamment MIT pour React, Three.js, React Three Fiber, Drei, Vite et Tailwind CSS ; Apache 2.0 pour TypeScript ; ISC pour Lucide. Consulter les paquets pour les textes complets et les autres dépendances. GSAP est utilisé selon sa [licence standard](https://gsap.com/community/standard-license/). La licence CC BY 4.0 des textures continue de s’appliquer aux ressources redistribuées.
