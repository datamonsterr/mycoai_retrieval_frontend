import { describe, it, expect } from 'vitest'
import { render, screen, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import { RouteSummary } from '@/components/layout/route-summary'
import { PageShell } from '@/components/layout/page-shell'
import { ThemeProvider, useTheme } from '@/context/theme-context'
import { AuthProvider, useAuth } from '@/context/auth-context'
import { appRoutes } from '@/lib/routes'

describe('Frontend architecture smoke tests', () => {
  it('RouteSummary renders all route descriptors', () => {
    render(
      <MemoryRouter>
        <RouteSummary />
      </MemoryRouter>,
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Upload')).toBeInTheDocument()
    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('PageShell renders title + description', () => {
    render(<PageShell title="Test title" description="Test description" />)

    expect(screen.getByText('Test title')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('ThemeProvider defaults to light', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    )

    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.theme).toBe('light')
  })

  it('AuthProvider default user is null', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
  })

  it('route table includes all expected paths', () => {
    const paths = appRoutes.map((route) => route.path)
    expect(paths).toContain('/upload')
    expect(paths).toContain('/dashboard')
    expect(paths).toContain('/database')
    expect(paths).toContain('/database/species/:id')
    expect(paths).toContain('/database/strains/:id')
    expect(paths).toContain('/feedback')
    expect(paths).toContain('/feedback/inbox')
    expect(paths).toContain('/training')
    expect(paths).toContain('/settings')
    expect(paths).toContain('/admin/users')
    expect(paths).toContain('/login')
    expect(paths).toContain('/register')
  })

  it('lazy DashboardPage renders without throwing', async () => {
    const { default: DashboardPage } = await import('@/pages/dashboard-page')
    const client = new QueryClient()

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Overview dashboard')).toBeInTheDocument()
  })

  it('lazy UploadPage renders without throwing', async () => {
    const { default: UploadPage } = await import('@/pages/upload-page')
    const client = new QueryClient()

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <UploadPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Single + batch image intake')).toBeInTheDocument()
  })
})
