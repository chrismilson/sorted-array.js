/* global require */
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfigOverride: {
        exclude: ["**/__tests__/**/*"]
      }
    })
  ],
  external: ["wbtree", "@shlappas/itertools"]
}