import { useState } from 'react'
import { shuffle } from '../lib/shuffle.js'

// Plantens dele i rækkefølge nedefra og op. Hver del har præcis én plads.
const PLANT_PARTS = [
  { key: 'rod', label: 'Rod' },
  { key: 'staengel', label: 'Stængel' },
  { key: 'kimblad', label: 'Kimblad' },
  { key: 'blad', label: 'Blad' },
  { key: 'blomst', label: 'Blomst' },
]
const partByKey = Object.fromEntries(PLANT_PARTS.map((part) => [part.key, part]))

// Klik-/trækfelter i SVG-koordinater (viewBox 100x60), så de følger figurernes position præcist.
const SLOT_RECT = {
  blomst: { x: 31, y: 1, w: 38, h: 19 },
  blad: { x: 26, y: 20, w: 48, h: 12 },
  staengel: { x: 41, y: 32, w: 18, h: 8 },
  kimblad: { x: 30, y: 40, w: 40, h: 6 },
  rod: { x: 35, y: 46.5, w: 30, h: 12.5 },
}

const ghost = {
  fill: 'none',
  stroke: '#9bb38f',
  strokeWidth: 0.7,
  strokeDasharray: '1.8 1.6',
  opacity: 0.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const ROD_PATH =
  'M50,46 C50,50 49.5,53 50,58 M50,49 C47.5,51 45.5,52.5 44,55.5 M50,51 C52.5,53 54.5,54.5 56,57.5 M50,53.5 C48.5,55.5 47.5,57 46.5,59.5 M50,54.5 C51.5,56.5 52.5,57.5 54,59.5'
const STEM_PATH = 'M50,46 C49,38 51,28 50,15'
const PETAL_ANGLES = [0, 60, 120, 180, 240, 300]

function RodPart({ placed }) {
  if (!placed) return <path d={ROD_PATH} {...ghost} />
  return <path d={ROD_PATH} fill="none" stroke="#a9763f" strokeWidth="1.2" strokeLinecap="round" />
}

function StemPart({ placed }) {
  if (!placed) return <path d={STEM_PATH} {...ghost} strokeWidth={2.4} />
  return <path d={STEM_PATH} fill="none" stroke="#3c9d4e" strokeWidth="3" strokeLinecap="round" />
}

function KimbladPart({ placed }) {
  const style = placed ? { fill: '#9ad98a', stroke: '#6fb86a', strokeWidth: 0.4 } : ghost
  return (
    <g>
      <ellipse cx="45.5" cy="41.5" rx="4.3" ry="2.3" transform="rotate(-22 45.5 41.5)" {...style} />
      <ellipse cx="54.5" cy="41.5" rx="4.3" ry="2.3" transform="rotate(22 54.5 41.5)" {...style} />
    </g>
  )
}

function BladPart({ placed }) {
  const style = placed ? { fill: '#3fae5a', stroke: '#2f9247', strokeWidth: 0.4 } : ghost
  return (
    <g>
      <ellipse cx="44" cy="28" rx="6.2" ry="3.2" transform="rotate(-26 44 28)" {...style} />
      <ellipse cx="56" cy="28" rx="6.2" ry="3.2" transform="rotate(26 56 28)" {...style} />
    </g>
  )
}

function BlomstPart({ placed, color }) {
  if (!placed) {
    return (
      <g>
        <circle cx="50" cy="13" r="7.5" {...ghost} />
        <circle cx="50" cy="13" r="3.2" {...ghost} />
      </g>
    )
  }
  return (
    <g>
      {PETAL_ANGLES.map((angle) => (
        <ellipse key={angle} cx="50" cy="6.6" rx="2.5" ry="4.2" fill={color} transform={`rotate(${angle} 50 13)`} />
      ))}
      <circle cx="50" cy="13" r="3.4" fill="#ffd23f" />
    </g>
  )
}

// Små ikoner til delene i bakken.
function PartIcon({ part }) {
  switch (part) {
    case 'rod':
      return (
        <svg viewBox="0 0 24 24" className="part-icon" aria-hidden="true">
          <path d="M12,3 V11 M12,9 C9,12 7,14 6,19 M12,10 C15,13 17,15 18,20 M12,12 C11,15 10,17 9,21"
            fill="none" stroke="#a9763f" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'staengel':
      return (
        <svg viewBox="0 0 24 24" className="part-icon" aria-hidden="true">
          <path d="M12,21 C11,15 13,9 12,3" fill="none" stroke="#3c9d4e" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      )
    case 'kimblad':
      return (
        <svg viewBox="0 0 24 24" className="part-icon" aria-hidden="true">
          <ellipse cx="8" cy="13" rx="6" ry="3.2" transform="rotate(-22 8 13)" fill="#9ad98a" stroke="#6fb86a" strokeWidth="0.6" />
          <ellipse cx="16" cy="13" rx="6" ry="3.2" transform="rotate(22 16 13)" fill="#9ad98a" stroke="#6fb86a" strokeWidth="0.6" />
        </svg>
      )
    case 'blad':
      return (
        <svg viewBox="0 0 24 24" className="part-icon" aria-hidden="true">
          <ellipse cx="8" cy="12" rx="7" ry="3.6" transform="rotate(-26 8 12)" fill="#3fae5a" stroke="#2f9247" strokeWidth="0.6" />
          <ellipse cx="16" cy="12" rx="7" ry="3.6" transform="rotate(26 16 12)" fill="#3fae5a" stroke="#2f9247" strokeWidth="0.6" />
        </svg>
      )
    case 'blomst':
      return (
        <svg viewBox="0 0 24 24" className="part-icon" aria-hidden="true">
          {PETAL_ANGLES.map((angle) => (
            <ellipse key={angle} cx="12" cy="6" rx="2.8" ry="4.6" fill="#ff7eb6" transform={`rotate(${angle} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="3.6" fill="#ffd23f" />
        </svg>
      )
    default:
      return null
  }
}

// Farver til paletten, så barnet kan farve blomsten.
const PETAL_COLORS = [
  { value: '#ff7eb6', label: 'lyserød' },
  { value: '#ff5d5d', label: 'rød' },
  { value: '#ffd23f', label: 'gul' },
  { value: '#b06fff', label: 'lilla' },
  { value: '#ff9f43', label: 'orange' },
  { value: '#5db0ff', label: 'blå' },
]

// 2D-dyr der flyver langsomt og blødt rundt i scenen, hver ad sin egen rute og i forskellig størrelse.
const DECOR = [
  { id: 'bee1', type: 'bee', cls: 'fly-a', size: '8%', dur: '24s', delay: '0s' },
  { id: 'bee2', type: 'bee', cls: 'fly-b', size: '5%', dur: '29s', delay: '-6s' },
  { id: 'bfly1', type: 'butterfly', cls: 'fly-c', size: '8.5%', dur: '22s', delay: '-3s' },
  { id: 'bfly2', type: 'butterfly', cls: 'fly-d', size: '6%', dur: '27s', delay: '-12s' },
]

function BeeSvg() {
  return (
    <svg viewBox="0 0 30 22" aria-hidden="true">
      <g className="bee-wings">
        <ellipse cx="12" cy="6" rx="4.5" ry="6.5" fill="rgba(255,255,255,0.85)" stroke="#cfd6e0" strokeWidth="0.6" />
        <ellipse cx="18" cy="6" rx="4.5" ry="6.5" fill="rgba(255,255,255,0.85)" stroke="#cfd6e0" strokeWidth="0.6" />
      </g>
      <ellipse cx="15" cy="13" rx="9" ry="6.5" fill="#ffce3a" stroke="#3a2f1a" strokeWidth="0.8" />
      <path d="M13,7.2 L13,18.8 M17,7.6 L17,18.4" stroke="#3a2f1a" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="23.5" cy="11" r="1" fill="#3a2f1a" />
    </svg>
  )
}

function ButterflySvg() {
  return (
    <svg viewBox="0 0 32 26" aria-hidden="true">
      <g className="bfly-wing bfly-left">
        <ellipse cx="9.5" cy="9" rx="6.5" ry="5.5" fill="#ff9eb5" stroke="#e76f9a" strokeWidth="0.7" />
        <ellipse cx="11" cy="17.5" rx="4.6" ry="4" fill="#ffd166" stroke="#e0a93b" strokeWidth="0.7" />
        <circle cx="9" cy="8.5" r="1.4" fill="#fff7e0" />
      </g>
      <g className="bfly-wing bfly-right">
        <ellipse cx="22.5" cy="9" rx="6.5" ry="5.5" fill="#ff9eb5" stroke="#e76f9a" strokeWidth="0.7" />
        <ellipse cx="21" cy="17.5" rx="4.6" ry="4" fill="#ffd166" stroke="#e0a93b" strokeWidth="0.7" />
        <circle cx="23" cy="8.5" r="1.4" fill="#fff7e0" />
      </g>
      <ellipse cx="16" cy="13" rx="1.2" ry="6.5" fill="#4a3b2a" />
      <path d="M16,7 C14.5,4 13.5,3 12.5,2.5 M16,7 C17.5,4 18.5,3 19.5,2.5" fill="none" stroke="#4a3b2a" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  )
}

function Decor() {
  return (
    <div className="plant-decor" aria-hidden="true">
      {DECOR.map((item) => (
        <div
          key={item.id}
          className={`insect ${item.cls}`}
          style={{ width: item.size, animationDuration: item.dur, animationDelay: item.delay }}
        >
          {item.type === 'bee' ? <BeeSvg /> : <ButterflySvg />}
        </div>
      ))}
    </div>
  )
}

// Naturaktivitet: byg en plante ved at trække delene op på de rigtige pladser.
export function PlantBuilderGame() {
  const [trayOrder, setTrayOrder] = useState(() => shuffle(PLANT_PARTS.map((part) => part.key)))
  const [placed, setPlaced] = useState({})
  const [selected, setSelected] = useState(null)
  const [dragged, setDragged] = useState(null)
  const [message, setMessage] = useState('Træk delene op og byg planten nedefra.')
  const [petalColor, setPetalColor] = useState(PETAL_COLORS[0].value)

  const isComplete = PLANT_PARTS.every((part) => placed[part.key])
  const trayParts = trayOrder.filter((key) => !placed[key])

  const placePart = (slotKey, partKey) => {
    if (!partKey) return
    if (partKey === slotKey) {
      setPlaced((current) => ({ ...current, [slotKey]: true }))
      setMessage(`${partByKey[slotKey].label} sat på plads.`)
    } else {
      setMessage(`${partByKey[partKey].label} hører ikke til her. Prøv igen.`)
    }
    setSelected(null)
    setDragged(null)
  }

  const selectPart = (partKey) => {
    setSelected((current) => (current === partKey ? null : partKey))
    setMessage(`Vælg pladsen til ${partByKey[partKey].label}.`)
  }

  const handleDrop = (event, slotKey) => {
    event.preventDefault()
    const partKey = event.dataTransfer.getData('text/plain') || dragged
    placePart(slotKey, partKey)
  }

  const reset = () => {
    setTrayOrder(shuffle(PLANT_PARTS.map((part) => part.key)))
    setPlaced({})
    setSelected(null)
    setDragged(null)
    setMessage('Ny plante. Byg den nedefra.')
  }

  return (
    <main className="plant-game-shell">
      <section className="plant-topbar">
        <div>
          <p className="kicker">Natur</p>
          <h1>Byg en plante</h1>
        </div>
        <button type="button" className="icon-button" onClick={reset}>
          Forfra
        </button>
      </section>

      <p className="share-message" aria-live="polite">
        {isComplete ? 'Din plante er færdig.' : message}
      </p>

      <div className={`plant-stage ${isComplete ? 'complete' : ''}`}>
        <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" className="plant-scene">
          <defs>
            <linearGradient id="plant-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfeaff" />
              <stop offset="100%" stopColor="#e9f8e3" />
            </linearGradient>
            <linearGradient id="plant-soil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8a5a33" />
              <stop offset="100%" stopColor="#6b4423" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="100" height="46" fill="url(#plant-sky)" />
          <rect x="0" y="46" width="100" height="14" fill="url(#plant-soil)" />

          {/* Rødderne sidder fast i jorden og vugger ikke med. */}
          <RodPart placed={!!placed.rod} />

          <g className="plant-sway">
            <StemPart placed={!!placed.staengel} />
            <KimbladPart placed={!!placed.kimblad} />
            <BladPart placed={!!placed.blad} />
            <BlomstPart placed={!!placed.blomst} color={petalColor} />
          </g>

          {/* Pladser til delene (klik, træk eller piletast + Enter). */}
          {PLANT_PARTS.filter((part) => !placed[part.key]).map((part) => {
            const box = SLOT_RECT[part.key]
            return (
              <g
                key={part.key}
                className={`plant-slot ${selected ? 'ready' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`Plads til ${part.label}`}
                onClick={() => selected && placePart(part.key, selected)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    if (selected) placePart(part.key, selected)
                  }
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, part.key)}
              >
                <rect className="plant-slot-hit" x={box.x} y={box.y} width={box.w} height={box.h} rx="2" />
                <text className="plant-slot-text" x={box.x + box.w / 2} y={box.y + box.h / 2} textAnchor="middle" dominantBaseline="central">
                  {part.label}
                </text>
              </g>
            )
          })}
        </svg>

        <Decor />
      </div>

      <div className="plant-palette" aria-label="Farv blomsten">
        <span className="plant-palette-label">Blomstens farve</span>
        {PETAL_COLORS.map((color) => (
          <button
            type="button"
            key={color.value}
            className={`plant-swatch ${petalColor === color.value ? 'selected' : ''}`}
            style={{ '--swatch': color.value }}
            aria-label={`Farv blomsten ${color.label}`}
            aria-pressed={petalColor === color.value}
            onClick={() => setPetalColor(color.value)}
          />
        ))}
      </div>

      <div className="plant-tray" aria-label="Plantens dele">
        {trayParts.length === 0 ? (
          <p className="plant-tray-done">Alle dele er sat på plads.</p>
        ) : (
          trayParts.map((key) => (
            <button
              type="button"
              key={key}
              className={`plant-part-button ${selected === key ? 'selected' : ''}`}
              draggable
              onClick={() => selectPart(key)}
              onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', key)
                event.dataTransfer.effectAllowed = 'move'
                setDragged(key)
              }}
              onDragEnd={() => setDragged(null)}
            >
              <PartIcon part={key} />
              <span>{partByKey[key].label}</span>
            </button>
          ))
        )}
      </div>
    </main>
  )
}
