/// <reference types="vitest" />

import analog from '@analogjs/platform'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    publicDir: 'src/public',
    cacheDir: `../node_modules/.vite`,

    build: {
      outDir: '../dist/./pdf/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    server: {
      fs: {
        allow: ['.', '../libs'],
      },
    },
    vite: {
      ssr: {
        noExternal: ['shelljs', '@angular/fire/**'],
      },
    },
    plugins: [
      analog({
        nitro: {
          preset: 'node-server',
        },
      }),

      nxViteTsPaths(),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  }
})
