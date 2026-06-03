const DEFAULT_ALLOWED_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173"];
const requestCounts = new Map();

export function getAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.includes(origin)) return true;

  try {
    const originHost = new URL(origin).host;
    const requestHost = req.headers["x-forwarded-host"] || req.headers.host;
    return Boolean(requestHost && originHost === requestHost);
  } catch {
    return false;
  }
}

export function applyCors(req, res) {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(req)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }

  return false;
}

export function rejectDisallowedOrigin(req, res) {
  if (isAllowedOrigin(req)) return false;
  res.status(403).json({ error: "Origin is not allowed." });
  return true;
}

export function cleanString(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function normalizePantry(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => cleanString(item, 60))
    .filter(Boolean)
    .slice(0, 80);
}

export function checkRateLimit(req) {
  const now = Date.now();
  const rateWindowMs = Number(process.env.RATE_WINDOW_MS || 60000);
  const rateMaxRequests = Number(process.env.RATE_MAX_REQUESTS || 20);
  const key =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  for (const [entryKey, value] of requestCounts.entries()) {
    if (value.resetAt <= now) {
      requestCounts.delete(entryKey);
    }
  }

  const current = requestCounts.get(key) || { count: 0, resetAt: now + rateWindowMs };
  current.count += 1;
  requestCounts.set(key, current);

  return current.count <= rateMaxRequests;
}

export async function readJsonBody(req, maxBytes = 64 * 1024) {
  if (req.body && typeof req.body === "object") return req.body;

  if (typeof req.body === "string") {
    if (Buffer.byteLength(req.body, "utf8") > maxBytes) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    return JSON.parse(req.body);
  }

  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}
