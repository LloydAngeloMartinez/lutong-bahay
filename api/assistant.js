import Groq from "groq-sdk";
import {
  applyCors,
  checkRateLimit,
  cleanString,
  normalizePantry,
  readJsonBody,
  rejectDisallowedOrigin
} from "./_shared.js";

export const config = {
  maxDuration: 30
};

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (rejectDisallowedOrigin(req, res)) return;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  if (!checkRateLimit(req)) {
    res.status(429).json({
      error: "Too many assistant requests. Please wait a moment and try again."
    });
    return;
  }

  if (!process.env.GROQ_API_KEY) {
    res.status(503).json({
      error:
        "Groq is not configured yet. Add GROQ_API_KEY in your Vercel project environment variables."
    });
    return;
  }

  let body;

  try {
    body = await readJsonBody(req);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.statusCode === 413 ? "Request body is too large." : "Malformed JSON request body."
    });
    return;
  }

  const message = cleanString(body?.message, 1000);
  const pantry = normalizePantry(body?.pantry);
  const selectedRecipe = cleanString(body?.selectedRecipe, 120);

  if (!message) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      timeout: Number(process.env.ASSISTANT_TIMEOUT_MS || 25000)
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

    res.status(200).json({
      answer: completion.choices[0]?.message?.content ?? "No answer returned."
    });
  } catch (error) {
    console.error("Assistant request failed:", error?.message || error);
    res.status(500).json({
      error: "The AI assistant is unavailable right now. Please try again later."
    });
  }
}
