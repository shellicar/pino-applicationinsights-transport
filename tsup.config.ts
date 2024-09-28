import { defineConfig } from 'tsup';

export default defineConfig((config) => {
  console.log('config', config.watch);
  return {
    format: ['esm', 'cjs'],
    bundle: true,
    clean: !config.watch,
    minify: config.watch ? false : 'terser',
    dts: true,
    entry: ['src/index.ts', 'src/createLogger.ts', 'src/createTransport.ts'],
    keepNames: true,
    outDir: 'dist',
    platform: 'node',
    target: 'node20',
    sourcemap: true,
    splitting: !config.watch,
    tsconfig: './tsconfig.json',
  };
});
