# Frontend Application

React + Vite + TanStack Router application for CV generation.

## Development

```bash
pnpm install
pnpm run dev
```

App runs on http://localhost:3000

## Environment Variables

Create a `.env.local` file (see `.env.local.example`):

```
VITE_API_URL=http://localhost:3001
```

For production, the backend URL is configured in `.env.production`.

## Building

```bash
pnpm run build
```

This creates a production build in the `dist/` directory.

## Testing

```bash
pnpm run test
```

## Deployment

Deploy to Firebase Hosting:

```bash
pnpm run deploy
```

Or manually:

```bash
pnpm run build
firebase deploy --only hosting
```

### First-time Firebase Setup

If you haven't set up Firebase CLI yet:

```bash
pnpm install -g firebase-tools
firebase login
```

## Code Quality

```bash
pnpm run lint      # Check for linting errors
pnpm run format    # Format code
pnpm run check     # Format and fix linting errors
```
