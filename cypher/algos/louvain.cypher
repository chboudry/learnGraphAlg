// ===========================================
// 1. LOUVAIN ALGORITHM (Newman-Girvan Modularity) with neo4J GDS
// ===========================================

CALL gds.graph.drop('modularity_graph', false)
YIELD graphName
RETURN *;
MATCH (source:Node)-[:LINK]->(target:Node)
RETURN gds.graph.project(
	'modularity_graph',
	source,
	target,
    {},
    { undirectedRelationshipTypes: ['*'] }
) AS graph;

CALL gds.louvain.stream('modularity_graph')
YIELD nodeId, communityId, intermediateCommunityIds
RETURN gds.util.asNode(nodeId).id AS nodeId,
       gds.util.asNode(nodeId).role AS role,
       communityId,
       intermediateCommunityIds
ORDER BY communityId, nodeId;