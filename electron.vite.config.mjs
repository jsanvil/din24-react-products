import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
    // example of using alias
    // resolve: {
    //   alias: {
    //     '@repo': resolve('src/main/repository'),
    //     '@utils': resolve('src/main/utils')
    //   }
    // }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: 'src/renderer/assets/**',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
        // '@/components': resolve('src/renderer/src/components'),
        // '@redux': resolve('src/renderer/src/redux'),
        // '@models': resolve('src/renderer/src/models'),
        // '@helpers': resolve('src/renderer/src/helpers')
      }
    },
    plugins: [react()]
  }
})
