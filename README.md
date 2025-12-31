# CV Generator - MonorepoWelcome to your new TanStack app!

A monorepo application for CV generation with separate backend and frontend deployments.# Getting Started

## Project StructureTo run this application:

```````bash

cvgen-new/npm install

├── packages/npm run start

│   ├── backend/          # Express + Puppeteer API server```

│   └── frontend/         # React + Vite + TanStack Router app

├── package.json          # Root workspace configuration# Building For Production

├── pnpm-workspace.yaml   # pnpm workspace configuration

└── README.md             # This fileTo build this application for production:

```

```bash

## Quick Startnpm run build

```

### Install Dependencies

## Testing

From the root directory:

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash

pnpm install```bash

```npm run test

```

This will install dependencies for both packages and download Chrome for Puppeteer.

## Styling

### Development

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

**Option 1: Run both services together (recommended):**

## Linting & Formatting

```bash

pnpm devThis project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```

```bash

This will start both backend and frontend in parallel.npm run lint

- Backend runs on http://localhost:3001npm run format

- Frontend runs on http://localhost:3000npm run check

```

**Option 2: Run services separately:**

## Routing

```bash

# Terminal 1 - BackendThis project uses [TanStack Router](https://tanstack.com/router). The initial setup is a code based router. Which means that the routes are defined in code (in the `./src/main.tsx` file). If you like you can also use a file based routing setup by following the [File Based Routing](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing) guide.

pnpm run dev:backend

### Adding A Route

# Terminal 2 - Frontend

pnpm run dev:frontendTo add a new route to your application just add another `createRoute` call to the `./src/main.tsx` file. The example below adds a new `/about`route to the root route.

```

```tsx

### Frontend Only Developmentconst aboutRoute = createRoute({

  getParentRoute: () => rootRoute,

If the backend is already deployed, you can run just the frontend:  path: '/about',

  component: () => <h1>About</h1>,

```bash})

cd packages/frontend```

pnpm run dev

```You will also need to add the route to the `routeTree` in the `./src/main.tsx` file.



Make sure `.env.local` points to your deployed backend URL.```tsx

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

## Architecture```



### Backend (`packages/backend`)With this set up you should be able to navigate to `/about` and see the about page.



- **Tech Stack**: Node.js, Express, Puppeteer, Firebase AdminOf course you don't need to implement the About page in the `main.tsx` file. You can create that component in another file and import it into the `main.tsx` file, then use it in the `component` property of the `createRoute` call, like so:

- **Purpose**: PDF generation API with Firebase authentication

- **Deployment**: Google Cloud Run (Docker container)```tsx

- **Endpoint**: https://cvgenerator-382610169939.europe-west1.run.appimport About from './components/About.tsx'



See `packages/backend/README.md` for backend-specific documentation.const aboutRoute = createRoute({

  getParentRoute: () => rootRoute,

### Frontend (`packages/frontend`)  path: '/about',

  component: About,

- **Tech Stack**: React 19, Vite, TanStack Router, Zustand, MUI})

- **Purpose**: CV editor with real-time preview```

- **Deployment**: Firebase Hosting

- **URL**: https://cv-generator-b8c44.web.appThat is how we have the `App` component set up with the home page.



See `packages/frontend/README.md` for frontend-specific documentation.For more information on the options you have when you are creating code based routes check out the [Code Based Routing](https://tanstack.com/router/latest/docs/framework/react/guide/code-based-routing) documentation.



## BuildingNow that you have two routes you can use a `Link` component to navigate between them.



Build both packages:### Adding Links



```bashTo use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

pnpm run build:backend

pnpm run build:frontend```tsx

```import { Link } from '@tanstack/react-router'

```

## Deployment

Then anywhere in your JSX you can use it like so:

### Backend to Google Cloud Run

```tsx

**Prerequisites:**<Link to="/about">About</Link>

- Google Cloud SDK installed and configured```

- Docker installed

- Authenticated: `gcloud auth login`This will create a link that will navigate to the `/about` route.

- Project set: `gcloud config set project cv-generator-475321`

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

**Deploy:**

### Using A Layout

```bash

pnpm run deploy:backendLayouts can be used to wrap the contents of the routes in menus, headers, footers, etc.

```

There is already a layout in the `src/main.tsx` file:

This will:

1. Build Docker image for linux/amd64```tsx

2. Push to Google Artifact Registryconst rootRoute = createRootRoute({

3. Deploy to Cloud Run  component: () => (

    <>

**Manual steps:**      <Outlet />

      <TanStackRouterDevtools />

```bash    </>

cd packages/backend  ),

pnpm run docker:build})

pnpm run docker:push```

pnpm run cloud:deploy

```You can use the React component specified in the `component` property of the `rootRoute` to wrap the contents of the routes. The `<Outlet />` component is used to render the current route within the body of the layout. For example you could add a header to the layout like so:



### Frontend to Firebase Hosting```tsx

import { Link } from '@tanstack/react-router'

**Prerequisites:**

- Firebase CLI installed: `npm install -g firebase-tools`const rootRoute = createRootRoute({

- Authenticated: `firebase login`  component: () => (

    <>

**Deploy:**      <header>

        <nav>

```bash          <Link to="/">Home</Link>

pnpm run deploy:frontend          <Link to="/about">About</Link>

```        </nav>

      </header>

Or manually:      <Outlet />

      <TanStackRouterDevtools />

```bash    </>

cd packages/frontend  ),

pnpm run build})

firebase deploy --only hosting```

```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

## Environment Configuration

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

### Backend

### Migrating To File Base Routing

Environment variables:

- `PORT` - Server port (default: 3001, Cloud Run: 8080)First you need to add the Vite plugin for Tanstack Router:

- `NODE_ENV` - Environment (`production` or `development`)

- `SERVICE_ACCOUNT_JSON` - Firebase service account credentials```bash

- `PUPPETEER_EXECUTABLE_PATH` - (Optional) Custom Chrome pathnpm install @tanstack/router-plugin -D

```

CORS is configured for:

- `https://cv-generator-b8c44.web.app`From there you need to update your `vite.config.js` file to use the plugin:

- `https://cv-generator-b8c44.firebaseapp.com`

- `http://localhost:3000````ts

- `http://localhost:5173`import { defineConfig } from 'vite'

import viteReact from '@vitejs/plugin-react'

### Frontendimport { TanStackRouterVite } from '@tanstack/router-plugin/vite'

import tailwindcss from '@tailwindcss/vite'

Create `packages/frontend/.env.local` for local development:

// https://vitejs.dev/config/

```bashexport default defineConfig({

VITE_API_URL=http://localhost:3001  plugins: [TanStackRouterVite(), viteReact(), tailwindcss()],

```})

```

Production uses `.env.production`:

Now you'll need to rearrange your files a little bit. That starts with creating a `routes` directory in the `src` directory:

```bash

VITE_API_URL=https://cvgenerator-382610169939.europe-west1.run.app```bash

```mkdir src/routes

```

## GCP Configuration

Then you'll need to create a `src/routes/__root.tsx` file with the contents of the root route that was in `main.tsx`.

- **Project ID**: `cv-generator-475321`

- **Artifact Registry**: `cvgen-image````tsx

- **Region**: `europe-west1`import { Outlet, createRootRoute } from '@tanstack/react-router'

- **Cloud Run Service**: `cvgenerator`import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'



## Firebase Configurationexport const Route = createRootRoute({

  component: () => (

- **Project ID**: `cv-generator-b8c44`    <>

- **Hosting URL**: https://cv-generator-b8c44.web.app      <Outlet />

- **Auth Domain**: cv-generator-b8c44.firebaseapp.com      <TanStackRouterDevtools />

    </>

## Testing  ),

})

Run frontend tests:```



```bashNext up you'll need to move your home route code into `src/routes/index.tsx`

pnpm run test

``````tsx

import { createFileRoute } from '@tanstack/react-router'

Or from frontend package:

import logo from '../logo.svg'

```bashimport '../App.css'

cd packages/frontend

pnpm run testexport const Route = createFileRoute('/')({

```  component: App,

})

## Code Quality

function App() {

```bash  return (

pnpm run lint      # Lint frontend code    <div className="text-center">

pnpm run format    # Format frontend code      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">

pnpm run check     # Format and fix linting errors        <img

```          src={logo}

          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"

## Package Manager          alt="logo"

        />

This project uses **pnpm** for package management. Key commands:        <p>

          Edit <code>src/App.tsx</code> and save to reload.

```bash        </p>

pnpm install              # Install all dependencies        <a

pnpm add <package>        # Add a dependency to root          className="text-[#61dafb] hover:underline"

pnpm --filter @cvgen/frontend add <package>   # Add to frontend          href="https://reactjs.org"

pnpm --filter @cvgen/backend add <package>    # Add to backend          target="_blank"

```          rel="noopener noreferrer"

        >

## Migration Notes          Learn React

        </a>

This project was split from a monolithic deployment where the backend served the frontend as static files. Now:        <a

          className="text-[#61dafb] hover:underline"

- **Backend**: Standalone API on Cloud Run with CORS configured          href="https://tanstack.com"

- **Frontend**: Static SPA on Firebase Hosting          target="_blank"

- **Benefits**:           rel="noopener noreferrer"

  - Independent deployments        >

  - Better scalability          Learn TanStack

  - Faster frontend deployments (no Docker build)        </a>

  - Firebase CDN for frontend assets      </header>

    </div>

## Troubleshooting  )

}

### Puppeteer Chrome Not Found```



If you see "Browser was not found at the configured executablePath" error:At this point you can delete `src/App.tsx`, you will no longer need it as the contents have moved into `src/routes/index.tsx`.



```bashThe only additional code is the `createFileRoute` function that tells TanStack Router where to render the route. Helpfully the Vite plugin will keep the path argument that goes to `createFileRoute` automatically in sync with the file system.

# Install Chrome for Puppeteer manually

cd packages/backendFinally the `src/main.tsx` file can be simplified down to this:

npx puppeteer browsers install chrome

``````tsx

import { StrictMode } from 'react'

Or let the postinstall script handle it:import ReactDOM from 'react-dom/client'

import { RouterProvider, createRouter } from '@tanstack/react-router'

```bash

cd packages/backend// Import the generated route tree

pnpm installimport { routeTree } from './routeTree.gen'

```

import './styles.css'

### CORS Errorsimport reportWebVitals from './reportWebVitals.ts'



If you see CORS errors, ensure:// Create a new router instance

1. Backend CORS origins include your frontend URLconst router = createRouter({

2. Frontend is using the correct backend URL  routeTree,

3. Requests include proper Firebase auth tokens  defaultPreload: 'intent',

  defaultPreloadStaleTime: 0,

### Firebase Hosting 404s  scrollRestoration: true,

  defaultStructuralSharing: true,

Make sure `firebase.json` has the SPA rewrite rule:})



```json// Register the router instance for type safety

{declare module '@tanstack/react-router' {

  "rewrites": [  interface Register {

    {    router: typeof router

      "source": "**",  }

      "destination": "/index.html"}

    }

  ]// Render the app

}const rootElement = document.getElementById('app')!

```if (!rootElement.innerHTML) {

  const root = ReactDOM.createRoot(rootElement)

### Cloud Run Deployment Issues  root.render(

    <StrictMode>

- Ensure Docker image is built for `linux/amd64` platform      <RouterProvider router={router} />

- Check that `PrivateServiceAccount.json` exists in backend package    </StrictMode>,

- Verify Cloud Run has the `SERVICE_ACCOUNT_JSON` environment variable set  )

}

### pnpm Workspace Issues

// If you want to start measuring performance in your app, pass a function

If you see workspace-related errors:// to log results (for example: reportWebVitals(console.log))

1. Ensure `pnpm-workspace.yaml` exists in root// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

2. Check package names match in package.json files (`@cvgen/backend`, `@cvgen/frontend`)reportWebVitals()

3. Run `pnpm install` from the root directory```



### Backend Port Already in UseNow you've got a file based routing setup in your project! Let's have some fun with it! Just create a file in `about.tsx` in `src/routes` and it if the application is running TanStack will automatically add contents to the file and you'll have the start of your `/about` route ready to go with no additional work. You can see why folks find File Based Routing so easy to use.



If port 3001 is already in use:You can find out everything you need to know on how to use file based routing in the [File Based Routing](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing) documentation.



```bash## Data Fetching

# Find and kill the process

lsof -ti:3001 | xargs kill -9There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.



# Or set a different portFor example:

PORT=3002 pnpm run dev:backend

``````tsx

const peopleRoute = createRoute({

## Learn More  getParentRoute: () => rootRoute,

  path: '/people',

- [TanStack Router](https://tanstack.com/router)  loader: async () => {

- [Firebase Hosting](https://firebase.google.com/docs/hosting)    const response = await fetch('https://swapi.dev/api/people')

- [Google Cloud Run](https://cloud.google.com/run/docs)    return response.json() as Promise<{

- [Puppeteer](https://pptr.dev/)      results: {

- [pnpm Workspaces](https://pnpm.io/workspaces)        name: string

      }[]
    }>
  },
  component: () => {
    const data = peopleRoute.useLoaderData()
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    )
  },
})
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ...

const queryClient = new QueryClient()

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
})
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from '@tanstack/react-query'

import './App.css'

function App() {
  const { data } = useQuery({
    queryKey: ['people'],
    queryFn: () =>
      fetch('https://swapi.dev/api/people')
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  })

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

function App() {
  const count = useStore(countStore)
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  )
}

export default App
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store, Derived } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
})
doubledStore.mount()

function App() {
  const count = useStore(countStore)
  const doubledCount = useStore(doubledStore)

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  )
}

export default App
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

# Deployment

## Building and Deploying to Google Cloud Run

This application is deployed to Google Cloud Run using Docker containers stored in Google Artifact Registry.

### Prerequisites

- Google Cloud SDK (`gcloud`) installed and configured
- Docker installed
- Authenticated with Google Cloud: `gcloud auth login`
- Project set: `gcloud config set project cv-generator-475321`

### Build and Push Docker Image

1. **Configure Docker authentication** (one-time setup):

```bash
gcloud auth configure-docker europe-west1-docker.pkg.dev
```

2. **Build the Docker image** (with linux/amd64 platform for Cloud Run):

```bash
docker build --platform linux/amd64 -t europe-west1-docker.pkg.dev/cv-generator-475321/cvgen-image/cvgen-new:latest .
```

3. **Push to Artifact Registry**:

```bash
docker push europe-west1-docker.pkg.dev/cv-generator-475321/cvgen-image/cvgen-new:latest
```

> **Note**: The `--platform linux/amd64` flag is required for Cloud Run compatibility, especially when building on Apple Silicon (ARM) Macs.

### Deploy to Cloud Run

```bash
gcloud run deploy cvgenerator \
  --image europe-west1-docker.pkg.dev/cv-generator-475321/cvgen-image/cvgen-new:latest \
  --region europe-west1 \
  --platform managed
```

### Project Configuration

- **GCP Project ID**: `cv-generator-475321`
- **Artifact Registry Repository**: `cvgen-image`
- **Region**: `europe-west1`
- **Cloud Run Service**: `cvgenerator`
- **Image Name**: `cvgen-new`
```````
