import { Component, useEffect, useMemo, useRef, useState } from 'react'
import {
  Apple,
  Armchair,
  Bed,
  Bike,
  Bird,
  BookOpen,
  Bus,
  Cake,
  Camera,
  Car,
  Cat,
  Clock,
  Cloud,
  Coffee,
  Cookie,
  Crown,
  Dog,
  Drum,
  Fish,
  Flower2,
  Gift,
  Glasses,
  Guitar,
  Heart,
  House,
  Key,
  Lamp,
  Moon,
  Sun,
  TreePine,
} from 'lucide-react'

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
const speechLocales = {
  da: 'da-DK',
  en: 'en-US',
  de: 'de-DE',
}
const languageLabels = {
  da: 'Dansk',
  en: 'Engelsk',
  de: 'Tysk',
}
const languageFlags = {
  da: '🇩🇰',
  en: '🇬🇧',
  de: '🇩🇪',
}
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
const appleLooks = [
  { size: 58, rotate: -10 },
  { size: 72, rotate: 8 },
  { size: 52, rotate: 15 },
  { size: 66, rotate: -5 },
  { size: 60, rotate: 12 },
  { size: 78, rotate: -14 },
  { size: 55, rotate: 4 },
  { size: 70, rotate: -8 },
  { size: 64, rotate: 16 },
  { size: 74, rotate: -3 },
]

function formatAppleCount(count) {
  return `${count} ${count === 1 ? 'æble' : 'æbler'}`
}

function Celebration() {
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
const wordItems = [
  { id: 'apple', icon: Apple, da: 'æble', en: 'apple', de: 'Apfel' },
  { id: 'dog', icon: Dog, da: 'hund', en: 'dog', de: 'Hund' },
  { id: 'cat', icon: Cat, da: 'kat', en: 'cat', de: 'Katze' },
  { id: 'fish', icon: Fish, da: 'fisk', en: 'fish', de: 'Fisch' },
  { id: 'car', icon: Car, da: 'bil', en: 'car', de: 'Auto' },
  { id: 'house', icon: House, da: 'hus', en: 'house', de: 'Haus' },
  { id: 'book', icon: BookOpen, da: 'bog', en: 'book', de: 'Buch' },
  { id: 'sun', icon: Sun, da: 'sol', en: 'sun', de: 'Sonne' },
  { id: 'moon', icon: Moon, da: 'måne', en: 'moon', de: 'Mond' },
  { id: 'tree', icon: TreePine, da: 'træ', en: 'tree', de: 'Baum' },
  { id: 'bird', icon: Bird, da: 'fugl', en: 'bird', de: 'Vogel' },
  { id: 'flower', icon: Flower2, da: 'blomst', en: 'flower', de: 'Blume' },
  { id: 'chair', icon: Armchair, da: 'stol', en: 'chair', de: 'Stuhl' },
  { id: 'bed', icon: Bed, da: 'seng', en: 'bed', de: 'Bett' },
  { id: 'bike', icon: Bike, da: 'cykel', en: 'bike', de: 'Fahrrad' },
  { id: 'bus', icon: Bus, da: 'bus', en: 'bus', de: 'Bus' },
  { id: 'cake', icon: Cake, da: 'kage', en: 'cake', de: 'Kuchen' },
  { id: 'camera', icon: Camera, da: 'kamera', en: 'camera', de: 'Kamera' },
  { id: 'clock', icon: Clock, da: 'ur', en: 'clock', de: 'Uhr' },
  { id: 'cloud', icon: Cloud, da: 'sky', en: 'cloud', de: 'Wolke' },
  { id: 'cup', icon: Coffee, da: 'kop', en: 'cup', de: 'Tasse' },
  { id: 'cookie', icon: Cookie, da: 'kiks', en: 'cookie', de: 'Keks' },
  { id: 'crown', icon: Crown, da: 'krone', en: 'crown', de: 'Krone' },
  { id: 'drum', icon: Drum, da: 'tromme', en: 'drum', de: 'Trommel' },
  { id: 'gift', icon: Gift, da: 'gave', en: 'gift', de: 'Geschenk' },
  { id: 'glasses', icon: Glasses, da: 'briller', en: 'glasses', de: 'Brille' },
  { id: 'guitar', icon: Guitar, da: 'guitar', en: 'guitar', de: 'Gitarre' },
  { id: 'heart', icon: Heart, da: 'hjerte', en: 'heart', de: 'Herz' },
  { id: 'key', icon: Key, da: 'nøgle', en: 'key', de: 'Schlüssel' },
  { id: 'lamp', icon: Lamp, da: 'lampe', en: 'lamp', de: 'Lampe' },
]

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="page-shell">
          <section className="about-panel">
            <h1>Der skete en fejl</h1>
            <p>{this.state.error.message}</p>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

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

  if (view.startsWith('ord-match')) return 'ord-match'
  return ['om', 'tier-venner', 'fordel-aebler'].includes(view) ? view : 'hjem'
}

function useWordMatchLanguage() {
  const [language, setLanguage] = useState(() => {
    const hashLanguage = window.location.hash.replace('#ord-match-', '')
    return languageLabels[hashLanguage] ? hashLanguage : 'da'
  })

  useEffect(() => {
    const onHashChange = () => {
      const hashLanguage = window.location.hash.replace('#ord-match-', '')
      if (languageLabels[hashLanguage]) {
        setLanguage(hashLanguage)
      }
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return language
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
        <span className="brand-mark" aria-hidden="true">
          <span>+</span>
          <span>A</span>
          <span>-</span>
          <span>C</span>
          <span>B</span>
        </span>
        <span>PetersApp</span>
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
            icon: '🍎',
          },
        ],
      },
      {
        title: 'Sprog',
        tiles: [
          {
            title: 'Ord-match',
            subject: `${languageFlags.da} Dansk`,
            description: 'Match ord og ikoner på dansk.',
            accent: 'tile-words',
            href: '#ord-match-da',
            icon: languageFlags.da,
          },
          {
            title: 'Ord-match',
            subject: `${languageFlags.en} Engelsk`,
            description: 'Match words and icons in English.',
            accent: 'tile-words',
            href: '#ord-match-en',
            icon: languageFlags.en,
          },
          {
            title: 'Ord-match',
            subject: `${languageFlags.de} Tysk`,
            description: 'Match ord og ikoner på tysk.',
            accent: 'tile-words',
            href: '#ord-match-de',
            icon: languageFlags.de,
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

function ShareApplesGame() {
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

function speakWord(item, language, lastSpokenRef) {
  const word = item[language]
  const speechKey = `${item.id}-${language}`

  if (!window.speechSynthesis || lastSpokenRef.current === speechKey) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = speechLocales[language]
  utterance.rate = 0.86
  utterance.pitch = 1.04
  lastSpokenRef.current = speechKey
  window.speechSynthesis.speak(utterance)
}

function createWordRound() {
  const picked = shuffle(wordItems).slice(0, 10)
  return {
    items: picked,
    words: shuffle(picked),
    icons: shuffle(picked),
  }
}

function WordMatchGame({ initialLanguage }) {
  const [language, setLanguage] = useState(initialLanguage)
  const [round, setRound] = useState(() => createWordRound())
  const [matchedIds, setMatchedIds] = useState([])
  const [message, setMessage] = useState('Træk eller tryk et ord og ikon sammen.')
  const [dragged, setDragged] = useState(null)
  const [picked, setPicked] = useState(null)
  const lastSpokenRef = useRef(null)
  const score = matchedIds.length
  const isComplete = score === round.items.length

  useEffect(() => {
    setLanguage(initialLanguage)
    lastSpokenRef.current = null
  }, [initialLanguage])

  const resetWordGame = () => {
    setRound(createWordRound())
    setMatchedIds([])
    setDragged(null)
    setPicked(null)
    setMessage('Ny runde. Match alle 10 ord.')
    lastSpokenRef.current = null
  }

  const setDragData = (event, type, item) => {
    const data = { type, id: item.id }
    setDragged(data)
    event.dataTransfer.setData('application/json', JSON.stringify(data))
    event.dataTransfer.effectAllowed = 'move'
  }

  const readDragData = (event) => {
    try {
      return JSON.parse(event.dataTransfer.getData('application/json'))
    } catch {
      return dragged
    }
  }

  const tryMatch = (source, targetType, targetItem) => {
    if (!source || source.type === targetType || matchedIds.includes(targetItem.id)) return

    if (source.id === targetItem.id) {
      setMatchedIds((current) => [...current, targetItem.id])
      setMessage(`${targetItem[language]} er matchet.`)
      playTone(score + 1 === round.items.length ? 'finish' : 'success', true)
      return
    }

    setMessage('Ikke helt. Prøv et andet par.')
    playTone('miss', true)
  }

  const handleDropOn = (event, targetType, item) => {
    event.preventDefault()
    tryMatch(readDragData(event), targetType, item)
    setDragged(null)
    setPicked(null)
  }

  const handleTileClick = (item, type) => {
    speakWord(item, language, lastSpokenRef)

    if (matchedIds.includes(item.id)) return

    if (!picked || picked.type === type) {
      setPicked({ type, id: item.id })
      return
    }

    tryMatch(picked, type, item)
    setPicked(null)
  }

  const renderWordCard = (item) => {
    const matched = matchedIds.includes(item.id)

    return (
      <button
        type="button"
        className={`word-card ${matched ? 'matched' : ''} ${picked?.type === 'word' && picked.id === item.id ? 'picked' : ''}`}
        data-word-id={item.id}
        draggable={!matched}
        key={`word-${item.id}`}
        onClick={() => handleTileClick(item, 'word')}
        onDragStart={(event) => setDragData(event, 'word', item)}
        onDragEnd={() => setDragged(null)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => handleDropOn(event, 'word', item)}
      >
        {item[language]}
      </button>
    )
  }

  const renderIconCard = (item) => {
    const Icon = item.icon
    const matched = matchedIds.includes(item.id)

    return (
      <button
        type="button"
        className={`word-icon-card ${matched ? 'matched' : ''} ${picked?.type === 'icon' && picked.id === item.id ? 'picked' : ''}`}
        data-icon-id={item.id}
        draggable={!matched}
        key={`icon-${item.id}`}
        onClick={() => handleTileClick(item, 'icon')}
        onDragStart={(event) => setDragData(event, 'icon', item)}
        onDragEnd={() => setDragged(null)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => handleDropOn(event, 'icon', item)}
        aria-label={item[language]}
      >
        <Icon aria-hidden="true" strokeWidth={2.6} />
      </button>
    )
  }

  return (
    <main className="word-game-shell">
      <section className="word-game">
        <div className="word-game-topbar">
          <div>
            <p className="kicker">Sprog</p>
            <h1>{languageFlags[language]} Ord-match</h1>
          </div>
          <div className="word-controls">
            <label>
              Sprog
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                {Object.entries(languageLabels).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <span className="score-pill">Score: {score} / {round.items.length}</span>
            <button type="button" className="icon-button" onClick={resetWordGame}>
              Spil igen
            </button>
          </div>
        </div>

        <div className="word-board">
          <section className="word-column" aria-label="Ord">
            <h2>Ord</h2>
            <div className="word-card-grid">{round.words.map(renderWordCard)}</div>
          </section>
          <section className="word-column" aria-label="Ikoner">
            <h2>Ikoner</h2>
            <div className="word-card-grid">{round.icons.map(renderIconCard)}</div>
          </section>
        </div>

        <p className="word-message" aria-live="polite">
          {isComplete ? 'Flot. Alle ord er matchet.' : message}
        </p>

        {isComplete && (
          <>
            <Celebration />
            <section className="finish-panel" aria-live="polite">
              <h2>Godt matchet</h2>
              <p>Alle 10 ord og ikoner passer sammen.</p>
              <button type="button" onClick={resetWordGame}>
                Spil igen
              </button>
            </section>
          </>
        )}
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

function About() {
  return (
    <main className="page-shell narrow">
      <section className="about-panel" aria-labelledby="about-title">
        <p className="kicker">Om appen</p>
        <h1 id="about-title">PetersApp er en lille samling undervisningsværktøjer.</h1>
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
      <span>PetersApp</span>
      <span>v{appVersion}</span>
    </footer>
  )
}

export default function App() {
  const view = useCurrentView()
  const wordMatchLanguage = useWordMatchLanguage()
  const latestVersion = useVersionNotice()

  return (
    <div className={`app ${view === 'tier-venner' || view === 'ord-match' || view === 'fordel-aebler' ? 'game-app' : ''}`}>
      <Header view={view} />
      <VersionNotice latestVersion={latestVersion} />
      <ErrorBoundary key={view}>
        {view === 'om' ? <About /> : view === 'tier-venner' ? <TenFriendsGame /> : view === 'ord-match' ? <WordMatchGame initialLanguage={wordMatchLanguage} /> : view === 'fordel-aebler' ? <ShareApplesGame /> : <Home />}
      </ErrorBoundary>
      <Footer />
    </div>
  )
}
