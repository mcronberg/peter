import { useEffect, useMemo, useRef, useState } from 'react'

const appVersion = __APP_VERSION__
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
const confettiPieces = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${4 + ((index * 23) % 92)}%`,
  delay: `${(index % 9) * 0.08}s`,
  duration: `${1.9 + (index % 5) * 0.18}s`,
  drift: `${((index % 7) - 3) * 18}px`,
  color: ['#ff5c8a', '#ffd166', '#24c6dc', '#62e58d', '#9448ff', '#ff9f1c'][index % 6],
  shape: index % 3 === 0 ? 'round' : index % 3 === 1 ? 'wide' : 'tall',
}))

function shuffle(items) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
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

function playTone(kind, enabled) {
  if (!enabled) return

  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return

  const context = new AudioContext()
  const gain = context.createGain()
  gain.connect(context.destination)
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45)

  const notes =
    kind === 'success'
      ? [523.25, 659.25, 783.99]
      : kind === 'finish'
        ? [392, 523.25, 659.25, 783.99]
        : kind === 'miss'
          ? [196, 164.81]
          : [440]

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    oscillator.type = kind === 'miss' ? 'triangle' : 'sine'
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.08)
    oscillator.connect(gain)
    oscillator.start(context.currentTime + index * 0.08)
    oscillator.stop(context.currentTime + index * 0.08 + 0.16)
  })

  window.setTimeout(() => context.close(), 650)
}

function useCurrentView() {
  const [view, setView] = useState(() => window.location.hash.replace('#', '') || 'hjem')

  useEffect(() => {
    const onHashChange = () => setView(window.location.hash.replace('#', '') || 'hjem')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return ['om', 'tier-venner'].includes(view) ? view : 'hjem'
}

function useVersionNotice() {
  const [latestVersion, setLatestVersion] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const versionUrl = `${import.meta.env.BASE_URL}version.json?t=${Date.now()}`

    fetch(versionUrl, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.version && data.version !== appVersion) {
          setLatestVersion(data.version)
        }
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  return latestVersion
}

function Header({ view }) {
  return (
    <header className="site-header">
      <a className="brand" href="#hjem" aria-label="Gå til forsiden">
        <span className="brand-mark">10</span>
        <span>peter.app</span>
      </a>
      <nav className="main-nav" aria-label="Hovedmenu">
        {view !== 'hjem' && <a href="#hjem">Hjem</a>}
        <a className={view === 'om' ? 'active' : ''} href="#om">
          Om
        </a>
      </nav>
    </header>
  )
}

function VersionNotice({ latestVersion }) {
  if (!latestVersion) return null

  const reloadApp = () => {
    const base = import.meta.env.BASE_URL
    window.location.assign(`${base}?v=${encodeURIComponent(latestVersion)}#hjem`)
  }

  return (
    <section className="version-notice" aria-live="polite">
      <div>
        <strong>Der er kommet en ny version.</strong>
        <span> Hent v{latestVersion}, så er du helt opdateret.</span>
      </div>
      <button type="button" onClick={reloadApp}>
        Hent ny version
      </button>
    </section>
  )
}

function Home() {
  const tiles = useMemo(
    () => [
      {
        title: "10'er-venner",
        subject: 'Matematik',
        description: 'Find to tal, der giver 10.',
        accent: 'tile-game',
        href: '#tier-venner',
        icon: '10',
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
        <div className="tile-grid">
          {tiles.map((tile) => (
            <a className={`activity-tile ${tile.accent}`} data-activity={tile.href.replace('#', '')} href={tile.href} key={tile.title}>
              <div className="tile-icon" aria-hidden="true">
                {tile.icon}
              </div>
              <p>{tile.subject}</p>
              <h3>{tile.title}</h3>
              <span>{tile.description}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}

function TenFriendsGame() {
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
          <div className="confetti" aria-hidden="true">
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

function About() {
  return (
    <main className="page-shell narrow">
      <section className="about-panel" aria-labelledby="about-title">
        <p className="kicker">Om appen</p>
        <h1 id="about-title">peter.app er en lille samling undervisningsværktøjer.</h1>
        <p>
          Målet er at lave korte, visuelle aktiviteter til indskolingen: små spil, animationer og præsentationer, der kan bruges på klassens skærm eller prøves på en telefon, når aktiviteten passer til det.
        </p>
        <p>
          Appen starter simpelt, så hvert nyt spil kan få sin egen plads uden at forsiden bliver uoverskuelig.
        </p>
      </section>
    </main>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>peter.app</span>
      <span>v{appVersion}</span>
    </footer>
  )
}

export default function App() {
  const view = useCurrentView()
  const latestVersion = useVersionNotice()

  return (
    <div className="app">
      <Header view={view} />
      <VersionNotice latestVersion={latestVersion} />
      {view === 'om' ? <About /> : view === 'tier-venner' ? <TenFriendsGame /> : <Home />}
      <Footer />
    </div>
  )
}
