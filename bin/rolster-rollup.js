#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

const rollupPackage = require.resolve('rollup/package.json');
const rollupCli = join(
  dirname(rollupPackage),
  require(rollupPackage).bin.rollup
);

const args = process.argv.slice(2);
const hasConfig = args.some(
  (arg) => arg === '-c' || arg === '--config' || arg.startsWith('--config=')
);

const rollupArgs = hasConfig ? args : ['-c', 'rollup.config.mjs', ...args];

const child = spawn(process.execPath, [rollupCli, ...rollupArgs], {
  stdio: 'inherit'
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }

  process.exit(code ?? 1);
});
