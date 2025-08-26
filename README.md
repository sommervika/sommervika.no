# Sommervika – Next.js + Tailwind (Netlify-ready)
- Global CSS import flyttet til `app/layout.tsx` (krav i Next.js).
- `netlify.toml` uten publish-dir. Netlify-plugin for Next.js styrer deploy.

## Lokalt
npm install
npm run dev

## Netlify
- Importer repoet fra GitHub
- Build command: `npm run build`
- **Ikke sett publish directory**
- Installer plugin: `@netlify/plugin-nextjs`
- Trigger nytt deploy (Clear cache and deploy)