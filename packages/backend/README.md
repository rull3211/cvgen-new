# Backend API Server

Express server with Puppeteer for PDF generation.

## Development

**Prerequisites:**

- Node.js >= 18
- Chrome or Chromium installed (Puppeteer will auto-detect)

```bash
pnpm install
pnpm run dev
```

Server runs on http://localhost:3001 (or PORT env variable).

**Note:** In development, Puppeteer automatically finds your local Chrome installation. In production (Docker), it uses `/usr/bin/google-chrome`.

## Endpoints

- `GET /ping` - Health check
- `GET /health` - Health status with timestamp
- `POST /generate-pdf` - Generate PDF from HTML/CSS (requires Firebase auth token)

## Deployment

Deploy to Google Cloud Run:

```bash
pnpm run deploy
```

Or manually:

```bash
pnpm run docker:build
pnpm run docker:push
pnpm run cloud:deploy
```

## Environment Variables

- `PORT` - Server port (default: 3001, Cloud Run uses 8080)
- `NODE_ENV` - Environment (`production` or `development`)
- `SERVICE_ACCOUNT_JSON` - Firebase service account credentials (optional, falls back to PrivateServiceAccount.json)
- `PUPPETEER_EXECUTABLE_PATH` - (Optional) Custom Chrome executable path
