import { useState } from 'react'
import './App.css'
import AlgorithmNavigation from './components/AlgorithmNavigation'
import LouvainAlgorithm from './components/LouvainAlgorithm'
import GraphVisualizer from './components/GraphVisualizer'

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('louvain');

  const renderAlgorithm = () => {
    switch (selectedAlgorithm) {
      case 'louvain':
        return <LouvainAlgorithm />;
      default:
        return (
          <div className="placeholder-content">
            <div className="algorithm-info">
              <p className="algorithm-description">
                This algorithm implementation is coming soon. Select Louvain from the navigation to see an interactive demo.
              </p>
            </div>
            <GraphVisualizer />
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <AlgorithmNavigation 
        onAlgorithmSelect={setSelectedAlgorithm}
        selectedAlgorithm={selectedAlgorithm}
      />
      
      <main className="main-content">
        <div className="algorithm-container">
            {renderAlgorithm()}
        </div>
      </main>
    </div>
  )
}

export default App
