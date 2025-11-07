export interface AlgorithmCategory {
  id: string;
  name: string;
  algorithms: Algorithm[];
}

export interface Algorithm {
  id: string;
  name: string;
  enabled: boolean;
}

export const algorithmCategories: AlgorithmCategory[] = [
  {
    id: 'pathfinding',
    name: 'Path Finding',
    algorithms: [
      { id: 'dijkstra', name: 'Dijkstra', enabled: false },
      { id: 'astar', name: 'A*', enabled: false },
      { id: 'yens', name: "Yen's K-shortest paths", enabled: false },
      { id: 'allshortestpaths', name: 'All Shortest Paths', enabled: false },
    ],
  },
  {
    id: 'centrality',
    name: 'Centrality',
    algorithms: [
      { id: 'betweenness', name: 'Betweenness Centrality', enabled: false },
      { id: 'closeness', name: 'Closeness Centrality', enabled: false },
      { id: 'degree', name: 'Degree Centrality', enabled: false },
      { id: 'eigenvector', name: 'Eigenvector Centrality', enabled: false },
      { id: 'pagerank', name: 'PageRank', enabled: false },
    ],
  },
  {
    id: 'community',
    name: 'Community Detection',
    algorithms: [
      { id: 'louvain', name: 'Louvain', enabled: true }, // Only enabled algorithm
      { id: 'leiden', name: 'Leiden', enabled: false },
      { id: 'weakly-connected', name: 'Weakly Connected Components', enabled: false },
      { id: 'strongly-connected', name: 'Strongly Connected Components', enabled: false },
      { id: 'triangle-count', name: 'Triangle Count', enabled: false },
      { id: 'local-clustering', name: 'Local Clustering Coefficient', enabled: false },
    ],
  },
  {
    id: 'similarity',
    name: 'Similarity',
    algorithms: [
      { id: 'node-similarity', name: 'Node Similarity', enabled: false },
      { id: 'jaccard', name: 'Jaccard Similarity', enabled: false },
      { id: 'cosine', name: 'Cosine Similarity', enabled: false },
      { id: 'pearson', name: 'Pearson Similarity', enabled: false },
    ],
  },
  {
    id: 'link-prediction',
    name: 'Link Prediction',
    algorithms: [
      { id: 'adamic-adar', name: 'Adamic Adar', enabled: false },
      { id: 'common-neighbors', name: 'Common Neighbors', enabled: false },
      { id: 'preferential-attachment', name: 'Preferential Attachment', enabled: false },
      { id: 'resource-allocation', name: 'Resource Allocation', enabled: false },
    ],
  },
];