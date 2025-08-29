import { defineBuildConfig } from 'unbuild'
import packageJson from './package.json'

// https://github.com/unjs/unbuild
export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: false,
    esbuild: {
      minify: false,
    },
  },

  replace: {
    '__package_version': packageJson.version.toString(),
    '__package_name': packageJson.name,
  },

  entries: [
    './src/index.ts',
  ],
})
