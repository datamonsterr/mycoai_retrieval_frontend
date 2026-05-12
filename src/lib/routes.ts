export type UserRole = 'public' | 'all' | 'owner'

export type AppRoute = {
  path: string
  label: string
  role: UserRole
  description: string
}

export const appRoutes: AppRoute[] = [
  {
    path: '/',
    label: 'Home',
    role: 'all',
    description: 'Landing redirect to upload',
  },
  {
    path: '/login',
    label: 'Login',
    role: 'public',
    description: 'Public login form',
  },
  {
    path: '/register',
    label: 'Register',
    role: 'public',
    description: 'Public registration form',
  },
  {
    path: '/upload',
    label: 'Upload',
    role: 'all',
    description: 'Single and batch image upload',
  },
  {
    path: '/results/:jobId',
    label: 'Results',
    role: 'all',
    description: 'Retrieval results view',
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    role: 'all',
    description: 'Overview metrics and charts',
  },
  {
    path: '/database',
    label: 'Database',
    role: 'all',
    description: 'Database browser',
  },
  {
    path: '/database/species/:id',
    label: 'Species detail',
    role: 'all',
    description: 'Species record detail',
  },
  {
    path: '/database/strains/:id',
    label: 'Strain detail',
    role: 'all',
    description: 'Strain record detail',
  },
  {
    path: '/feedback',
    label: 'Feedback',
    role: 'all',
    description: 'My submitted feedback',
  },
  {
    path: '/feedback/inbox',
    label: 'Feedback inbox',
    role: 'owner',
    description: 'Owner review queue',
  },
  {
    path: '/training',
    label: 'Training',
    role: 'owner',
    description: 'Training status and trigger',
  },
  {
    path: '/settings',
    label: 'Settings',
    role: 'all',
    description: 'User preferences and theme',
  },
  {
    path: '/admin/users',
    label: 'Users',
    role: 'owner',
    description: 'User management',
  },
]

export const routePaths = appRoutes.map((route) => route.path)
