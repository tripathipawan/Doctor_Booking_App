import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 400,
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/'))
            return 'vendor-react'
          if (id.includes('node_modules/react-router-dom/'))
            return 'vendor-router'
          if (id.includes('node_modules/firebase/auth') || id.includes('node_modules/@firebase/auth'))
            return 'vendor-firebase-auth'
          if (id.includes('node_modules/firebase/firestore') || id.includes('node_modules/@firebase/firestore'))
            return 'vendor-firebase-firestore'
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase'))
            return 'vendor-firebase-core'
          if (id.includes('node_modules/lucide-react'))
            return 'vendor-icons'
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})