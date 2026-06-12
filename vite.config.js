import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import packageJson from './package.json' with { type: 'json' }

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'peter'
const base = process.env.VITE_BASE_PATH ?? (process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/')

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
})
