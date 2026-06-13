import { useEffect, useState } from 'react'

// Hash-baseret routing. Alle #ord-match-* samles til view'et 'ord-match'.
export function useCurrentView() {
  const [view, setView] = useState(() => window.location.hash.replace('#', '') || 'hjem')

  useEffect(() => {
    const onHashChange = () => setView(window.location.hash.replace('#', '') || 'hjem')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (view.startsWith('ord-match')) return 'ord-match'
  return ['om', 'tier-venner', 'fordel-aebler', 'byg-raekker', 'solformoerkelse'].includes(view) ? view : 'hjem'
}
