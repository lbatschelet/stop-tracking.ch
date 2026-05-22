# versteckis.ch

Digital zine: a field guide to surveillance and self-defense.

## Stack

- Next.js (App Router, static export)
- React 19
- Simple prev/next page navigation (one screen per zine page)
- Content in `src/content/zinePages.ts` (web + PDF share the same source)

## Project structure

```
src/
├── app/                 # layout, page, global styles
├── components/Zine/     # page viewer, nav, primitives
├── content/             # zine text blocks + spread builder
├── data/toolkit.ts      # links on the back cover
├── pdf/                 # client-side PDF export
└── types/zine.ts
```

## Edit content

- **All page copy:** `src/content/zinePages.ts`
- **Toolkit / org links:** `src/data/toolkit.ts`

## Development

```bash
npm install
npm run dev
```

```bash
npm run build    # static export to out/
npm test
npm run lint
```

## Deployment (Vercel)

Static export (`out/`) — configured in `vercel.json`.

1. **CLI einloggen** (lokal, einmalig): `vercel login`
2. **Projekt verknüpfen:** `vercel link` (Repo: `lbatschelet/versteckis.ch`)
3. **Produktion deployen:** `vercel --prod`
4. **Domain:** In [Vercel → Project → Settings → Domains](https://vercel.com) `versteckis.ch` und optional `www.versteckis.ch` hinzufügen. DNS beim Registrar:
   - `A` → `76.76.21.21`
   - `www` → `CNAME` → `cname.vercel-dns.com`

Alternativ ohne CLI: [GitHub-Repo importieren](https://vercel.com/new/import?s=https://github.com/lbatschelet/versteckis.ch) — danach deployt jeder Push auf `main` automatisch.

GitHub Actions führt nur Build + Tests aus (`ci.yml`); Hosting übernimmt Vercel.

## License

Private project.
