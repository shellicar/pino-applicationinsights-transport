import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs'],
  target: 'esnext',
  outDir: 'dist',
  splitting: false,
  clean: true,
});
