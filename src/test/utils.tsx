import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

type WrapperOptions = {
  initialRoute?: string
}

export function createTestWrapper({ initialRoute = '/' }: WrapperOptions = {}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

export { renderHook }
