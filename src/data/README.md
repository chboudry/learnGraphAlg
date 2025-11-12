# Structure des données d'algorithmes

Cette documentation explique la nouvelle structure JSON pour les algorithmes de graphes.

## Structure générale

Chaque algorithme est défini dans un fichier JSON avec la structure suivante :

```json
{
  "title": "Nom de l'algorithme",
  "steps": [
    {
      "name": "Nom de l'étape",
      "description": "Description de ce qui se passe dans cette étape",
      "nodes": [...],
      "relationships": [...]
    }
  ]
}
```

## Types TypeScript

Les types suivants sont définis dans `src/types/graph.ts` :

- `AlgorithmStep` : Définit une étape d'algorithme avec son nom, description, nœuds et relations
- `LouvainGraphData` : Structure complète pour un algorithme avec titre et étapes
- `GraphData` : Structure simple avec juste nœuds et relations

## Fichiers d'exemples

### Louvain Algorithm (`src/data/louvain.json`)
- **Étapes** : 6 étapes montrant l'évolution de la détection de communautés
- **Visualisation** : Couleurs changeantes pour montrer l'appartenance aux communautés
- **Données** : Nœuds et relations évoluent à chaque étape

### PageRank Algorithm (`src/data/pagerank.json`)
- **Étapes** : 3 étapes montrant le calcul itératif du PageRank
- **Visualisation** : Taille des nœuds proportionnelle au score PageRank
- **Données** : Même structure de graphe, valeurs PageRank évolutives

### Dijkstra Algorithm (`src/data/dijkstra.json`)
- **Étapes** : 4 étapes montrant l'algorithme de plus court chemin
- **Visualisation** : Couleurs verte (visité), orange (en cours), grise (non traité)
- **Données** : Graphe pondéré avec distances évolutives

## Utilisation dans les composants

1. **Import du JSON** : `import data from "../data/algorithm-name.json"`
2. **Validation** : `validateLouvainGraphData(data)`
3. **Extraction des données** : 
   - Titre : `data.title`
   - Étapes : `data.steps.map(step => step.name)`
   - Descriptions : `data.steps.map(step => step.description)`
4. **Mise à jour dynamique** : Changer les nœuds/relations selon l'étape sélectionnée

## Architecture générique

### 🏗️ **Composant AlgorithmRenderer** :
L'application utilise un seul composant générique `AlgorithmRenderer.tsx` qui :
- **Charge dynamiquement** les données JSON basées sur l'`algorithmId`
- **Valide automatiquement** la structure des données
- **Gère l'état** des étapes, nœuds sélectionnés, profil
- **Rend uniformément** tous les algorithmes avec la même interface

### 📦 **Import dynamique** :
```tsx
const module = await import(`../data/${algorithmId}.json`);
```
- Chargement à la demande (lazy loading)
- Code splitting automatique par Vite
- Gestion d'erreur intégrée

## Avantages

- ✅ **Un seul composant** : Maintenance centralisée de la logique de rendu
- ✅ **Séparation des données** : Logique séparée des données
- ✅ **Réutilisabilité** : Même structure pour tous les algorithmes
- ✅ **Maintenabilité** : Facile de modifier les données sans toucher au code
- ✅ **Type Safety** : Validation TypeScript complète
- ✅ **Évolutivité** : Facile d'ajouter de nouveaux algorithmes
- ✅ **Performance** : Code splitting automatique des données JSON

## Algorithmes disponibles dans le menu

### ✅ **Algorithmes implémentés** :
- **Louvain** (Community Detection) - Détection de communautés avec 6 étapes
- **PageRank** (Centrality) - Calcul d'importance des pages avec 3 étapes
- **Dijkstra** (Pathfinding) - Plus court chemin avec 4 étapes

### 🔄 **Navigation** :
- Les algorithmes activés apparaissent dans leurs catégories respectives
- Sélection via `AlgorithmNavigation.tsx`
- Routing via `App.tsx` avec switch case sur l'ID de l'algorithme

## Ajout d'un nouvel algorithme

1. **Créer le fichier JSON** dans `src/data/[algorithm-name].json`
2. **Suivre la structure** définie avec `title` et `steps`
3. **Chaque étape** doit avoir `name`, `description`, `nodes`, `relationships`
4. **Activer dans le menu** : `src/data/algorithms.ts` → `enabled: true`
5. **Créer le composant** : `src/components/[AlgorithmName]Algorithm.tsx`
6. **Ajouter le routing** : `src/App.tsx` → import + case dans switch
7. **Valider** avec `validateLouvainGraphData()`