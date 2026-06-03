import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Groq from "groq-sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 8787);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://127.0.0.1:5173,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const assistantTimeoutMs = Number(process.env.ASSISTANT_TIMEOUT_MS || 25000);
const rateWindowMs = Number(process.env.RATE_WINDOW_MS || 60000);
const rateMaxRequests = Number(process.env.RATE_MAX_REQUESTS || 20);
const requestCounts = new Map();

function pruneRateLimit(now) {
  for (const [key, value] of requestCounts.entries()) {
    if (value.resetAt <= now) {
      requestCounts.delete(key);
    }
  }
}

function assistantRateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  pruneRateLimit(now);

  const current = requestCounts.get(key) || { count: 0, resetAt: now + rateWindowMs };
  current.count += 1;
  requestCounts.set(key, current);

  if (current.count > rateMaxRequests) {
    return res.status(429).json({
      error: "Too many assistant requests. Please wait a moment and try again."
    });
  }

  return next();
}

function cleanString(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function normalizePantry(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => cleanString(item, 60))
    .filter(Boolean)
    .slice(0, 80);
}

function isAllowedOrigin(origin, host) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

app.disable("x-powered-by");
app.use((req, res, next) => {
  if (!isAllowedOrigin(req.get("origin"), req.get("host"))) {
    return res.status(403).json({ error: "Origin is not allowed." });
  }

  return next();
});
app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    }
  })
);
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    assistantConfigured: Boolean(process.env.GROQ_API_KEY)
  });
});

app.post("/api/assistant", assistantRateLimit, async (req, res) => {
  const message = cleanString(req.body?.message, 1000);
  const pantry = normalizePantry(req.body?.pantry);
  const selectedRecipe = cleanString(req.body?.selectedRecipe, 120);

  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({
      error:
        "Groq is not configured yet. Set GROQ_API_KEY in your .env file to enable the AI assistant."
    });
  }

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      timeout: assistantTimeoutMs
    });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a concise Filipino home-cooking assistant. Suggest practical, culturally appropriate Philippine cuisine ideas. Do not invent medical nutrition advice."
        },
        {
          role: "user",
          content: JSON.stringify({
            question: message,
            pantry,
            selectedRecipe
          })
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    return res.json({
      answer: completion.choices[0]?.message?.content ?? "No answer returned."
    });
  } catch (error) {
    console.error("Assistant request failed:", error?.message || error);
    return res.status(500).json({
      error: "The AI assistant is unavailable right now. Please try again later."
    });
  }
});

const distPath = path.resolve(__dirname, "../dist");

if (existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: "1h" }));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      next();
      return;
    }

    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found." });
});

app.use((error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error?.type === "entity.too.large") {
    res.status(413).json({ error: "Request body is too large." });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: "Malformed JSON request body." });
    return;
  }

  console.error("Unhandled server error:", error?.message || error);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(port, () => {
  console.log(`Lutong Bahay API listening on http://127.0.0.1:${port}`);
});
