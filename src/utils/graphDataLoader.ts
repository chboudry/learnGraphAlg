import type { GraphData, LouvainGraphData, AlgorithmStep } from "../types/graph";

/**
 * Fonction utilitaire pour charger les données de graphique depuis un fichier JSON
 * @param graphName - Nom du fichier de graphique (sans l'extension .json)
 * @returns Promise<GraphData> - Les données du graphique
 */
export const loadGraphData = async (graphName: string): Promise<GraphData> => {
  try {
    const module = await import(`../data/${graphName}.json`);
    return module.default as GraphData;
  } catch (error) {
    console.error(`Erreur lors du chargement du graphique ${graphName}:`, error);
    throw new Error(`Impossible de charger le graphique ${graphName}`);
  }
};

/**
 * Fonction pour valider les données de graphique simple
 * @param data - Les données à valider
 * @returns boolean - true si les données sont valides
 */
export const validateGraphData = (data: any): data is GraphData => {
  return (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.nodes) &&
    Array.isArray(data.relationships) &&
    data.nodes.every((node: any) => 
      node && 
      typeof node.id === 'string' &&
      Array.isArray(node.captions)
    ) &&
    data.relationships.every((rel: any) => 
      rel && 
      typeof rel.id === 'string' &&
      typeof rel.from === 'string' &&
      typeof rel.to === 'string'
    )
  );
};

/**
 * Fonction pour valider une étape d'algorithme
 * @param step - L'étape à valider
 * @returns boolean - true si l'étape est valide
 */
export const validateAlgorithmStep = (step: any): step is AlgorithmStep => {
  return (
    step &&
    typeof step === 'object' &&
    typeof step.name === 'string' &&
    typeof step.description === 'string' &&
    validateGraphData(step)
  );
};

/**
 * Fonction pour valider les données d'algorithme Louvain
 * @param data - Les données à valider
 * @returns boolean - true si les données sont valides
 */
export const validateLouvainGraphData = (data: any): data is LouvainGraphData => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    Array.isArray(data.steps) &&
    data.steps.every((step: any) => validateAlgorithmStep(step))
  );
};