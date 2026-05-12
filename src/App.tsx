import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Layers3,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Search,
  ServerCrash,
  ShieldCheck,
  TimerReset,
  TrendingUp,
} from 'lucide-react'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TrainingStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
type TrainingStage =
  | 'preparing'
  | 'extracting'
  | 'training'
  | 'evaluating'
  | 'indexing'

type TrainingJob = {
  id: string
  type: 'reindex' | 'finetune' | 'full_retrain'
  status: TrainingStatus
  stage: TrainingStage
  epoch: string
  loss: string
  accuracy: string
  eta: string
  startedAt: string
  completedAt: string | null
  duration: string
  changes: string
}

type TrainingState = {
  model: string
  lastTrainingDate: string
  strainsInTrainingSet: number
  f1Score: string
  stagedVersion: string
  notification: string
  preflight: {
    newStrains: number
    archivedStrains: number
    feedbackAccepted: number
    estimatedHours: string
  }
  progress: {
    stage: TrainingStage
    current: number
    total: number
    epoch: string
    loss: string
    accuracy: string
    eta: string
  }
  jobs: TrainingJob[]
}

const trainingState: TrainingState = {
  model: 'EfficientNetB1 finetuned v3',
  lastTrainingDate: '2026-05-06 14:30 UTC',
  strainsInTrainingSet: 184,
  f1Score: '0.92',
  stagedVersion: 'v3.3.0',
  notification: 'Model v3.3.0 ready for review',
  preflight: {
    newStrains: 12,
    archivedStrains: 3,
    feedbackAccepted: 5,
    estimatedHours: '~3.5 hours on current hardware',
  },
  progress: {
    stage: 'training',
    current: 15,
    total: 50,
    epoch: '3 / 25',
    loss: '0.023',
    accuracy: '0.91',
    eta: '47 min',
  },
  jobs: [
    {
      id: 'train_20260506_001',
      type: 'finetune',
      status: 'completed',
      stage: 'evaluating',
      epoch: '25 / 25',
      loss: '0.023',
      accuracy: '0.91',
      eta: '0 min',
      startedAt: '2026-05-06 10:45 UTC',
      completedAt: '2026-05-06 14:30 UTC',
      duration: '3h 45m',
      changes: '18 strains added, 2 archived, 7 feedback accepted',
    },
    {
      id: 'train_20260511_002',
      type: 'reindex',
      status: 'running',
      stage: 'extracting',
      epoch: '—',
      loss: '—',
      accuracy: '—',
      eta: '47 min',
      startedAt: '2026-05-11 09:10 UTC',
      completedAt: null,
      duration: 'Running',
      changes: '12 strains added, 3 archived, 5 feedback accepted',
    },
    {
      id: 'train_20260429_003',
      type: 'full_retrain',
      status: 'failed',
      stage: 'training',
      epoch: '11 / 25',
      loss: '0.081',
      accuracy: '0.73',
      eta: '—',
      startedAt: '2026-04-29 08:00 UTC',
      completedAt: '2026-04-29 09:22 UTC',
      duration: '1h 22m',
      changes: '26 strains added, 1 archived, 9 feedback accepted',
    },
  ],
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/training" />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate replace to="/training" />} />
    </Routes>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="from-background via-background to-muted/25 text-foreground min-h-screen bg-gradient-to-b">
      <header className="border-border/70 bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase">
              <Layers3 className="size-3.5" />
              MycoAI Retrieval Platform
            </div>
            <p className="text-foreground text-sm font-medium text-wrap">
              Training observation and deployment console
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <NavItem to="/training" label="Training" />
            <NavItem to="/dashboard" label="Dashboard" />
          </nav>
        </div>
      </header>
      {children}
    </main>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-background text-muted-foreground hover:text-foreground',
        )
      }
    >
      {label}
    </NavLink>
  )
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10">
      {children}
    </section>
  )
}

function TrainingPage() {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <Shell>
      <PageFrame>
        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-8">
            <section className="border-border/70 bg-card rounded-3xl border p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="text-muted-foreground inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase dark:text-emerald-300">
                    <ShieldCheck className="size-3.5" />
                    Training status
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                      {trainingState.model}
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-base leading-7 md:text-lg">
                      Last training {trainingState.lastTrainingDate}. Current
                      model ready for review, staged deployment, and rollback.
                    </p>
                  </div>
                </div>
                <div className="bg-muted/40 rounded-2xl p-4 text-right">
                  <div className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
                    Latest F1
                  </div>
                  <div className="text-4xl font-semibold">
                    {trainingState.f1Score}
                  </div>
                </div>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <StatCard
                  label="Training strains"
                  value={trainingState.strainsInTrainingSet.toString()}
                  icon={<Layers3 className="size-4" />}
                />
                <StatCard
                  label="Last training"
                  value={trainingState.lastTrainingDate}
                  icon={<Clock3 className="size-4" />}
                />
                <StatCard
                  label="Staged version"
                  value={trainingState.stagedVersion}
                  icon={<Activity className="size-4" />}
                />
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="New strains"
                value={trainingState.preflight.newStrains.toString()}
                icon={<TrendingUp className="size-4" />}
              />
              <StatCard
                label="Archived strains"
                value={trainingState.preflight.archivedStrains.toString()}
                icon={<ServerCrash className="size-4" />}
              />
              <StatCard
                label="Feedback accepted"
                value={trainingState.preflight.feedbackAccepted.toString()}
                icon={<CheckCircle2 className="size-4" />}
              />
              <StatCard
                label="Estimated time"
                value={trainingState.preflight.estimatedHours}
                icon={<TimerReset className="size-4" />}
              />
            </section>

            <section className="border-border/70 bg-card rounded-3xl border p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold">Manual retrain</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Trigger reindex, finetune, or full retrain with pre-flight
                    summary.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => setConfirmed(true)}
                >
                  Retrain
                  <PlayCircle className="size-4" />
                </Button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoPanel title="Pre-flight checks">
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li>
                      {trainingState.preflight.newStrains} new strains added
                      since last train
                    </li>
                    <li>
                      {trainingState.preflight.archivedStrains} strains archived
                      since last train
                    </li>
                    <li>
                      {trainingState.preflight.feedbackAccepted} feedback
                      corrections accepted since last train
                    </li>
                    <li>
                      Estimated training time:{' '}
                      {trainingState.preflight.estimatedHours}
                    </li>
                  </ul>
                </InfoPanel>
                <InfoPanel title="Confirmation">
                  <p className="text-muted-foreground text-sm leading-6">
                    {confirmed
                      ? 'Retrain confirmed. Running job shows progress instead of starting another.'
                      : 'Confirm dialog would appear before starting. Only one job can run at once.'}
                  </p>
                </InfoPanel>
              </div>
            </section>

            <section className="border-border/70 bg-card rounded-3xl border p-8 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold">Progress</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Stage, epoch, loss, accuracy, ETA, logs, and graceful
                    cancel.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <PauseCircle className="size-4" />
                    Cancel
                  </Button>
                  <Button variant="secondary" className="gap-2">
                    <RotateCcw className="size-4" />
                    Deploy
                  </Button>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-sm font-medium">
                    Current stage: {trainingState.progress.stage}
                  </div>
                  <div className="bg-muted mt-2 h-3 rounded-full">
                    <div
                      className="bg-primary h-3 rounded-full"
                      style={{ width: '30%' }}
                    />
                  </div>
                  <div className="text-muted-foreground mt-2 flex flex-wrap gap-4 text-sm">
                    <span>Epoch {trainingState.progress.epoch}</span>
                    <span>Loss {trainingState.progress.loss}</span>
                    <span>Accuracy {trainingState.progress.accuracy}</span>
                    <span>ETA {trainingState.progress.eta}</span>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoPanel title="Streaming log">
                    <div className="text-muted-foreground space-y-2 text-sm">
                      <p>pre-flight checks passed</p>
                      <p>extracting features for active segments</p>
                      <p>epoch 3 / 25 loss=0.023 accuracy=0.91</p>
                    </div>
                  </InfoPanel>
                  <InfoPanel title="Notifications">
                    <p className="text-muted-foreground text-sm leading-6">
                      Completion and failure alerts can go to in-app inbox and
                      optional email/webhook.
                    </p>
                  </InfoPanel>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="border-border/70 bg-card rounded-3xl border p-8 shadow-sm">
              <h2 className="text-2xl font-semibold">Training history</h2>
              <div className="mt-6 space-y-4">
                {trainingState.jobs.map((job) => (
                  <article
                    key={job.id}
                    className="border-border/70 rounded-2xl border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{job.id}</div>
                        <div className="text-muted-foreground text-sm">
                          {job.type}
                        </div>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <Field label="Start" value={job.startedAt} />
                      <Field label="End" value={job.completedAt ?? 'running'} />
                      <Field label="Duration" value={job.duration} />
                      <Field label="Changes" value={job.changes} />
                    </dl>
                    <div className="text-muted-foreground mt-3 text-sm">
                      Stage {job.stage} · Epoch {job.epoch} · Loss {job.loss} ·
                      Accuracy {job.accuracy}
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="border-border/70 bg-card rounded-3xl border p-8 shadow-sm">
              <h2 className="text-2xl font-semibold">Deployment review</h2>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                Staged model {trainingState.stagedVersion} waits for review.
                Owner can compare metrics, deploy, or roll back to previous
                version.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button className="gap-2">
                  Deploy
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" className="gap-2">
                  <RotateCcw className="size-4" />
                  Roll back
                </Button>
              </div>
            </section>
          </aside>
        </div>
      </PageFrame>
    </Shell>
  )
}

function DashboardPage() {
  return (
    <Shell>
      <PageFrame>
        <section className="border-border/70 bg-card rounded-3xl border p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                Overview dashboard
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-base leading-7">
                Live status, model version, training metadata, and history in
                one place.
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Search className="size-4" />
              View API contract
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard
              label="Current model"
              value={trainingState.model}
              icon={<Layers3 className="size-4" />}
            />
            <StatCard
              label="Latest F1"
              value={trainingState.f1Score}
              icon={<TrendingUp className="size-4" />}
            />
            <StatCard
              label="Status"
              value="running"
              icon={<Activity className="size-4" />}
            />
          </div>
        </section>
      </PageFrame>
    </Shell>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: ReactNode
}) {
  return (
    <div className="border-border/70 bg-card rounded-2xl border p-5 shadow-sm">
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-lg font-semibold text-balance">{value}</div>
    </div>
  )
}

function InfoPanel({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="bg-muted/30 rounded-2xl p-4">
      <div className="mb-3 text-sm font-semibold">{title}</div>
      {children}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  )
}

function StatusBadge({ status }: { status: TrainingStatus }) {
  const classes: Record<TrainingStatus, string> = {
    pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    running: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    completed: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    failed: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    cancelled: 'bg-muted text-muted-foreground',
  }

  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase',
        classes[status],
      )}
    >
      {status}
    </span>
  )
}

export default App
