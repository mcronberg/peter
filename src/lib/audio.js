// Små lyde via Web Audio API. Ingen lydfiler – tonerne genereres på stedet.
export function playTone(kind, enabled) {
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
