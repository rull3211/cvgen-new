import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'

import './styles.css'
import { useAuth } from './hooks/useAuth.ts'
import Login from './features/auth/Login.tsx'
import CvListPage from './features/cvList/CvListPage.tsx'
import CvEditor from './features/cvAppLayout/CvEditor.tsx'
import GlobalSnackbar from './components/GlobalSnackbar.tsx'
import Navbar from './components/Navbar/Navbar.tsx'

// Auth layout component
function AuthLayout() {
  const { user, loading } = useAuth()
  const routerState = useRouterState()

  if (loading) return <div>Loading...</div>
  if (!user) return <Login />

  // Show navbar only on CV editor routes
  const showNavbar =
    routerState.location.pathname.startsWith('/cvs/') &&
    routerState.location.pathname !== '/cvs'

  return (
    <>
      {showNavbar && <Navbar />}
      <Outlet />
      <GlobalSnackbar />
    </>
  )
}

// Define routes
const rootRoute = createRootRoute({
  component: AuthLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/cvs' })
  },
})

const cvsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cvs',
  component: CvListPage,
})

const cvEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cvs/$cvId',
  component: CvEditor,
})

const routeTree = rootRoute.addChildren([indexRoute, cvsRoute, cvEditorRoute])

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
