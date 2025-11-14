// Directed graph with labeled nodes A-F (A=0, B=1, C=2, D=3, E=4, F=5)
// Directed edges:
// A → D, A → C
// B → D
// C → E, C ↔ F (both C→F and F→C)
// E → B
// F → B

// Clear existing data
MATCH (n) DETACH DELETE n;

// Create nodes with numeric labels
CREATE 
  (a:Node {id: 'A', name: 'A', label: 0}),
  (b:Node {id: 'B', name: 'B', label: 1}),
  (c:Node {id: 'C', name: 'C', label: 2}),
  (d:Node {id: 'D', name: 'D', label: 3}),
  (e:Node {id: 'E', name: 'E', label: 4}),
  (f:Node {id: 'F', name: 'F', label: 5});

// A → D, A → C
MATCH (a:Node {id: 'A'}), (d:Node {id: 'D'})
CREATE (a)-[:LINK {weight: 1}]->(d);

MATCH (a:Node {id: 'A'}), (c:Node {id: 'C'})
CREATE (a)-[:LINK {weight: 1}]->(c);

// B → D
MATCH (b:Node {id: 'B'}), (d:Node {id: 'D'})
CREATE (b)-[:LINK {weight: 1}]->(d);

// C → E, C ↔ F (both C→F and F→C)
MATCH (c:Node {id: 'C'}), (e:Node {id: 'E'})
CREATE (c)-[:LINK {weight: 1}]->(e);

MATCH (c:Node {id: 'C'}), (f:Node {id: 'F'})
CREATE (c)-[:LINK {weight: 1}]->(f);

MATCH (f:Node {id: 'F'}), (c:Node {id: 'C'})
CREATE (f)-[:LINK {weight: 1}]->(c);

// E → B
MATCH (e:Node {id: 'E'}), (b:Node {id: 'B'})
CREATE (e)-[:LINK {weight: 1}]->(b);

// F → B
MATCH (f:Node {id: 'F'}), (b:Node {id: 'B'})
CREATE (f)-[:LINK {weight: 1}]->(b);


// Set community assignments for modularity calculations
MATCH (n:Node) WHERE n.id IN ['E', 'B']
SET n.community = 1;
MATCH (n:Node) WHERE n.id IN ['C', 'F']
SET n.community = 2;
MATCH (n:Node) WHERE n.id IN ['A', 'D']
SET n.community = 3;

// 0.1484375
// 0.3125

MATCH (n:Node) WHERE n.id IN ['A', 'D']
SET n.community = 1;
MATCH (n:Node) WHERE n.id IN ['F', 'C', 'E', 'B']
SET n.community = 2;

// 0.125
// 0.46875


MATCH (n:Node) WHERE n.id IN ['A', 'C', 'E']
SET n.community = 1;
MATCH (n:Node) WHERE n.id IN ['B', 'D', 'F']
SET n.community = 2;

//0
// 0.3125