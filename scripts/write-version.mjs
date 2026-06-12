import { mkdir, writeFile } from 'node:fs/promises'
import packageJson from '../package.json' with { type: 'json' }

await mkdir('public', { recursive: true })
await writeFile(
  'public/version.json',
  `${JSON.stringify(
    {
      version: packageJson.version,
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
)
