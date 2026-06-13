export function Header({ view }) {
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
