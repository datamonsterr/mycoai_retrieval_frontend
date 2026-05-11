import { useParams } from 'react-router-dom'

import { PageShell } from '@/components/layout/page-shell'

export default function ResultsPage() {
  const { jobId = 'pending' } = useParams()

  return (
    <PageShell
      title={`Retrieval results ${jobId}`}
      description="Summary, ranked species, confidence bars, expandable neighbor detail, and feedback actions belong here."
    />
  )
}
