
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { batchControlPlugin } from './plugins/batchControlPlugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), batchControlPlugin()],
})
