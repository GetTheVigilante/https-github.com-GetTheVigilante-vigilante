import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Optimize production builds
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("@radix-ui")) {
              return "radix-ui";
            }
            if (id.includes("react-router-dom")) {
              return "router";
            }
            if (id.includes("@supabase")) {
              return "supabase";
            }
            if (id.includes("recharts")) {
              return "charts";
            }
            if (id.includes("marked") || id.includes("highlight.js")) {
              return "markdown";
            }
            return "vendor";
          }
        },
      },
    },
    // Optimize CSS
    cssCodeSplit: true,
    // Increase chunk size warning
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging
    sourcemap: false, // Set to true if you need debugging
  },
  plugins: [
    react(),
    // Bundle analyzer - remove or disable after analysis
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "zod",
      "react-hook-form",
    ],
    exclude: ["@radix-ui"], // Let Radix build optimize itself
  },
}));