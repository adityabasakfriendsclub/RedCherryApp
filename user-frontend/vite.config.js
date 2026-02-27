import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api requests from the frontend dev server to the backend.
    // This means you call fetch("/api/auth/register") in React and Vite
    // forwards it to http://localhost:5000/api/auth/register — no CORS issues.
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
