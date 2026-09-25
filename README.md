# Entraînement Entretiens Java + React

Application web d'entraînement aux entretiens techniques pour un développeur **Java / Spring / JPA / SQL / TypeScript / React**. QCM adaptatif avec répétition espacée, questions ouvertes et de code, simulations d'entretien chronométrées, statistiques détaillées et rapport de session exportable en PNG.

Le contenu est construit à partir du guide _Guide-Entretiens-Java-React-Toufik-Mazy.pdf_ (méthode d'entretien, fiches par thème, ateliers corrigés, QCM, annexe RAG), complété par des questions originales — notamment un corpus dédié aux **questions pièges classiquement posées en ESN et en entreprise**, organisées par niveau (junior, intermédiaire, confirmé, approfondissement).

100 % frontend, sans backend : toutes les données (progression, statistiques, sessions) restent **locales à votre navigateur** (localStorage). Aucune clé API, aucun compte requis.

## Fonctionnalités

- **Tableau de bord** : compteurs clés, concepts les plus faibles, progression par thème, actions rapides.
- **Sessions configurables** : nombre de questions (5 à 50), thèmes multiples, niveau de difficulté, mode (entraînement, examen, révision des erreurs, favoris), chronomètre, correction immédiate, mélange des réponses.
- **Trois types de questions** : QCM, questions ouvertes (avec auto-évaluation 0–4), questions de code/diagnostic.
- **Répétition espacée** : chaque concept a une priorité de révision qui grandit après une erreur et diminue après des réussites successives (algorithme documenté et modifiable dans `src/lib/spacedRepetition.ts`).
- **Simulation d'entretien** : durée configurable (30/45/60/90 min), questions mélangées technique + comportemental, score détaillé par catégorie (connaissances, raisonnement, diagnostic, sécurité, tests, communication, capacité à reconnaître une limite).
- **Flashcards** : révision rapide filtrable par thème.
- **Statistiques** : réussite globale, par thème, par difficulté, premier essai vs après répétition, historique des sessions, questions les plus ratées, courbe de progression (7/14/30 jours).
- **Rapport PNG** téléchargeable en fin de session (score, temps, résultats par thème, concepts à revoir, recommandation de prochaine révision) + impression/export PDF via le navigateur.
- **Import/export JSON** des statistiques et des questions personnalisées, avec validation stricte (jamais d'écrasement silencieux).
- **Accessibilité** : navigation clavier, focus visible, `aria-live` sur les corrections, contrastes suffisants, respect de `prefers-reduced-motion`.

## Stack technique

React 18 · TypeScript · Vite · Tailwind CSS · Recharts · html2canvas · Lucide React · React Router · Vitest + React Testing Library · ESLint + Prettier · npm.

## Installation

```bash
npm install
```

## Commandes disponibles

```bash
npm run dev            # serveur de développement (http://localhost:5173)
npm run build           # build de production dans dist/
npm run preview         # prévisualiser le build de production
npm run test            # exécuter la suite de tests une fois
npm run test:watch      # tests en mode watch
npm run test:coverage   # tests avec rapport de couverture
npm run lint             # ESLint
npm run format           # Prettier (écrit les fichiers)
npm run format:check     # Prettier (vérifie sans écrire)
```

## Structure du projet

```
src/
  components/
    Dashboard/          # KPI, concepts faibles, progression par thème, actions rapides
    QuestionCard/        # carte de question, feedback, auto-évaluation, bloc de code
    AnswerOption/         # option de QCM (état sélectionné/correct/incorrect)
    SessionSetup/         # formulaire de configuration d'une session
    Results/              # rapport de fin de session (PNG), graphiques
    Statistics/           # historique des sessions, questions les plus ratées
    InterviewMode/        # configuration de la simulation d'entretien
    Flashcards/           # carte retournable
    ImportExport/         # export/import JSON, réinitialisation
    ui/                   # primitives (Button, Card, Badge, Select, Switch, ProgressBar…)
  data/
    questions.json         # corpus de questions (voir format ci-dessous)
    topics.json             # métadonnées par thème
    flashcards.json          # cartes de révision rapide
    interview-scenarios.json # scénarios de simulation d'entretien détaillés
    glossary.json            # glossaire des sigles/termes
  hooks/
    useLocalStorage.ts       # persistance générique typée
    useProgress.ts           # état global progression/sessions/questions personnalisées
    ProgressContext.tsx      # fournit useProgress() à toute l'application
    useSpacedRepetition.ts    # sélecteurs dérivés (concepts dus, priorités)
    useQuestionSelection.ts   # sélection figée des questions d'une session
    useSession.ts             # cycle de vie d'une session en cours
  lib/
    questionSelector.ts       # filtrage + tirage pondéré par priorité de révision
    scoring.ts                 # correction, calcul de score, agrégations par thème/difficulté
    spacedRepetition.ts         # algorithme de répétition espacée
    statistics.ts                # agrégation des statistiques globales
    interviewScoring.ts           # score par catégorie pour le mode entretien
    reportGenerator.ts             # génération du rapport PNG (html2canvas)
    importExport.ts                 # export/fusion des données (jamais d'écrasement silencieux)
    validation.ts                    # validation stricte des imports JSON
    dateUtils.ts                      # formatage de dates/durées
  types/
    question.ts, session.ts, progress.ts, statistics.ts
  pages/
    DashboardPage.tsx, SessionSetupPage.tsx, SessionPage.tsx, ResultsPage.tsx,
    StatisticsPage.tsx, InterviewPage.tsx, FlashcardsPage.tsx, ImportExportPage.tsx
  App.tsx, AppRoutes.tsx, main.tsx, index.css
```

## Format JSON des questions

Chaque question suit le type `Question` (`src/types/question.ts`), avec un socle commun et des champs spécifiques selon `type` :

```jsonc
{
  "id": "J10",
  "source": "pdf", // "pdf" | "added"
  "sourcePage": 11, // page réelle du PDF, ou null si non déterminée/ajoutée
  "chapter": "Java : le langage",
  "theme": "Java",
  "subtheme": "equals et hashCode",
  "difficulty": "junior", // junior | intermediate | confirmed | advanced
  "type": "mcq", // mcq | open | code
  "question": "Quelle affirmation est correcte concernant equals et hashCode ?",
  "code": null,
  "options": [{ "id": "a", "text": "…" }],
  "correctOptionIds": ["b"],
  "explanation": "…", // mcq et code uniquement
  "commonTrap": "…",
  "keyConcept": "equals-hashcode-contract",
  "tags": ["Java", "Object", "HashMap"],
  "relatedQuestionIds": ["J11"],
  "reviewIntervals": [1, 3, 7, 14],
  "isOriginalPdfContent": true,
  "proofType": "definition", // definition | example | counterexample | code | diagnosis | tradeoff | security | testing
}
```

Une question **ouverte** remplace `options`/`correctOptionIds`/`explanation` par `expectedPoints: string[]` et `modelAnswer: string`. Une question **code** ajoute `code`, `expectedAnswer` et `acceptedConcepts: string[]`, en plus de `explanation`.

Le corpus compte plus de 300 questions couvrant Java, Spring, JPA/Hibernate, SQL, JavaScript, TypeScript, React, Tests, Maven, Git/GitLab, Docker, Architecture, Sécurité, Angular/RxJS, RAG et l'entretien comportemental — avec un accent particulier sur les **questions pièges** (`chapter: "Pièges classiques d'entretien"`, préfixe d'identifiant `TRAP-*`) issues de motifs récurrents en entretien ESN/entreprise : autoboxing et cache Integer, pool de chaînes, ordre d'initialisation statique, auto-invocation Spring (`@Transactional`/`@Cacheable`), N+1 et proxies Hibernate, `GROUP BY`/`NULL`/jointures SQL, closures et `var` dans une boucle, stale closures et `memo` en React, IDOR, etc.

## Stratégie de répétition espacée

Chaque concept (`keyConcept` d'une question) a un score de priorité recalculé après chaque réponse (`src/lib/spacedRepetition.ts`) :

- **Une erreur** augmente la priorité : le concept redevient dû dès le lendemain et son facteur de difficulté augmente (l'intervalle futur sera raccourci).
- **Une réussite** diminue progressivement la priorité : l'intervalle suivant grandit selon `reviewIntervals` (`[1, 3, 7, 14]` jours par défaut), modulé par le facteur de difficulté du concept.
- Le **mode « révision des erreurs »** sélectionne les questions dont le concept est en échec ou marqué « à revoir plus tard », en mélangeant avec de nouvelles questions pour éviter de ne montrer que les mêmes items.
- La sélection utilise un **tirage pondéré** (`src/lib/questionSelector.ts`) : plus un concept est prioritaire, plus ses questions ont de chances d'être tirées, sans jamais exclure totalement les nouveaux concepts.

L'algorithme est volontairement simple et commenté dans le code pour rester facilement ajustable.

## Fonctionnement du rapport PNG

En fin de session, `src/components/Results/ReportView.tsx` compose un rapport complet (titre, date, score, temps, résultats par thème, top concepts à revoir, questions incorrectes, comparaison à la session précédente, recommandation de prochaine révision, graphiques Recharts). `src/lib/reportGenerator.ts` capture ce composant avec **html2canvas** et déclenche un téléchargement nommé `rapport-java-react-AAAA-MM-JJ.png`. Un bouton « Imprimer / PDF » ouvre la boîte de dialogue d'impression du navigateur (mise en page adaptée via `@media print`).

## Limites de la correction des questions ouvertes

Les questions de type `open` et `code` ne sont **jamais corrigées automatiquement de façon fiable** : l'application affiche la réponse attendue (`modelAnswer`/`expectedAnswer`) et les points clés, puis demande une **auto-évaluation honnête** de 0 à 4. Cette note alimente la répétition espacée, mais reste déclarative — sans modèle d'IA externe, aucune comparaison sémantique fiable de texte libre n'est effectuée.

## Ajouter de nouvelles questions

1. Ajouter un objet conforme au format ci-dessus dans `src/data/questions.json` (ou via l'écran **Import/export** avec un fichier JSON respectant ce format — les questions importées sont stockées séparément comme « questions personnalisées » et fusionnées à l'affichage).
2. Utiliser un `id` unique. Un import avec un `id` déjà existant est **ignoré et signalé**, jamais silencieusement écrasé.
3. Renseigner `keyConcept` de façon cohérente si la question couvre un concept déjà présent ailleurs (la répétition espacée regroupe par concept, pas par question).
4. Lancer `npm run test` : `src/data/questions.test.ts` vérifie l'absence de doublons d'ID, la validité des `relatedQuestionIds` et les minimums par thème.

## Lancer les tests

```bash
npm run test
```

La suite couvre : calcul de score, sélection pondérée des questions (y compris la garantie qu'une question ratée peut revenir en révision), algorithme de répétition espacée, lecture/écriture localStorage, génération des statistiques, validation et fusion import/export, intégrité du corpus de questions, accessibilité et interaction de la carte de question, et navigation principale.

## Build de production

```bash
npm run build
```

Produit un bundle statique dans `dist/` (Vite). Le bundle dépasse 500 Ko après minification (Recharts + html2canvas + le corpus de questions) ; un découpage plus fin (`dynamic import()`) est possible mais non nécessaire pour l'usage visé.

## Déploiement Vercel

1. Importer le dépôt GitHub dans [Vercel](https://vercel.com/new).
2. Framework détecté : **Vite**.
3. Commande d'installation : `npm install`.
4. Commande de build : `npm run build`.
5. Dossier de sortie : `dist`.
6. Déployer.
7. Après déploiement, tester : lancer une session complète, vérifier que la progression persiste après rechargement (localStorage), télécharger le rapport PNG, exporter puis réimporter les statistiques.

Un fichier `vercel.json` est fourni avec une règle de réécriture (`rewrites`) pour que les routes côté client (React Router) fonctionnent après un rechargement direct ou un lien partagé (`/statistics`, `/session/new`, etc.).

## Variables d'environnement

Aucune. L'application ne dépend d'aucun service externe ni d'aucune clé d'API.

## Licence

Projet pédagogique à usage personnel. Le contenu du guide PDF source reste la propriété de son auteur ; les questions marquées `"source": "pdf"` en sont des reformulations d'entraînement, pas une reproduction du texte original.
