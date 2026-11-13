# Planets2See

Une fenêtre interactive et documentée sur le système solaire. Application 3D entièrement en français, statique et compatible avec GitHub Pages.

## Démarrer

Prérequis : Node.js 22.12+ (ou 24) et npm.

```bash
npm ci
npm run dev
```

Ouvrir l’URL indiquée par Vite, avec le chemin **`/planets2see/`**.

```bash
npm run typecheck  # TypeScript, application et tests
npm test           # Invariants de simulation et navigation
npm run build      # Vérification TypeScript puis compilation dans dist/
npm run preview    # Servir le build de production
npx playwright install chromium
npm run test:e2e   # Chromium, bureau et mobile émulé
```

Les textures sont incluses dans le dépôt : aucune requête vers un fournisseur tiers n’est nécessaire pour explorer. `npm run textures` permet de régénérer les versions optimisées (curl requis). Les dépendances sont verrouillées dans `package-lock.json`.

## Explorer

- L’accueil affiche la Terre et permet de commencer immédiatement : aucune vidéo ni attente imposée.
- Cliquer sur un astre dans la scène, sur son label ou dans le bandeau inférieur pour lancer le voyage. Une nouvelle sélection remplace la transition en cours à partir de la position actuelle de la caméra.
- Glisser avec la souris pour orbiter ; utiliser la molette pour zoomer. Dans la vue générale, le clic droit permet de déplacer le point de vue.
- Sur écran tactile : un doigt pour tourner, deux pour zoomer ou déplacer la vue générale. Le bandeau des planètes défile horizontalement sur mobile ; les fiches ont leur propre défilement.
- Les boutons précédent/suivant et les flèches du clavier parcourent les neuf astres. `Échap` revient à la vue générale, `Espace` met la simulation en pause (hors contrôles de formulaire).
- Les vitesses orbitales proposées vont de 1 à 240 jours simulés par seconde. La rotation propre est ralentie séparément pour rester lisible. Ce n’est pas une horloge astronomique synchronisée.
- Les réglages permettent de masquer les labels, de choisir la qualité et de désactiver l’accueil. Ils sont enregistrés localement si le navigateur autorise le stockage.
- La préférence système `prefers-reduced-motion` supprime les transitions et démarre avec la simulation en pause ; une reprise explicite reste possible.
- Sans WebGL 2, ou après perte du contexte graphique, les fiches et les commandes HTML restent accessibles dans un mode documentaire.

## Qualité et ressources

| Mode | Textures | DPR maximum | Sphères | Bloom |
| --- | --- | --- | --- | --- |
| Éco | 1 024 × 512 | 1 | 32 segments | Non |
| Équilibrée | 1 024 × 512 | 1,5 | 48 segments | Oui |
| Élevée | 2 048 × 1 024 pour l’astre sélectionné, 1K ailleurs | 2 | 80 segments | Oui |

Le mode automatique utilise un choix conservateur selon le nombre de cœurs et le type de pointeur : Éco sur appareil tactile ou à quatre cœurs et moins, Équilibrée sinon. Il n’effectue pas de benchmark GPU. Le mode élevé est un choix explicite ; le DPR plafonné limite le coût sur écrans 1440p/4K. Les textures 2K du premier plan sont chargées à la demande. Le total des textures du dépôt est d’environ 3,6 Mio, dont environ 0,6 Mio pour toutes les versions 1K.

Les positions et transformations sont mises à jour avec `useFrame` sans re-rendu React à chaque image. Géométries et matériaux sont libérés par React Three Fiber ; les textures chargées ou créées manuellement sont explicitement libérées. Un échec de texture conserve un rendu coloré utilisable et affiche un message.

## Architecture

```text
src/
  App.tsx                  État de navigation, accueil, commandes et repli WebGL
  components/              Fiches, navigation, réglages, frontière d’erreur
  scene/
    SolarScene.tsx         Canvas, orbites, étoiles, éclairage et post-traitement
    CelestialBody.tsx      Surfaces, nuages et anneaux procéduraux
    Atmosphere.tsx         Halo atmosphérique éclairé par le Soleil
    CameraRig.tsx          Transitions GSAP annulables et suivi de l’astre
    useTextureAsset.ts     Chargement avec repli et libération mémoire
  data/bodies.ts           Données scientifiques, dates et liens de référence
  hooks/usePreferences.ts  Préférences locales et mouvements réduits
  lib/simulation.ts        Orbites illustratives, qualité, chemins de ressources
public/textures/{1k,2k}/    Ressources locales attribuées
tests/                     Tests unitaires et parcours Playwright
.github/workflows/         CI et déploiement GitHub Pages
```

Stack : React 19, TypeScript, Vite, Three.js, React Three Fiber, Drei, React Three Postprocessing, GSAP, Tailwind CSS 4 et Lucide.

## Déployer sur GitHub Pages

1. Dans **Settings → Pages → Build and deployment**, choisir **GitHub Actions** comme source.
2. Fusionner la pull request dans `main`.
3. Le workflow **Déployer sur GitHub Pages** construit, teste et publie le dossier `dist`. Il peut également être lancé depuis **Actions → Run workflow**.
4. L’adresse attendue est **https://waridosann.github.io/planets2see/**.

Le site n’est publié qu’après exécution réussie du workflow. Aucun jeton personnel n’est requis : le workflow utilise `GITHUB_TOKEN` et l’identité OIDC fournis par GitHub. Le chemin Vite est fixé à `/planets2see/`, y compris pour les textures et les images CSS. Pour renommer le dépôt ou publier à la racine d’un domaine, modifier `base` dans `vite.config.ts`. Il n’y a pas de route côté serveur ni de fallback SPA nécessaire.

La CI des pull requests exécute les tests unitaires, le build et les parcours navigateur. Les navigateurs de CI utilisent SwiftShader ; cela vérifie les interactions mais ne constitue pas une mesure de performances d’un GPU réel.

## Sources, crédits et limites

Voir [CREDITS.md](CREDITS.md) pour les licences des textures et les sources scientifiques.

Les tailles, distances et vitesses sont adaptées à la lecture ; les orbites circulaires et coplanaires sont illustratives. Les positions ne correspondent pas à la date réelle. L’application ne calcule ni éphémérides, ni gravitation, ni éclipses. Les anneaux sont une représentation procédurale. Les atmosphères sont des halos artistiques ; ce ne sont pas des modèles physiques de diffusion. La couche de nuages terrestre est statique par rapport à la surface. Les comptes de satellites sont datés et doivent être révisés avec leurs sources.

La qualité élevée et les effets ont été exercés dans Chromium ; un essai sur Safari/iOS et sur des GPU physiques modestes reste conseillé avant de revendiquer une compatibilité et une fluidité universelles.
