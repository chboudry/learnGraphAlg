import { useState, useEffect } from "react";
import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
import type { MouseEventCallbacks } from "@neo4j-nvl/react";
import type { HitTargets, Node, Relationship } from "@neo4j-nvl/base";
import profileImage from "../assets/me.jpeg";

interface GraphVisualizationProps {
  nodes: Node[];
  relationships: Relationship[];
  directed?: boolean;
  onNodeClick?: (node: Node) => void;
  onNodeDoubleClick?: (node: Node) => void;
  onShowProfile: () => void;
  onCanvasClick?: () => void;
}

const GraphVisualization = ({ 
  nodes, 
  relationships,
  directed = true,
  onNodeClick, 
  onNodeDoubleClick,
  onShowProfile,
  onCanvasClick
}: GraphVisualizationProps) => {
  
  // Référence pour mesurer le conteneur
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600
  });

  // Mettre à jour les dimensions basées sur le conteneur réel
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef) {
        const rect = containerRef.getBoundingClientRect();
        const newWidth = Math.floor(rect.width);
        const newHeight = Math.floor(rect.height);
        
        console.log('GraphVisualization dimensions:', newWidth, 'x', newHeight);
        
        setDimensions(prev => {
          if (prev.width !== newWidth || prev.height !== newHeight) {
            return { width: newWidth, height: newHeight };
          }
          return prev;
        });
      }
    };

    // Observer les changements de taille du conteneur
    if (containerRef) {
      updateDimensions();
      
      const timeoutId = setTimeout(updateDimensions, 100);
      
      const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      resizeObserver.observe(containerRef);
      
      const handleResize = () => {
        updateDimensions();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(timeoutId);
        resizeObserver.disconnect();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [containerRef]);
  

  
  // Callbacks d'événements souris pour l'interactivité
  const mouseEventCallbacks: MouseEventCallbacks = {
    onNodeClick: (node: Node, _hitTargets: HitTargets, _originalEvent: MouseEvent) => {
      onNodeClick?.(node);
      console.log('Node clicked:', node.id);
    },
    onNodeDoubleClick: (node: Node, _hitTargets: HitTargets, _originalEvent: MouseEvent) => {
      onNodeDoubleClick?.(node);
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
    onZoom: (_zoom: number, _originalEvent: WheelEvent) => {
      // Optionnel: logs pour le zoom
      console.log('Graph zoomed to:', _zoom);
    },
    onCanvasClick: (_originalEvent: MouseEvent) => {
      // Fermer le panel de détails quand on clique sur un endroit vide
      onCanvasClick?.();
    }
  };

  return (
    <div 
      ref={setContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#242424'
      }}>
      {/* Bouton Profile en haut à droite */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '20px',
        width: '40px',
        height: '40px',
        background: '#242424',
        padding: '6px',
        borderRadius: '50%',
        zIndex: 1002,
        cursor: 'pointer'
      }}>
        <img 
          onClick={onShowProfile}
          src={profileImage}
          alt="Charles Boudry"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #555',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.borderColor = '#4ecdc4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#555';
          }}
        />
      </div>

      {nodes.length > 0 && dimensions.width > 0 && dimensions.height > 0 ? (
        <div style={{ width: dimensions.width, height: dimensions.height }}>
          <InteractiveNvlWrapper
            nodes={nodes.map(node => ({
              ...node,
              size: node.size ? node.size * 1.5 : 60
            }))}
            rels={
              directed 
                ? relationships.map(rel => ({
                    ...rel,
                    color: rel.color || '#666666'
                  }))
                : relationships.flatMap(rel => [
                    { ...rel, color: rel.color || '#666666' },
                    { 
                      ...rel, 
                      id: `${rel.id}_rev`, 
                      from: rel.to, 
                      to: rel.from,
                      color: rel.color || '#666666'
                    }
                  ])
            }
            mouseEventCallbacks={mouseEventCallbacks}
            nvlOptions={{
              renderer: 'canvas',
              instanceId: 'graph-viz'
            }}
          />
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'white',
          fontSize: '18px'
        }}>
          Nothing To Display
        </div>
      )}
    </div>
  );
};

export default GraphVisualization;