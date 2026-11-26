import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Ionic 8 publica ESM con importaciones de directorio que Node no resuelve;
    // se procesan con Vite para que la resolución funcione bajo Vitest.
    server: {
      deps: {
        inline: [/@ionic\//, /ionicons/, /@stencil\//],
      },
    },
  },
});
