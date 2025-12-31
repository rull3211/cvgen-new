# CV Generator - Monorepo

A monorepo application for CV generation with separate backend and frontend deployments.

## Project Structure

```
cvgen-new/
├── packages/
│   ├── backend/          # Express + Puppeteer API server
│   └── frontend/         # React + Vite + TanStack Router app
├── package.json          # Root workspace configuration
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── README.md
```

## Quick Start

### Install Dependencies

From the root directory:

```bash
pnpm install
```

This will install dependencies for both packages and download Chrome for Puppeteer.

### Development

**Option 1: Run both services together (recommended):**

```bash
pnpm dev
```

This will start both backend and frontend in parallel.

- Backend runs on http://localhost:3001
- Frontend runs on http://localhost:3000

**Option 2: Run services separately:**

```bash
# Terminal 1 - Backend
pnpm run dev:backend

# Terminal 2 - Frontend
pnpm run dev:frontend
```

### Frontend Only Development

If the backend is already deployed, you can run just the frontend:

```bash
cd packages/frontend
pnpm run dev
```

Make sure `.env.local` points to your deployed backend URL.

## Architecture

### Backend (`packages/backend`)

- **Tech Stack**: Node.js, Express, Puppeteer, Firebase Admin
- **Purpose**: PDF generation API with Firebase authentication
- **Deployment**: Google Cloud Run (Docker container)
- **Endpoint**: https://cvgenerator-382610169939.europe-west1.run.app

See `packages/backend/README.md` for backend-specific documentation.

### Frontend (`packages/frontend`)

- **Tech Stack**: React 19, Vite, TanStack Router, Zustand, MUI
- **Purpose**: CV editor with real-time preview
- **Deployment**: Firebase Hosting
- **URL**: https://cv-generator-b8c44.web.app

See `packages/frontend/README.md` for frontend-specific documentation.

## Building

Build both packages:

```bash
pnpm run build:backend
pnpm run build:frontend
```

## Deployment

### Backend to Google Cloud Run

**Prerequisites:**

- Google Cloud SDK installed and configured
- Docker installed
- Authenticated: `gcloud auth login`
- Project set: `gcloud config set project cv-generator-475321`

**Deploy:**

```bash
pnpm run deploy:backend
```

This will:

1. Build Docker image for linux/amd64
2. Push to Google Artifact Registry
3. Deploy to Cloud Run

**Manual steps:**

```bash
cd packages/backend
pnpm run docker:build
pnpm run docker:push
pnpm run cloud:deploy
```

### Frontend to Firebase Hosting

**Prerequisites:**

- Firebase CLI installed: `npm install -g firebase-tools`
- Authenticated: `firebase login`

**Deploy:**

```bash
pnpm run deploy:frontend
```

Or manually:

```bash
cd packages/frontend
pnpm run build
firebase deploy --only hosting
```

## Environment Configuration

### Backend

Environment variables:

- `PORT` - Server port (default: 3001, Cloud Run: 8080)
- `NODE_ENV` - Environment (`production` or `development`)
- `SERVICE_ACCOUNT_JSON` - Firebase service account credentials
- `PUPPETEER_EXECUTABLE_PATH` - (Optional) Custom Chrome path

CORS is configured for:

- `https://cv-generator-b8c44.web.app`
- `https://cv-generator-b8c44.firebaseapp.com`
- `http://localhost:3000`
- `http://localhost:5173`

### Frontend

Create `packages/frontend/.env.local` for local development:

```bash
VITE_API_URL=http://localhost:3001
```

Production uses `.env.production`:

```bash
VITE_API_URL=https://cvgenerator-382610169939.europe-west1.run.app
```

## GCP Configuration

- **Project ID**: `cv-generator-475321`
- **Artifact Registry**: `cvgen-image`
- **Region**: `europe-west1`
- **Cloud Run Service**: `cvgenerator`

## Firebase Configuration

- **Project ID**: `cv-generator-b8c44`
- **Hosting URL**: https://cv-generator-b8c44.web.app
- **Auth Domain**: cv-generator-b8c44.firebaseapp.com

## Testing

Run frontend tests:

```bash
pnpm run test
```

Or from frontend package:

```bash
cd packages/frontend
pnpm run test
```

## Code Quality

```bash
pnpm run lint      # Lint frontend code
pnpm run format    # Format frontend code
pnpm run check     # Format and fix linting errors
```

## Package Manager

This project uses **pnpm** for package management. Key commands:

```bash
pnpm install              # Install all dependencies
pnpm add <package>        # Add a dependency to root
pnpm --filter @cvgen/frontend add <package>   # Add to frontend
pnpm --filter @cvgen/backend add <package>    # Add to backend
```

## Migration Notes

This project was split from a monolithic deployment where the backend served the frontend as static files. Now:

- **Backend**: Standalone API on Cloud Run with CORS configured
- **Frontend**: Static SPA on Firebase Hosting
- **Benefits**:
  - Independent deployments
  - Better scalability
  - Faster frontend deployments (no Docker build)
  - Firebase CDN for frontend assets

## Troubleshooting

### Puppeteer Chrome Not Found

If you see "Browser was not found at the configured executablePath" error:

```bash
# Install Chrome for Puppeteer manually
cd packages/backend
npx puppeteer browsers install chrome
```

Or let the postinstall script handle it:

```bash
cd packages/backend
pnpm install
```

### CORS Errors

If you see CORS errors, ensure:

1. Backend CORS origins include your frontend URL
2. Frontend is using the correct backend URL
3. Requests include proper Firebase auth tokens

### Firebase Hosting 404s

Make sure `firebase.json` has the SPA rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "**",
      "destination": "/index.html"
    }
  ]
}
```

### Cloud Run Deployment Issues

- Ensure Docker image is built for `linux/amd64` platform
- Check that `PrivateServiceAccount.json` exists in backend package
- Verify Cloud Run has the `SERVICE_ACCOUNT_JSON` environment variable set

### pnpm Workspace Issues

If you see workspace-related errors:

1. Ensure `pnpm-workspace.yaml` exists in root
2. Check package names match in package.json files (`@cvgen/backend`, `@cvgen/frontend`)
3. Run `pnpm install` from the root directory

### Backend Port Already in Use

If port 3001 is already in use:

```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9

# Or set a different port
PORT=3002 pnpm run dev:backend
```

## Learn More

- [TanStack Router](https://tanstack.com/router)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [Puppeteer](https://pptr.dev/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
