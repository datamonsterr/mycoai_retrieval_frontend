import { Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, Microscope, UploadCloud } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useTheme } from '@/context/theme-context'
import { appRoutes } from '@/lib/routes'

const navItems = appRoutes.filter((route) => route.role !== 'public')

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="border-border/70 bg-card/80 flex flex-col gap-6 rounded-3xl border p-4 shadow-sm backdrop-blur">
          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.24em] uppercase">
              <Microscope className="size-4" />
              MycoAI Retrieval
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              Front-end shell
            </p>
            <p className="text-muted-foreground text-sm leading-6">
              Sidebar layout, route map, and state boundaries for scientist
              workflows.
            </p>
          </div>

          <nav className="grid gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path === '/dashboard' ? '/upload' : item.path}
                className={({ isActive }) =>
                  [
                    'flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted',
                  ].join(' ')
                }
              >
                <span>{item.label}</span>
                <span className="text-xs opacity-70">{item.role}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-border/70 bg-background/70 rounded-2xl border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Session</span>
              <span>{user ? user.email : 'Guest'}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={toggleTheme}>
                Theme: {theme}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={logout}
                disabled={user === null}
              >
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <header className="border-border/70 bg-card/80 flex flex-wrap items-center justify-between gap-4 rounded-3xl border px-5 py-4 shadow-sm backdrop-blur">
            <div>
              <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
                Desktop-first SPA
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Route hierarchy + server state ready
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/upload">
                  <UploadCloud className="size-4" />
                  Upload
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard">
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  )
}
