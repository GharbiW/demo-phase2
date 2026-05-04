# Parnass — Phase 2 Demo (standalone)

This folder is a **fully separate** Next.js app that provides a **static demo** for Phase 2 (27 pages).

## Run

```powershell
cd .\demo-phase2
npm install
npm run dev
```

Open `http://localhost:3001`.

## Notes

- **No API calls**: all pages use hardcoded fixtures in `src/lib/demo-data.js`.
- **Same shell**: TopBar + Sidebar live in `src/components/layout/`.
- Assets: copy the Phase 1 logo files into `public/logo-parnass/` (see `public/logo-parnass/README.txt`).

