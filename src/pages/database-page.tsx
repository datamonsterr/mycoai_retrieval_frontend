import { PageShell } from '@/components/layout/page-shell'

export default function DatabasePage({ variant }: { variant?: 'species' | 'strain' }) {
  return (
    <PageShell
      title={variant === 'species' ? 'Species detail' : variant === 'strain' ? 'Strain detail' : 'Database browser'}
      description="Filter bar, virtualized table, action menus, and pagination belong here for owner and read-only workflows."
    />
  )
}
