import { useState } from "react";
import type { GenerationResult } from "../types";
import { downloadSvg, downloadPng, downloadWebp, downloadIco, downloadPdf } from "../lib/export";

interface ExportBarProps {
  result: GenerationResult | null;
}

const PNG_SIZES = [16, 32, 64, 128, 256, 512, 1024];

export default function ExportBar({ result }: ExportBarProps) {
  const [showPngSizes, setShowPngSizes] = useState(false);

  if (!result) return null;

  const baseName = result.prompt.split(/\s+/).slice(0, 3).join("-").toLowerCase().replace(/[^a-z0-9-]/g, "") || "logo";

  async function handleSvg() {
    if (result!.type !== "svg") return;
    await downloadSvg(result!.data, `${baseName}.svg`);
  }

  async function handlePng(size: number) {
    await downloadPng({ type: result!.type, data: result!.data }, size, `${baseName}-${size}.png`);
    setShowPngSizes(false);
  }

  async function handleWebp() {
    await downloadWebp({ type: result!.type, data: result!.data }, 512, `${baseName}.webp`);
  }

  async function handleIco() {
    await downloadIco({ type: result!.type, data: result!.data }, `${baseName}.ico`);
  }

  async function handlePdf() {
    await downloadPdf({ type: result!.type, data: result!.data }, `${baseName}.pdf`);
  }

  return (
    <div className="export-bar">
      {result.type === "svg" && (
        <button className="export-btn" onClick={handleSvg}>SVG</button>
      )}

      <div className="export-dropdown">
        <button className="export-btn" onClick={() => setShowPngSizes(!showPngSizes)}>
          PNG
        </button>
        {showPngSizes && (
          <div className="export-dropdown-menu">
            {PNG_SIZES.map((size) => (
              <button key={size} className="export-dropdown-item" onClick={() => handlePng(size)}>
                {size} x {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="export-btn" onClick={handleIco}>ICO</button>
      <button className="export-btn" onClick={handleWebp}>WebP</button>
      <button className="export-btn" onClick={handlePdf}>PDF</button>
    </div>
  );
}
