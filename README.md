<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# SchemeSahay

SchemeSahay is an AI-assisted Indian government scheme discovery platform with source-grounded answers, deterministic eligibility checks, multilingual support, and voice assistance.

View your app in AI Studio: https://ai.studio/apps/3cf46091-fc09-4cfe-b017-5a0348142274

## Run Locally

**Prerequisites:** Node.js


1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` or `GROQ_API_KEY` in `.env` for AI responses. The app includes an offline fallback when no key is available.
3. Run the app:
   `npm run dev`

## Project Layout

```text
frontend/   React UI, components, context, translations, and API client
backend/    Express server, API routes, scheme data, and eligibility engine
rag/        Knowledge chunks and retrieval logic for source-grounded AI answers
shared/     TypeScript contracts shared by frontend and backend
```

The root `index.html`, `vite.config.ts`, and `package.json` provide the application entrypoint and build tooling. Use `npm run lint` for type checking and `npm run build` for a production build.
