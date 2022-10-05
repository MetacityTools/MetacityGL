import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'metacitygl/metacitygl.ts'),
      name: 'MetacityGL',
      // the proper extensions will be added
      fileName: 'metacitygl'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom', 'three', 'axios'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          three: 'THREE',
          axios: 'axios'
          //what about react-dom?
        }
      }
    }
  },
  plugins: [dts()]
})
