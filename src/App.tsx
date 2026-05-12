import { ArrowRight, FlaskConical, Layers3, Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

type Role = 'data_owner' | 'normal_user'

type UserProfile = {
  name: string
  email: string
  role: Role
}

type Capability = {
  label: string
  allowed: boolean
}

const roleProfiles: Record<Role, UserProfile> = {
  data_owner: {
    name: 'Data Owner',
    email: 'owner@myco.ai',
    role: 'data_owner',
  },
  normal_user: {
    name: 'Normal User',
    email: 'researcher@myco.ai',
    role: 'normal_user',
  },
}

const commonCapabilities: Capability[] = [
  { label: 'Upload images for classification', allowed: true },
  { label: 'View retrieval results', allowed: true },
  { label: 'Submit feedback', allowed: true },
]

function getCapabilities(role: Role): Capability[] {
  const dataOwnerOnly = role === 'data_owner'

  return [
    ...commonCapabilities,
    { label: 'Create/edit species', allowed: dataOwnerOnly },
    { label: 'Upload images with direct species link', allowed: dataOwnerOnly },
    { label: 'Archive/delete data', allowed: dataOwnerOnly },
    { label: 'Restore from trash', allowed: dataOwnerOnly },
    { label: 'Review feedback', allowed: dataOwnerOnly },
    { label: 'Trigger retraining', allowed: dataOwnerOnly },
    { label: 'Configure system settings', allowed: dataOwnerOnly },
    { label: 'View audit logs', allowed: dataOwnerOnly },
    { label: 'Manage users', allowed: dataOwnerOnly },
  ]
}

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(roleProfiles.normal_user)
  const capabilities = profile ? getCapabilities(profile.role) : []
  const canManageData = profile?.role === 'data_owner'

  return (
    <main className="from-background via-background to-muted/30 text-foreground min-h-screen bg-gradient-to-b">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 py-16 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-3xl space-y-6">
            <div className="border-border/70 bg-background/80 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase backdrop-blur">
              <Layers3 className="size-3.5" />
              MycoAI Retrieval Platform
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                Scientist-facing search and indexing for fungal retrieval workflows.
              </h1>
              <p className="text-muted-foreground max-w-2xl text-base leading-7 md:text-lg">
                This frontend is the operator console for dataset management, index
                status, and retrieval queries backed by the MycoAI platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" disabled={!profile}>
                Open dashboard
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                View API contract
                <Search className="size-4" />
              </Button>
            </div>
          </div>

          <aside className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                  Session
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {profile ? profile.name : 'Signed out'}
                </h2>
                {profile ? (
                  <p className="text-muted-foreground text-sm">{profile.email}</p>
                ) : null}
              </div>
              <div className="bg-primary/10 text-primary rounded-2xl p-3">
                <ShieldCheck className="size-5" />
              </div>
            </div>

            {profile ? (
              <div className="mb-5 rounded-2xl border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                  Role
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {profile.role === 'data_owner' ? 'Data Owner' : 'Normal User'}
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={profile?.role === 'normal_user' ? 'default' : 'outline'}
                onClick={() => setProfile(roleProfiles.normal_user)}
              >
                Login normal
              </Button>
              <Button
                type="button"
                variant={profile?.role === 'data_owner' ? 'default' : 'outline'}
                onClick={() => setProfile(roleProfiles.data_owner)}
              >
                Login owner
              </Button>
              <Button type="button" variant="ghost" onClick={() => setProfile(null)}>
                Logout
              </Button>
            </div>
          </aside>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-2xl p-3">
              <Search className="size-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Query Console</h2>
            <p className="text-muted-foreground text-sm leading-6">
              Run species retrieval queries against the shared vector index with a
              scientist-friendly workflow.
            </p>
          </div>

          <div className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-2xl p-3">
              <FlaskConical className="size-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Dataset Operations</h2>
            <p className="text-muted-foreground text-sm leading-6">
              {canManageData
                ? 'Manage uploads, curation steps, and experiment-facing metadata.'
                : 'Classification upload and feedback submission are available.'}
            </p>
          </div>

          <div className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-2xl p-3">
              <Layers3 className="size-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Index Visibility</h2>
            <p className="text-muted-foreground text-sm leading-6">
              Surface collection health, model versions, and retrieval artifacts from
              the shared monorepo workflows.
            </p>
          </div>
        </div>

        {profile ? (
          <section className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                  Permissions
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Role-based actions</h2>
              </div>
              {canManageData ? (
                <Button type="button" className="gap-2">
                  Manage users
                  <ShieldCheck className="size-4" />
                </Button>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((capability) => (
                <div
                  key={capability.label}
                  className="border-border/70 flex items-center justify-between gap-4 rounded-2xl border p-4"
                >
                  <span className="text-sm font-medium">{capability.label}</span>
                  <span
                    className={
                      capability.allowed
                        ? 'text-primary text-sm font-semibold'
                        : 'text-muted-foreground text-sm'
                    }
                  >
                    {capability.allowed ? 'Allowed' : 'Hidden'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  )
}

export default App
