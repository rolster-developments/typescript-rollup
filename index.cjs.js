'use strict';

var typescript = require('@rollup/plugin-typescript');
var commonjs = require('@rollup/plugin-commonjs');
var resolve = require('@rollup/plugin-node-resolve');

function rollupInput(entryFile, path) {
  return [`${path}/esm/${entryFile}.js`];
}

function rollupOutput(entryFile, path) {
  return [
    {
      file: `${path}/cjs/${entryFile}.js`,
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true
    },
    {
      file: `${path}/es/${entryFile}.js`,
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true
    }
  ];
}

function rolster(options) {
  const { entryFiles, packages, path, plugins, pluginsOptions } = options;

  const rolsterTypescript = {
    tsconfig: './tsconfig.app.json',
    declaration: true,
    declarationDir: 'dist',
    include: ['node_modules/@rolster/types/index.d.ts']
  };

  const rolsterPlugins = [
    commonjs(),
    resolve(pluginsOptions?.nodeResolve),
    typescript({ ...rolsterTypescript, ...pluginsOptions?.typescript }),
    ...(plugins || [])
  ];

  return entryFiles.map((entryFile) => {
    return {
      external: packages || [],
      input: rollupInput(entryFile, path || 'dist'),
      output: rollupOutput(entryFile, path || 'dist'),
      plugins: rolsterPlugins
    };
  });
}

module.exports = rolster;
//# sourceMappingURL=index.cjs.js.map
