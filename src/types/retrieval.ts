export type AggregationStrategy = 'weighted' | 'uni'

export type EnvironmentStrategy = 'E1' | 'E2' | 'E3' | 'E4'

export type QueryNeighbor = {
  image_id: string
  thumbnail_url: string
  species: string
  strain: string
  similarity: number
  growth_medium: string
}

export type QueryMediaNeighbors = {
  media: string
  query_image_id: string
  neighbors: QueryNeighbor[]
}

export type RankedSpeciesResult = {
  rank: number
  species: string
  score: number
  media_details: QueryMediaNeighbors[]
}

export type RetrievalQueryDetails = {
  k: number
  aggregation: AggregationStrategy
  environment_strategy: EnvironmentStrategy
  total_neighbors_queried: number
}

export type RetrievalQueryResponse = {
  strain: string
  rankings: RankedSpeciesResult[]
  query_details: RetrievalQueryDetails
}

export type GraphNode = {
  id: string
  label: string
  species: string
  strain: string
  similarity: number
  connectionCount: number
  isQuery: boolean
}

export type GraphLink = {
  source: string
  target: string
  similarity: number
}
