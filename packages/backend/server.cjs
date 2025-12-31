const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const cors = require("cors");
const path = require("path");
const zlib = require("zlib");
const admin = require("firebase-admin");

// Try to load service account from environment or file
let credential;
const serviceAccFromManager = process.env.SERVICE_ACCOUNT_JSON;

if (serviceAccFromManager) {
  // Use service account JSON from environment variable (production)
  credential = admin.credential.cert(JSON.parse(serviceAccFromManager));
} else {
  // Try to load from file (local development)
  try {
    const serviceAccount = require("./PrivateServiceAccount.json");
    credential = admin.credential.cert(serviceAccount);
  } catch (error) {
    console.error(
      "ERROR: No service account found. Set SERVICE_ACCOUNT_JSON environment variable or provide PrivateServiceAccount.json"
    );
    process.exit(1);
  }
}

admin.initializeApp({ credential });

module.exports = admin;

const app = express();

// CORS configuration for Firebase Hosting
const allowedOrigins = [
  "https://cv-generator-b8c44.web.app",
  "https://cv-generator-b8c44.firebaseapp.com",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json({ limit: "200kb" }));

const whitelistedEmails = ["benze00@gmail.com"];
const userExportLimits = new Map();

function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).send("Missing token");

  const idToken = authHeader.split("Bearer ")[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((err) => {
      console.error("Firebase token verification failed:", err);
      res.status(403).send("Invalid token");
    });
}
function pdfRateLimiter(req, res, next) {
  const { uid, email } = req.user;
  if (whitelistedEmails.includes(email)) return next();

  const now = Date.now();
  const limit = 10;
  const resetTime = 24 * 60 * 60 * 1000;

  let userData = userExportLimits.get(uid);
  if (!userData || now - userData.lastReset > resetTime) {
    userData = { count: 0, lastReset: now };
  }

  if (userData.count >= limit)
    return res.status(429).send("Daily export limit reached");

  userData.count++;
  userExportLimits.set(uid, userData);

  next();
}

// Health check
app.get("/ping", (req, res) => res.send("pong"));
app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// PDF generation helper
async function generatePDF(html, css) {
  // Use different Chrome paths for local dev vs production
  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    process.env.NODE_ENV === "production"
      ? "/usr/bin/google-chrome"
      : puppeteer.executablePath(); // Let puppeteer find Chrome automatically in dev

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const fullHtml = `
    <html>
      <head><style>${css || ""}</style></head>
      <body>${html}</body>
    </html>
  `;

  await page.setContent(fullHtml, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdfBuffer;
}

// PDF endpoint with decompression
app.post(
  "/generate-pdf",
  verifyFirebaseToken,
  pdfRateLimiter,
  async (req, res) => {
    try {
      if (!req.body?.data)
        return res.status(400).send("Missing compressed data");

      const compressed = Buffer.from(req.body.data, "base64");
      const decompressed = require("zlib").gunzipSync(compressed).toString();
      const { html, css } = JSON.parse(decompressed);

      if (!html) return res.status(400).send("Missing HTML");

      const pdf = await generatePDF(html, css);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=document.pdf",
        "Content-Length": pdf.length,
      });
      res.send(pdf);
    } catch (err) {
      console.error("PDF generation failed:", err);
      res.status(500).send("PDF generation failed");
    }
  }
);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
