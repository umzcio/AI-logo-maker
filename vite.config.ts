import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  server: {
    port: 5176,
  },
  plugins: [
    react(),
    {
      name: "api-server",
      configureServer: async (server) => {
        const { configureServer } = await import("./server/index.js");
        configureServer(server);
      },
    },
  ],
});
