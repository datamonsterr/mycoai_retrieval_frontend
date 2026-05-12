import { PageShell } from '@/components/layout/page-shell'

export default function FeedbackPage({ inbox = false }: { inbox?: boolean }) {
  return (
    <PageShell
      title={inbox ? 'Feedback inbox' : 'My feedback'}
      description="Report incorrect matches, queue review items, and invalidate query state after mutation."
    />
  )
}
