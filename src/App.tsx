import { useState } from 'react'
import './App.css'
import AlgorithmNavigation from './components/AlgorithmNavigation'
import AlgorithmRenderer from './components/AlgorithmRenderer'

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('louvain');

  const renderAlgorithm = () => {
    // Le composant AlgorithmRenderer gère automatiquement les erreurs de chargement
    // et affiche un message approprié si le fichier JSON n'existe pas
    return <AlgorithmRenderer algorithmId={selectedAlgorithm} />;
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
