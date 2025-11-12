import type { Node } from "@neo4j-nvl/base";
import profileImage from "../assets/me.jpeg";

interface NodeDetailsPanelProps {
  selectedNode: Node | null;
  showProfile: boolean;
  onClose: () => void;
}

const NodeDetailsPanel = ({ 
  selectedNode, 
  showProfile, 
  onClose
}: NodeDetailsPanelProps) => {
  
  const detailsPanelWidth = (selectedNode || showProfile) ? 320 : 0; // Largeur panneau + marges

  if (!selectedNode && !showProfile) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      bottom: '20px',
      width: `${detailsPanelWidth - 30}px`,
      background: 'transparent',
      padding: '10px',
      zIndex: 999,
      pointerEvents: 'none' // Permet aux clics de passer à travers le conteneur transparent
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
        backdropFilter: 'blur(10px)',
        pointerEvents: 'all' // Réactive les événements sur le contenu
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
            onClick={onClose}
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
                  src={profileImage}
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
                  Neo4j Senior Consultant
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
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
  );
};

export default NodeDetailsPanel;