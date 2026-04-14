import express from "express";
import { generateSvg } from "./generate-svg.js";
import { generateImage } from "./generate-image.js";
import type { ViteDevServer } from "vite";

export function configureServer(server: ViteDevServer) {
  const app = express();
  app.use(express.json());

  app.post("/api/generate-svg", generateSvg);
  app.post("/api/generate-image", generateImage);

  server.middlewares.use(app);
}
