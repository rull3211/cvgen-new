# Quick Command Reference

## Development

```bash
pnpm dev              # 🚀 Run both backend and frontend (parallel)
pnpm run dev:backend  # Run backend only
pnpm run dev:frontend # Run frontend only
```

## Building

```bash
pnpm run build:backend   # Build backend (no-op)
pnpm run build:frontend  # Build frontend for production
```

## Deployment

```bash
pnpm run deploy:backend   # Deploy backend to GCP Cloud Run
pnpm run deploy:frontend  # Deploy frontend to Firebase Hosting
```

## Testing & Quality

```bash
pnpm run test    # Run frontend tests
pnpm run lint    # Lint frontend code
pnpm run format  # Format frontend code
pnpm run check   # Format and fix all issues
```

## Package Management

```bash
pnpm install                                      # Install all dependencies
pnpm --filter @cvgen/frontend add <package>      # Add to frontend
pnpm --filter @cvgen/backend add <package>       # Add to backend
pnpm --filter @cvgen/frontend remove <package>   # Remove from frontend
```

## Workspace Commands

```bash
pnpm -r <command>              # Run command in all workspaces
pnpm --filter <package> <cmd>  # Run command in specific workspace
pnpm --parallel <cmd>          # Run command in parallel
```

## Useful Aliases

Add these to your `~/.zshrc` for convenience:

```bash
alias pd="pnpm dev"
alias pdb="pnpm run dev:backend"
alias pdf="pnpm run dev:frontend"
alias pb="pnpm run build:frontend"
alias ptest="pnpm run test"
```

## First Time Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Setup frontend env:**

   ```bash
   cd packages/frontend
   cp .env.local.example .env.local
   ```

3. **Run development:**

   ```bash
   pnpm dev
   ```

4. **Access:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
