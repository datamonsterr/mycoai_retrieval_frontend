import type { AggregationStrategy, GraphNode, RankedSpeciesResult } from '@/types/retrieval'

import { useDeferredValue, useMemo, useState } from 'react'
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force'

import {
  buildGraphData, GRAPH_HEIGHT, GRAPH_WIDTH, speciesColor,
  type SimulationNode,
} from '@/lib/graph'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type PositionedNode = GraphNode & { x: number; y: number }
type PositionedLink = { source: string; target: string; similarity: number }

function layoutGraph(
  data: { nodes: GraphNode[]; links: import('@/types/retrieval').GraphLink[] }
): { nodes: PositionedNode[]; links: PositionedLink[] } {
  const simNodes: SimulationNode[] = data.nodes.map((node) => ({
    ...node,
    x: node.isQuery ? GRAPH_WIDTH / 2 : GRAPH_WIDTH / 2 + (Math.random() - 0.5) * 200,
    y: node.isQuery ? GRAPH_HEIGHT / 2 : GRAPH_HEIGHT / 2 + (Math.random() - 0.5) * 200,
  }))

  const simLinks = data.links.map((link) => ({ ...link }))

  forceSimulation<SimulationNode>(simNodes)
    .force(
      'link',
      forceLink<SimulationNode, { source: number | string; target: number | string; similarity: number }>(simLinks)
        .id((node) => node.id)
        .distance((link) => 180 - link.similarity * 70)
    )
    .force('charge', forceManyBody().strength(-320))
    .force('center', forceCenter(GRAPH_WIDTH / 2, GRAPH_HEIGHT / 2))
    .force(
      'collide',
      forceCollide<SimulationNode>().radius((node) => (node.isQuery ? 42 : 26 + node.connectionCount * 2))
    )
    .stop()
    .tick(140)

  return {
    nodes: simNodes.map((node) => ({
      ...node,
      id: node.id,
      label: node.label,
      species: node.species,
      strain: node.strain,
      similarity: node.similarity,
      connectionCount: node.connectionCount,
      isQuery: node.isQuery,
      x: node.isQuery ? GRAPH_WIDTH / 2 : (node.x ?? GRAPH_WIDTH / 2),
      y: node.isQuery ? GRAPH_HEIGHT / 2 : (node.y ?? GRAPH_HEIGHT / 2),
    })),
    links: simLinks.map((link) => ({
      source: typeof link.source === 'string' ? link.source : String(link.source),
      target: typeof link.target === 'string' ? link.target : String(link.target),
      similarity: link.similarity,
    })),
  }
}

export function KNNGraph({ rankings }: { rankings: RankedSpeciesResult[] }) {
  const [k, setK] = useState(5)
  const [aggregation, setAggregation] = useState<AggregationStrategy>('weighted')
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const deferredK = useDeferredValue(k)
  const graphData = useMemo(() => buildGraphData(rankings, deferredK, aggregation), [rankings, deferredK, aggregation])
  const layout = useMemo(() => layoutGraph(graphData), [graphData])
  const [viewBoxX, setViewBoxX] = useState(0)
  const [viewScale, setViewScale] = useState(1)

  const onKChange = (nextK: number) => {
    setK(nextK)
    setSelectedNode(null)
  }

  const onAggregationChange = () => {
    setAggregation((value) => (value === 'weighted' ? 'uni' : 'weighted'))
    setSelectedNode(null)
  }

  const nodeById = useMemo(
    () => new Map(layout.nodes.map((node) => [node.id, node])),
    [layout.nodes]
  )
  const activeNode = hoveredNode ?? selectedNode

  const viewBox = `${viewBoxX} 0 ${GRAPH_WIDTH * viewScale} ${GRAPH_HEIGHT * viewScale}`

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm" aria-label="KNN graph visualization">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">KNN Graph</h2>
          <p className="text-sm text-muted-foreground">
            Query-centered force layout updates when k or strategy changes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            k
            <input
              type="range"
              min={1}
              max={20}
              value={k}
              onChange={(event) => onKChange(Number(event.target.value))}
              aria-label="Neighbor count"
            />
            <span className="w-6 tabular-nums text-foreground">{k}</span>
          </label>
          <Button
            type="button"
            variant={aggregation === 'weighted' ? 'default' : 'outline'}
            onClick={onAggregationChange}
          >
            {aggregation === 'weighted' ? 'Weighted edges' : 'Uni edges'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setViewScale((s) => s * 0.85)}>
            Zoom out
          </Button>
          <Button type="button" variant="outline" onClick={() => setViewScale((s) => s * 1.15)}>
            Zoom in
          </Button>
          <Button type="button" variant="outline" onClick={() => setViewBoxX((x) => x - 40)}>
            Pan left
          </Button>
          <Button type="button" variant="outline" onClick={() => setViewBoxX((x) => x + 40)}>
            Pan right
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_13rem]">
        <svg
          className="h-[460px] w-full rounded-xl bg-muted/20"
          viewBox={viewBox}
          role="img"
          aria-label="Query and neighbor strain graph"
        >
          {layout.links.map((link) => {
            const source = nodeById.get(link.source)
            const target = nodeById.get(link.target)
            if (!source || !target) return null
            return (
              <line
                key={`${link.source}-${link.target}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="hsl(var(--muted-foreground))"
                strokeOpacity={0.35}
                strokeWidth={1 + link.similarity * 5}
              />
            )
          })}
          {layout.nodes.map((node) => (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(node)}
            >
              <circle
                r={node.isQuery ? 28 : 14 + node.connectionCount * 2}
                fill={node.isQuery ? '#f8fafc' : speciesColor(node.species, graphData.species)}
                stroke={selectedNode?.id === node.id ? '#f8fafc' : '#0f172a'}
                strokeWidth={selectedNode?.id === node.id ? 4 : 2}
              />
              <text y={node.isQuery ? 45 : 32} textAnchor="middle" className="fill-foreground text-[11px] font-medium">
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <aside className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Legend</h3>
            <div className="space-y-2">
              {graphData.species.map((species) => (
                <div key={species} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: speciesColor(species, graphData.species) }}
                  />
                  <span>{species}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-background p-3">
            <h3 className="mb-2 text-sm font-semibold">Details</h3>
            {activeNode ? (
              <dl className="space-y-1 text-xs text-muted-foreground">
                <div>
                  <dt className="inline font-medium text-foreground">Strain: </dt>
                  {activeNode.strain}
                </div>
                <div>
                  <dt className="inline font-medium text-foreground">Species: </dt>
                  {activeNode.species}
                </div>
                <div>
                  <dt className="inline font-medium text-foreground">Similarity: </dt>
                  {activeNode.similarity.toFixed(2)}
                </div>
              </dl>
            ) : (
              <p className="text-xs text-muted-foreground">Hover or click a node.</p>
            )}
          </div>
          <div className="rounded-xl border border-border/70 bg-background p-3">
            <h3 className="mb-2 text-sm font-semibold">Selected</h3>
            <p className={cn('text-xs', selectedNode ? 'text-foreground' : 'text-muted-foreground')}>
              {selectedNode
                ? `${selectedNode.strain} · ${selectedNode.species}`
                : 'Click node to expand neighbor details.'}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
