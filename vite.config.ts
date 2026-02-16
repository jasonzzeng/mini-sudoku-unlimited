import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/',
  }

  if (command === 'build') {
    // Replace 'mini-sudoku-unlimited' with your actual repo name if different
    config.base = '/mini-sudoku-unlimited/'
  }

  return config
})