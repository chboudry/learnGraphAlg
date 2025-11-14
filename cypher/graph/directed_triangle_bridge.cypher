// Directed graph with dense triangle, sparse right side, and oriented bridges
// Triangle gauche (dense, réciproque): A↔B, B↔C, C↔A
// Paire droite: D↔E
// F→E (F ne pointe que vers E)
// Ponts orientés (gauche → droite): A→D, B→D, C→D
// Un faible retour: E→A

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

// Triangle gauche (dense, réciproque): A↔B, B↔C, C↔A
MATCH (a:Node {id: 'A'}), (b:Node {id: 'B'})
CREATE (a)-[:LINK {weight: 1}]->(b);

MATCH (b:Node {id: 'B'}), (a:Node {id: 'A'})
CREATE (b)-[:LINK {weight: 1}]->(a);

MATCH (b:Node {id: 'B'}), (c:Node {id: 'C'})
CREATE (b)-[:LINK {weight: 1}]->(c);

MATCH (c:Node {id: 'C'}), (b:Node {id: 'B'})
CREATE (c)-[:LINK {weight: 1}]->(b);

MATCH (c:Node {id: 'C'}), (a:Node {id: 'A'})
CREATE (c)-[:LINK {weight: 1}]->(a);

MATCH (a:Node {id: 'A'}), (c:Node {id: 'C'})
CREATE (a)-[:LINK {weight: 1}]->(c);

// Paire droite: D↔E
MATCH (d:Node {id: 'D'}), (e:Node {id: 'E'})
CREATE (d)-[:LINK {weight: 1}]->(e);

MATCH (e:Node {id: 'E'}), (d:Node {id: 'D'})
CREATE (e)-[:LINK {weight: 1}]->(d);

// F→E (F ne pointe que vers E)
MATCH (f:Node {id: 'F'}), (e:Node {id: 'E'})
CREATE (f)-[:LINK {weight: 1}]->(e);

// Ponts orientés (gauche → droite): A→D, B→D, C→D
MATCH (a:Node {id: 'A'}), (d:Node {id: 'D'})
CREATE (a)-[:LINK {weight: 1}]->(d);

MATCH (b:Node {id: 'B'}), (d:Node {id: 'D'})
CREATE (b)-[:LINK {weight: 1}]->(d);

MATCH (c:Node {id: 'C'}), (d:Node {id: 'D'})
CREATE (c)-[:LINK {weight: 1}]->(d);

// Un faible retour: E→A
MATCH (e:Node {id: 'E'}), (a:Node {id: 'A'})
CREATE (e)-[:LINK {weight: 1}]->(a);



//Louvain pick
// Set community assignments for modularity calculations
MATCH (n:Node) WHERE n.id IN ['A', 'B', 'C']
SET n.community = 1;
MATCH (n:Node) WHERE n.id IN ['D', 'E', 'F']
SET n.community = 2;

//0.165
// 0.37278106508875736

// manual
MATCH (n:Node) WHERE n.id IN ['A', 'B', 'C', 'D']
SET n.community = 1;
MATCH (n:Node) WHERE n.id IN ['E', 'F']
SET n.community = 2;

//0.07988165680473369
//0.2958579881656805