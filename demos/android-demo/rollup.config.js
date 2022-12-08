import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'index.js',
  output: {
    file: 'android/app/src/main/assets/dist/bundle.js',
    format: 'esm'
  },
  plugins: [nodeResolve()]
};