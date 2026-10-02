import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Desactivamos HMR y watcher explícitamente para evitar que la pérdida de conexión WebSocket
      // en celulares o entornos de nube dispare recargas continuas de página (window.location.reload)
      hmr: false,
      watch: null,
    },
  };
});
