// Vises når en nyere version er deployet (se useVersionNotice). Reload med version-query.
export function VersionNotice({ latestVersion }) {
  if (!latestVersion) return null

  const reloadApp = () => {
    const base = import.meta.env.BASE_URL
    window.location.assign(`${base}?v=${encodeURIComponent(latestVersion)}#hjem`)
  }

  return (
    <section className="version-notice" aria-live="polite">
      <div>
        <strong>Der er kommet en ny version.</strong>
        <span> Hent v{latestVersion}, så er du helt opdateret.</span>
      </div>
      <button type="button" onClick={reloadApp}>
        Hent ny version
      </button>
    </section>
  )
}
