import { useMemo } from 'react'
import { DanishFlag, BritishFlag, GermanFlag } from './Flags.jsx'

// Lille solformørkelse-ikon (Sol med Månen for): crescent-effekt som i selve spillet.
function EclipseTileIcon() {
  return (
    <svg className="tile-eclipse-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="12" r="8" fill="#ffd000" />
      <circle cx="15" cy="11" r="8" fill="#2c3340" />
    </svg>
  )
}

// Lille plante-ikon: stængel, blad og blomst.
function PlantTileIcon() {
  return (
    <svg className="tile-plant-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12,22 C11,16 13,11 12,6" fill="none" stroke="#3c9d4e" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="7" cy="14" rx="4.2" ry="2.2" transform="rotate(-28 7 14)" fill="#3fae5a" />
      <circle cx="12" cy="5" r="2.4" fill="#ffd23f" />
      <circle cx="9" cy="5" r="2.2" fill="#ff7eb6" />
      <circle cx="15" cy="5" r="2.2" fill="#ff7eb6" />
      <circle cx="12" cy="2.6" r="2.2" fill="#ff7eb6" />
      <circle cx="12" cy="7.4" r="2.2" fill="#ff7eb6" />
    </svg>
  )
}

function PhotosynthesisTileIcon() {
  return (
    <svg className="tile-photo-icon" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="13" cy="12" r="6" fill="#ffd23f" stroke="#f2a81d" strokeWidth="1.8" />
      <path d="M24 40 C24 31 25 24 24 15" fill="none" stroke="#3c9d4e" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="18" cy="26" rx="8" ry="4" transform="rotate(-24 18 26)" fill="#3fae5a" stroke="#2f9247" strokeWidth="1" />
      <ellipse cx="31" cy="25" rx="8" ry="4" transform="rotate(24 31 25)" fill="#58bd67" stroke="#2f9247" strokeWidth="1" />
      <circle cx="37" cy="16" r="4.5" fill="#e8f4ff" stroke="#527aa3" strokeWidth="1.4" />
      <text x="37" y="18.5" textAnchor="middle" fill="#243044" fontSize="5.5" fontWeight="900">CO₂</text>
      <path d="M12 20 C17 23 20 24 25 25" fill="none" stroke="#f2a81d" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M36 21 C32 23 29 24 25 25" fill="none" stroke="#527aa3" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MemoryTileIcon() {
  return (
    <svg className="tile-memory-icon" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="7" y="8" width="18" height="22" rx="4" fill="#ff7eb6" stroke="#243044" strokeWidth="2.2" transform="rotate(-8 16 19)" />
      <rect x="22" y="13" width="18" height="22" rx="4" fill="#8ee3f5" stroke="#243044" strokeWidth="2.2" transform="rotate(7 31 24)" />
      <circle cx="16" cy="19" r="4" fill="#fff6bf" />
      <path d="M28 23 L32 18 L36 23 L32 28 Z" fill="#fff6bf" />
    </svg>
  )
}

// Forsiden: kategoriserede tiles for de rigtige aktiviteter (ingen "kommer snart"-kort).
export function Home() {
  const categories = useMemo(
    () => [
      {
        title: 'Tal',
        tiles: [
          {
            title: "10'er-venner",
            subject: 'Matematik',
            description: 'Find to tal, der giver 10.',
            accent: 'tile-game',
            href: '#tier-venner',
            icon: '10',
          },
          {
            title: 'Fordel æbler',
            subject: 'Division',
            description: 'Fordel æblerne ligeligt mellem børnene.',
            accent: 'tile-apples',
            href: '#fordel-aebler',
            icon: '÷',
          },
          {
            title: 'Byg rækker',
            subject: 'Gange',
            description: 'Byg rækker med lige mange frugter.',
            accent: 'tile-multiply',
            href: '#byg-raekker',
            icon: '×',
          },
        ],
      },
      {
        title: 'Sprog',
        tiles: [
          {
            title: 'Ord-match',
            subject: 'Dansk',
            description: 'Match ord og ikoner på dansk.',
            accent: 'tile-words',
            href: '#ord-match-da',
            icon: <DanishFlag />,
          },
          {
            title: 'Ord-match',
            subject: 'Engelsk',
            description: 'Match words and icons in English.',
            accent: 'tile-words',
            href: '#ord-match-en',
            icon: <BritishFlag />,
          },
          {
            title: 'Ord-match',
            subject: 'Tysk',
            description: 'Match ord og ikoner på tysk.',
            accent: 'tile-words',
            href: '#ord-match-de',
            icon: <GermanFlag />,
          },
        ],
      },
      {
        title: 'Natur',
        tiles: [
          {
            title: 'Solformørkelse',
            subject: 'Rummet',
            description: 'Træk Månen foran Solen, og se det blive mørkt.',
            accent: 'tile-eclipse',
            href: '#solformoerkelse',
            icon: <EclipseTileIcon />,
          },
          {
            title: 'Byg en plante',
            subject: 'Planter',
            description: 'Sæt rod, stængel, blade og blomst på plads.',
            accent: 'tile-plant',
            href: '#byg-plante',
            icon: <PlantTileIcon />,
          },
          {
            title: 'Fotosyntese',
            subject: 'Planter',
            description: 'Giv planten sol, vand og CO₂.',
            accent: 'tile-photo',
            href: '#fotosyntese',
            icon: <PhotosynthesisTileIcon />,
          },
        ],
      },
      {
        title: 'For sjov',
        tiles: [
          {
            title: 'Memory',
            subject: 'Huskespil',
            description: 'Find par med frugter og figurer.',
            accent: 'tile-memory',
            href: '#memory',
            icon: <MemoryTileIcon />,
          },
        ],
      },
    ],
    [],
  )

  return (
    <main className="page-shell home-shell">
      <section className="tiles-section home-tiles" aria-labelledby="tiles-title">
        <div className="section-heading">
          <h2 id="tiles-title">Aktiviteter</h2>
        </div>
        <div className="category-list">
          {categories.map((category) => (
            <section className="activity-category" aria-labelledby={`category-${category.title}`} key={category.title}>
              <h3 id={`category-${category.title}`}>{category.title}</h3>
              <div className="tile-grid">
                {category.tiles.map((tile) => (
                  <a className={`activity-tile ${tile.accent}`} data-activity={tile.href.replace('#', '')} href={tile.href} key={tile.href}>
                    <div className="tile-icon" aria-hidden="true">
                      {tile.icon}
                    </div>
                    <p>{tile.subject}</p>
                    <h4>{tile.title}</h4>
                    <span>{tile.description}</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}
