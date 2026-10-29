# Rolster Rollup

Shared [Rollup](https://rollupjs.org) configuration builder for Rolster TypeScript
packages. It standardizes the build pipeline across every `@rolster/*` project,
producing **CommonJS** and **ESM** bundles from a single, small config file.

## Installation

```bash
npm i @rolster/rollup -D
```

Rollup and the `@rollup/plugin-*` plugins it needs (`commonjs`, `node-resolve`)
are already bundled as dependencies, so you don't have to install
them yourself. The package also exposes the `rolster-rollup` command, which runs
the bundled Rollup CLI, so consumer projects never need to depend on `rollup`
directly. In the consumer project you only need `typescript` (to run `tsc`) and,
for the recommended `clean` script, `rimraf`.

## How it works

The package exports a single function, `rolster(options)`, that returns an array
of Rollup configurations. A Rolster build runs in **two steps**:

1. **`tsc`** compiles `src/**/*.ts` into `dist/esm/` (JavaScript + `.d.ts`).
2. **`rolster-rollup`** takes each `dist/esm/<entry>.js` and bundles it into
   `dist/cjs/<entry>.cjs` and — when `requiredEsm` is enabled —
   `dist/es/<entry>.mjs`.

## Using it in a project

Four pieces wire a package into this pipeline.

### 1. `rollup.config.mjs`

```js
import rolster from '@rolster/rollup';

export default rolster({
  entryFiles: ['index'],
  requiredEsm: true,
  packages: ['@rolster/i18n'] // external deps: not bundled, kept as `external`
});
```

### 2. Build scripts in `package.json`

```json
{
  "scripts": {
    "clean": "rimraf ./dist",
    "build": "npm run clean && tsc -p tsconfig.app.json && rolster-rollup",
    "prepublishOnly": "npm run build"
  }
}
```

`rolster-rollup` runs the Rollup CLI bundled with this package using
`rollup.config.mjs` from the current directory. Any extra flag is forwarded to
Rollup (for example `rolster-rollup --watch`), and passing your own `-c` replaces
the default config file.

### 3. `tsconfig.app.json`

The build compiles with a dedicated tsconfig that emits only the library source
(excluding specs):

```json
{
  "extends": "./tsconfig.json",
  "files": ["node_modules/@rolster/types/index.d.ts"],
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```

### 4. Entry points in `package.json`

Point the published fields at the generated output:

```json
{
  "types": "./dist/esm/index.d.ts",
  "main": "./dist/cjs/index.cjs",
  "module": "./dist/es/index.mjs",
  "exports": {
    ".": {
      "types": "./dist/esm/index.d.ts",
      "node": {
        "require": "./dist/cjs/index.cjs",
        "import": "./dist/es/index.mjs"
      },
      "default": "./dist/es/index.mjs"
    }
  }
}
```

## API — `rolster(options)`

| Option                       | Type                       | Default      | Description                                                                                                |
| ---------------------------- | -------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `entryFiles`                 | `string[]`                 | **required** | Entry names (without extension). Each is read from `<path>/esm/<entry>.js` and produces one Rollup config. |
| `requiredEsm`                | `boolean`                  | `false`      | When `true`, also emits an ESM bundle at `<path>/es/<entry>.mjs` (besides the CJS one).                    |
| `packages`                   | `string[]`                 | `[]`         | Packages marked as `external` (not bundled) — e.g. other `@rolster/*` dependencies.                        |
| `path`                       | `string`                   | `'dist'`     | Base folder for both input and output.                                                                     |
| `plugins`                    | `Plugin[]`                 | `[]`         | Extra Rollup plugins appended after the Rolster defaults.                                                  |
| `pluginsOptions.nodeResolve` | `RollupNodeResolveOptions` | —            | Options forwarded to `@rollup/plugin-node-resolve`.                                                        |

**Returns:** `RollupOptions[]` — one configuration per entry in `entryFiles`.

The option types (`RolsterOptions` and `RollupOptions`)
are declared in `index.d.ts` but not exported, so they cannot be imported: type
the options object inline or rely on inference from the `rolster(...)` call.

### Generated output (per entry)

- **CJS:** `<path>/cjs/<entry>.cjs`
- **ESM** (only if `requiredEsm: true`): `<path>/es/<entry>.mjs`

Both are emitted with source maps and `inlineDynamicImports`.

## Example: a package with an external dependency

```js
import rolster from '@rolster/rollup';

// @rolster/dates depends on @rolster/i18n, which must stay external
export default rolster({
  entryFiles: ['index'],
  requiredEsm: true,
  packages: ['@rolster/i18n']
});
```

## Contributing

:sparkles: Daniel Andrés Castillo Pedroza
