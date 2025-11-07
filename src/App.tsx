import './App.css'
import GraphVisualizer from './components/GraphVisualizer'

function App() {
  return (
    <>
      <div className="header">
        <h1>Learn Graph Algorithms</h1>
        <p className="subtitle">
          Application interactive pour apprendre et visualiser les algorithmes de graphes
        </p>
      </div>
      
      <GraphVisualizer />
      
      <footer className="footer">
        <p>Construit avec React + TypeScript + Vite</p>
        <p>Déployé sur GitHub Pages</p>
      </footer>
    </>
  )
}

export default App
