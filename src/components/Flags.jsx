// Inline SVG-flag. Bruges i stedet for emoji-flag, som Windows ikke kan vise.
export function DanishFlag({ className = 'tile-flag' }) {
  return (
    <svg className={className} viewBox="0 0 37 28" aria-hidden="true">
      <rect width="37" height="28" fill="#c8102e" />
      <rect x="12" width="4" height="28" fill="#fff" />
      <rect y="12" width="37" height="4" fill="#fff" />
    </svg>
  )
}

export function GermanFlag({ className = 'tile-flag' }) {
  return (
    <svg className={className} viewBox="0 0 5 3" aria-hidden="true">
      <rect width="5" height="3" fill="#ffce00" />
      <rect width="5" height="2" fill="#dd0000" />
      <rect width="5" height="1" fill="#000" />
    </svg>
  )
}

export function BritishFlag({ className = 'tile-flag' }) {
  return (
    <svg className={className} viewBox="0 0 60 30" aria-hidden="true">
      <clipPath id="uk-union-clip">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" fill="none" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-union-clip)" stroke="#c8102e" strokeWidth="4" fill="none" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" fill="none" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" fill="none" />
    </svg>
  )
}

// Slå flag-komponent op ud fra sprogkode (da/en/de).
export const languageFlagComponents = {
  da: DanishFlag,
  en: BritishFlag,
  de: GermanFlag,
}
