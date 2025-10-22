import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import './styles.css'
import { useAuth } from './hooks/useAuth.ts'
import Login from './features/auth/Login.tsx'
import CvAppLayout from './features/cvAppLayout/CvAppLayout.tsx'

// Auth layout component
function AuthLayout() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Login />

  return <CvAppLayout />
}

// Define routes
const rootRoute = createRootRoute({
  component: AuthLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuthLayout,
})

const routeTree = rootRoute.addChildren([indexRoute])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Mount the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
