export type Mode = "svg" | "artistic";

export interface GenerationResult {
  type: Mode;
  data: string; // SVG markup or base64 image
  prompt: string;
}

export interface GalleryItem extends GenerationResult {
  id: string;
  timestamp: number;
}
