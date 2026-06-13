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
- Forside: kun kategoriserede tile-grids med aktiviteter, uden hero-/forklaringstekst. Kategorier nu: `Tal`, `Sprog`, `Natur` og `For sjov`.
- Første aktivitet: `10'er-venner`, et matematikspil hvor elever vælger to tal fra 1-9, der tilsammen giver 10
- Tal-aktivitet: `Fordel æbler`, et begynderspil til division hvor elever fordeler op til 10 æbler ligeligt mellem 2-4 børn.
- Tal-aktivitet: `Byg rækker`, et begynderspil til gange hvor elever bygger 2-5 rækker med lige mange frugter i hver række.
- Sprog-aktivitet: `Ord-match`, et sprogspil med dansk, engelsk og tysk, hvor 10 tilfældige ord vælges fra en pulje på 30 ord/ikoner. Forsiden skal kunne starte spillet direkte på dansk, engelsk eller tysk med tekst og flag.
- Natur-aktivitet: `Solformørkelse`, en interaktiv forklaring hvor eleven trækker Månen foran Solen. Himlen bliver gradvist mørkere, Solen får en segl-form, og ved fuld dækning ses koronaen. Hele scenen er tegnet i ren SVG/CSS (ingen billed-assets).
- Natur-aktivitet: `Byg en plante`, hvor eleven trækker plantens dele (rod, stængel, kimblad, blad, blomst) op på de rigtige pladser nedefra og op. Et par bier summer rundt i baggrunden. Ren SVG/CSS, ingen billed-assets.
- For sjov-aktivitet: `Memory`, et vendespil med frugter og figurer fra appens egne assets. Eleven kan vælge sværhedsgrad.
- Om-side: handler om appens formål, ikke Peters personlige profil
- Footer: viser appnavn og version

## Kodestruktur

Koden er opdelt i fokuserede moduler under `src/` – ét spil/komponent pr. fil:

- `src/App.jsx` – kun routing og layout-shell. Hvert nyt spil/side tilføjes som en `case` i `renderView`.
- `src/main.jsx` – React-rod.
- `src/games/` – ét spil pr. fil (`TenFriendsGame`, `ShareApplesGame`, `BuildRowsGame`, `WordMatchGame`, `EclipseGame`, `PlantBuilderGame`, `MemoryGame`). Spil-specifik data (fx regnestykker, farver) og hjælpere (fx `createXRound`, billed-komponenter) bor i samme fil som spillet.
- `src/components/` – delte UI-komponenter (`Header`, `Footer`, `Home`, `About`, `VersionNotice`, `ErrorBoundary`, `Celebration`, `Flags`).
- `src/hooks/` – delte hooks (`useCurrentView`, `useWordMatchLanguage`, `useVersionNotice`).
- `src/lib/` – rene hjælpere uden UI (`shuffle`, `audio`/`playTone`, `speech`/`speakWord`, `version`).
- `src/data/` – delt data (`words`, `languages`, `looks`).

Retningslinje: hold spil selvstændige; flyt først noget til `components`/`lib`/`data`, når det faktisk deles af flere spil.

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
- Frugtspil bruger transparente PNG-assets fra `public/images/objects`; hold nye frugter i samme venlige maskot-/tegneseriestil og navngiv filer med ASCII-navne.
- `10'er-venner` skal passe på én skærm uden lodret eller vandret scrollbar, også ved 1280x720 og små mobilvisninger.
- `Fordel æbler` skal kunne bruges med både drag/drop og tryk-for-at-flytte, og skal passe på én skærm på desktop og telefon.
- `Byg rækker` skal kunne bruges med både drag/drop og tryk-for-at-flytte, og skal passe på én skærm på desktop og telefon.
- `Ord-match` skal passe på én skærm uden scrollbar på både desktop og telefon. På telefon bruges primært tryk-for-at-matche i stedet for drag/drop.
- `Memory` skal have tydelig sværhedsgrad og bruge store kort, så det fungerer på både desktop og telefon.
- `Solformørkelse` skal passe på én skærm uden scrollbar. Månen styres med mus, touch (pointer events) og piletaster, og der er en `Kør formørkelsen`-knap til klassens skærm. Hold scenen i ren SVG/CSS.
- `Byg en plante` skal passe på én skærm uden scrollbar. Delene placeres med drag/drop og tryk-for-at-flytte, og pladserne kan også bruges med tastatur. Afslutningen er rolig (ingen `Celebration`): planten vugger blidt, og en ekstra bi kommer til.
- I `Ord-match` skal klik på ord eller ikon oplæse ordet på det valgte sprog, men samme ord må ikke oplæses to gange i træk.
- Brug Web Audio API til små lyde, når det er nok; undgå tunge lydfiler uden god grund.
- Brug den fælles `Celebration`-komponent til succes/afslutning i spil. Den vælger tilfældigt mellem flere festlige animationer.
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
