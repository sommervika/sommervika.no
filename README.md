# Sommervika – Nettside (Next.js + Tailwind + Netlify)

Dette repoet inneholder en enkel, estetisk nettside for sommerhuset **Sommervika**.

## Komme i gang

```bash
npm install
npm run dev
```

Åpne http://localhost:3000 i nettleser.

## Bygg og deploy (Netlify)

Dette repoet er klargjort for Netlify.

- `netlify.toml` er inkludert med riktig konfigurasjon (`@netlify/plugin-nextjs`).
- Når du kobler repoet til Netlify, vil siden bygges med `npm run build` og publiseres automatisk.

## Kalender

Bytt `src` på Google Calendar-`iframe` i `app/page.tsx` til deres offentlige kalender.