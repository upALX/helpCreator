import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
//import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
    react()
  ],
  optimizeDeps: {
    exclude: ['@ffmepg/ffmpeg', '@ffmpeg/util']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
