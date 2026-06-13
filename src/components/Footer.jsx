import { appVersion } from '../lib/version.js'

export function Footer() {
  return (
    <footer className="site-footer">
      <span>PetersApp</span>
      <span>v{appVersion}</span>
    </footer>
  )
}
