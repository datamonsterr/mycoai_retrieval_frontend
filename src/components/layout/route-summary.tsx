import { appRoutes } from '@/lib/routes'

export function RouteSummary() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {appRoutes.map((route) => (
        <article
          key={route.path}
          className="border-border/70 bg-card rounded-2xl border p-4 shadow-sm"
        >
          <div className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            {route.role}
          </div>
          <div className="text-muted-foreground mt-2 text-xs">{route.path}</div>
          <h2 className="font-semibold">{route.label}</h2>
          <p className="text-muted-foreground text-sm">{route.description}</p>
        </article>
      ))}
    </section>
  )
}
