/// <reference types="vitest" />

import analog from '@analogjs/platform'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { visualizer } from 'rollup-plugin-visualizer'
import { Plugin, defineConfig, splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    publicDir: 'src/public',
    cacheDir: `../node_modules/.vite`,

    build: {
      outDir: '../dist/./pdf/client',
      reportCompressedSize: true,
      target: ['es2022'],
    },
    server: {
      fs: {
        // '..' is for primeicons
        allow: ['.', '../libs', '..'],
      },
    },
    ssr: {
      noExternal: [
        'shelljs',
        'firebase/**',
        'firebase-admin/**',
        'ngx-cookie-service/**',
        'ngx-cookie-service-ssr/**',
      ],
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
      visualizer() as Plugin,
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
