import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/festivo-ai/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.jsx',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html'],
      include: ['src/**/*.jsx', 'src/**/*.js'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
