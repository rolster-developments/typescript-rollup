import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

function rollupInput(entryFile, path) {
  return [`${path}/esm/${entryFile}.js`];
}

function rollupOutput(entryFile, path, requiredEsm) {
  const outputs = [
    {
      file: `${path}/cjs/${entryFile}.cjs`,
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true
    }
  ];

  if (requiredEsm) {
    outputs.push({
      file: `${path}/es/${entryFile}.mjs`,
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true
    });
  }

  return outputs;
}

export default function rolster(options) {
  const {
    entryFiles,
    packages,
    path,
    plugins,
    pluginsOptions,
    requiredEsm
  } =
    options;

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

  const rollupPath = path || 'dist';

  return entryFiles.map((entryFile) => {
    return {
      external: packages || [],
      input: rollupInput(entryFile, rollupPath),
      output: rollupOutput(entryFile, rollupPath, requiredEsm),
      plugins: rolsterPlugins
    };
  });
}
