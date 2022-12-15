import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'index.js',
  output: {
    file: 'ios/Assets.xcassets/App Icon & Top Shelf Image.brandassets/dist.dataset/bundle.js',
    format: 'esm'
  },
  plugins: [nodeResolve()]
};