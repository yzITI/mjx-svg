import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/mjx-svg.js',
      name: 'MJXSVG',
      fileName: (format) => `mjx-svg.${format}.js`
    }
  }
})
