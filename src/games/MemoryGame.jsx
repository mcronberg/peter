import { useEffect, useMemo, useState } from 'react'
import { Celebration } from '../components/Celebration.jsx'
import { playTone } from '../lib/audio.js'
import { shuffle } from '../lib/shuffle.js'

const MEMORY_ASSETS = [
  { key: 'aeble', label: 'Æble', src: 'images/objects/aeble.png' },
  { key: 'appelsin', label: 'Appelsin', src: 'images/objects/appelsin.png' },
  { key: 'banan', label: 'Banan', src: 'images/objects/banan.png' },
  { key: 'paere', label: 'Pære', src: 'images/objects/paere.png' },
  { key: 'jordbaer', label: 'Jordbær', src: 'images/objects/jordbaer.png' },
  { key: 'blaabaer', label: 'Blåbær', src: 'images/objects/blaabaer.png' },
  { key: 'dreng4', label: 'Dreng', src: 'images/characters/dreng4.png' },
  { key: 'pige4', label: 'Pige', src: 'images/characters/pige4.png' },
  { key: 'dreng5', label: 'Dreng', src: 'images/characters/dreng5.png' },
  { key: 'pige5', label: 'Pige', src: 'images/characters/pige5.png' },
  { key: 'dreng1', label: 'Dreng', src: 'images/characters/dreng1.png' },
  { key: 'pige1', label: 'Pige', src: 'images/characters/pige1.png' },
]

const LEVELS = [
  { key: 'nem', label: 'Nem', pairs: 6, columns: 4 },
  { key: 'mellem', label: 'Mellem', pairs: 8, columns: 4 },
  { key: 'svaer', label: 'Svær', pairs: 12, columns: 6 },
]

function createDeck(levelKey) {
  const level = LEVELS.find((item) => item.key === levelKey) ?? LEVELS[0]
  const picked = shuffle(MEMORY_ASSETS).slice(0, level.pairs)
  const cards = picked.flatMap((asset) => [
    { ...asset, id: `${asset.key}-a` },
    { ...asset, id: `${asset.key}-b` },
  ])

  return {
    level,
    cards: shuffle(cards),
  }
}

// For sjov-spil: klassisk vendespil med frugter og figurer fra appens egne assets.
export function MemoryGame() {
  const [levelKey, setLevelKey] = useState('nem')
  const [round, setRound] = useState(() => createDeck('nem'))
  const [openCards, setOpenCards] = useState([])
  const [matched, setMatched] = useState({})
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const [message, setMessage] = useState('Find to ens kort.')

  const matchedCount = useMemo(() => Object.keys(matched).length, [matched])
  const isComplete = matchedCount === round.level.pairs

  const startRound = (nextLevelKey = levelKey) => {
    setLevelKey(nextLevelKey)
    setRound(createDeck(nextLevelKey))
    setOpenCards([])
    setMatched({})
    setAttempts(0)
    setLocked(false)
    setMessage('Find to ens kort.')
  }

  useEffect(() => {
    if (isComplete) {
      setMessage(`Alle ${round.level.pairs} par er fundet.`)
      playTone('finish', true)
    }
  }, [isComplete, round.level.pairs])

  const flipCard = (card) => {
    if (locked || isComplete || matched[card.key] || openCards.some((item) => item.id === card.id)) return

    const nextOpen = [...openCards, card]
    setOpenCards(nextOpen)

    if (nextOpen.length === 1) {
      setMessage('Find makkerkortet.')
      playTone('tap', true)
      return
    }

    setAttempts((current) => current + 1)

    if (nextOpen[0].key === nextOpen[1].key) {
      setMatched((current) => ({ ...current, [card.key]: true }))
      setOpenCards([])
      setMessage('Ja. Det var et par.')
      playTone('success', true)
      return
    }

    setLocked(true)
    setMessage('Ikke helt. Prøv igen.')
    playTone('miss', true)
    window.setTimeout(() => {
      setOpenCards([])
      setLocked(false)
    }, 760)
  }

  return (
    <main className="memory-game-shell">
      <section className="memory-topbar">
        <div>
          <p className="kicker">For sjov</p>
          <h1>Memory</h1>
        </div>

        <div className="memory-controls" aria-label="Sværhedsgrad">
          {LEVELS.map((level) => (
            <button
              type="button"
              className={`memory-level ${level.key === levelKey ? 'active' : ''}`}
              key={level.key}
              onClick={() => startRound(level.key)}
              aria-pressed={level.key === levelKey}
            >
              {level.label}
            </button>
          ))}
        </div>

        <button type="button" className="icon-button" onClick={() => startRound()}>
          Ny runde
        </button>
      </section>

      <section className="memory-status" aria-live="polite">
        <span>{message}</span>
        <strong>
          {matchedCount}/{round.level.pairs} par
        </strong>
        <strong>{attempts} forsøg</strong>
      </section>

      <section className="memory-board" style={{ '--memory-columns': round.level.columns }} aria-label="Memorykort">
        {round.cards.map((card) => {
          const isOpen = matched[card.key] || openCards.some((item) => item.id === card.id)
          return (
            <button
              type="button"
              className={`memory-card ${isOpen ? 'open' : ''} ${matched[card.key] ? 'matched' : ''}`}
              key={card.id}
              data-card-id={card.id}
              data-card-key={card.key}
              onClick={() => flipCard(card)}
              aria-label={isOpen ? card.label : 'Lukket kort'}
            >
              <span className="memory-card-back" aria-hidden="true">?</span>
              <span className="memory-card-front" aria-hidden="true">
                <img src={`${import.meta.env.BASE_URL}${card.src}`} alt="" draggable={false} />
              </span>
            </button>
          )
        })}
      </section>

      {isComplete && (
        <>
          <Celebration />
          <section className="finish-panel" aria-live="polite">
            <h2>Flot husket</h2>
            <p>
              {round.level.pairs} par på {attempts} forsøg.
            </p>
            <button type="button" onClick={() => startRound()}>
              Spil igen
            </button>
          </section>
        </>
      )}
    </main>
  )
}
