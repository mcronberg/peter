import { useEffect, useState } from 'react'
import { playTone } from '../lib/audio.js'

const INPUTS = [
  { key: 'sun', label: 'Sollys', target: 'leaf' },
  { key: 'water', label: 'Vand', target: 'root' },
  { key: 'co2', label: 'CO₂', target: 'leaf' },
]

const SLOTS = [
  { key: 'leaf', label: 'bladene' },
  { key: 'root', label: 'rødderne' },
]

const inputByKey = Object.fromEntries(INPUTS.map((input) => [input.key, input]))

function InputIcon({ type }) {
  switch (type) {
    case 'sun':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="11" fill="#ffd23f" stroke="#f2a81d" strokeWidth="2" />
          {Array.from({ length: 10 }, (_, index) => {
            const angle = index * 36
            return <path key={angle} d="M24 4 V10" stroke="#f2a81d" strokeWidth="3" strokeLinecap="round" transform={`rotate(${angle} 24 24)`} />
          })}
        </svg>
      )
    case 'water':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 5 C16 16 12 23 12 31 C12 39 17 44 24 44 C31 44 36 39 36 31 C36 23 32 16 24 5 Z" fill="#5db0ff" stroke="#2f80ed" strokeWidth="2" />
          <path d="M18 30 C18 35 21 38 25 38" fill="none" stroke="#dff4ff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case 'co2':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="16" cy="24" r="10" fill="#e8f4ff" stroke="#527aa3" strokeWidth="2" />
          <circle cx="32" cy="24" r="10" fill="#e8f4ff" stroke="#527aa3" strokeWidth="2" />
          <text x="24" y="29" textAnchor="middle" fill="#243044" fontSize="13" fontWeight="900">CO₂</text>
        </svg>
      )
    default:
      return null
  }
}

function PhotosynthesisScene({ placed, isComplete }) {
  return (
    <svg className="photo-scene" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="photo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfeaff" />
          <stop offset="1" stopColor="#efffdc" />
        </linearGradient>
        <linearGradient id="photo-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9c18f" />
          <stop offset="1" stopColor="#b58a54" />
        </linearGradient>
      </defs>

      <rect width="100" height="60" fill="url(#photo-sky)" />
      <rect y="45" width="100" height="15" fill="url(#photo-ground)" />

      <g className={isComplete ? 'photo-sun active' : 'photo-sun'}>
        <circle cx="16" cy="13" r="7" fill="#ffd23f" stroke="#f2a81d" strokeWidth="0.8" />
        {Array.from({ length: 10 }, (_, index) => {
          const angle = index * 36
          return <path key={angle} d="M16 2.5 V6" stroke="#f2a81d" strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${angle} 16 13)`} />
        })}
      </g>

      <g className="photo-plant" transform="translate(50 35) scale(1.42) translate(-50 -35)">
        <path className={isComplete ? 'photo-water-flow active' : 'photo-water-flow'} d="M50 54 C49 47 50 39 50 31 C50 24 50 19 50 13" />
        <path d="M50 49 C49 39 51 27 50 14" fill="none" stroke="#3c9d4e" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="39" cy="28" rx="11" ry="5.4" transform="rotate(-24 39 28)" fill="#3fae5a" stroke="#2f9247" strokeWidth="0.7" />
        <ellipse cx="61" cy="28" rx="11" ry="5.4" transform="rotate(24 61 28)" fill="#3fae5a" stroke="#2f9247" strokeWidth="0.7" />
        <ellipse cx="43" cy="18" rx="9" ry="5" transform="rotate(-34 43 18)" fill="#58bd67" stroke="#2f9247" strokeWidth="0.7" />
        <ellipse cx="58" cy="18" rx="9" ry="5" transform="rotate(34 58 18)" fill="#58bd67" stroke="#2f9247" strokeWidth="0.7" />
        <path d="M50 48 C47 50 45 53 43 57 M50 49 C53 51 55 54 57 57 M50 51 C49 54 48 56 47 59 M50 51 C51 54 52 56 53 59" fill="none" stroke="#a9763f" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {placed.sun && (
        <g className={isComplete ? 'photo-rays active' : 'photo-rays'}>
          <path d="M23 17 C31 20 35 22 43 24" />
          <path d="M23 12 C33 13 40 15 48 19" />
          <path d="M19 20 C27 28 33 31 40 31" />
        </g>
      )}

      {placed.co2 && (
        <g className={isComplete ? 'photo-co2 active' : 'photo-co2'}>
          <circle cx="82" cy="21" r="3.2" />
          <circle cx="76" cy="30" r="2.8" />
          <circle cx="87" cy="34" r="2.4" />
          <text x="82" y="18" textAnchor="middle">CO₂</text>
        </g>
      )}

      {placed.water && (
        <g className={isComplete ? 'photo-water active' : 'photo-water'}>
          <path d="M22 48 C19 52 18 54 18 56.5 C18 59 20 60.5 22 60.5 C24 60.5 26 59 26 56.5 C26 54 25 52 22 48 Z" />
          <path d="M31 45 C28 49 27 52 27 54.5 C27 57 29 58.5 31 58.5 C33 58.5 35 57 35 54.5 C35 52 34 49 31 45 Z" />
          <path d="M40 48 C37 52 36 54 36 56.5 C36 59 38 60.5 40 60.5 C42 60.5 44 59 44 56.5 C44 54 43 52 40 48 Z" />
        </g>
      )}

      {isComplete && (
        <>
          <g className="photo-output output-oxygen">
            <circle cx="77" cy="14" r="3.4" />
            <circle cx="84" cy="10" r="2.6" />
            <circle cx="89" cy="17" r="2.2" />
            <text x="82" y="25" textAnchor="middle">O₂</text>
          </g>
          <g className="photo-output output-sugar">
            <rect x="44" y="31" width="13" height="8" rx="2" />
            <text x="50.5" y="37.2" textAnchor="middle">energi</text>
          </g>
        </>
      )}
    </svg>
  )
}

export function PhotosynthesisGame() {
  const [placed, setPlaced] = useState({})
  const [selected, setSelected] = useState(null)
  const [dragged, setDragged] = useState(null)
  const [message, setMessage] = useState('Giv planten sollys, vand og CO₂.')
  const isComplete = INPUTS.every((input) => placed[input.key])
  const trayInputs = INPUTS.filter((input) => !placed[input.key])

  useEffect(() => {
    if (isComplete) {
      setMessage('Planten laver sukker/energi og sender O₂ ud.')
      playTone('finish', true)
    }
  }, [isComplete])

  const placeInput = (slotKey, inputKey) => {
    const input = inputByKey[inputKey]
    if (!input) return

    if (input.target === slotKey) {
      setPlaced((current) => ({ ...current, [inputKey]: true }))
      setMessage(`${input.label} er på plads.`)
      playTone('success', true)
    } else {
      setMessage(`${input.label} skal et andet sted hen.`)
      playTone('miss', true)
    }

    setSelected(null)
    setDragged(null)
  }

  const reset = () => {
    setPlaced({})
    setSelected(null)
    setDragged(null)
    setMessage('Giv planten sollys, vand og CO₂.')
  }

  return (
    <main className="photo-game-shell">
      <section className="photo-topbar">
        <div>
          <p className="kicker">Natur</p>
          <h1>Fotosyntese</h1>
        </div>
        <button type="button" className="icon-button" onClick={reset}>
          Forfra
        </button>
      </section>

      <p className="share-message" aria-live="polite">
        {message}
      </p>

      <section className={`photo-stage ${isComplete ? 'complete' : ''}`}>
        <PhotosynthesisScene placed={placed} isComplete={isComplete} />

        {SLOTS.map((slot) => (
          <button
            type="button"
            className={`photo-slot ${slot.key} ${selected ? 'ready' : ''}`}
            key={slot.key}
            aria-label={`Placér ved ${slot.label}`}
            onClick={() => selected && placeInput(slot.key, selected)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              placeInput(slot.key, event.dataTransfer.getData('text/plain') || dragged)
            }}
          />
        ))}
      </section>

      <section className="photo-tray" aria-label="Ting planten bruger">
        {trayInputs.map((input) => (
          <button
            type="button"
            className={`photo-input ${selected === input.key ? 'selected' : ''}`}
            draggable
            key={input.key}
            onClick={() => {
              setSelected((current) => (current === input.key ? null : input.key))
              setMessage(`Vælg hvor ${input.label} skal hen.`)
            }}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', input.key)
              setDragged(input.key)
            }}
            onDragEnd={() => setDragged(null)}
          >
            <InputIcon type={input.key} />
            <span>{input.label}</span>
          </button>
        ))}
        {isComplete && (
          <div className="photo-result" aria-live="polite">
            <strong>Ud:</strong>
            <span>O₂</span>
            <span>Sukker/energi</span>
          </div>
        )}
      </section>
    </main>
  )
}
