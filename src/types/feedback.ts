export type FeedbackSource = 'query_result' | 'database_review'

export type FeedbackStatus = 'pending' | 'accepted' | 'rejected'

export type FeedbackItem = {
  feedback_id: string
  source: FeedbackSource
  query_strain: string
  predicted_species: string
  suggested_species: string
  description: string
  submitter_id: string
  status: FeedbackStatus
  created_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  review_note: string | null
}

export type FeedbackCreate = {
  source: FeedbackSource
  query_strain: string
  predicted_species: string
  suggested_species: string
  description: string
  submitter_id: string
}

export type FeedbackReview = {
  action: 'accept' | 'reject'
  reviewed_by: string
  review_note?: string
  feedback_ids: string[]
}

export type Page = 'home' | 'submit' | 'my-feedback' | 'inbox'
