// Éléments pédagogiques en Markdown simple : éditables sans build ni dépendance.
const md = (...lines) => lines.join("\n");
export const courses = {
  start: {
    title: "Premiers pas en C", takeaway: "Écrire un programme, l'exécuter et afficher une valeur.",
    short: md(
      "## Un programme C, c'est quoi ?",
      "Le programme démarre dans la fonction `main`. Les instructions se terminent en général par un point-virgule.",
      "",
      "```c",
      "#include <stdio.h>",
      "",
      "int main(void) {",
      "    printf(\"Bonjour C\\n\");",
      "    return 0;",
      "}",
      "```",
      "",
      "- `#include <stdio.h>` rend `printf` disponible.",
      "- `\\n` passe à la ligne.",
      "- `return 0;` signale une fin normale."
    ),
    full: md(
      "## Ce qui se passe réellement",
      "Le compilateur traduit le programme en instructions exécutables. `main` est le point d'entrée habituel d'un programme hébergé.",
      "",
      "## Première erreur fréquente",
      "`printf` affiche du texte, mais ne lit rien. Pour récupérer une valeur saisie, on utilisera `scanf` et l'adresse d'une variable : `scanf(\"%d\", &age);`.",
      "",
      "## À expérimenter",
      "Change le message, ajoute un second `printf`, puis supprime le `\\n` pour observer l'effet."
    ),
    flow: ["Démarrage", "main()", "printf()", "Fin"]
  },
  variables: {
    title: "Variables & calculs", takeaway: "Mémoriser des valeurs et construire des expressions.",
    short: md(
      "## Une variable est une boîte étiquetée",
      "Une variable a un **type**, un **nom** et une **valeur**.",
      "",
      "```c",
      "int minutes = 125 / 60;",
      "int secondes = 125 % 60;",
      "printf(\"%d min %d s\\n\", minutes, secondes);",
      "```",
      "",
      "- `/` avec deux entiers effectue une **division entière**.",
      "- `%` donne le **reste** de cette division.",
      "- `=` affecte une valeur ; `==` sert à comparer."
    ),
    full: md(
      "## Déclaration et affectation",
      "`int score = 0;` déclare un entier et l'initialise. `score = score + 1;` remplace son ancienne valeur.",
      "",
      "## Types essentiels",
      "- `int` pour les entiers.",
      "- `double` pour les réels ; `%f` pour les afficher avec `printf`.",
      "- `char` pour un caractère, par exemple `'A'`.",
      "",
      "## Attention",
      "`5 / 2` vaut `2`, tandis que `5.0 / 2` vaut `2.5`. Ne divise jamais par zéro."
    ),
    flow: ["Lire", "Calculer", "Stocker", "Afficher"]
  },
  conditions: {
    title: "Conditions", takeaway: "Choisir un chemin selon une expression vraie ou fausse.",
    short: md(
      "## Prendre une décision",
      "Une condition est évaluée : si elle est vraie, le bloc `if` s'exécute ; sinon, le `else` peut s'exécuter.",
      "",
      "```c",
      "if (note >= 10) {",
      "    printf(\"admis\\n\");",
      "} else {",
      "    printf(\"refuse\\n\");",
      "}",
      "```",
      "",
      "La comparaison utilise `==`, `!=`, `<`, `<=`, `>` et `>=`."
    ),
    full: md(
      "## Composer des conditions",
      "- `&&` : les deux conditions doivent être vraies.",
      "- `||` : au moins une condition doit être vraie.",
      "- `!` : inverse le résultat logique.",
      "",
      "## Ordre",
      "Pour plusieurs cas exclusifs, utilise `if / else if / else`. Sans accolades, un `if` ne contrôle qu'une seule instruction : préfère toujours les accolades.",
      "",
      "## À tester",
      "Que se passe-t-il pour une note exactement égale à `10` ? Et pour `9` ?"
    ),
    flow: ["Tester", "Vrai → if", "Faux → else", "Suite"]
  },
  while: {
    title: "Boucles while", takeaway: "Répéter tant qu'une condition est vraie.",
    short: md(
      "## Vérifier, puis répéter",
      "`while` vérifie la condition **avant chaque tour**. Si elle est fausse dès le début, le corps ne s'exécute pas.",
      "",
      "```c",
      "int i = 1;",
      "while (i <= 3) {",
      "    printf(\"%d\\n\", i);",
      "    i++;",
      "}",
      "```",
      "",
      "La variable `i` évolue pour que la boucle puisse se terminer."
    ),
    full: md(
      "## Penser en trois temps",
      "- **Initialiser** les valeurs avant la boucle.",
      "- **Tester** la condition à chaque passage.",
      "- **Mettre à jour** les variables dans le corps.",
      "",
      "## Pièges fréquents",
      "Oublier `i++` peut donner une boucle infinie. Confondre `<` et `<=` peut produire un tour de trop ou de moins.",
      "",
      "`do { ... } while (condition);` teste après le corps : il y a alors toujours au moins un tour."
    ),
    flow: ["Initialiser", "Condition ?", "Corps", "Retour au test"]
  },
  for: {
    title: "Boucles for", takeaway: "Observer chaque étape : initialisation, condition, corps, mise à jour.",
    short: md(
      "## Une boucle à compteur",
      "`for` rassemble trois étapes dans une même ligne : **initialisation ; condition ; mise à jour**.",
      "",
      "```c",
      "int total = 0;",
      "for (int i = 1; i <= 4; i++) {",
      "    total += i;",
      "}",
      "printf(\"%d\\n\", total); // 10",
      "```",
      "",
      "L'initialisation n'a lieu **qu'une fois**. La condition est vérifiée **avant chaque tour**. La mise à jour arrive **après le corps**.",
      "",
      "Utilise l'animation ci-dessous pour suivre `i` et `total`, instruction par instruction."
    ),
    full: md(
      "## Lire la boucle comme une machine",
      "Au départ, `total = 0` et `i = 1`. Si `i <= 4`, on ajoute `i` à `total` ; ensuite `i++`. On recommence jusqu'à ce que le test échoue.",
      "",
      "## Équivalent avec while",
      "```c",
      "int total = 0;",
      "int i = 1;",
      "while (i <= 4) {",
      "    total += i;",
      "    i++;",
      "}",
      "```",
      "",
      "## Variantes utiles",
      "- `i--` pour compter à rebours.",
      "- `i += 2` pour avancer de deux en deux.",
      "- `break` quitte la boucle ; `continue` passe à la mise à jour (dans un `for`).",
      "",
      "## À retenir",
      "La portée de `int i` déclaré dans un `for` se limite à la boucle en C moderne. Attention à la dernière valeur : ici, `i` atteint `5` et la condition devient fausse."
    ),
    flow: ["Initialiser i", "Tester i <= 4", "Ajouter i", "i++ puis retour"]
  },
  arrays: {
    title: "Tableaux & chaînes", takeaway: "Rassembler plusieurs valeurs et parcourir leurs indices.",
    short: md(
      "## Un seul nom, plusieurs cases",
      "Un tableau contient plusieurs éléments **du même type**. Les indices commencent à `0`.",
      "",
      "```c",
      "int notes[3] = {12, 15, 9};",
      "int somme = 0;",
      "for (int i = 0; i < 3; i++) {",
      "    somme += notes[i];",
      "}",
      "```",
      "",
      "Dans `notes[3]`, les indices autorisés sont `0`, `1` et `2`."
    ),
    full: md(
      "## Attention aux limites",
      "Accéder à `notes[3]` dans cet exemple dépasse le tableau : c'est un comportement indéfini, pas une case supplémentaire.",
      "",
      "## Chaînes de caractères",
      "Une chaîne C est un tableau de `char` terminé par l'octet nul `'\\0'`.",
      "",
      "```c",
      "char mot[] = \"Coucou\";",
      "// 7 cases : 6 lettres + '\\0'",
      "```",
      "",
      "## Stratégie",
      "Pour lire un tableau, vérifie sa taille et utilise un compteur qui reste strictement inférieur au nombre d'éléments."
    ),
    flow: ["Indice 0", "Indice 1", "Indice 2", "Fin du tableau"]
  },
  functions: {
    title: "Fonctions", takeaway: "Donner un nom à une opération réutilisable.",
    short: md(
      "## Décomposer le problème",
      "Une fonction peut recevoir des **paramètres**, calculer quelque chose et **retourner** un résultat.",
      "",
      "```c",
      "int carre(int n) {",
      "    return n * n;",
      "}",
      "",
      "int main(void) {",
      "    printf(\"%d\\n\", carre(6));",
      "    return 0;",
      "}",
      "```",
      "",
      "`carre(6)` vaut `36` et s'utilise comme une expression."
    ),
    full: md(
      "## Signature",
      "`int carre(int n)` indique le type retourné (`int`), le nom (`carre`) et le type du paramètre (`int`).",
      "",
      "## Variables locales",
      "Le paramètre `n` n'est pas la variable de l'appelant : sa valeur est copiée lors de l'appel.",
      "",
      "## void",
      "Une fonction qui n'a pas de valeur de retour déclare le type `void`. `main(void)` indique explicitement l'absence de paramètres.",
      "",
      "## Conseil",
      "Une fonction courte qui accomplit une tâche identifiable sera plus facile à tester et à réutiliser."
    ),
    flow: ["Appel", "Paramètres", "return", "Reprise"]
  }
};
