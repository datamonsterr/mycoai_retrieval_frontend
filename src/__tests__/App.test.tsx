import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import App from '@/App'
import { queryClient } from '@/lib/query-client'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock

describe('App', () => {
  it('renders the stack landing heading', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>,
    )
    expect(screen.getByText(/stack-ready console/i)).toBeInTheDocument()
  })
})
