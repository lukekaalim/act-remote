import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'index.js',
  output: [
    {
      file: 'iOS/ActMultiTargetDemo/Assets.xcassets/dist.dataset/bundle.js',
      format: 'esm'
    },
    {
      file: 'android/app/src/main/assets/dist/bundle.js',
      format: 'esm'
    }
  ],
  plugins: [nodeResolve()]
};