import { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';

import type { Plugin } from 'rollup';

interface RolsterTypescriptOptions {
  declaration: boolean;
  declarationDir: string;
  include: string[];
  tsconfig: string;
}

interface RolsterOptions {
  entryFiles: string[];
  packages?: string[];
  path?: string;
  plugins?: Plugin[];
  pluginsOptions?: {
    nodeResolve?: RollupNodeResolveOptions;
    typescript?: Partial<RolsterTypescriptOptions>;
  };
  requiredEsm?: boolean;
}

interface RollupOptions {
  external: string[];
  input: string[];
  output: string[];
  plugins: Plugin[];
}

export default function rolster(options: RolsterOptions): RollupOptions[];
