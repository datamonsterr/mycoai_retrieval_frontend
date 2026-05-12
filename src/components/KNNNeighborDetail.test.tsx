import type { QueryMediaNeighbors } from '@/types/retrieval'

import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KNNNeighborDetail } from '@/components/KNNNeighborDetail'

const mediaDetails: QueryMediaNeighbors[] = [
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
      {
        image_id: 'img-2',
        thumbnail_url: 'https://placehold.co/256/png?text=B',
        species: 'Penicillium expansum',
        strain: 'PE-221',
        similarity: 0.87,
        growth_medium: 'CYA',
      },
    ],
  },
]

describe('KNNNeighborDetail', () => {
  test('renders media header', () => {
    render(<KNNNeighborDetail mediaDetails={mediaDetails} />)
    expect(screen.getByText(/query-mea-01/)).toBeInTheDocument()
  })

  test('renders neighbor thumbnails', () => {
    render(<KNNNeighborDetail mediaDetails={mediaDetails} />)
    expect(screen.getByText('PC-104')).toBeInTheDocument()
    expect(screen.getByText('PE-221')).toBeInTheDocument()
  })

  test('shows match percentages', () => {
    render(<KNNNeighborDetail mediaDetails={mediaDetails} />)
    expect(screen.getByText('94% match')).toBeInTheDocument()
    expect(screen.getByText('87% match')).toBeInTheDocument()
  })

  test('opens lightbox on thumbnail click', async () => {
    const user = userEvent.setup()
    render(<KNNNeighborDetail mediaDetails={mediaDetails} />)
    await user.click(screen.getByLabelText(/PC-104/))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
