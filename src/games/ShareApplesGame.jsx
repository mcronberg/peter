import { useEffect, useState } from 'react'
import { shuffle } from '../lib/shuffle.js'
import { playTone } from '../lib/audio.js'
import { appleLooks } from '../data/looks.js'
import { Celebration } from '../components/Celebration.jsx'

const appleProblems = [
  { apples: 4, children: 2 },
  { apples: 4, children: 4 },
  { apples: 6, children: 2 },
  { apples: 6, children: 3 },
  { apples: 8, children: 2 },
  { apples: 8, children: 4 },
  { apples: 9, children: 3 },
  { apples: 10, children: 2 },
]
const characterImages = ['dreng4.png', 'pige4.png', 'dreng5.png', 'pige5.png']

function formatAppleCount(count) {
  return `${count} ${count === 1 ? 'æble' : 'æbler'}`
}

function createAppleRound() {
  const problem = shuffle(appleProblems)[0]
  const children = shuffle(characterImages).slice(0, problem.children).map((image, index) => ({
    id: `child-${index}`,
    image,
    flipped: Math.random() > 0.5,
  }))
  const apples = Array.from({ length: problem.apples }, (_, index) => ({
    id: `apple-${index}`,
    look: {
      ...appleLooks[index % appleLooks.length],
      flipped: Math.random() > 0.5,
    },
  }))

  return {
    ...problem,
    target: problem.apples / problem.children,
    children,
    apples,
  }
}

function AppleImage({ apple, className = '', selected = false }) {
  return (
    <img
      className={`share-apple ${selected ? 'selected' : ''} ${className}`}
      src={`${import.meta.env.BASE_URL}images/objects/aeble.png`}
      alt="Æble"
      draggable={false}
      style={{
        '--apple-size': `${apple.look.size}px`,
        '--apple-rotate': `${apple.look.rotate}deg`,
        '--apple-flip': apple.look.flipped ? -1 : 1,
      }}
    />
  )
}

// Divisionsspil: fordel æblerne ligeligt mellem børnene.
export function ShareApplesGame() {
  const [round, setRound] = useState(() => createAppleRound())
  const [placements, setPlacements] = useState({})
  const [selectedAppleId, setSelectedAppleId] = useState(null)
  const [message, setMessage] = useState('Fordel æblerne, så alle får lige mange.')
  const [draggedAppleId, setDraggedAppleId] = useState(null)
  const isComplete =
    round.apples.every((apple) => placements[apple.id] !== undefined) &&
    round.children.every((child, index) => round.apples.filter((apple) => placements[apple.id] === index).length === round.target)

  useEffect(() => {
    if (isComplete) {
      setMessage(`Flot. Alle fik ${formatAppleCount(round.target)}.`)
      playTone('finish', true)
    }
  }, [isComplete, round.target])

  const resetRound = () => {
    setRound(createAppleRound())
    setPlacements({})
    setSelectedAppleId(null)
    setDraggedAppleId(null)
    setMessage('Ny runde. Fordel æblerne ligeligt.')
  }

  const moveApple = (appleId, childIndex) => {
    setPlacements((current) => {
      const next = { ...current }
      if (childIndex === null) {
        delete next[appleId]
      } else {
        next[appleId] = childIndex
      }
      return next
    })
    setSelectedAppleId(null)
    playTone('tap', true)
  }

  const handleAppleClick = (appleId) => {
    setSelectedAppleId((current) => (current === appleId ? null : appleId))
    setMessage('Vælg en kasse til æblet.')
  }

  const handleDrop = (event, childIndex) => {
    event.preventDefault()
    const appleId = event.dataTransfer.getData('text/plain') || draggedAppleId
    if (appleId) moveApple(appleId, childIndex)
    setDraggedAppleId(null)
  }

  const poolApples = round.apples.filter((apple) => placements[apple.id] === undefined)

  return (
    <main className="share-game-shell">
      <section className="share-game-topbar">
        <div>
          <p className="kicker">Division</p>
          <h1>Fordel æbler</h1>
        </div>
        <div className="share-equation" aria-label={`${round.apples.length} divideret med ${round.children.length}`}>
          <span>{round.apples.length}</span>
          <span aria-hidden="true" />
          <span>{round.children.length}</span>
        </div>
        <button type="button" className="icon-button" onClick={resetRound}>
          Ny runde
        </button>
      </section>

      <p className="share-message" aria-live="polite">
        {isComplete ? `Sådan. Alle fik ${formatAppleCount(round.target)}.` : 'Hvordan vil du fordele?'}
      </p>

      <section
        className={`apple-pool ${selectedAppleId && placements[selectedAppleId] !== undefined ? 'ready' : ''}`}
        onClick={() => selectedAppleId && moveApple(selectedAppleId, null)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => handleDrop(event, null)}
        aria-label="Æbler der ikke er fordelt"
      >
        {poolApples.map((apple) => (
          <button
            type="button"
            className="apple-button"
            data-apple-id={apple.id}
            draggable
            key={apple.id}
            onClick={(event) => {
              event.stopPropagation()
              handleAppleClick(apple.id)
            }}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', apple.id)
              setDraggedAppleId(apple.id)
            }}
            onDragEnd={() => setDraggedAppleId(null)}
          >
            <AppleImage apple={apple} selected={selectedAppleId === apple.id} />
          </button>
        ))}
      </section>

      <section className="children-board" aria-label="Børn og æblekasser">
        {round.children.map((child, childIndex) => {
          const childApples = round.apples.filter((apple) => placements[apple.id] === childIndex)
          return (
            <article className="child-station" key={child.id}>
              <img
                className="child-picture"
                src={`${import.meta.env.BASE_URL}images/characters/${child.image}`}
                alt="Barn"
                style={{ '--child-flip': child.flipped ? -1 : 1 }}
              />
              <div
                role="button"
                tabIndex={0}
                className={`apple-box ${selectedAppleId ? 'ready' : ''}`}
                data-child-index={childIndex}
                onClick={() => selectedAppleId && moveApple(selectedAppleId, childIndex)}
                onKeyDown={(event) => {
                  if ((event.key === 'Enter' || event.key === ' ') && selectedAppleId) {
                    event.preventDefault()
                    moveApple(selectedAppleId, childIndex)
                  }
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, childIndex)}
                aria-label={`Kasse ${childIndex + 1} med ${childApples.length} æbler`}
              >
                <span className="apple-count">{childApples.length}</span>
                <div className="box-apples">
                  {childApples.map((apple) => (
                    <button
                      type="button"
                      className="boxed-apple-button"
                      data-apple-id={apple.id}
                      draggable
                      key={apple.id}
                      onClick={(event) => {
                        event.stopPropagation()
                        if (selectedAppleId && selectedAppleId !== apple.id) {
                          moveApple(selectedAppleId, childIndex)
                        } else {
                          handleAppleClick(apple.id)
                        }
                      }}
                      onDragStart={(event) => {
                        event.dataTransfer.setData('text/plain', apple.id)
                        setDraggedAppleId(apple.id)
                      }}
                      onDragEnd={() => setDraggedAppleId(null)}
                    >
                      <AppleImage apple={apple} selected={selectedAppleId === apple.id} />
                    </button>
                  ))}
                </div>
              </div>
            </article>
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
            <h2>Godt fordelt</h2>
            <p>Alle børn fik lige mange æbler.</p>
            <button type="button" onClick={resetRound}>
              Spil igen
            </button>
          </section>
        </>
      )}
    </main>
  )
}
