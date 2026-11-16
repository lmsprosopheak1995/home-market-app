import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // គាំទ្រ browser/ទូរស័ព្ទចាស់ៗ (iOS Safari 12+, Android Chrome 64+)
    target: ['es2018', 'safari12', 'chrome64'],
    cssTarget: ['safari12', 'chrome64'],
  },
})
