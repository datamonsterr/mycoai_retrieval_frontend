import { PageShell } from '@/components/layout/page-shell'
import { RouteSummary } from '@/components/layout/route-summary'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageShell
        title="Overview dashboard"
        description="Charts, counts, and retrieval health summaries belong here. TanStack Query handles server state and cache refreshes."
      />
      <RouteSummary />
    </div>
  )
}
