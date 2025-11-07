import React, { useState } from "react";
import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
import type { MouseEventCallbacks } from "@neo4j-nvl/react";
import type { HitTargets, Node, Relationship } from "@neo4j-nvl/base";

const LouvainAlgorithm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timelineHeight, setTimelineHeight] = useState(350);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  const [nodes] = useState<Node[]>([
    { id: '0', captions: [{ value: 'Node A' }], color: '#ff6b6b' },
    { id: '1', captions: [{ value: 'Node B' }], color: '#4ecdc4' },
    { id: '2', captions: [{ value: 'Node C' }], color: '#45b7d1' },
    { id: '3', captions: [{ value: 'Node D' }], color: '#f9ca24' },
    { id: '4', captions: [{ value: 'Node E' }], color: '#6c5ce7' }
  ]);
  
  const [relationships] = useState<Relationship[]>([
    { id: 'e1', from: '0', to: '1', captions: [{ value: 'connects' }] },
    { id: 'e2', from: '1', to: '2', captions: [{ value: 'connects' }] },
    { id: 'e3', from: '2', to: '3', captions: [{ value: 'connects' }] },
    { id: 'e4', from: '3', to: '4', captions: [{ value: 'connects' }] },
    { id: 'e5', from: '0', to: '3', captions: [{ value: 'connects' }] }
  ]);

  const algorithmSteps = [
    "Initial Graph",
    "Calculate Modularity", 
    "Community Detection - Pass 1",
    "Community Aggregation",
    "Community Detection - Pass 2", 
    "Final Communities"
  ];

  const stepDescriptions = [
    "Initial graph where all nodes are in their own community. Each node is considered as a distinct community.",
    "Calculate the modularity of the current graph to measure the quality of the community partition.",
    "First pass: each node evaluates whether it should join a neighbor's community to improve modularity.",
    "Aggregation of nodes belonging to the same community into super-nodes to create a new graph.",
    "Second pass: apply community detection on the aggregated graph.",
    "Final result with detected communities colored according to their membership."
  ];

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  // Callbacks d'événements souris pour l'interactivité
  const mouseEventCallbacks: MouseEventCallbacks = {
    onNodeClick: (node: Node, _hitTargets: HitTargets, _originalEvent: MouseEvent) => {
      setSelectedNode(node);
      console.log('Node clicked:', node.id);
    },
    onNodeDoubleClick: (node: Node, _hitTargets: HitTargets, _originalEvent: MouseEvent) => {
      console.log('Node double-clicked:', node.id);
    },
    onDrag: (draggedNodes: Node[], _originalEvent: MouseEvent) => {
      console.log('Nodes dragged:', draggedNodes.map(n => n.id));
    },
    onHover: (_element: Node | Relationship, _hitTargets: HitTargets, _originalEvent: MouseEvent) => {
      // Changement de curseur au survol
      document.body.style.cursor = 'pointer';
    },
    onPan: (_pan: { x: number; y: number }, _originalEvent: MouseEvent) => {
      // Remettre le curseur normal lors du panoramique
      document.body.style.cursor = 'default';
    },
    onZoom: (zoomLevel: number, _originalEvent: MouseEvent) => {
      console.log('Zoom level:', zoomLevel);
    },
    onCanvasClick: (_originalEvent: MouseEvent) => {
      // Remettre le curseur normal et désélectionner le nœud
      document.body.style.cursor = 'default';
      setSelectedNode(null);
    }
  };

  const detailsPanelWidth = selectedNode ? 320 : 0; // Largeur panneau + marges

  return (
    <>
      {/* Graph Area - avec dimensions explicites */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '280px',
        width: `calc(100vw - 280px - ${detailsPanelWidth}px)`, // Largeur réduite si panneau ouvert
        height: `calc(100vh - ${timelineHeight}px)`, // Hauteur explicite
        background: '#242424',
        transition: 'width 0.3s ease'
      }}>
        <InteractiveNvlWrapper
          nvlOptions={{ 
            initialZoom: 1.5,
            renderer: 'canvas'
          }}
          nodes={nodes}
          rels={relationships}
          mouseEventCallbacks={mouseEventCallbacks}
        />
      </div>

      {/* Panneau de détails du nœud - Fenêtre flottante */}
      {selectedNode && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '10px',
          bottom: `${timelineHeight + 20}px`,
          width: `${detailsPanelWidth - 30}px`,
          background: '#242424', // Couleur de fond du graphique
          padding: '10px',
          zIndex: 999
        }}>
          {/* Contenu de la fenêtre flottante */}
          <div style={{
            background: '#1e1e1e',
            borderRadius: '12px',
            border: '1px solid #444',
            height: '100%',
            padding: '20px',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
          {/* Bouton de fermeture */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #333',
            paddingBottom: '15px'
          }}>
            <h3 style={{ 
              color: '#fff', 
              margin: 0, 
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Node Details
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                background: 'none',
                border: '1px solid #555',
                color: '#ccc',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Propriétés du nœud */}
          <div style={{ color: '#ccc' }}>
            <div style={{ 
              marginBottom: '15px',
              padding: '15px',
              background: '#2a2a2a',
              borderRadius: '8px',
              border: '1px solid #444'
            }}>
              <h4 style={{ 
                color: selectedNode.color || '#4ecdc4', 
                margin: '0 0 10px 0',
                fontSize: '16px'
              }}>
                {selectedNode.captions?.[0]?.value || `Node ${selectedNode.id}`}
              </h4>
              
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#4ecdc4' }}>ID:</strong> {selectedNode.id}
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#4ecdc4' }}>Color:</strong> 
                  <span style={{ 
                    marginLeft: '10px',
                    padding: '2px 8px',
                    background: selectedNode.color || '#666',
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}>
                    {selectedNode.color || 'Undefined'}
                  </span>
                </div>

                {selectedNode.captions && selectedNode.captions.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#4ecdc4' }}>Labels:</strong>
                    <div style={{ marginTop: '5px' }}>
                      {selectedNode.captions.map((caption, index) => (
                        <span 
                          key={index}
                          style={{ 
                            background: '#333',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            marginRight: '5px',
                            fontSize: '12px'
                          }}
                        >
                          {caption.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.size && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#4ecdc4' }}>Size:</strong> {selectedNode.size}
                  </div>
                )}

                {(selectedNode.x !== undefined && selectedNode.y !== undefined) && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#4ecdc4' }}>Position:</strong> 
                    <br />
                    <span style={{ fontSize: '12px', color: '#aaa' }}>
                      X: {selectedNode.x?.toFixed(2)}, Y: {selectedNode.y?.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Timeline Area - fixée en bas */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '280px',
        right: 0,
        height: `${timelineHeight}px`,
        background: '#1a1a1a',
        borderTop: '1px solid #333',
        padding: '15px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingBottom: '10px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}>
        {/* Resize Handle */}
        <div 
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '10px',
            background: '#333',
            borderRadius: '5px',
            cursor: 'ns-resize',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onMouseDown={(e) => {
            const startY = e.clientY;
            const startHeight = timelineHeight;
            
            const handleMouseMove = (e: MouseEvent) => {
              const newHeight = Math.max(120, Math.min(280, startHeight - (e.clientY - startY)));
              setTimelineHeight(newHeight);
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div style={{ 
            width: '20px', 
            height: '2px', 
            background: '#666'
          }} />
        </div>

        {/* Algorithm title */}
        <div style={{ 
          color: '#fff', 
          fontSize: '18px', 
          fontWeight: 'bold',
          marginBottom: '15px',
          marginLeft: '20px',
          textAlign: 'left'
        }}>
          Louvain Algorithm
        </div>

        {/* Timeline Slider avec points */}
        <div style={{ 
          marginBottom: '15px',
          marginLeft: '20px',
          marginRight: '20px',
          position: 'relative'
        }}>
          <input
            type="range"
            min="0"
            max={algorithmSteps.length - 1}
            value={currentStep}
            onChange={(e) => handleStepChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              background: '#333',
              borderRadius: '3px',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none'
            }}
          />
          
          {/* Points pour chaque étape */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '8px',
            position: 'relative'
          }}>
            {algorithmSteps.map((step, index) => (
              <div 
                key={index}
                onClick={() => setCurrentStep(index)}
                style={{ 
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: index === currentStep ? '#4ecdc4' : '#555',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  color: '#fff',
                  fontWeight: 'bold',
                  border: index === currentStep ? '2px solid #fff' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                title={step}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Current step and description */}
        <div style={{ 
          color: '#ccc', 
          fontSize: '14px',
          lineHeight: '1.4',
          marginLeft: '20px',
          marginRight: '20px'
        }}>
          <div style={{ 
            color: '#4ecdc4', 
            fontSize: '16px', 
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Step {currentStep + 1}: {algorithmSteps[currentStep]}
          </div>
          <div style={{ 
            color: '#aaa',
            fontSize: '13px'
          }}>
            {stepDescriptions[currentStep]}
          </div>
        </div>
      </div>
    </>
  );
};

export default LouvainAlgorithm;
