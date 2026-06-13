import { useEffect, useState } from 'react'
import { appVersion } from '../lib/version.js'

// Henter version.json uden cache og melder tilbage, hvis en nyere version er deployet.
export function useVersionNotice() {
  const [latestVersion, setLatestVersion] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const versionUrl = `${import.meta.env.BASE_URL}version.json?t=${Date.now()}`

    fetch(versionUrl, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.version && data.version !== appVersion) {
          setLatestVersion(data.version)
        }
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  return latestVersion
}
