# PetersApp Agent Instructions

## Formål

`PetersApp` er en dansk React-app med små spil, animationer og præsentationer til indskolingen, især 1.-3. klasse. Appen er tænkt som et muntert, roligt undervisningsværktøj til Peter, der arbejder som folkeskolelærer i Nordsjælland.

## Teknisk retning

- Brug React med Vite.
- Brug Tailwind CSS via `@tailwindcss/vite`.
- Brug `lucide-react` som ikonbibliotek til spil og generelle UI-ikoner.
- Appen deployes til GitHub Pages.
- Standard produktionsbase er `/peter/`; brug `VITE_BASE_PATH`, hvis deploy-målet ændres.
- UI-sproget er dansk.
- Versionen skal hentes fra `package.json`, ikke hardcodes flere steder.
- `scripts/write-version.mjs` skriver `public/version.json` før `dev` og `build`.

## Designretning

- Målgruppen er 1.-3. klasse: farverigt, venligt, tydeligt og let at forstå.
- Desktop er primær brugssituation, typisk på klassens skærm.
- Enkelte spil skal senere kunne fungere på telefon, så layout og klikflader skal være responsive.
- Brug store klikområder, tydelige kontraster og stabile dimensioner.
- Undgå lange forklaringstekster i selve appen.
- Forsiden skal være selve oplevelsen, ikke en marketing-landingpage.
- Forsiden skal kun vise tiles for rigtige aktiviteter; undgå `kommer snart`-kort.
- Hold kort/tiles enkle: titel, fag/type, kort beskrivelse og gerne tydelig status.

## Nuværende appstruktur

- Header: `PetersApp`
- Menu: kun `Om` lige nu
- Forside: kun kategoriserede tile-grids med aktiviteter, uden hero-/forklaringstekst. Brug foreløbigt kategorierne `Tal` og `Sprog`.
- Første aktivitet: `10'er-venner`, et matematikspil hvor elever vælger to tal fra 1-9, der tilsammen giver 10
- Anden aktivitet: `Ord-match`, et sprogspil med dansk, engelsk og tysk, hvor 10 tilfældige ord vælges fra en pulje på 30 ord/ikoner. Forsiden skal kunne starte spillet direkte på dansk, engelsk eller tysk med tekst og flag.
- Om-side: handler om appens formål, ikke Peters personlige profil
- Footer: viser appnavn og version

## Cache og versioner

GitHub Pages kan cache aggressivt. Undgå service worker/PWA, medmindre der senere er en meget klar grund.

Den nuværende strategi:

- Vite laver hashed assets i produktionsbuild.
- Appen fetcher `version.json?t=<timestamp>` med `cache: "no-store"`.
- Hvis `version.json` har en anden version end den kørende app, vises en besked:
  `Der er kommet en ny version.`
- Knappen laver en reload med version query parameter.

Når versionen ændres, opdater `version` i `package.json`.

## Arbejdsmåde

- Hold ændringer små og lette at forstå.
- Tilføj nye spil som selvstændige komponenter eller mapper, så forsiden kan vokse uden rod.
- Spil til de yngste elever skal kunne bruges med både mus, touch og gerne simple tastatur-/skærmlæser-signaler.
- `10'er-venner` skal passe på én skærm uden lodret eller vandret scrollbar, også ved 1280x720 og små mobilvisninger.
- `Ord-match` skal passe på én skærm uden scrollbar på både desktop og telefon. På telefon bruges primært tryk-for-at-matche i stedet for drag/drop.
- I `Ord-match` skal klik på ord eller ikon oplæse ordet på det valgte sprog, men samme ord må ikke oplæses to gange i træk.
- Brug Web Audio API til små lyde, når det er nok; undgå tunge lydfiler uden god grund.
- Bevar dansk tekst og den venlige skole-tone.
- Kør `npm run build` før en ændring betragtes som færdig.
- Ved frontendændringer bør appen åbnes lokalt og tjekkes visuelt på desktop og en mobilbredde.

## Kommandoer

```bash
npm install
npm run dev
npm run build
npm run preview
```
