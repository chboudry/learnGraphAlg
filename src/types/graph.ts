import type { Node, Relationship } from "@neo4j-nvl/base";

export interface GraphData {
  nodes: Node[];
  relationships: Relationship[];
}

export interface AlgorithmStep {
  name: string;
  description: string;
  nodes: Node[];
  relationships: Relationship[];
}

export interface LouvainGraphData {
  title: string;
  category: string;
  description: string;
  directed?: boolean;
  steps: AlgorithmStep[];
}