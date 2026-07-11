import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/utils/supabase/**',
        'node_modules/**',
        '.next/**',
        'cypress/**'
      ]
    }
  }
});
