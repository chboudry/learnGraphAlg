import { useState, useEffect } from 'react';
import './AlgorithmTimeline.css';

interface TimelineStep {
  id: number;
  title: string;
  description: string;
}

interface AlgorithmTimelineProps {
  steps: TimelineStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onReset: () => void;
}

const AlgorithmTimeline = ({
  steps,
  currentStep,
  onStepChange,
  isPlaying,
  onPlayToggle,
  onReset,
}: AlgorithmTimelineProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (steps.length > 0) {
      setProgress((currentStep / (steps.length - 1)) * 100);
    }
  }, [currentStep, steps.length]);

  const handleStepClick = (stepIndex: number) => {
    if (!isPlaying) {
      onStepChange(stepIndex);
    }
  };

  return (
    <div className="algorithm-timeline">
      <div className="timeline-header">
        <div className="timeline-title">
          <span>Step {currentStep + 1} of {steps.length}</span>
          {steps[currentStep] && (
            <span className="step-title">{steps[currentStep].title}</span>
          )}
        </div>
        
        <div className="timeline-controls">
          <button
            onClick={onReset}
            disabled={isPlaying}
            className="timeline-btn reset-btn"
            title="Reset to beginning"
          >
            ⏪
          </button>
          
          <button
            onClick={onPlayToggle}
            className={`timeline-btn play-btn ${isPlaying ? 'playing' : ''}`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button
            onClick={() => onStepChange(Math.min(currentStep + 1, steps.length - 1))}
            disabled={isPlaying || currentStep >= steps.length - 1}
            className="timeline-btn step-btn"
            title="Next step"
          >
            ⏩
          </button>
        </div>
      </div>

      <div className="timeline-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="timeline-steps">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={`timeline-step ${index <= currentStep ? 'completed' : ''} ${
                index === currentStep ? 'active' : ''
              }`}
              onClick={() => handleStepClick(index)}
              disabled={isPlaying}
              title={step.description}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step.title}</div>
            </button>
          ))}
        </div>
      </div>

      {steps[currentStep] && (
        <div className="step-description">
          <p>{steps[currentStep].description}</p>
        </div>
      )}
    </div>
  );
};

export default AlgorithmTimeline;