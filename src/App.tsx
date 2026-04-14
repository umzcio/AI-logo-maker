import { useState } from "react";
import type { Mode, GenerationResult, GalleryItem } from "./types";
import PromptInput from "./components/PromptInput";
import Preview from "./components/Preview";
import Gallery from "./components/Gallery";
import ExportBar from "./components/ExportBar";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<Mode>("svg");
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "svg" ? "/api/generate-svg" : "/api/generate-image";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const result: GenerationResult = {
        type: mode,
        data: mode === "svg" ? data.svg : data.image,
        prompt,
      };

      setCurrentResult(result);
      setGallery((prev) => [
        { ...result, id: crypto.randomUUID(), timestamp: Date.now() },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="header-logo" />
          <span className="header-title">Logo Maker</span>
        </div>
        <span className="header-count">
          {gallery.length} logo{gallery.length !== 1 ? "s" : ""} generated
        </span>
      </header>
      <main className="main">
        <div className="content">
          <PromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            mode={mode}
            onModeChange={setMode}
            onGenerate={handleGenerate}
            onClear={() => {
              setPrompt("");
              setCurrentResult(null);
              setError(null);
            }}
            loading={loading}
          />
          <Preview result={currentResult} loading={loading} error={error} />
          <ExportBar result={currentResult} />
        </div>
        <aside className="sidebar">
          <Gallery
            items={gallery}
            currentResult={currentResult}
            onSelect={(item) =>
              setCurrentResult({ type: item.type, data: item.data, prompt: item.prompt })
            }
          />
        </aside>
      </main>
    </div>
  );
}
