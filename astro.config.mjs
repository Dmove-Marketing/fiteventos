import { defineConfig } from 'astro/config';

export default defineConfig({
  // URL de produção — usada pelo Astro para resolver Astro.url e JSON-LD
  site: 'https://lp.espacofiteventos.com.br',

  // Output estático (padrão) — gera HTML puro
  output: 'static',

  // View Transitions habilitadas
  prefetch: true,

  // Build otimizado
  build: {
    inlineStylesheets: 'auto',
  },

  // Dev server
  server: {
    port: 4321,
  },
});
