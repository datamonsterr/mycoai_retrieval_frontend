import type {
  FeedbackCreate,
  FeedbackItem,
  FeedbackReview,
} from '@/types/feedback'

const API_BASE = '/api/v1/feedback'

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export function submitFeedback(data: FeedbackCreate): Promise<FeedbackItem> {
  return fetchJson<FeedbackItem>(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function listFeedback(params?: {
  status?: string
  submitter_id?: string
  source?: string
}): Promise<FeedbackItem[]> {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.submitter_id) qs.set('submitter_id', params.submitter_id)
  if (params?.source) qs.set('source', params.source)
  const url = qs.toString() ? `${API_BASE}?${qs}` : API_BASE
  return fetchJson<FeedbackItem[]>(url)
}

export function getFeedback(id: string): Promise<FeedbackItem> {
  return fetchJson<FeedbackItem>(`${API_BASE}/${id}`)
}

export function reviewFeedback(
  id: string,
  body: FeedbackReview,
): Promise<FeedbackItem> {
  return fetchJson<FeedbackItem>(`${API_BASE}/${id}/review`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function reviewFeedbackBulk(
  body: FeedbackReview,
): Promise<FeedbackItem[]> {
  return fetchJson<FeedbackItem[]>(`${API_BASE}/review/bulk`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
