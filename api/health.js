import { applyCors, rejectDisallowedOrigin } from "./_shared.js";

export default function handler(req, res) {
  if (applyCors(req, res)) return;
  if (rejectDisallowedOrigin(req, res)) return;

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  res.status(200).json({
    ok: true,
    assistantConfigured: Boolean(process.env.GROQ_API_KEY),
    runtime: "vercel"
  });
}
