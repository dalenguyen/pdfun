/// <reference types="vitest" />

import analog from '@analogjs/platform'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { defineConfig, splitVendorChunkPlugin } from 'vite'

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
        // '..' is for primeicons
        allow: ['.', '../libs', '..'],
      },
    },
    vite: {
      ssr: {
        noExternal: [
          'shelljs',
          'firebase/**',
          'firebase-admin/**',
          'ngx-cookie-service/**',
          'ngx-cookie-service-ssr/**',
        ],
      },
    },
    plugins: [
      analog({
        nitro: {
          preset: 'node-server',
        },
        vite: {
          inlineStylesExtension: 'scss',
        },
        ssr: false,
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
