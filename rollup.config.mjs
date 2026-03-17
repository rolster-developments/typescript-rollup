import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    plugins: [commonjs(), resolve()],
    input: ['index.js'],
    output: [
      {
        file: 'index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: 'index.es.js',
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    external: [
      '@rollup/plugin-typescript',
      '@rollup/plugin-commonjs',
      '@rollup/plugin-node-resolve'
    ]
  }
];
