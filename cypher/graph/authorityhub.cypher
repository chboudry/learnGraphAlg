// Authority-Hub Network for Modularity Comparison
// This network demonstrates role-based directed structure where nodes have different functions in information flow
// Used in modularity-comparaison.json to compare Newman-Girvan vs Leicht-Newman modularity

// Clear existing data
MATCH (n) DETACH DELETE n;

// Create nodes with role-based properties
CREATE 
  // Intermediates (1→1 balanced flow)
  (a:Node {id: 'A', name: 'A', role: 'intermediate'}),
  (g:Node {id: 'G', name: 'G', role: 'intermediate'}),
  
  // Sources/Hubs (2→1 high out-degree)
  (b:Node {id: 'B', name: 'B', role: 'source'}),
  (d:Node {id: 'D', name: 'D', role: 'source'}),
  (e:Node {id: 'E', name: 'E', role: 'source'}),
  
  // Authorities/Sinks (1→2 high in-degree)
  (f:Node {id: 'F', name: 'F', role: 'authority'}),
  (h:Node {id: 'H', name: 'H', role: 'authority'}),
  (i:Node {id: 'I', name: 'I', role: 'authority'});

// Create directed relationships (11 edges total)
// Main flow paths
MATCH (a:Node {id: 'A'}), (d:Node {id: 'D'})
CREATE (a)-[:LINK {weight: 1, type: 'flow'}]->(d);  // A → D

MATCH (d:Node {id: 'G'}), (g:Node {id: 'D'})
CREATE (d)-[:LINK {weight: 1, type: 'flow'}]->(g);  // D → G

MATCH (d:Node {id: 'D'}), (e:Node {id: 'E'})
CREATE (d)-[:LINK {weight: 1, type: 'branch'}]->(e);  // D → E

MATCH (e:Node {id: 'E'}), (h:Node {id: 'H'})
CREATE (e)-[:LINK {weight: 1, type: 'flow'}]->(h);  // E → H

MATCH (e:Node {id: 'E'}), (f:Node {id: 'F'})
CREATE (e)-[:LINK {weight: 1, type: 'cross'}]->(f);  // E → F

// Secondary flow paths
MATCH (b:Node {id: 'F'}), (f:Node {id: 'B'})
CREATE (b)-[:LINK {weight: 1, type: 'source'}]->(f);  // B → F
MATCH (f:Node {id: 'F'}), (i:Node {id: 'I'})
CREATE (f)-[:LINK {weight: 1, type: 'flow'}]->(i);  // F → I

MATCH (i:Node {id: 'I'}), (b:Node {id: 'B'})
CREATE (i)-[:LINK {weight: 1, type: 'cycle'}]->(b);  // I → B (cycle return)

// Cross-connections
MATCH (g:Node {id: 'H'}), (h:Node {id: 'G'})
CREATE (g)-[:LINK {weight: 1, type: 'cross'}]->(h);  // G → H
MATCH (h:Node {id: 'H'}), (i:Node {id: 'I'})
CREATE (h)-[:LINK {weight: 1, type: 'flow'}]->(i);  // H → I

MATCH (b:Node {id: 'B'}), (a:Node {id: 'A'})
CREATE (b)-[:LINK {weight: 1, type: 'cycle'}]->(a);  // B → A (cycle completion)

//Louvain pick
// Set community assignments for modularity calculations
MATCH (n:Node) WHERE n.id IN ['A', 'D', 'G']
SET n.community = 1;
MATCH (n:Node) WHERE n.id IN ['E', 'H', 'F', 'B', 'I']
SET n.community = 2;

// girvan 0.16
// 0.5537190082644629

//H vers G
// 0.16
// 0.53719

//0.5454545454545454

//Manual but better ;)
// Set community assignments for modularity calculations
MATCH (n:Node) WHERE n.id IN ['B', 'F', 'I']
SET n.community = 1;
MATCH (n:Node) WHERE n.id IN ['A', 'D', 'G', 'E', 'H']
SET n.community = 2;

// 0.21
// 0.5537190082644629

// Set community assignments for modularity calculations
MATCH (n:Node) WHERE n.id IN ['A', 'B', 'I']
SET n.community = 1;
MATCH (n:Node) WHERE n.id IN ['D', 'E']
SET n.community = 2;
MATCH (n:Node) WHERE n.id IN ['G', 'H', 'F']
SET n.community = 3;

// 0.024
// 0.30