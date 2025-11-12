import { useState, useEffect } from "react";
import type { Node, Relationship } from "@neo4j-nvl/base";
import type { LouvainGraphData } from "../types/graph";
import { validateLouvainGraphData } from "../utils/graphDataLoader";
import GraphVisualization from "./GraphVisualization";
import NodeDetailsPanel from "./NodeDetailsPanel";
import TimelinePanel from "./TimelinePanel";
import { algorithmCategories, type AlgorithmVariant } from "../data/algorithms";

interface AlgorithmRendererProps {
  algorithmId: string;
}

const AlgorithmRenderer = ({ algorithmId }: AlgorithmRendererProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [algorithmData, setAlgorithmData] = useState<LouvainGraphData | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [timelinePanelWidth, setTimelinePanelWidth] = useState(800);
  const [isResizing, setIsResizing] = useState(false);
  const [variants, setVariants] = useState<AlgorithmVariant[] | undefined>(undefined);
  const [currentVariant, setCurrentVariant] = useState<string | undefined>(undefined);

  // Chargement dynamique des données d'algorithme avec HMR automatique
  useEffect(() => {
    const loadAlgorithmData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Find algorithm metadata to check for variants
        let algorithmMetadata = null;
        for (const category of algorithmCategories) {
          const found = category.algorithms.find(alg => alg.id === algorithmId);
          if (found) {
            algorithmMetadata = found;
            break;
          }
        }

        // Set variants and determine which file to load
        let fileToLoad = algorithmId;
        if (algorithmMetadata?.variants && algorithmMetadata.variants.length > 0) {
          setVariants(algorithmMetadata.variants);
          
          // Find default variant or use first with file
          const defaultVariant = algorithmMetadata.variants.find(v => v.default);
          const firstWithFile = algorithmMetadata.variants.find(v => v.file);
          const variantToUse = defaultVariant || firstWithFile;
          
          if (variantToUse) {
            setCurrentVariant(variantToUse.id);
            if (variantToUse.file) {
              // Remove .json extension if present
              fileToLoad = variantToUse.file.replace('.json', '');
            }
          }
        } else {
          setVariants(undefined);
          setCurrentVariant(undefined);
        }

        // Import dynamique du fichier JSON avec hot reloading
        // Le paramètre ?init rend le fichier JSON hot-reloadable dans Vite
        const module = await import(`../data/${fileToLoad}.json?init`);
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

        setCurrentStep(0);
        setIsLoading(false);
      } catch (error) {
        console.error(`Erreur lors du chargement de l'algorithme ${algorithmId}:`, error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadAlgorithmData();
  }, [algorithmId]);

  // Mise à jour des données du graphique lors du changement d'étape
  useEffect(() => {
    if (algorithmData && algorithmData.steps && algorithmData.steps[currentStep]) {
      setNodes(algorithmData.steps[currentStep].nodes);
      setRelationships(algorithmData.steps[currentStep].relationships);
    }
  }, [currentStep, algorithmData]);

  const handleStepChange = (newStep: number) => {
    if (algorithmData && newStep >= 0 && newStep < algorithmData.steps.length) {
      setCurrentStep(newStep);
    }
  };

  const handleVariantChange = async (variantId: string) => {
    if (!variants) return;
    
    const variant = variants.find(v => v.id === variantId);
    if (!variant || !variant.file) return;

    setCurrentVariant(variantId);
    setIsLoading(true);
    setHasError(false);

    try {
      const fileToLoad = variant.file.replace('.json', '');
      const module = await import(`../data/${fileToLoad}.json?init`);
      const data = module.default as LouvainGraphData;
      
      if (!validateLouvainGraphData(data)) {
        console.error(`Les données de la variante ${variantId} ne sont pas valides`);
        setHasError(true);
        setIsLoading(false);
        return;
      }

      setAlgorithmData(data);
      
      if (data.steps && data.steps.length > 0) {
        setNodes(data.steps[0].nodes);
        setRelationships(data.steps[0].relationships);
      }

      setCurrentStep(0);
      setIsLoading(false);
    } catch (error) {
      console.error(`Erreur lors du chargement de la variante ${variantId}:`, error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const handleNodeDoubleClick = (node: Node) => {
    setSelectedNode(node);
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
    setShowProfile(false);
  };

  const handleShowProfile = () => {
    setShowProfile(true);
  };

  const handleTimelineResize = (newHeight: number) => {
    // Dans le nouveau layout, le resize sera géré différemment si nécessaire
    console.log('Timeline resize requested:', newHeight);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX - 280; // 280px = menu width
      if (newWidth >= 300 && newWidth <= 1200) {
        setTimelinePanelWidth(newWidth);
        // Force un resize event pour que le GraphVisualization se mette à jour
        window.dispatchEvent(new Event('resize'));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Force un dernier resize à la fin
      window.dispatchEvent(new Event('resize'));
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0d1117',
        color: '#fff'
      }}>
        <div>Chargement de l'algorithme {algorithmId}...</div>
      </div>
    );
  }

  if (hasError || !algorithmData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0d1117',
        color: '#ff6b6b'
      }}>
        <div>
          <h2>Erreur de chargement</h2>
          <p>Impossible de charger l'algorithme: {algorithmId}</p>
          <p>Vérifiez que le fichier JSON existe et est valide.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      background: '#0d1117',
      overflow: 'hidden'
    }}>
      {/* Colonne 2: Timeline Panel - largeur fixe redimensionnable */}
      <div style={{
        width: `${timelinePanelWidth}px`,
        height: '100vh',
        borderRight: '1px solid #333',
        position: 'relative',
        flexShrink: 0
      }}>
        <TimelinePanel
          algorithmData={algorithmData}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onTimelineResize={handleTimelineResize}
          variants={variants}
          currentVariant={currentVariant}
          onVariantChange={handleVariantChange}
        />
        
        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '4px',
            height: '100%',
            cursor: 'ew-resize',
            background: 'transparent',
            zIndex: 1000,
            transition: isResizing ? 'none' : 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isResizing) {
              e.currentTarget.style.background = '#666';
            }
          }}
          onMouseLeave={(e) => {
            if (!isResizing) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        />
      </div>

      {/* Colonne 3: Graph Visualization - prend l'espace restant */}
      <div style={{
        position: 'absolute',
        left: `${280 + timelinePanelWidth}px`,
        top: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        transition: 'left 0.1s ease'
      }}>
        <GraphVisualization
          key={`graph-${timelinePanelWidth}`}
          nodes={nodes}
          relationships={relationships}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onShowProfile={handleShowProfile}
          onCanvasClick={handleClosePanel}
        />
        
        {/* Panneau de détails des nœuds - en overlay sur le graphique */}
        {(selectedNode || showProfile) && (
          <NodeDetailsPanel
            selectedNode={selectedNode}
            showProfile={showProfile}
            onClose={handleClosePanel}
          />
        )}
      </div>
    </div>
  );
};

export default AlgorithmRenderer;