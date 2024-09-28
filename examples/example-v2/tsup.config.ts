import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  target: 'esnext',
  outDir: 'dist',
  splitting: false,
  clean: true,
});
