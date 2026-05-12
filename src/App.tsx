import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Shell } from '@/components/layout/shell'

const UploadPage = lazy(() => import('@/pages/upload-page'))
const DashboardPage = lazy(() => import('@/pages/dashboard-page'))
const DatabasePage = lazy(() => import('@/pages/database-page'))
const ResultsPage = lazy(() => import('@/pages/results-page'))
const LoginPage = lazy(() => import('@/pages/login-page'))
const RegisterPage = lazy(() => import('@/pages/register-page'))
const FeedbackPage = lazy(() => import('@/pages/feedback-page'))
const TrainingPage = lazy(() => import('@/pages/training-page'))
const SettingsPage = lazy(() => import('@/pages/settings-page'))
const UsersPage = lazy(() => import('@/pages/users-page'))

function AppRouter() {
  return (
    <Shell>
      <Suspense
        fallback={
          <div className="text-muted-foreground p-6 text-sm">
            Loading view...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/results/:jobId" element={<ResultsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route
            path="/database/species/:id"
            element={<DatabasePage variant="species" />}
          />
          <Route
            path="/database/strains/:id"
            element={<DatabasePage variant="strain" />}
          />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/feedback/inbox" element={<FeedbackPage inbox />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/upload" replace />} />
        </Routes>
      </Suspense>
    </Shell>
  )
}

export default AppRouter
