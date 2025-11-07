import { useState } from 'react';
import './GraphVisualizer.css';

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: number;
  to: number;
}

const GraphVisualizer = () => {
  const [nodes] = useState<Node[]>([
    { id: 1, x: 100, y: 100, label: 'A' },
    { id: 2, x: 300, y: 100, label: 'B' },
    { id: 3, x: 200, y: 250, label: 'C' },
    { id: 4, x: 400, y: 250, label: 'D' },
  ]);

  const [edges] = useState<Edge[]>([
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
  ]);

  const getNodeById = (id: number): Node | undefined => {
    return nodes.find(node => node.id === id);
  };

  return (
    <div className="graph-visualizer">
      <h2>Exemple de Graphe</h2>
      <svg width="500" height="350" className="graph-svg">
        {/* Dessiner les arêtes */}
        <g className="edges">
          {edges.map((edge, index) => {
            const fromNode = getNodeById(edge.from);
            const toNode = getNodeById(edge.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={index}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className="edge"
              />
            );
          })}
        </g>

        {/* Dessiner les nœuds */}
        <g className="nodes">
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={25}
                className="node"
              />
              <text
                x={node.x}
                y={node.y}
                className="node-label"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <div className="graph-info">
        <p><strong>Nœuds:</strong> {nodes.length}</p>
        <p><strong>Arêtes:</strong> {edges.length}</p>
        <p className="hint">
          Prochainement : algorithmes BFS, DFS, Dijkstra, et plus encore !
        </p>
      </div>
    </div>
  );
};

export default GraphVisualizer;
