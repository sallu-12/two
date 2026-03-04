import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname),
  server: {
    host: "::",
    port: 8080,
    strictPort: false,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  plugins: react(),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['framer-motion', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssMinify: "lightningcss",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion", "lucide-react"],
  },
});

