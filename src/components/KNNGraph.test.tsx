import type { RankedSpeciesResult } from '@/types/retrieval'

import { describe, expect, test } from 'vitest'
import { buildGraphData } from '@/lib/graph'

const rankings: RankedSpeciesResult[] = [
  {
    rank: 1,
    species: 'Penicillium commune',
    score: 0.91,
    media_details: [
      {
        media: 'MEA',
        query_image_id: 'query-mea-01',
        neighbors: [
          {
            image_id: 'img-1',
            thumbnail_url: '',
            species: 'Penicillium commune',
            strain: 'PC-104',
            similarity: 0.94,
            growth_medium: 'MEA',
          },
          {
            image_id: 'img-2',
            thumbnail_url: '',
            species: 'Penicillium expansum',
            strain: 'PE-221',
            similarity: 0.87,
            growth_medium: 'CYA',
          },
        ],
      },
    ],
  },
]

describe('buildGraphData', () => {
  test('includes query node', () => {
    const data = buildGraphData(rankings, 5, 'weighted')
    expect(data.nodes.some((node) => node.isQuery)).toBe(true)
  })

  test('includes neighbor nodes', () => {
    const data = buildGraphData(rankings, 5, 'weighted')
    expect(data.nodes.length).toBe(3)
  })

  test('creates links from query to each neighbor', () => {
    const data = buildGraphData(rankings, 5, 'weighted')
    expect(data.links.length).toBe(2)
    expect(data.links.every((link) => link.source === 'query-strain')).toBe(
      true,
    )
  })

  test('respects k limit', () => {
    const data = buildGraphData(rankings, 1, 'weighted')
    expect(data.links.length).toBe(1)
  })

  test('uni aggregation uses similarity=1 for links', () => {
    const data = buildGraphData(rankings, 5, 'uni')
    expect(data.links.every((link) => link.similarity === 1)).toBe(true)
  })

  test('weighted aggregation preserves similarity', () => {
    const data = buildGraphData(rankings, 5, 'weighted')
    expect(data.links[0].similarity).toBe(0.94)
  })

  test('deduplicates neighbors across media', () => {
    const dupeRankings = [
      {
        rank: 1,
        species: 'A',
        score: 0.9,
        media_details: [
          {
            media: 'MEA',
            query_image_id: 'q1',
            neighbors: [
              {
                image_id: 'img-1',
                thumbnail_url: '',
                species: 'A',
                strain: 'S1',
                similarity: 0.9,
                growth_medium: 'M1',
              },
            ],
          },
          {
            media: 'CYA',
            query_image_id: 'q2',
            neighbors: [
              {
                image_id: 'img-1',
                thumbnail_url: '',
                species: 'A',
                strain: 'S1',
                similarity: 0.85,
                growth_medium: 'M1',
              },
            ],
          },
        ],
      },
    ]
    const data = buildGraphData(dupeRankings, 5, 'weighted')
    expect(data.nodes.length).toBe(2)
    expect(data.links.length).toBe(1)
  })
})
