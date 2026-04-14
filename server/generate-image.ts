import OpenAI from "openai";
import type { Request, Response } from "express";

const client = new OpenAI();

export async function generateImage(req: Request, res: Response) {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  try {
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: `Professional logo/icon design: ${prompt}. Clean, minimal, suitable for app icon or branding.`,
      n: 1,
      size: "1024x1024",
      quality: "high",
    });

    const imageData = response.data[0];
    if (!imageData.b64_json) {
      res.status(500).json({ error: "No image data returned" });
      return;
    }

    res.json({ image: imageData.b64_json });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
