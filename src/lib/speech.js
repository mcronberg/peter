// Taleoplæsning til Ord-match. Samme ord oplæses ikke to gange i træk (lastSpokenRef).
const speechLocales = {
  da: 'da-DK',
  en: 'en-US',
  de: 'de-DE',
}

export function speakWord(item, language, lastSpokenRef) {
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
