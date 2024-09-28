import { defineConfig } from 'tsup';

export default defineConfig((config) => {
  console.log('config', config.watch);
  return {
    format: ['esm', 'cjs'],
    bundle: false,
    clean: config.watch ? false : true,
    minify: config.watch ? false : 'terser',
    dts: true,
    entry: [
      'src/index.ts',
      'src/createLogger.ts',
      'src/createTransport.ts',
      'src/PinoApplicationInsightsTransport.ts',
    ],
    keepNames: true,
    outDir: 'dist',
    platform: 'node',
    target: 'node20',
    treeshake: true,
    sourcemap: true,
    splitting: config.watch ? false : true,
    tsconfig: './tsconfig.json',
  };
});
