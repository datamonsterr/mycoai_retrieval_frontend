# MycoAI Retrieval Frontend

React frontend for scientist-facing retrieval, dataset, and indexing workflows
in the MycoAI platform, backed by outputs from the `retrieval` and
`kmeans_segmentation` experiment pipelines.

## Stack

- React 19
- Vite
- Tailwind CSS v4
- shadcn/ui
- TypeScript
- ESLint
- Prettier
- pnpm

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm format
pnpm run format:check
pnpm typecheck
pnpm build
```

## UI Setup

- Tailwind CSS v4 via `@tailwindcss/vite`
- shadcn/ui initialized with the `radix-nova` preset
- `@/*` alias mapped to `src/*`
