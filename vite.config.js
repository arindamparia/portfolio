import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Generate gzip compressed files
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files larger than 1kb
    }),
    // Generate brotli compressed files
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
  ],

  server: {
    port: 5173,
    strictPort: false, // Allow fallback if 5173 is taken
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173,
    },
  },

  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },

    // Optimize chunk size
    chunkSizeWarningLimit: 500,

    // Manual chunking strategy
    rolldownOptions: {
      output: {
        // Separate vendor chunks for better caching
        codeSplitting: {
          groups: [
            { name: 'vendor-react', test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'vendor-framer', test: /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
            { name: 'vendor-icons', test: /[\\/]node_modules[\\/]react-icons[\\/]/ },
            // Only loaded by the lazy 3D hero background
            { name: 'vendor-three', test: /[\\/]node_modules[\\/]three[\\/]/ },
          ],
        },
        // Optimize chunk filenames for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Source maps for debugging (disable in production for smaller builds)
    sourcemap: false,

    // Target modern browsers for smaller bundle size
    target: 'esnext',

    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
})
