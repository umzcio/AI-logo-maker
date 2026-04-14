import { useState } from "react";
import type { GenerationResult } from "../types";

interface PreviewProps {
  result: GenerationResult | null;
  loading: boolean;
  error: string | null;
}

export default function Preview({ result, loading, error }: PreviewProps) {
  const [bg, setBg] = useState<"dark" | "light">("dark");

  return (
    <div className="preview">
      <div className="preview-header">
        <div className="prompt-label">Preview</div>
        <div className="bg-toggle">
          <button
            className={`bg-toggle-btn ${bg === "dark" ? "active" : ""}`}
            onClick={() => setBg("dark")}
          >
            Dark
          </button>
          <button
            className={`bg-toggle-btn ${bg === "light" ? "active" : ""}`}
            onClick={() => setBg("light")}
          >
            Light
          </button>
        </div>
      </div>
      <div className={`preview-area ${bg === "light" ? "preview-area-light" : ""}`}>
        {loading && (
          <div className="preview-loading">
            <div className="spinner" />
            <span>Generating...</span>
          </div>
        )}
        {error && !loading && (
          <div className="preview-error">{error}</div>
        )}
        {!loading && !error && !result && (
          <div className="preview-empty">
            Describe a logo above and click Generate
          </div>
        )}
        {!loading && !error && result && (
          <div className="preview-content">
            {result.type === "svg" ? (
              <div
                className="preview-svg"
                dangerouslySetInnerHTML={{ __html: result.data }}
              />
            ) : (
              <img
                className="preview-image"
                src={`data:image/png;base64,${result.data}`}
                alt="Generated logo"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
