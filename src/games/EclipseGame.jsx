import { useEffect, useRef, useState } from 'react'

// Scene-koordinater (SVG viewBox). Solen står fast; Månen glider vandret henover.
const VIEW_W = 100
const VIEW_H = 60
const SUN = { cx: 50, cy: 28, r: 13 }
const MOON_R = 15
const TRACK_MIN = 18
const TRACK_MAX = 82
const KEY_STEP = 2

// Stjerner på himlen (kun øverste del), tændes når det bliver mørkt.
const stars = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  x: 6 + ((index * 37) % 88),
  y: 4 + ((index * 19) % 34),
  r: 0.3 + (index % 3) * 0.18,
}))
// Kratere på Månen (forskydning fra Månens centrum), så den ikke er en flad skive.
const craters = [
  { dx: -4, dy: -3, r: 2.4 },
  { dx: 3, dy: 2, r: 3 },
  { dx: 5, dy: -5, r: 1.6 },
  { dx: -5, dy: 4, r: 1.8 },
  { dx: 1, dy: -6, r: 1.3 },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const smoothstep = (t) => t * t * (3 - 2 * t)
const mix = (a, b, t) => a.map((value, index) => Math.round(value + (b[index] - value) * t))
const rgb = (channels) => `rgb(${channels[0]} ${channels[1]} ${channels[2]})`

const DAY_SKY = [126, 200, 245]
const NIGHT_SKY = [9, 14, 33]
const DAY_GROUND = [120, 176, 96]
const NIGHT_GROUND = [18, 26, 24]

// Naturaktivitet: træk Månen foran Solen og oplev en solformørkelse.
export function EclipseGame() {
  const [moonX, setMoonX] = useState(TRACK_MIN)
  const [dragging, setDragging] = useState(false)
  const svgRef = useRef(null)
  const rafRef = useRef(0)

  const separation = Math.abs(moonX - SUN.cx)
  const coverage = clamp((SUN.r + MOON_R - separation) / (2 * SUN.r), 0, 1)
  const isTotal = separation <= MOON_R - SUN.r

  const darkness = smoothstep(coverage)
  const skyColor = rgb(mix(DAY_SKY, NIGHT_SKY, darkness))
  const groundColor = rgb(mix(DAY_GROUND, NIGHT_GROUND, darkness))
  const glowOpacity = 1 - coverage * 0.85
  const coronaOpacity = clamp((coverage - 0.82) / 0.18, 0, 1)
  const starsOpacity = clamp((coverage - 0.5) / 0.4, 0, 1)

  const stopAutoRun = () => cancelAnimationFrame(rafRef.current)

  useEffect(() => stopAutoRun, [])

  const message = isTotal
    ? 'Solformørkelse! Månen dækker hele Solen, og det blev mørkt midt på dagen.'
    : coverage === 0
      ? 'Træk Månen hen foran Solen. Prøv at dække den helt.'
      : coverage >= 0.6
        ? 'Næsten! Nu er Solen kun en tynd måne-form.'
        : 'Godt – Månen skubber sig ind foran Solen.'

  const pointToTrack = (event) => {
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * VIEW_W
    return clamp(x, TRACK_MIN, TRACK_MAX)
  }

  const handlePointerDown = (event) => {
    stopAutoRun()
    setDragging(true)
    svgRef.current.setPointerCapture(event.pointerId)
    setMoonX(pointToTrack(event))
  }

  const handlePointerMove = (event) => {
    if (!dragging) return
    setMoonX(pointToTrack(event))
  }

  const handlePointerUp = (event) => {
    setDragging(false)
    if (svgRef.current.hasPointerCapture(event.pointerId)) {
      svgRef.current.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      stopAutoRun()
      const direction = event.key === 'ArrowLeft' ? -1 : 1
      setMoonX((current) => clamp(current + direction * KEY_STEP, TRACK_MIN, TRACK_MAX))
    }
  }

  const reset = () => {
    stopAutoRun()
    setMoonX(TRACK_MIN)
  }

  const autoRun = () => {
    stopAutoRun()
    const duration = 6000
    const start = performance.now()
    setMoonX(TRACK_MIN)
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setMoonX(TRACK_MIN + (TRACK_MAX - TRACK_MIN) * t)
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }

  return (
    <main className="eclipse-game-shell">
      <section className="eclipse-topbar">
        <div>
          <p className="kicker">Natur</p>
          <h1>Solformørkelse</h1>
        </div>
        <button type="button" className="icon-button" onClick={reset}>
          Forfra
        </button>
      </section>

      <p className="share-message" aria-live="polite">
        {message}
      </p>

      <div className={`eclipse-stage ${dragging ? 'dragging' : ''}`}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            <radialGradient id="eclipse-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="60%" stopColor="#ffd000" />
              <stop offset="100%" stopColor="#ff9d00" />
            </radialGradient>
            <radialGradient id="eclipse-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 221, 120, 0.95)" />
              <stop offset="100%" stopColor="rgba(255, 221, 120, 0)" />
            </radialGradient>
            <radialGradient id="eclipse-corona" cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </radialGradient>
            <radialGradient id="eclipse-moon" cx="42%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#7b8395" />
              <stop offset="100%" stopColor="#2c3340" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={skyColor} />

          <g opacity={starsOpacity}>
            {stars.map((star) => (
              <circle key={star.id} cx={star.x} cy={star.y} r={star.r} fill="#fff7e0" />
            ))}
          </g>

          <ellipse cx="30" cy="64" rx="48" ry="16" fill={groundColor} />
          <ellipse cx="78" cy="66" rx="40" ry="15" fill={groundColor} />

          {/* Solens skær – falmer efterhånden som Månen dækker. */}
          <circle cx={SUN.cx} cy={SUN.cy} r={SUN.r + 8} fill="url(#eclipse-glow)" opacity={glowOpacity} />
          <circle cx={SUN.cx} cy={SUN.cy} r={SUN.r} fill="url(#eclipse-sun)" />

          {/* Korona – den hvide krans, der kun ses ved totalitet (bag Månen). */}
          <circle cx={moonX} cy={SUN.cy} r={MOON_R + 7} fill="url(#eclipse-corona)" opacity={coronaOpacity} />

          {/* Månen – mørk skive, der lægger sig foran Solen. */}
          <g
            role="slider"
            tabIndex={0}
            aria-label="Månen. Flyt med venstre og højre piletast for at dække Solen."
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(coverage * 100)}
            className="eclipse-moon"
            onKeyDown={handleKeyDown}
          >
            <circle cx={moonX} cy={SUN.cy} r={MOON_R} fill="url(#eclipse-moon)" />
            {craters.map((crater, index) => (
              <circle
                key={index}
                cx={moonX + crater.dx}
                cy={SUN.cy + crater.dy}
                r={crater.r}
                fill="#252b36"
                opacity="0.55"
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="eclipse-controls">
        <button type="button" className="icon-button" onClick={autoRun}>
          ▶ Kør formørkelsen
        </button>
      </div>
    </main>
  )
}
