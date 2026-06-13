import { useMemo } from 'react'

// Fælles festanimation til succes/afslutning. Vælger tilfældigt mellem tre varianter.
const confettiPieces = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${4 + ((index * 23) % 92)}%`,
  delay: `${(index % 9) * 0.08}s`,
  duration: `${1.9 + (index % 5) * 0.18}s`,
  drift: `${((index % 7) - 3) * 18}px`,
  color: ['#ff5c8a', '#ffd166', '#24c6dc', '#62e58d', '#9448ff', '#ff9f1c'][index % 6],
  shape: index % 3 === 0 ? 'round' : index % 3 === 1 ? 'wide' : 'tall',
}))
const sparklePieces = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 31) % 84)}%`,
  top: `${10 + ((index * 17) % 70)}%`,
  delay: `${(index % 8) * 0.09}s`,
  size: `${18 + (index % 5) * 8}px`,
  color: ['#ffd166', '#ff5c8a', '#41c6f2', '#60d394', '#9448ff'][index % 5],
}))
const balloonPieces = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${5 + ((index * 37) % 90)}%`,
  delay: `${(index % 6) * 0.16}s`,
  duration: `${2.6 + (index % 4) * 0.32}s`,
  color: ['#ff5c8a', '#ffd166', '#41c6f2', '#60d394', '#9448ff', '#ff9f1c'][index % 6],
}))
const celebrationVariants = ['confetti', 'sparkles', 'balloons']

export function Celebration() {
  const variant = useMemo(() => celebrationVariants[Math.floor(Math.random() * celebrationVariants.length)], [])

  if (variant === 'sparkles') {
    return (
      <div className="celebration celebration-sparkles" aria-hidden="true">
        {sparklePieces.map((piece) => (
          <span
            className="sparkle-piece"
            key={piece.id}
            style={{
              '--sparkle-left': piece.left,
              '--sparkle-top': piece.top,
              '--sparkle-delay': piece.delay,
              '--sparkle-size': piece.size,
              '--sparkle-color': piece.color,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'balloons') {
    return (
      <div className="celebration celebration-balloons" aria-hidden="true">
        {balloonPieces.map((piece) => (
          <span
            className="balloon-piece"
            key={piece.id}
            style={{
              '--balloon-left': piece.left,
              '--balloon-delay': piece.delay,
              '--balloon-duration': piece.duration,
              '--balloon-color': piece.color,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="celebration confetti" aria-hidden="true">
      {confettiPieces.map((piece) => (
        <span
          className={`confetti-piece ${piece.shape}`}
          key={piece.id}
          style={{
            '--confetti-left': piece.left,
            '--confetti-delay': piece.delay,
            '--confetti-duration': piece.duration,
            '--confetti-drift': piece.drift,
            '--confetti-color': piece.color,
          }}
        />
      ))}
    </div>
  )
}
