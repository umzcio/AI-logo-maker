import Anthropic from "@anthropic-ai/sdk";
import type { Request, Response } from "express";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a logo/icon designer. Return ONLY valid SVG markup. No explanation, no markdown, no code fences. The SVG should use a viewBox of "0 0 512 512" and include width="512" height="512". Design a clean, professional logo based on the user's description. Use solid shapes, clean lines, and a limited color palette. Make sure the logo works well at small sizes.`;

export async function generateSvg(req: Request, res: Response) {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0];
    if (text.type !== "text") {
      res.status(500).json({ error: "Unexpected response type" });
      return;
    }

    // Strip any accidental markdown fencing
    let svg = text.text.trim();
    if (svg.startsWith("```")) {
      svg = svg.replace(/^```(?:svg|xml)?\n?/, "").replace(/\n?```$/, "");
    }

    res.json({ svg });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
