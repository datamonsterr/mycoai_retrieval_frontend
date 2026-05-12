import type { RankedSpeciesResult } from '@/types/retrieval'

import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rankingsToCsv } from '@/lib/csv'
import { ResultsTable } from '@/components/ResultsTable'

const sampleRankings: RankedSpeciesResult[] = [
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
            thumbnail_url: 'https://placehold.co/256/png?text=A',
            species: 'Penicillium commune',
            strain: 'PC-104',
            similarity: 0.94,
            growth_medium: 'MEA',
          },
        ],
      },
    ],
  },
  {
    rank: 2,
    species: 'Penicillium expansum',
    score: 0.73,
    media_details: [],
  },
  {
    rank: 3,
    species: 'Aspergillus niger',
    score: 0.59,
    media_details: [],
  },
]

describe('rankingsToCsv', () => {
  test('generates valid CSV from empty array', () => {
    expect(rankingsToCsv([])).toBe('rank,species,score')
  })

  test('generates CSV with rows', () => {
    const csv = rankingsToCsv(sampleRankings)
    const lines = csv.split('\n')
    expect(lines[0]).toBe('rank,species,score')
    expect(lines[1]).toBe('1,Penicillium commune,0.9100')
    expect(lines[2]).toBe('2,Penicillium expansum,0.7300')
  })

  test('escapes commas in species name', () => {
    const csv = rankingsToCsv([{ rank: 1, species: 'Fungus, sp.', score: 0.5, media_details: [] }])
    expect(csv).toContain('"Fungus, sp."')
  })
})

describe('ResultsTable', () => {
  test('renders all species rows', () => {
    render(<ResultsTable rankings={sampleRankings} />)
    expect(screen.getByText('Penicillium commune')).toBeInTheDocument()
    expect(screen.getByText('Penicillium expansum')).toBeInTheDocument()
    expect(screen.getByText('Aspergillus niger')).toBeInTheDocument()
  })

  test('sorts by species name on click', async () => {
    const user = userEvent.setup()
    render(<ResultsTable rankings={sampleRankings} />)
    await user.click(screen.getByText('Species'))
    await user.click(screen.getByText('Species'))
    const rows = screen.getAllByRole('row').slice(1)
    expect(rows[0]).toHaveTextContent('Aspergillus niger')
  })

  test('export button triggers CSV download', async () => {
    const user = userEvent.setup()
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const originalCreateElement = document.createElement.bind(document)
    const click = vi.fn()
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') element.click = click
      return element
    })

    render(<ResultsTable rankings={sampleRankings} />)
    await user.click(screen.getByText('Export CSV'))
    expect(createObjectURL).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test')
  })

  test('expand row shows KNN detail', async () => {
    const user = userEvent.setup()
    const { container } = render(<ResultsTable rankings={sampleRankings} />)
    const firstRow = container.querySelector('tbody tr')
    expect(firstRow).toBeInstanceOf(HTMLElement)
    await user.click(firstRow as HTMLElement)
    expect(screen.getByText(/query-mea-01/)).toBeInTheDocument()
  })
})
