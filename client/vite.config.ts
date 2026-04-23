import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    watch: {
      ignored: ['!../views/**'],
    },
  },
  plugins: [react(), tailwindcss(),
    {
      name: 'watch-sinatra-views',
      configureServer(server) {
        const viewsPath = path.resolve(__dirname, '../views');
        server.watcher.add(viewsPath);
        server.watcher.on('change', (file) => {
          if (file.includes('/views/')) {
            server.ws.send({ type: 'full-reload' });
          }
        });
      },
    },],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
