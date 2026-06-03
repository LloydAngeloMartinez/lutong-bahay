# Lutong Bahay Finder

Lutong Bahay Finder is a no-account Filipino recipe app that recommends dishes from a user's available ingredients. It includes recipe matching, missing-ingredient shopping lists, favorites, a random ulam picker, dish images, and an optional Groq-powered cooking assistant.

## Tech Stack

- React 19, TypeScript, and Vite for the frontend
- Express for the optional AI assistant API
- Groq SDK for AI responses
- Browser localStorage for pantry, favorites, and shopping list state
- Static recipe data in `src/data/recipes.ts`

## Local Development

1. Install dependencies:

```powershell
npm install
```

2. Create `.env` from the template:

```powershell
Copy-Item .env.example .env
```

3. Add your Groq key in `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

4. Start the API server:

```powershell
npm run server
```

5. In another terminal, start Vite:

```powershell
npm run dev
```

The app runs at `http://127.0.0.1:5173`.

## Production Run

Build the frontend and serve it from the Express app:

```powershell
npm run prod
```

Then open `http://127.0.0.1:8787`.

For production hosting, set these environment variables on the server:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=8787
ALLOWED_ORIGINS=https://your-domain.com
GROQ_MODEL=llama-3.3-70b-versatile
ASSISTANT_TIMEOUT_MS=25000
RATE_WINDOW_MS=60000
RATE_MAX_REQUESTS=20
```

If the frontend and API are served from the same Express app, `ALLOWED_ORIGINS` is mainly needed for separate preview/dev origins.

## Health Check

The API exposes:

```text
GET /api/health
```

It returns whether the server is running and whether the Groq assistant is configured.
