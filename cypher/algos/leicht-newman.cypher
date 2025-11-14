// -----------------------------------------------------------------------------
// Leicht-Newman Modularity (Cypher - treating directed graph as directed)
// -----------------------------------------------------------------------------

MATCH ()-[r]->() 
WITH toFloat(count(r)) AS m

// Step 2: For each edge, compute its contribution to modularity
MATCH (i:Node)-[r]->(j:Node)
WHERE i.community = j.community  // Only internal edges
WITH m
    , i.community AS community
    , toFloat(COUNT{(i)-->()}) AS k_out_i     // Out-degree of i
    , toFloat(COUNT{()-->(j)}) AS k_in_j      // In-degree of j
WITH m, community
    , count(*) AS e_internal                   // Number of internal edges
    , sum(k_out_i * k_in_j) / m AS expected   // Expected edges
WITH m, community
    , (e_internal - expected) AS contribution
WITH m, sum(contribution) AS total_contribution
RETURN total_contribution / m AS leicht_newman_modularity;
