import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppProviders } from '@/app/providers'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock

describe('App', () => {
  it('renders the upload landing page', async () => {
    render(<AppProviders />)

    expect(await screen.findByText(/single \+ batch image intake/i)).toBeInTheDocument()
  })
})
