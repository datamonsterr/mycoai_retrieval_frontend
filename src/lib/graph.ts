import type {
  AggregationStrategy,
  GraphLink,
  GraphNode,
  RankedSpeciesResult,
} from '@/types/retrieval'

export const GRAPH_WIDTH = 760
export const GRAPH_HEIGHT = 460
export const QUERY_ID = 'query-strain'
export const SPECIES_COLORS = [
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
]

export type SimulationNode = GraphNode & {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

type GraphData = {
  nodes: GraphNode[]
  links: GraphLink[]
  species: string[]
}

export function speciesColor(species: string, speciesList: string[]): string {
  const index = Math.max(0, speciesList.indexOf(species))
  return SPECIES_COLORS[index % SPECIES_COLORS.length]
}

export function buildGraphData(
  rankings: RankedSpeciesResult[],
  k: number,
  aggregation: AggregationStrategy,
): GraphData {
  const nodeMap = new Map<string, GraphNode>()
  const linkMap = new Map<string, GraphLink>()

  nodeMap.set(QUERY_ID, {
    id: QUERY_ID,
    label: 'Query strain',
    species: 'Query',
    strain: 'Query strain',
    similarity: 1,
    connectionCount: 0,
    isQuery: true,
  })

  rankings.forEach((ranking) => {
    ranking.media_details.forEach((media) => {
      media.neighbors.slice(0, k).forEach((neighbor) => {
        const id = `${neighbor.strain}-${neighbor.image_id}`
        const previous = nodeMap.get(id)
        const count = (previous?.connectionCount ?? 0) + 1
        nodeMap.set(id, {
          id,
          label: neighbor.strain,
          species: neighbor.species,
          strain: neighbor.strain,
          similarity: aggregation === 'weighted' ? neighbor.similarity : 1,
          connectionCount: count,
          isQuery: false,
        })
        linkMap.set(`${QUERY_ID}-${id}`, {
          source: QUERY_ID,
          target: id,
          similarity: aggregation === 'weighted' ? neighbor.similarity : 1,
        })
      })
    })
  })

  const query = nodeMap.get(QUERY_ID)
  if (query) query.connectionCount = Math.max(0, nodeMap.size - 1)

  const species = Array.from(nodeMap.values())
    .filter((node) => !node.isQuery)
    .map((node) => node.species)
    .filter((speciesName, index, all) => all.indexOf(speciesName) === index)

  return {
    nodes: Array.from(nodeMap.values()),
    links: Array.from(linkMap.values()),
    species,
  }
}
