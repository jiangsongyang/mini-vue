import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  output: [
    // cjs -> commonjs
    {
      format: 'cjs',
      file: pkg.main,
    },
    // esm -> es module
    {
      format: 'es',
      file: pkg.module,
    },
  ],
  plugins : [
    typescript()
  ]
}
