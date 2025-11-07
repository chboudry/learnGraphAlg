import { useState } from 'react';
import { algorithmCategories, Algorithm } from '../data/algorithms';
import './AlgorithmNavigation.css';

interface AlgorithmNavigationProps {
  onAlgorithmSelect: (algorithmId: string) => void;
  selectedAlgorithm?: string;
}

const AlgorithmNavigation = ({ onAlgorithmSelect, selectedAlgorithm }: AlgorithmNavigationProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['community']) // Expand Community Detection by default since Louvain is there
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAlgorithmClick = (algorithm: Algorithm, event: React.MouseEvent) => {
    if (algorithm.enabled) {
      onAlgorithmSelect(algorithm.id);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div className="algorithm-navigation ndl-theme">
      <nav className="side-navigation">
        <div className="nav-header">
          <h3>Graph Data Science</h3>
          <p className="nav-subtitle">Algorithm Categories</p>
        </div>
        
        <ul className="nav-list">
          {algorithmCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            const hasEnabledAlgorithms = category.algorithms.some(alg => alg.enabled);
            
            return (
              <li key={category.id} className="nav-category">
                <button
                  className={`category-header ${!hasEnabledAlgorithms ? 'disabled' : ''}`}
                  onClick={() => toggleCategory(category.id)}
                  type="button"
                >
                  <div className="category-title">
                    <span className="category-name">{category.name}</span>
                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                      ▶
                    </span>
                  </div>
                </button>
                
                {isExpanded && (
                  <ul className="secondary-nav">
                    {category.algorithms.map((algorithm) => (
                      <li key={algorithm.id}>
                        <button
                          className={`algorithm-item ${!algorithm.enabled ? 'disabled' : ''} ${
                            selectedAlgorithm === algorithm.id ? 'selected' : ''
                          }`}
                          onClick={(event) => handleAlgorithmClick(algorithm, event)}
                          type="button"
                        >
                          <div className="algorithm-title">
                            <span className={`algorithm-name ${!algorithm.enabled ? 'grayed-out' : ''}`}>
                              {algorithm.name}
                            </span>
                            {!algorithm.enabled && (
                              <span className="coming-soon">Coming Soon</span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AlgorithmNavigation;