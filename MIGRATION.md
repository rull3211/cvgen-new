# Migration Guide: Monolithic to Monorepo

## What Changed

The project has been split into a monorepo with separate backend and frontend packages:

### Before (Monolithic)
- Single deployment to GCP Cloud Run
- Backend served frontend as static files
- Frontend and backend in same Docker image
- Slow deployments (full Docker rebuild for any change)

### After (Monorepo)
- **Backend**: Separate deployment to GCP Cloud Run
- **Frontend**: Separate deployment to Firebase Hosting
- Independent deployment pipelines
- Faster frontend deployments (no Docker needed)
- Better separation of concerns

## Directory Structure Changes

```
OLD:                           NEW:
/src/                         /packages/frontend/src/
/public/                      /packages/frontend/public/
/src/server.cjs              /packages/backend/server.cjs
/Dockerfile                   /packages/backend/Dockerfile
/package.json                 /package.json (workspace root)
                              /packages/frontend/package.json
                              /packages/backend/package.json
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Setup frontend environment:**
   ```bash
   cd packages/frontend
   cp .env.local.example .env.local
   # Edit .env.local if needed for local development
   ```

3. **Ensure backend has service account:**
   ```bash
   # Make sure PrivateServiceAccount.json exists in packages/backend/
   ```

## Development Workflow

### Running Locally

**Option 1: Both services**
```bash
# Terminal 1
pnpm run dev:backend

# Terminal 2
pnpm run dev:frontend
```

**Option 2: Frontend only (using deployed backend)**
```bash
cd packages/frontend
pnpm run dev
```

### Building

```bash
pnpm run build:frontend  # Build frontend only
pnpm run build:backend   # Nothing to build for backend
```

### Testing

```bash
pnpm run test  # Runs frontend tests
```

## Deployment Workflow

### Backend (GCP Cloud Run)

1. Ensure Docker is authenticated:
   ```bash
   gcloud auth configure-docker europe-west1-docker.pkg.dev
   ```

2. Deploy:
   ```bash
   pnpm run deploy:backend
   ```

   Or manually:
   ```bash
   cd packages/backend
   pnpm run docker:build
   pnpm run docker:push
   pnpm run cloud:deploy
   ```

### Frontend (Firebase Hosting)

1. Ensure Firebase CLI is authenticated:
   ```bash
   firebase login
   ```

2. Deploy:
   ```bash
   pnpm run deploy:frontend
   ```

   Or manually:
   ```bash
   cd packages/frontend
   pnpm run build
   firebase deploy --only hosting
   ```

## Code Changes

### Backend Changes

1. **CORS Configuration** (`packages/backend/server.cjs`):
   - Now explicitly allows Firebase Hosting origins
   - Allows localhost for development

2. **Removed Static File Serving**:
   - No longer serves frontend files
   - Removed `app.use(express.static(distPath))`
   - Removed SPA fallback route

3. **Dockerfile**:
   - Removed frontend build step
   - Smaller, faster builds

### Frontend Changes

1. **API Configuration** (`packages/frontend/src/config.ts`):
   - New config file for environment-based API URL
   - Uses `VITE_API_URL` environment variable

2. **Export PDF Hook** (`packages/frontend/src/hooks/exportPdf.ts`):
   - Now uses config.apiUrl instead of hardcoded URL
   - Works with both dev and production environments

3. **Environment Files**:
   - `.env.production` - Production backend URL
   - `.env.local` - Local development backend URL

## Important Notes

### CORS

The backend now has strict CORS configuration. Allowed origins:
- `https://cv-generator-b8c44.web.app`
- `https://cv-generator-b8c44.firebaseapp.com`
- `http://localhost:3000`
- `http://localhost:5173`

If you need to add more origins, edit `packages/backend/server.cjs`.

### Environment Variables

**Frontend:**
- `VITE_API_URL` - Backend API URL

**Backend:**
- `PORT` - Server port (default: 3001, Cloud Run: 8080)
- `SERVICE_ACCOUNT_JSON` - Firebase Admin credentials (optional)

### Firebase Configuration

Firebase hosting config is in `packages/frontend/firebase.json`. It includes:
- SPA rewrite rules (all routes → index.html)
- Cache headers for assets
- Public directory set to `dist/`

## Troubleshooting

### Frontend can't reach backend

1. Check `.env.local` has correct `VITE_API_URL`
2. Ensure backend is running on specified port
3. Check browser console for CORS errors

### CORS errors in production

1. Verify frontend URL is in backend's allowedOrigins
2. Ensure requests include Firebase auth token
3. Check backend logs on Cloud Run

### Firebase deploy fails

1. Run `firebase login` to authenticate
2. Verify `.firebaserc` has correct project ID
3. Ensure `pnpm run build` completes successfully

### Backend deploy fails

1. Check Docker authentication: `gcloud auth configure-docker europe-west1-docker.pkg.dev`
2. Verify `PrivateServiceAccount.json` exists in backend package
3. Ensure GCP project is set: `gcloud config get-value project`

## Migration Checklist

- [x] Split codebase into packages/backend and packages/frontend
- [x] Configure CORS on backend
- [x] Add environment variable support for frontend
- [x] Create Firebase hosting configuration
- [x] Update Dockerfile to not build frontend
- [x] Create separate package.json for each package
- [x] Update README with new deployment instructions
- [ ] Test backend deployment to Cloud Run
- [ ] Test frontend deployment to Firebase Hosting
- [ ] Verify CORS works in production
- [ ] Update CI/CD pipelines (if any)
- [ ] Clean up old files from root directory

## Next Steps

1. **Test the setup:**
   - Run both services locally
   - Test PDF generation
   - Verify Firebase auth works

2. **Deploy:**
   - Deploy backend to Cloud Run
   - Deploy frontend to Firebase Hosting
   - Test production environment

3. **Cleanup:**
   - Remove old files from root (src/, public/, Dockerfile)
   - Update .gitignore
   - Remove old README backup

4. **CI/CD (Optional):**
   - Set up GitHub Actions for automated deployments
   - Configure separate workflows for backend and frontend
