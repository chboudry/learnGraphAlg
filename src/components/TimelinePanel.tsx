import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { LouvainGraphData } from "../types/graph";

interface AlgorithmVariant {
  id: string;
  name: string;
  file?: string;
  default?: boolean;
}

interface TimelinePanelProps {
  algorithmData: LouvainGraphData;
  currentStep: number;
  onStepChange: (step: number) => void;
  onTimelineResize?: (height: number) => void;
  variants?: AlgorithmVariant[];
  currentVariant?: string;
  onVariantChange?: (variantId: string) => void;
}

const TimelinePanel = ({ 
  algorithmData, 
  currentStep, 
  onStepChange,
  variants,
  currentVariant,
  onVariantChange
}: TimelinePanelProps) => {

  const [showDescription, setShowDescription] = useState(true);
  const algorithmSteps = algorithmData.steps.map(step => step.name);
  const stepDescriptions = algorithmData.steps.map(step => step.description);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header avec titre */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #333'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            color: '#fff',
            fontSize: '18px',
            margin: '0',
            fontWeight: 'bold'
          }}>
            {algorithmData.title}
          </h2>
          
          {/* Variant selector */}
          {variants && variants.length > 0 && (
            <select
              value={currentVariant || ''}
              onChange={(e) => onVariantChange?.(e.target.value)}
              style={{
                background: '#333',
                border: '1px solid #555',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {variants.map((variant) => (
                <option 
                  key={variant.id} 
                  value={variant.id}
                  disabled={!variant.file}
                  style={{
                    color: variant.file ? '#fff' : '#666'
                  }}
                >
                  {variant.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px'
      }}>
        {/* Algorithm Description - masquable */}
        <div style={{
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <button
              onClick={() => setShowDescription(!showDescription)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '0',
                marginRight: '8px',
                outline: 'none'
              }}
            >
              {showDescription ? '▼' : '▶'}
            </button>
            <span style={{
              color: '#666',
              fontSize: '12px'
            }}>
              Description
            </span>
          </div>
          
          {showDescription && (
            <div style={{
              marginBottom: '20px'
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
          )}

        </div>
          {/* Titre Steps avec boutons navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0px'
          }}>
            <h3 style={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              margin: '0'
            }}>
              Steps
            </h3>
            
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => onStepChange(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                style={{
                  background: currentStep === 0 ? '#333' : '#555',
                  border: 'none',
                  color: currentStep === 0 ? '#666' : '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (currentStep !== 0) {
                    e.currentTarget.style.background = '#666';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentStep !== 0) {
                    e.currentTarget.style.background = '#555';
                  }
                }}
              >
                ‹
              </button>
              
              <button
                onClick={() => onStepChange(Math.min(algorithmSteps.length - 1, currentStep + 1))}
                disabled={currentStep === algorithmSteps.length - 1}
                style={{
                  background: currentStep === algorithmSteps.length - 1 ? '#333' : '#555',
                  border: 'none',
                  color: currentStep === algorithmSteps.length - 1 ? '#666' : '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  cursor: currentStep === algorithmSteps.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (currentStep !== algorithmSteps.length - 1) {
                    e.currentTarget.style.background = '#666';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentStep !== algorithmSteps.length - 1) {
                    e.currentTarget.style.background = '#555';
                  }
                }}
              >
                ›
              </button>
            </div>
          </div>

        {/* Wizard Timeline Bar */}
        <div style={{ 
          marginBottom: '15px',
          position: 'relative',
          padding: '0 20px'
        }}>

          
          {/* Background track */}
          <div style={{
            position: 'relative',
            height: '6px',
            background: '#333',
            borderRadius: '3px',
            margin: '30px 0 20px 0'
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
                  onClick={() => onStepChange(index)}
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
                onClick={() => onStepChange(index)}
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
          lineHeight: '1.4'
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
                p: ({children}) => <p style={{color: '#aaa', fontSize: '13px', lineHeight: '1.5', margin: '0 0 8px 0'}}>{children}</p>,
                strong: ({children}) => <strong style={{color: '#fff'}}>{children}</strong>,
                em: ({children}) => <em style={{color: '#f39c12'}}>{children}</em>,
                code: ({children}) => <code style={{background: '#333', color: '#4ecdc4', padding: '2px 4px', borderRadius: '3px', fontSize: '12px'}}>{children}</code>,
                pre: ({children}) => <pre style={{background: '#0d1117', padding: '10px', borderRadius: '6px', overflow: 'auto', margin: '8px 0'}}>{children}</pre>,
                ul: ({children}) => <ul style={{color: '#aaa', fontSize: '13px', margin: '0 0 8px 0', paddingLeft: '20px'}}>{children}</ul>,
                li: ({children}) => <li style={{marginBottom: '4px'}}>{children}</li>
              }}
            >
              {stepDescriptions[currentStep]}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePanel;