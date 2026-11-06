export const curriculum=(()=>{
const modules=[
["start","Les premiers pas","Écrire, afficher, lire des valeurs"],
["variables","Variables et calculs","Types, opérateurs et expressions"],
["conditions","Conditions","if, else et comparaisons"],
["while","Boucles while","Répéter jusqu’à une condition"],
["for","Boucles for","Compteurs et accumulations"],
["arrays","Tableaux et chaînes","Manipuler plusieurs données"],
["functions","Fonctions","Découper et réutiliser son code"]].map(([id,title,subtitle])=>({id,title,subtitle}));
const boiler='#include <stdio.h>\n\nint main(void) {\n    // Écris ton code ici.\n    return 0;\n}\n';
const specs=[
["start","Bonjour C","Affiche exactement Bonjour C.","","Bonjour C"],
["start","Une nouvelle ligne","Affiche Ligne 1, puis Ligne 2 sur deux lignes.","","Ligne 1\nLigne 2"],
["start","Afficher un entier","Affiche le nombre 42.","","42"],
["start","Lire un entier","Lis un entier et affiche sa valeur.","7","7"],
["variables","Addition","Lis deux entiers, affiche leur somme.","3 7","10"],
["variables","Différence","Lis deux entiers et affiche le premier moins le second.","9 4","5"],
["variables","Multiplication","Lis deux entiers et affiche leur produit.","6 7","42"],
["variables","Division entière","Lis deux entiers non nuls, affiche leur quotient entier.","17 5","3"],
["variables","Reste de division","Lis deux entiers, affiche le reste de leur division.","17 5","2"],
["variables","Conversion secondes","Lis un nombre de secondes et affiche le nombre de minutes entières.","125","2"],
["conditions","Positif ou négatif","Lis un entier. Affiche positif s’il est supérieur ou égal à zéro, sinon negatif.","-8","negatif"],
["conditions","Pair ou impair","Lis un entier et affiche pair ou impair.","14","pair"],
["conditions","Le plus grand","Lis deux entiers et affiche le plus grand.","8 15","15"],
["conditions","Trois valeurs","Lis trois entiers et affiche le plus grand.","3 12 9","12"],
["conditions","Année bissextile","Lis une année, affiche oui si elle est bissextile, sinon non.","2024","oui"],
["while","Compter jusqu’à n","Lis n, affiche les entiers de 1 à n séparés par un espace, sans espace final.","4","1 2 3 4"],
["while","Somme jusqu’à n","Lis n et affiche la somme de 1 à n.","5","15"],
["while","Compter les chiffres","Lis un entier positif et affiche son nombre de chiffres.","1234","4"],
["while","Inverser les chiffres","Lis un entier positif et affiche ses chiffres à l’envers comme entier.","1234","4321"],
["for","Carrés","Lis n et affiche la somme des carrés de 1 à n.","3","14"],
["for","Table de multiplication","Lis n et affiche n multiplié par les entiers de 1 à 3, séparés par un espace.","5","5 10 15"],
["for","Factorielle","Lis n entre 0 et 10 et affiche n!.","5","120"],
["for","Somme des pairs","Lis n et affiche la somme des entiers pairs de 1 à n.","6","12"],
["for","Nombre premier","Lis n positif et affiche oui si n est premier, sinon non.","7","oui"],
["arrays","Somme d’un tableau","Lis n puis n entiers et affiche leur somme.","4 1 2 3 4","10"],
["arrays","Maximum d’un tableau","Lis n puis n entiers et affiche la plus grande valeur.","4 2 9 1 3","9"],
["arrays","Compter les positifs","Lis n puis n entiers, affiche combien sont strictement positifs.","5 -1 0 4 5 -2","2"],
["arrays","Longueur d’une chaîne","Lis un mot sans espaces, affiche sa longueur sans utiliser strlen.","bonjour","7"],
["functions","Valeur absolue","Écris une fonction qui retourne la valeur absolue d’un entier. Lis un entier puis affiche sa valeur absolue.","-8","8"],
["functions","Carré avec fonction","Écris une fonction qui calcule le carré d’un entier. Lis n et affiche son carré.","6","36"]
];
const revisions=[
["Afficher un message","Affiche Revision C.","","Revision C"],
["Valeur entière","Affiche 2026.","","2026"],
["Afficher deux lignes","Affiche Bonjour puis Monde sur deux lignes.","","Bonjour\nMonde"],
["Lire et afficher","Lis un entier, affiche-le.","19","19"],
["Addition de deux nombres","Lis deux entiers et affiche leur somme.","12 8","20"],
["Soustraction","Lis deux entiers et affiche leur différence.","13 5","8"],
["Produit","Lis deux entiers et affiche leur produit.","4 7","28"],
["Moyenne entière","Lis deux entiers et affiche leur moyenne entière.","7 8","7"],
["Reste modulo","Lis deux entiers et affiche leur reste.","20 6","2"],
["Conversion heures","Lis un nombre de minutes, affiche le nombre d’heures entières.","130","2"],
["Tester la parité","Lis un entier, affiche pair ou impair.","9","impair"],
["Tester le signe","Lis un entier, affiche positif, negatif ou nul.","0","nul"],
["Minimum","Lis deux entiers et affiche le plus petit.","8 3","3"],
["Note validée","Lis une note entière, affiche admis si elle vaut au moins 10, sinon refuse.","12","admis"],
["Compter avec while","Lis n et affiche les nombres de 1 à n séparés par un espace.","3","1 2 3"],
["Somme avec while","Lis n et affiche la somme de 1 à n.","4","10"],
["Compter à rebours","Lis n et affiche les entiers de n à 1 séparés par un espace.","4","4 3 2 1"],
["Multiples de 3","Lis n et affiche le nombre de multiples de 3 entre 1 et n.","10","3"],
["Factorielle avec for","Lis n et affiche n!.","4","24"],
["Somme des chiffres","Lis un entier positif et affiche la somme de ses chiffres.","1234","10"]
];
const starter=boiler;
const course=specs.map(([module,title,prompt,input,expected],i)=>({id:'c'+String(i+1).padStart(2,'0'),module,title,prompt,hint:'Utilise printf et scanf si nécessaire, puis la structure adaptée à la consigne.',concept:'Tu peux tester ton programme sur plusieurs entrées avant de le valider.',starter,tests:[{input,expected:expected+'\n'}]}));
const revision=revisions.map(([title,prompt,input,expected],i)=>({id:'r'+String(i+1).padStart(2,'0'),module:'revision',title,prompt,hint:'Commence par identifier les entrées et la sortie attendue.',concept:'Exercice de soutien : retravaille les fondamentaux de la programmation C.',starter,tests:[{input,expected:expected+'\n'}]}));
return {modules,lessons:{course,revision}};
})();

// v2 · Practical situations instead of isolated arithmetic operations.
// Keep lesson IDs unchanged: existing browser progress and backups remain valid.
const richerExercises = {
  c05: {
    title: 'Le budget du déjeuner',
    prompt: 'Chaque personne achète un sandwich et une boisson. Lis leur prix respectif, puis le nombre de personnes (3 entiers). Affiche le prix total. Exemple : 7 2 3 → 27.',
    hint: 'Calcule (sandwich + boisson) × personnes.',
    tests: [['7 2 3','27'], ['6 4 2','20'], ['0 3 5','15']]
  },
  c06: {
    title: 'La monnaie à rendre',
    prompt: 'À la caisse, lis le prix d’un article et la somme payée (2 entiers, paiement suffisant). Affiche la monnaie à rendre. Exemple : 12 30 → 18.',
    hint: 'La monnaie est la somme payée moins le prix.',
    tests: [['12 30','18'], ['25 25','0'], ['14 20','6']]
  },
  c07: {
    title: 'Les places du concert',
    prompt: 'Une salle a plusieurs rangées de sièges. Lis le nombre de rangées, les places par rangée et les places déjà réservées. Affiche les places encore disponibles. Exemple : 8 12 35 → 61.',
    hint: 'Commence par calculer la capacité totale.',
    tests: [['8 12 35','61'], ['3 20 6','54'], ['1 5 5','0']]
  },
  c08: {
    title: 'Partager des bonbons',
    prompt: 'Lis un nombre de bonbons et un nombre d’enfants (strictement positif). Partage équitablement : affiche le nombre reçu par enfant, puis le nombre restant, séparés par un espace. Exemple : 25 4 → 6 1.',
    hint: 'Division entière pour la part de chacun, modulo pour le reste.',
    tests: [['25 4','6 1'], ['24 6','4 0'], ['5 8','0 5']]
  },
  c09: {
    title: 'Un chronomètre en minutes',
    prompt: 'Lis une durée en secondes (entier positif ou nul). Affiche les minutes complètes et les secondes restantes, séparées par un espace. Exemple : 125 → 2 5.',
    hint: 'Utilise / 60 et % 60.',
    tests: [['125','2 5'], ['60','1 0'], ['59','0 59'], ['3601','60 1']]
  }
};
for (const lesson of curriculum.lessons.course) {
  lesson.concept = '';
  const upgrade = richerExercises[lesson.id];
  if (!upgrade) continue;
  const { tests, ...rest } = upgrade;
  Object.assign(lesson, rest, {
    tests: tests.map(([input, expected]) => ({ input, expected: expected + '\n' }))
  });
}

// Optional branches never gate the main storyline. IDs c01–c30 remain stable.
const mainIds = new Set(['c01','c03','c05','c09','c10','c12','c15','c16','c18','c19','c20','c23','c24','c25','c27','c28','c29','c30']);
for(const lesson of curriculum.lessons.course)lesson.kind=mainIds.has(lesson.id)?'main':'side';
const goldenSpecs=[
  ['g01','variables','Le chronomètre parfait','Lis une durée en secondes (entier positif ou nul). Affiche heures, minutes et secondes séparées par un espace. Exemple : 3665 → 1 1 5.','3665','1 1 5','Utilise deux divisions et deux modulos.'],
  ['g02','for','La somme mystérieuse','Lis n entre 1 et 100. Affiche la somme des carrés des entiers impairs de 1 à n. Exemple : 5 → 35.','5','35','Parcours les nombres impairs avec un pas de 2.'],
  ['g03','arrays','Le deuxième plus grand','Lis n entre 2 et 100, puis n entiers distincts. Affiche la deuxième plus grande valeur. Exemple : 5 3 9 2 7 4 → 7.','5 3 9 2 7 4','7','Garde en mémoire les deux plus grandes valeurs rencontrées.']
];
for(const [id,module,title,prompt,input,expected,hint] of goldenSpecs){
 curriculum.lessons.course.push({id,module,title,prompt,hint,concept:'Défi doré : une variante plus exigeante, facultative et sans indice de solution.',kind:'gold',starter:'#include <stdio.h>\\n\\nint main(void) {\\n    // À toi de jouer !\\n    return 0;\\n}\\n',tests:[{input,expected:expected+'\\n'}]});
}
