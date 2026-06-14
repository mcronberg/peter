import { useCurrentView } from './hooks/useCurrentView.js'
import { useWordMatchLanguage } from './hooks/useWordMatchLanguage.js'
import { useVersionNotice } from './hooks/useVersionNotice.js'
import { Header } from './components/Header.jsx'
import { VersionNotice } from './components/VersionNotice.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { Footer } from './components/Footer.jsx'
import { Home } from './components/Home.jsx'
import { About } from './components/About.jsx'
import { TenFriendsGame } from './games/TenFriendsGame.jsx'
import { ShareApplesGame } from './games/ShareApplesGame.jsx'
import { BuildRowsGame } from './games/BuildRowsGame.jsx'
import { WordMatchGame } from './games/WordMatchGame.jsx'
import { EclipseGame } from './games/EclipseGame.jsx'
import { PlantBuilderGame } from './games/PlantBuilderGame.jsx'
import { MemoryGame } from './games/MemoryGame.jsx'
import { PhotosynthesisGame } from './games/PhotosynthesisGame.jsx'

const gameViews = ['tier-venner', 'ord-match', 'fordel-aebler', 'byg-raekker', 'solformoerkelse', 'byg-plante', 'fotosyntese', 'memory']

// Vælger hvilken side/spil der vises ud fra det aktuelle view (hash-routing).
function renderView(view, wordMatchLanguage) {
  switch (view) {
    case 'om':
      return <About />
    case 'tier-venner':
      return <TenFriendsGame />
    case 'ord-match':
      return <WordMatchGame initialLanguage={wordMatchLanguage} />
    case 'fordel-aebler':
      return <ShareApplesGame />
    case 'byg-raekker':
      return <BuildRowsGame />
    case 'solformoerkelse':
      return <EclipseGame />
    case 'byg-plante':
      return <PlantBuilderGame />
    case 'fotosyntese':
      return <PhotosynthesisGame />
    case 'memory':
      return <MemoryGame />
    default:
      return <Home />
  }
}

export default function App() {
  const view = useCurrentView()
  const wordMatchLanguage = useWordMatchLanguage()
  const latestVersion = useVersionNotice()

  return (
    <div className={`app ${gameViews.includes(view) ? 'game-app' : ''}`}>
      <Header view={view} />
      <VersionNotice latestVersion={latestVersion} />
      <ErrorBoundary key={view}>{renderView(view, wordMatchLanguage)}</ErrorBoundary>
      <Footer />
    </div>
  )
}
