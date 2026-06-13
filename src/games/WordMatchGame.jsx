import { useEffect, useRef, useState } from 'react'
import { shuffle } from '../lib/shuffle.js'
import { playTone } from '../lib/audio.js'
import { speakWord } from '../lib/speech.js'
import { wordItems } from '../data/words.js'
import { languageLabels } from '../data/languages.js'
import { languageFlagComponents } from '../components/Flags.jsx'
import { Celebration } from '../components/Celebration.jsx'

function createWordRound() {
  const picked = shuffle(wordItems).slice(0, 10)
  return {
    items: picked,
    words: shuffle(picked),
    icons: shuffle(picked),
  }
}

// Sprogspil: match 10 ord med deres ikoner på dansk/engelsk/tysk, med taleoplæsning.
export function WordMatchGame({ initialLanguage }) {
  const [language, setLanguage] = useState(initialLanguage)
  const [round, setRound] = useState(() => createWordRound())
  const [matchedIds, setMatchedIds] = useState([])
  const [message, setMessage] = useState('Træk eller tryk et ord og ikon sammen.')
  const [dragged, setDragged] = useState(null)
  const [picked, setPicked] = useState(null)
  const lastSpokenRef = useRef(null)
  const score = matchedIds.length
  const isComplete = score === round.items.length
  const LanguageFlag = languageFlagComponents[language]

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
            <h1><LanguageFlag className="header-flag" /> Ord-match</h1>
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
