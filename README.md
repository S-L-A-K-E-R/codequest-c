# CodeQuest C — apprendre le C, un défi à la fois

Application statique, en français, pour la progression et le soutien en programmation C. **Sans serveur, sans compte élève, sans base de données.**

## Fonctionnalités

- Parcours progressif : **30 défis** dans 7 chapitres (entrées/sorties, variables, conditions, `while`, `for`, tableaux/chaînes, fonctions).
- Parcours indépendant **Soutien · Révision 1 : 20 exercices** accessibles dans n'importe quel ordre.
- Code C dans un éditeur, avec `stdin`, sortie console et validation de des tests automatiques.
- Exécution entièrement **dans le navigateur**, dans un moteur C/WASM isolé (`@browserrun/sandrun`, moteur `xcc`). Aucun code source d'élève n'est transmis à un serveur de compilation.
- Expérience et suivi : chaque défi réussi rapporte 20 XP, progression et série de jours.
- Autosauvegarde dans `localStorage`, export/import JSON, reprise de la dernière leçon.
- Interfaces responsive (ordinateur et mobile), tests pédagogiques et indices.

## Déploiement sur GitHub Pages (sans build)

1. Créer un **dépôt public**, par exemple `codequest-c` (le compte GitHub Free suffit).
2. Mettre les fichiers `index.html`, `styles.css`, `app.js`, `curriculum.js`, `favicon.svg`, `.nojekyll` et `README.md` **à la racine** du dépôt.
3. Aller dans **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
4. Choisir **Branch: main** et **Folder: /(root)**, puis **Save**.
5. Ouvrir `https://<UTILISATEUR>.github.io/<DEPOT>/` après la publication. Pour `S-L-A-K-E-R/codequest-c`, l'adresse prévue serait `https://s-l-a-k-e-r.github.io/codequest-c/` (elle ne fonctionnera qu'après déploiement confirmé).

Il n'y a pas besoin de `npm install`, de build ou de GitHub Actions.

## Pour une séance de soutien

- Adresse directe : `https://<UTILISATEUR>.github.io/<DEPOT>/?track=revision`
- Pour ouvrir un exercice particulier : `?track=revision&lesson=r05` (exemple : conversion de secondes).
- Pour accéder à n'importe quelle leçon du parcours en mode enseignant : `?teacher=1` (simple aide d'affichage côté client, **pas** un contrôle d'accès).
- Encourage les élèves à exporter leur progression en fin de séance s'ils changent souvent de machine.

## Modification des cours

Modifier le fichier `curriculum.js`, qui contient `modules` et les listes d'exercices. Chaque leçon définit :

```js
{
  id: 'r01', module: 'revision', title: 'Afficher un message',
  prompt: 'Affiche exactement « Revision C » et un retour à la ligne.',
  hint: 'Un seul printf suffit.',
  concept: '...', starter: '#include <stdio.h>\n...',
  tests: [{input: '', expected: 'Revision C\n'}]
}
```

**Avertissement pédagogique :** toute la logique des tests est du JavaScript téléchargé dans le navigateur. Les élèves peuvent donc inspecter les réponses attendues. C'est un outil d'entraînement et **pas** un système d'examen sécurisé ou anti-triche. La validation vérifie la sortie standard et le code de retour (pas la structure de code). Pour les exercices « définir une fonction », un élève peut théoriquement réussir sans avoir suivi l'approche imposée.

## Moteur de C

L'application utilise une dépendance ESM versionnée depuis jsDelivr : `@browserrun/sandrun@0.4.0`. Le premier lancement nécessite une connexion pour charger ce module et le petit moteur C/WASM `xcc`, puis les téléchargements peuvent être récupérés du cache du navigateur. Le site en tant que tel est hébergé sur GitHub Pages, et **l'exécution est locale**. Pas de requête serveur pour compiler ou exécuter le code.

Le moteur léger `xcc` couvre l'essentiel de C99/C11 mais n'est pas identique à GCC/Clang ; certaines fonctions de bibliothèque ou particularités du C peuvent différer. Le projet pourra évoluer vers le moteur Clang pour des exercices avancés. Les programmes exécutés en environnement isolé peuvent consommer des ressources pendant quelques secondes ; un timeout de 4 secondes par exécution est configuré.

## Confidentialité et limites

- `localStorage` se trouve dans **chaque navigateur et profil**, jamais sur GitHub. L'application ne fait pas de synchronisation entre appareils.
- En navigation privée, ou si le stockage est bloqué, la sauvegarde peut être perdue.
- GitHub Pages est un service public et GitHub peut journaliser des données réseau normales, notamment l'adresse IP. Le CDN du moteur reçoit les requêtes de chargement du moteur, **pas le code saisi**.
- Pas de backend, pas de compte ni de suivi professeur. Impossible de consulter les scores de tous les élèves sans introduire un service supplémentaire ou un export manuel.

## Utilisation locale

Servir le dossier avec un petit serveur de fichiers statiques, par exemple :

```bash
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`. Ce serveur local sert **uniquement les fichiers** pendant le développement, il ne compile pas le C et n'est pas nécessaire une fois le site déployé.

## Licence

CodeQuest C : MIT, voir `LICENSE`. Le moteur `sandrun` est sous licence MIT, et les runtimes tiers ont leurs propres licences.

## État du prototype

Version initiale : 30 défis du parcours principal, 20 révisions indépendantes. Chaque exercice dispose actuellement d'un test automatisé visible (à étoffer avant une utilisation évaluative). L'éditeur et le moteur C/WASM doivent être validés sur le site publié avant une séance en classe. Le fichier `build_data.py` du prototype de travail n'est pas nécessaire pour l'hébergement.
