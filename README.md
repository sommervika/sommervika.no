# Sommervika – Next.js static export (Netlify)
- Bygg: `next build && next export` → publiser mappen `out/` på Netlify
- Kalender: Google Calendar integrert via CAL_URL i `app/page.tsx` (Europe/London). Bytt til `Europe/Oslo` hvis ønskelig.
- Ingen netlify.toml nødvendig.

## Netlify GUI
Build command: `npm run build`
Publish directory: `out`