# Learn Graph Algorithms 🎓

Application interactive pour apprendre et visualiser les algorithmes de graphes, construite avec React + TypeScript.

## 🚀 Démarrage rapide

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Build pour production
```bash
npm run build
```

### Prévisualisation du build
```bash
npm run preview
```

## 📦 Déploiement sur GitHub Pages

### Première fois
```bash
# Installer les dépendances
npm install

# Déployer sur GitHub Pages
npm run deploy
```

Votre site sera disponible sur : **https://chboudry.github.io/learnGraphAlg**

### Déploiements suivants
```bash
npm run deploy
```

## 🛠️ Technologies

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Neo4j NDL** (à venir) - Composants UI Neo4j
- **GitHub Pages** - Hébergement gratuit

## 📁 Structure du projet

```
learnGraphAlg/
├── src/
│   ├── App.tsx          # Composant principal
│   ├── main.tsx         # Point d'entrée
│   ├── assets/          # Images, SVG, etc.
│   └── components/      # Composants React (à créer)
├── public/              # Fichiers statiques
├── index.html           # Template HTML
├── vite.config.ts       # Configuration Vite
├── tsconfig.json        # Configuration TypeScript
└── package.json         # Dépendances et scripts
```

## 🎯 Prochaines étapes

- [ ] Ajouter Neo4j Design Library (@neo4j-ndl/react)
- [ ] Créer des visualisations de graphes
- [ ] Implémenter les algorithmes (BFS, DFS, Dijkstra, etc.)
- [ ] Ajouter des animations interactives

## 📝 License

MIT - Charles Boudry
