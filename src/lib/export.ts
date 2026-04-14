import { jsPDF } from "jspdf";
import { encodeIco } from "./ico";

function svgToDataUrl(svg: string): string {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  return URL.createObjectURL(blob);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function renderToCanvas(
  source: { type: "svg"; data: string } | { type: "artistic"; data: string },
  size: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  let img: HTMLImageElement;
  if (source.type === "svg") {
    const url = svgToDataUrl(source.data);
    img = await loadImage(url);
    URL.revokeObjectURL(url);
  } else {
    img = await loadImage(`data:image/png;base64,${source.data}`);
  }

  ctx.drawImage(img, 0, 0, size, size);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create blob"))),
      type
    );
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadSvg(svgData: string, filename: string) {
  const blob = new Blob([svgData], { type: "image/svg+xml" });
  downloadBlob(blob, filename);
}

export async function downloadPng(
  source: { type: "svg"; data: string } | { type: "artistic"; data: string },
  size: number,
  filename: string
) {
  const canvas = await renderToCanvas(source, size);
  const blob = await canvasToBlob(canvas, "image/png");
  downloadBlob(blob, filename);
}

export async function downloadWebp(
  source: { type: "svg"; data: string } | { type: "artistic"; data: string },
  size: number,
  filename: string
) {
  const canvas = await renderToCanvas(source, size);
  const blob = await canvasToBlob(canvas, "image/webp");
  downloadBlob(blob, filename);
}

export async function downloadIco(
  source: { type: "svg"; data: string } | { type: "artistic"; data: string },
  filename: string
) {
  const sizes = [16, 32, 48];
  const pngBuffers: ArrayBuffer[] = [];

  for (const size of sizes) {
    const canvas = await renderToCanvas(source, size);
    const blob = await canvasToBlob(canvas, "image/png");
    pngBuffers.push(await blob.arrayBuffer());
  }

  const icoBuffer = encodeIco(pngBuffers, sizes);
  const blob = new Blob([icoBuffer], { type: "image/x-icon" });
  downloadBlob(blob, filename);
}

export async function downloadPdf(
  source: { type: "svg"; data: string } | { type: "artistic"; data: string },
  filename: string
) {
  const canvas = await renderToCanvas(source, 1024);
  const imgData = canvas.toDataURL("image/png");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const logoSize = Math.min(pageWidth, pageHeight) * 0.6;
  const x = (pageWidth - logoSize) / 2;
  const y = (pageHeight - logoSize) / 2;

  doc.addImage(imgData, "PNG", x, y, logoSize, logoSize);
  doc.save(filename);
}
