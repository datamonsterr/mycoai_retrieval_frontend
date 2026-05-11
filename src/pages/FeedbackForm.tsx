import { useState, type FormEvent } from 'react'

import type { FeedbackSource, Page } from '@/types/feedback'
import { submitFeedback } from '@/api/feedback'
import { Button } from '@/components/ui/button'

const KNOWN_SPECIES = [
  'Amanita muscaria',
  'Psilocybe cubensis',
  'Pleurotus ostreatus',
  'Ganoderma lucidum',
  'Fusarium oxysporum',
  'Penicillium chrysogenum',
  'Aspergillus niger',
  'Trichoderma harzianum',
  'Candida albicans',
  'Saccharomyces cerevisiae',
]

type Props = { setPage: (p: Page) => void }

export default function FeedbackForm({ setPage }: Props) {
  const [source, setSource] = useState<FeedbackSource>('query_result')
  const [strain, setStrain] = useState('')
  const [predicted, setPredicted] = useState('')
  const [suggested, setSuggested] = useState(KNOWN_SPECIES[0])
  const [otherSpecies, setOtherSpecies] = useState('')
  const [isOther, setIsOther] = useState(false)
  const [description, setDescription] = useState('')
  const [submitterId, setSubmitterId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const finalSuggested = isOther ? otherSpecies : suggested
    if (!strain || !predicted || !finalSuggested || !description || !submitterId) return
    setLoading(true)
    setResult(null)
    submitFeedback({
      source,
      query_strain: strain.trim(),
      predicted_species: predicted.trim(),
      suggested_species: finalSuggested.trim(),
      description: description.trim(),
      submitter_id: submitterId.trim(),
    })
      .then((item) => {
        setResult(`Submitted — feedback id ${item.feedback_id}`)
        setStrain('')
        setPredicted('')
        setDescription('')
        setOtherSpecies('')
        setIsOther(false)
        setSuggested(KNOWN_SPECIES[0])
      })
      .catch((err: unknown) => {
        setResult(err instanceof Error ? err.message : 'submit error')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-12">
      <button
        className="text-muted-foreground hover:text-foreground text-sm"
        onClick={() => setPage('home')}
        type="button"
      >
        &larr; Home
      </button>
      <h1 className="text-2xl font-semibold">Report Incorrect Prediction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Source</span>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as FeedbackSource)}
            className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="query_result">Query Result</option>
            <option value="database_review">Database Review</option>
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Submitter ID</span>
          <input
            required
            value={submitterId}
            onChange={(e) => setSubmitterId(e.target.value)}
            className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="user-1"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Query Strain</span>
          <input
            required
            value={strain}
            onChange={(e) => setStrain(e.target.value)}
            className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="strain-12"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Predicted Species</span>
          <input
            required
            value={predicted}
            onChange={(e) => setPredicted(e.target.value)}
            className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Species A"
          />
        </label>
        <div className="space-y-1">
          <span className="text-sm font-medium">Correct Species</span>
          {isOther ? (
            <input
              required
              value={otherSpecies}
              onChange={(e) => setOtherSpecies(e.target.value)}
              className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Enter species name"
            />
          ) : (
            <select
              value={suggested}
              onChange={(e) => setSuggested(e.target.value)}
              className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
            >
              {KNOWN_SPECIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setIsOther(!isOther)}
            className="text-primary text-xs hover:underline"
          >
            {isOther ? 'Choose from list' : '+ Other species (free text)'}
          </button>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description (required)</span>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
            rows={3}
            placeholder="Describe why this prediction is incorrect"
          />
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Feedback'}
        </Button>
        {result && (
          <p className="text-muted-foreground rounded-lg bg-muted px-3 py-2 text-sm">
            {result}
          </p>
        )}
      </form>
    </div>
  )
}
