// Two Oriented Cycles Connected by Single Edge
// Cycle 1: A → B → C → A
// Cycle 2: D → E → F → D  
// Connection: C → D

// Clear existing data
MATCH (n) DETACH DELETE n;

// Create nodes
CREATE 
  (a:Node {id: 'A', name: 'A'}),
  (b:Node {id: 'B', name: 'B'}),
  (c:Node {id: 'C', name: 'C'}),
  (d:Node {id: 'D', name: 'D'}),
  (e:Node {id: 'E', name: 'E'}),
  (f:Node {id: 'F', name: 'F'});

// Create cycle 1: A → B → C → A
MATCH (a:Node {id: 'A'}), (b:Node {id: 'B'})
CREATE (a)-[:LINK {weight: 1}]->(b);

MATCH (b:Node {id: 'B'}), (c:Node {id: 'C'})
CREATE (b)-[:LINK {weight: 1}]->(c);

MATCH (c:Node {id: 'C'}), (a:Node {id: 'A'})
CREATE (c)-[:LINK {weight: 1}]->(a);

// Create cycle 2: D → E → F → D
MATCH (d:Node {id: 'D'}), (e:Node {id: 'E'})
CREATE (d)-[:LINK {weight: 1}]->(e);

MATCH (e:Node {id: 'E'}), (f:Node {id: 'F'})
CREATE (e)-[:LINK {weight: 1}]->(f);

MATCH (f:Node {id: 'F'}), (d:Node {id: 'D'})
CREATE (f)-[:LINK {weight: 1}]->(d);

// Create connection between cycles: C → D
MATCH (c:Node {id: 'C'}), (d:Node {id: 'D'})
CREATE (c)-[:LINK {weight: 1}]->(d);
