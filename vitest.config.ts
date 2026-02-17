import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify('test-abc123'),
    __VERSION__: JSON.stringify('0.0.0-test'),
  },
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
  },
});
