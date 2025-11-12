import { useState, useEffect } from "react";
import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
import type { MouseEventCallbacks } from "@neo4j-nvl/react";
import type { HitTargets, Node, Relationship } from "@neo4j-nvl/base";
import type { LouvainGraphData } from "../types/graph";
import { validateLouvainGraphData } from "../utils/graphDataLoader";
import ReactMarkdown from 'react-markdown';

interface AlgorithmRendererProps {
  algorithmId: string;
}

const AlgorithmRenderer = ({ algorithmId }: AlgorithmRendererProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timelineHeight, setTimelineHeight] = useState(350);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [algorithmData, setAlgorithmData] = useState<LouvainGraphData | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Chargement dynamique des données d'algorithme avec HMR automatique
  useEffect(() => {
    const loadAlgorithmData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Import dynamique du fichier JSON avec hot reloading
        // Le paramètre ?init rend le fichier JSON hot-reloadable dans Vite
        const module = await import(`../data/${algorithmId}.json?init`);
        const data = module.default as LouvainGraphData;
        
        // Validation des données
        if (!validateLouvainGraphData(data)) {
          console.error(`Les données de l'algorithme ${algorithmId} ne sont pas valides`);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        setAlgorithmData(data);
        
        // Initialiser avec la première étape
        if (data.steps && data.steps.length > 0) {
          setNodes(data.steps[0].nodes);
          setRelationships(data.steps[0].relationships);
        }
        
        // Reset de l'étape lors du changement d'algorithme
        setCurrentStep(0);
        setSelectedNode(null);
        setShowProfile(false);
        setIsLoading(false);
        
        console.log(`📋 Données de l'algorithme ${algorithmId} chargées avec HMR activé`);
        
      } catch (error) {
        console.error(`Erreur lors du chargement de l'algorithme ${algorithmId}:`, error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadAlgorithmData();
  }, [algorithmId]);

  // Mise à jour des données quand l'étape change
  const handleStepChange = (newStep: number) => {
    if (!algorithmData) return;
    
    setCurrentStep(newStep);
    const newStepData = algorithmData.steps[newStep];
    if (newStepData) {
      setNodes(newStepData.nodes);
      setRelationships(newStepData.relationships);
    }
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

  const detailsPanelWidth = (selectedNode || showProfile) ? 320 : 0; // Largeur panneau + marges

  // Affichage de chargement ou d'erreur
  if (isLoading) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: '280px',
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#242424',
        color: '#ccc',
        fontSize: '18px'
      }}>
        Chargement de l'algorithme {algorithmId}...
      </div>
    );
  }

  if (hasError || !algorithmData) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: '280px',
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#242424',
        color: '#ccc',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>
          🚧 Algorithm under development
        </div>
        <div style={{ fontSize: '16px', marginBottom: '8px' }}>
          The algorithm <strong>{algorithmId}</strong> is not yet implemented.
        </div>
        <div style={{ fontSize: '14px', color: '#aaa' }}>
          Please select another algorithm from the navigation menu.
        </div>
      </div>
    );
  }

  const algorithmTitle = algorithmData.title;
  const algorithmSteps = algorithmData.steps.map(step => step.name);
  const stepDescriptions = algorithmData.steps.map(step => step.description);

  return (
    <>
      {/* Icône GitHub flottante */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: detailsPanelWidth > 0 ? `${detailsPanelWidth + 20}px` : '20px',
        width: '50px',
        height: '50px',
        background: '#242424',
        padding: '8px',
        borderRadius: '50%',
        zIndex: 1001,
        transition: 'right 0.3s ease'
      }}>
        <img 
          onClick={() => {
            setSelectedNode(null);
            setShowProfile(true);
          }}
          src="./src/assets/me.jpeg"
          alt="Charles Boudry"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer',
            border: '2px solid #555',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#666';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#555';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </div>

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

      {/* Panneau de détails - Fenêtre flottante */}
      {(selectedNode || showProfile) && (
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
              {showProfile ? 'Developer Profile' : 'Node Details'}
            </h3>
            <button
              onClick={() => {
                setSelectedNode(null);
                setShowProfile(false);
              }}
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

          {/* Contenu dynamique */}
          <div style={{ color: '#ccc' }}>
            {showProfile ? (
              // Profil personnel
              <div style={{ 
                marginBottom: '15px',
                padding: '20px'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <img 
                    src="./src/assets/me.jpeg"
                    alt="Charles Boudry"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      margin: '0 auto 15px',
                      display: 'block',
                      border: '3px solid #666'
                    }}
                  />
                  <h4 style={{ 
                    color: '#ccc', 
                    margin: '0 0 5px 0',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    Charles Boudry
                  </h4>
                  <div style={{ 
                    color: '#aaa',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}>
                    Senior Consultant Neo4j
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                  {/* Icône LinkedIn */}
                  <a 
                    href="https://www.linkedin.com/in/boudry-charles/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: '#0077b5',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 119, 181, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  
                  {/* Icône GitHub */}
                  <a 
                    href="https://github.com/chboudry/learnGraphAlg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: '#333',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.background = '#444';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = '#333';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ) : selectedNode ? (
              // Détails du nœud
              <div style={{ 
                marginBottom: '15px',
                padding: '15px',
                background: '#2a2a2a',
                borderRadius: '8px',
                border: '1px solid #444'
              }}>
                <h4 style={{ 
                  color: selectedNode.color || '#ccc', 
                  margin: '0 0 10px 0',
                  fontSize: '16px'
                }}>
                  {selectedNode.captions?.[0]?.value || `Node ${selectedNode.id}`}
                </h4>
                
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#ccc' }}>ID:</strong> {selectedNode.id}
                  </div>

                  {selectedNode.captions && selectedNode.captions.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#ccc' }}>Labels:</strong>
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
                      <strong style={{ color: '#ccc' }}>Size:</strong> {selectedNode.size}
                    </div>
                  )}

                  {(selectedNode.x !== undefined && selectedNode.y !== undefined) && (
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#ccc' }}>Position:</strong> 
                      <br />
                      <span style={{ fontSize: '12px', color: '#aaa' }}>
                        X: {selectedNode.x?.toFixed(2)}, Y: {selectedNode.y?.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
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
              const newHeight = Math.max(120, Math.min(600, startHeight - (e.clientY - startY)));
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

        {/* Scrollable Content Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '15px 40px 10px 40px',
          scrollBehavior: 'smooth'
        }}>
          {/* Algorithm title */}
          <div style={{ 
            color: '#fff', 
            fontSize: '18px', 
            fontWeight: 'bold',
            marginBottom: '8px',
            marginLeft: '20px',
            textAlign: 'left'
          }}>
            {algorithmTitle}
          </div>

        {/* Category badge */}
        <div style={{
          marginLeft: '20px',
          marginBottom: '15px'
        }}>
          <span style={{
            background: '#4ecdc4',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {algorithmData.category}
          </span>
        </div>

        {/* Algorithm description */}
        <div style={{
          marginLeft: '20px',
          marginRight: '20px',
          marginBottom: '20px',
          padding: '15px',
          background: '#1a1a1a',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 style={{color: '#fff', fontSize: '16px', margin: '0 0 10px 0'}}>{children}</h1>,
              h2: ({children}) => <h2 style={{color: '#fff', fontSize: '15px', margin: '10px 0 8px 0'}}>{children}</h2>,
              h3: ({children}) => <h3 style={{color: '#4ecdc4', fontSize: '14px', margin: '8px 0 6px 0'}}>{children}</h3>,
              p: ({children}) => <p style={{color: '#ccc', fontSize: '13px', lineHeight: '1.5', margin: '0 0 8px 0'}}>{children}</p>,
              strong: ({children}) => <strong style={{color: '#fff'}}>{children}</strong>,
              em: ({children}) => <em style={{color: '#f39c12'}}>{children}</em>,
              code: ({children}) => <code style={{background: '#333', color: '#4ecdc4', padding: '2px 4px', borderRadius: '3px', fontSize: '12px'}}>{children}</code>,
              pre: ({children}) => <pre style={{background: '#0d1117', padding: '10px', borderRadius: '6px', overflow: 'auto', margin: '8px 0'}}>{children}</pre>,
              ul: ({children}) => <ul style={{color: '#ccc', fontSize: '13px', margin: '0 0 8px 0', paddingLeft: '20px'}}>{children}</ul>,
              li: ({children}) => <li style={{marginBottom: '4px'}}>{children}</li>
            }}
          >
            {algorithmData.description}
          </ReactMarkdown>
        </div>

        {/* Wizard Timeline Bar */}
        <div style={{ 
          marginBottom: '15px',
          marginLeft: '20px',
          marginRight: '20px',
          position: 'relative'
        }}>
          {/* Background track */}
          <div style={{
            position: 'relative',
            height: '6px',
            background: '#333',
            borderRadius: '3px',
            margin: '20px 0'
          }}>
            {/* Progress line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${(currentStep / (algorithmSteps.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg, #666, #888)',
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
            
            {/* Step points directly on the bar */}
            {algorithmSteps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              const leftPosition = (index / (algorithmSteps.length - 1)) * 100;
              
              return (
                <div
                  key={index}
                  onClick={() => handleStepChange(index)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${leftPosition}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isCurrent ? '24px' : '20px',
                    height: isCurrent ? '24px' : '20px',
                    borderRadius: '50%',
                    background: isCompleted ? (isCurrent ? '#666' : '#888') : '#555',
                    border: isCurrent ? '3px solid #a7a7a7ff' : isCompleted ? '2px solid #333' : '2px solid #444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isCurrent ? '12px' : '10px',
                    color: '#fff',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                    boxShadow: isCurrent ? '0 1px 3px rgba(15, 44, 42, 0.1)' : isCompleted ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  title={step}
                  onMouseEnter={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                    }
                  }}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
          
          {/* Step labels below */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px'
          }}>
            {algorithmSteps.map((step, index) => (
              <div
                key={index}
                style={{
                  fontSize: '10px',
                  color: index === currentStep ? '#ccc' : '#666',
                  textAlign: 'center',
                  flex: 1,
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onClick={() => handleStepChange(index)}
              >
                {step.split(' - ')[0]} {/* Show only the first part of step name */}
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
            color: '#ccc', 
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
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 style={{color: '#fff', fontSize: '15px', margin: '0 0 8px 0'}}>{children}</h1>,
                h2: ({children}) => <h2 style={{color: '#fff', fontSize: '14px', margin: '8px 0 6px 0'}}>{children}</h2>,
                h3: ({children}) => <h3 style={{color: '#4ecdc4', fontSize: '13px', margin: '6px 0 4px 0'}}>{children}</h3>,
                p: ({children}) => <p style={{color: '#aaa', fontSize: '13px', lineHeight: '1.4', margin: '0 0 8px 0'}}>{children}</p>,
                strong: ({children}) => <strong style={{color: '#fff'}}>{children}</strong>,
                em: ({children}) => <em style={{color: '#f39c12'}}>{children}</em>,
                code: ({children}) => <code style={{background: '#333', color: '#4ecdc4', padding: '1px 3px', borderRadius: '2px', fontSize: '12px'}}>{children}</code>,
                pre: ({children}) => <pre style={{background: '#0d1117', padding: '8px', borderRadius: '4px', overflow: 'auto', margin: '6px 0', fontSize: '11px'}}>{children}</pre>,
                ul: ({children}) => <ul style={{color: '#aaa', fontSize: '13px', margin: '0 0 6px 0', paddingLeft: '16px'}}>{children}</ul>,
                li: ({children}) => <li style={{marginBottom: '2px'}}>{children}</li>
              }}
            >
              {stepDescriptions[currentStep]}
            </ReactMarkdown>
          </div>
        </div> {/* Fermeture de la section étapes */}
        </div> {/* Fermeture du conteneur scrollable */}
      </div>
    </>
  );
};

export default AlgorithmRenderer;