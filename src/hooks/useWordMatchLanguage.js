import { useEffect, useState } from 'react'
import { languageLabels } from '../data/languages.js'

// Læser sproget ud af hash'en (#ord-match-da/en/de) og opdaterer ved hash-skift.
export function useWordMatchLanguage() {
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
