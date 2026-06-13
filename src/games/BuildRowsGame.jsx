import { useEffect, useState } from 'react'
import { shuffle } from '../lib/shuffle.js'
import { playTone } from '../lib/audio.js'
import { appleLooks } from '../data/looks.js'
import { Celebration } from '../components/Celebration.jsx'

const fruitImages = [
  'aeble.png',
  'appelsin.png',
  'banan.png',
  'paere.png',
  'jordbaer.png',
  'blaabaer.png',
]
const multiplyProblems = [
  { rows: 2, perRow: 2 },
  { rows: 2, perRow: 3 },
  { rows: 2, perRow: 4 },
  { rows: 2, perRow: 5 },
  { rows: 3, perRow: 2 },
  { rows: 3, perRow: 3 },
  { rows: 3, perRow: 4 },
  { rows: 4, perRow: 2 },
  { rows: 4, perRow: 3 },
  { rows: 5, perRow: 2 },
]

function createMultiplyRound() {
  const problem = shuffle(multiplyProblems)[0]
  const fruit = shuffle(fruitImages)[0]
  const total = problem.rows * problem.perRow
  return {
    ...problem,
    total,
    fruit,
    items: Array.from({ length: total }, (_, index) => ({
      id: `fruit-${index}`,
      look: {
        ...appleLooks[index % appleLooks.length],
        flipped: Math.random() > 0.5,
      },
    })),
  }
}

function FruitImage({ item, fruit, className = '', selected = false }) {
  return (
    <img
      className={`share-apple ${selected ? 'selected' : ''} ${className}`}
      src={`${import.meta.env.BASE_URL}images/objects/${fruit}`}
      alt="Frugt"
      draggable={false}
      style={{
        '--apple-size': `${item.look.size}px`,
        '--apple-rotate': `${item.look.rotate}deg`,
        '--apple-flip': item.look.flipped ? -1 : 1,
      }}
    />
  )
}

// Gangespil: byg rækker med lige mange frugter i hver.
export function BuildRowsGame() {
  const [round, setRound] = useState(() => createMultiplyRound())
  const [placements, setPlacements] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [draggedId, setDraggedId] = useState(null)
  const [message, setMessage] = useState('Byg rækkerne med lige mange frugter.')
  const isComplete =
    round.items.every((item) => placements[item.id] !== undefined) &&
    Array.from({ length: round.rows }, (_, rowIndex) => round.items.filter((item) => placements[item.id] === rowIndex).length).every((count) => count === round.perRow)

  useEffect(() => {
    if (isComplete) {
      setMessage(`Flot. ${round.rows} × ${round.perRow} = ${round.total}.`)
      playTone('finish', true)
    }
  }, [isComplete, round.rows, round.perRow, round.total])

  const resetRound = () => {
    setRound(createMultiplyRound())
    setPlacements({})
    setSelectedId(null)
    setDraggedId(null)
    setMessage('Ny runde. Byg rækkerne.')
  }

  const moveItem = (itemId, rowIndex) => {
    setPlacements((current) => {
      const next = { ...current }
      if (rowIndex === null) {
        delete next[itemId]
      } else {
        next[itemId] = rowIndex
      }
      return next
    })
    setSelectedId(null)
    playTone('tap', true)
  }

  const selectItem = (itemId) => {
    setSelectedId((current) => (current === itemId ? null : itemId))
    setMessage('Vælg en række til frugten.')
  }

  const handleDrop = (event, rowIndex) => {
    event.preventDefault()
    const itemId = event.dataTransfer.getData('text/plain') || draggedId
    if (itemId) moveItem(itemId, rowIndex)
    setDraggedId(null)
  }

  const poolItems = round.items.filter((item) => placements[item.id] === undefined)

  return (
    <main className="multiply-game-shell">
      <section className="multiply-topbar">
        <div>
          <p className="kicker">Gange</p>
          <h1>Byg rækker</h1>
        </div>
        <div className="multiply-equation" aria-label={`${round.rows} gange ${round.perRow}`}>
          {round.rows} × {round.perRow}
        </div>
        <button type="button" className="icon-button" onClick={resetRound}>
          Ny runde
        </button>
      </section>

      <p className="share-message" aria-live="polite">
        {isComplete ? `${round.rows} × ${round.perRow} = ${round.total}` : `Byg ${round.rows} rækker med ${round.perRow} i hver.`}
      </p>

      <section
        className={`fruit-pool ${selectedId && placements[selectedId] !== undefined ? 'ready' : ''}`}
        onClick={() => selectedId && moveItem(selectedId, null)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => handleDrop(event, null)}
        aria-label="Frugter der ikke er placeret"
      >
        {poolItems.map((item) => (
          <button
            type="button"
            className="fruit-button"
            data-fruit-id={item.id}
            draggable
            key={item.id}
            onClick={(event) => {
              event.stopPropagation()
              selectItem(item.id)
            }}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', item.id)
              setDraggedId(item.id)
            }}
            onDragEnd={() => setDraggedId(null)}
          >
            <FruitImage item={item} fruit={round.fruit} selected={selectedId === item.id} />
          </button>
        ))}
      </section>

      <section className="rows-board" aria-label="Rækker" style={{ '--row-count': round.rows }}>
        {Array.from({ length: round.rows }, (_, rowIndex) => {
          const rowItems = round.items.filter((item) => placements[item.id] === rowIndex)
          return (
            <div
              className={`fruit-row ${selectedId ? 'ready' : ''} ${rowItems.length === round.perRow ? 'complete' : ''}`}
              data-row-index={rowIndex}
              key={rowIndex}
              role="button"
              tabIndex={0}
              onClick={() => selectedId && moveItem(selectedId, rowIndex)}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && selectedId) {
                  event.preventDefault()
                  moveItem(selectedId, rowIndex)
                }
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, rowIndex)}
              aria-label={`Række ${rowIndex + 1} med ${rowItems.length} af ${round.perRow}`}
            >
              <span className="row-count">{rowItems.length}/{round.perRow}</span>
              <div className="row-fruits">
                {rowItems.map((item) => (
                  <button
                    type="button"
                    className="fruit-button in-row"
                    data-fruit-id={item.id}
                    draggable
                    key={item.id}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (selectedId && selectedId !== item.id) {
                        moveItem(selectedId, rowIndex)
                      } else {
                        selectItem(item.id)
                      }
                    }}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', item.id)
                      setDraggedId(item.id)
                    }}
                    onDragEnd={() => setDraggedId(null)}
                  >
                    <FruitImage item={item} fruit={round.fruit} selected={selectedId === item.id} />
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <p className="share-message lower" aria-live="polite">
        {message}
      </p>

      {isComplete && (
        <>
          <Celebration />
          <section className="finish-panel" aria-live="polite">
            <h2>Flot bygget</h2>
            <p>
              {round.rows} × {round.perRow} = {round.total}
            </p>
            <button type="button" onClick={resetRound}>
              Spil igen
            </button>
          </section>
        </>
      )}
    </main>
  )
}
