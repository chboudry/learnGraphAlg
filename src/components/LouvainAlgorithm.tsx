import React, { useState } from "react";
import { BasicNvlWrapper } from "@neo4j-nvl/react";
import { Node, Relationship } from "@neo4j-nvl/base";

const LouvainAlgorithm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineHeight, setTimelineHeight] = useState(120);
  
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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Dimensions explicites pour éviter les problèmes de canvas

  return (
    <>
      {/* Graph Area - avec dimensions explicites */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '280px',
        width: `calc(100vw - 280px)`, // Largeur explicite
        height: `calc(100vh - ${timelineHeight}px)`, // Hauteur explicite
        background: '#242424'
      }}>
        <BasicNvlWrapper
          nvlOptions={{ 
            initialZoom: 1.5,
            renderer: 'canvas'
          }}
          nodes={nodes}
          rels={relationships}
        />
      </div>

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
              const newHeight = Math.max(80, Math.min(200, startHeight - (e.clientY - startY)));
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

        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          marginBottom: '15px' 
        }}>
          <button
            onClick={handlePlayPause}
            style={{
              background: isPlaying ? '#333' : '#444',
              border: '1px solid #555',
              borderRadius: '6px',
              width: '40px',
              height: '40px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button
            onClick={handleReset}
            style={{
              background: '#333',
              border: '1px solid #555',
              borderRadius: '6px',
              padding: '8px 15px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>

          <div style={{ 
            color: '#ccc', 
            fontSize: '14px', 
            fontWeight: 'normal'
          }}>
            Step {currentStep + 1}: {algorithmSteps[currentStep]}
          </div>
        </div>

        {/* Timeline Slider */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <input
            type="range"
            min="0"
            max={algorithmSteps.length - 1}
            value={currentStep}
            onChange={(e) => handleStepChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '4px',
              background: '#333',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Step Labels */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '10px',
          fontSize: '10px',
          color: '#777'
        }}>
          {algorithmSteps.map((_, index) => (
            <span key={index} style={{ 
              textAlign: 'center',
              flex: 1,
              opacity: index === currentStep ? 1 : 0.5
            }}>
              {index + 1}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default LouvainAlgorithm;
