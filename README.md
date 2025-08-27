# Sommervika – Static Export for Netlify
Denne versjonen bruker `next export` → **`out/`**. Perfekt for Netlify **manual/Git deploy** uten Next-plugin-krøll.

## Lokalt
npm install
npm run build
# resultat i ./out

## Netlify (Git deploy)
- Build command: `npm run build`
- Publish directory: `out`
- Ikke nødvendig med netlify.toml eller plugin.

HTTPS: Domain management → Verify DNS → Provision certificate.