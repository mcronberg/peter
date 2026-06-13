# PetersApp

En lille React-app med spil, animationer og præsentationer til indskolingen.

## Udvikling

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

App-versionen hentes fra `package.json` og skrives til `public/version.json` før `dev` og `build`.

## GitHub Pages

Projektet er sat op til GitHub Pages via `.github/workflows/deploy.yml`.
Vite bruger `/peter/` som base path i produktionsbuilds, medmindre `VITE_BASE_PATH` sættes til noget andet.
