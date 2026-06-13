import { useEffect, useRef, useState } from 'react'
import { shuffle } from '../lib/shuffle.js'
import { playTone } from '../lib/audio.js'
import { Celebration } from '../components/Celebration.jsx'

const numberColors = {
  1: 'berry',
  2: 'sky',
  3: 'leaf',
  4: 'sun',
  5: 'grape',
  6: 'coral',
  7: 'aqua',
  8: 'mint',
  9: 'violet',
}

function createTenFriendTiles() {
  const pairs = [
    [1, 9],
    [2, 8],
    [3, 7],
    [4, 6],
    [5, 5],
    [1, 9],
  ]

  return shuffle(
    pairs.flatMap((pair, pairIndex) =>
      pair.map((value, sideIndex) => ({
        id: `${pairIndex}-${sideIndex}-${value}`,
        value,
      })),
    ),
  )
}

// Matematikspil: find par af tal, der tilsammen giver 10.
export function TenFriendsGame() {
  const [tiles, setTiles] = useState(() => createTenFriendTiles())
  const [selected, setSelected] = useState([])
  const [matchedIds, setMatchedIds] = useState([])
  const [message, setMessage] = useState('Vælg to tal, der giver 10.')
  const [soundOn, setSoundOn] = useState(true)
  const [round, setRound] = useState(1)
  const liveRef = useRef(null)
  const remainingTiles = tiles.filter((tile) => !matchedIds.includes(tile.id))
  const selectedSum = selected.reduce((sum, tile) => sum + tile.value, 0)
  const isComplete = remainingTiles.length === 0

  useEffect(() => {
    if (isComplete) {
      setMessage('Sådan. Alle 10’er-venner er fundet.')
      playTone('finish', soundOn)
    }
  }, [isComplete, soundOn])

  const announce = (text) => {
    setMessage(text)
    if (liveRef.current) {
      liveRef.current.textContent = text
    }
  }

  const resetGame = () => {
    setTiles(createTenFriendTiles())
    setSelected([])
    setMatchedIds([])
    setRound((current) => current + 1)
    announce('Ny runde. Vælg to tal, der giver 10.')
    playTone('tap', soundOn)
  }

  const removeSelection = (tileId) => {
    setSelected((current) => current.filter((tile) => tile.id !== tileId))
    playTone('tap', soundOn)
  }

  const tryPair = (nextSelected) => {
    const sum = nextSelected[0].value + nextSelected[1].value

    if (sum === 10) {
      setMatchedIds((current) => [...current, nextSelected[0].id, nextSelected[1].id])
      setSelected([])
      announce(`${nextSelected[0].value} og ${nextSelected[1].value} er 10’er-venner.`)
      playTone('success', soundOn)
      return
    }

    announce(`${nextSelected[0].value} plus ${nextSelected[1].value} giver ${sum}. Prøv igen.`)
    playTone('miss', soundOn)
    window.setTimeout(() => setSelected([]), 550)
  }

  const chooseTile = (tile) => {
    if (matchedIds.includes(tile.id) || selected.some((item) => item.id === tile.id) || selected.length >= 2) {
      return
    }

    const nextSelected = [...selected, tile]
    setSelected(nextSelected)
    playTone('tap', soundOn)

    if (nextSelected.length === 1) {
      announce(`${tile.value} er valgt. Find dens 10’er-ven.`)
      return
    }

    tryPair(nextSelected)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const tileId = event.dataTransfer.getData('text/plain')
    const tile = tiles.find((item) => item.id === tileId)
    if (tile) chooseTile(tile)
  }

  return (
    <main className="game-shell">
      <section className="game-topbar" aria-label="Spilstatus">
        <div className="game-title">
          <span className="game-badge">10</span>
          <div>
            <p className="kicker">Matematik</p>
            <h1>10'er-venner</h1>
          </div>
        </div>
        <div className="game-actions">
          <div className="score-pill" aria-label={`${matchedIds.length / 2} par fundet`}>
            Par: {matchedIds.length / 2}/6
          </div>
          <button type="button" className="icon-button" onClick={() => setSoundOn((current) => !current)}>
            {soundOn ? 'Lyd til' : 'Lyd fra'}
          </button>
          <button type="button" className="icon-button" onClick={resetGame}>
            Ny runde
          </button>
        </div>
      </section>

      <section className="sum-board" aria-label="Regnestykke">
        <button
          type="button"
          className={`drop-card ${selected[0] ? 'filled' : ''}`}
          onClick={() => selected[0] && removeSelection(selected[0].id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          aria-label={selected[0] ? `Første tal er ${selected[0].value}` : 'Træk eller vælg første tal'}
        >
          {selected[0]?.value ?? '?'}
        </button>
        <span className="sum-symbol">+</span>
        <button
          type="button"
          className={`drop-card ${selected[1] ? 'filled' : ''}`}
          onClick={() => selected[1] && removeSelection(selected[1].id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          aria-label={selected[1] ? `Andet tal er ${selected[1].value}` : 'Træk eller vælg andet tal'}
        >
          {selected[1]?.value ?? '?'}
        </button>
        <span className="sum-symbol">=</span>
        <div className={`sum-result ${selectedSum === 10 ? 'ready' : ''}`}>{selected.length ? selectedSum : '?'}</div>
      </section>

      <p className="game-message" aria-live="polite">
        {message}
      </p>
      <span className="sr-only" ref={liveRef} aria-live="assertive" />

      <section className="number-grid" aria-label="Talbrikker">
        {remainingTiles.map((tile) => (
          <button
            type="button"
            className={`number-card ${numberColors[tile.value]} ${selected.some((item) => item.id === tile.id) ? 'selected' : ''}`}
            data-tile-id={tile.id}
            data-tile-value={tile.value}
            draggable
            key={`${round}-${tile.id}`}
            onClick={() => chooseTile(tile)}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', tile.id)
              event.dataTransfer.effectAllowed = 'move'
            }}
          >
            {tile.value}
          </button>
        ))}
      </section>

      {isComplete && (
        <>
          <Celebration />
          <section className="finish-panel" aria-live="polite">
            <h2>Flot fundet</h2>
            <p>Alle tal er væk, og alle par blev til 10.</p>
            <button type="button" onClick={resetGame}>
              Spil igen
            </button>
          </section>
        </>
      )}
    </main>
  )
}
