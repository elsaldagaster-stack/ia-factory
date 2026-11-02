import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    exclude: ['tests/e2e/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'src/**/*.tsx', 'lib/**/*.ts', 'components/**/*.tsx'],
      thresholds: {
        branches: 70,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
