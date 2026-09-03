import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/deploy_package/**', '**/*.zip', '**/android/**', '**/temp_apk_build/**', '**/*.apk', '**/*.apk.bak'],
    },
  },
  build: {
    sourcemap: false,
    minify: true,
    rollupOptions: {
      input: 'react.html',
    }
  },
})
