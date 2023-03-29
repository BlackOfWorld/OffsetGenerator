
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

/** @type {import('vite').UserConfig} */
export default {
    build: {
        sourcemap: true,
        rollupOptions: {
            plugins: [
              rollupNodePolyFill()
            ]
          }
    },
    optimizeDeps: {
        esbuildOptions: {
          // Node.js global to browser globalThis
          define: {
            global: 'globalThis'
          },
          // Enable esbuild polyfill plugins
          plugins: [
            NodeGlobalsPolyfillPlugin({
              buffer: true, 
              process: true,
            }), 
            NodeModulesPolyfillPlugin() 
          ]
        }
      }
}