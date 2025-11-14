// -----------------------------------------------------------------------------
// Newman-Girvan Modularity (Cypher - treating directed graph as undirected)
// -----------------------------------------------------------------------------
// Compute modularity by community using Newman-Girvan formula
MATCH (i:Node), (j:Node)
WHERE i.community = j.community
WITH 
	i.community AS community
	, i
	, j
	, toFloat(COUNT{(i)--(j)}) AS A_ij
	, toFloat(COUNT{(i)--()}) AS k_i
	, toFloat(COUNT{(j)--()}) AS k_j
	, toFloat(COUNT{()-->()}) AS m
WITH community, i, j, A_ij, m
	, (k_i * k_j) / (2.0 * m) AS expected
WITH community, i, j, m
	, A_ij - expected AS contribution
WITH community, m, sum(contribution) AS total
RETURN sum(total * 1/(2.0*m)) AS global_newman_girvan_modularity;

// -----------------------------------------------------------------------------
// 2. GDS Modularity (Neo4j Graph Data Science Library)
// -----------------------------------------------------------------------------
// Create graph projection
CALL gds.graph.drop('modularity_graph', false)
YIELD graphName
MATCH (source:Node)-[:LINK]->(target:Node)
RETURN gds.graph.project(
	'modularity_graph'
	, source
	, target
	, {
		sourceNodeProperties: source { .community }
		, targetNodeProperties: target { .community }
	}
	, { undirectedRelationshipTypes: ['*'] }
) AS graph;

// Compute modularity by community using GDS
CALL gds.modularity.stream('modularity_graph', {
	 communityProperty: 'community'
})
YIELD communityId, modularity
RETURN communityId, modularity ORDER BY communityId;

// Compute global GDS modularity
CALL gds.modularity.stream('modularity_graph', {
	 communityProperty: 'community'
})
YIELD communityId, modularity
RETURN sum(modularity) AS global_gds_modularity;
