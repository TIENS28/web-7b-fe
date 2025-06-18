import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// ✅ REQUIRED: Vitest configuration for React Testing Library
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      'shared': path.resolve(__dirname, './src/shared'),
      'public': path.resolve(__dirname, './src/public'),
      'admin': path.resolve(__dirname, './src/admin'),
      'app': path.resolve(__dirname, './src/app'),
    },
  },
}); 