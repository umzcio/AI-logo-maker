import type { Mode } from "../types";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onGenerate: () => void;
  onClear: () => void;
  loading: boolean;
}

export default function PromptInput({
  prompt,
  onPromptChange,
  mode,
  onModeChange,
  onGenerate,
  onClear,
  loading,
}: PromptInputProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !loading) {
      onGenerate();
    }
  }

  return (
    <div className="prompt-input">
      <div className="prompt-label">Describe your logo</div>
      <textarea
        className="prompt-textarea"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='A minimal mountain peak logo for a hiking app called "Summit"...'
        rows={3}
      />
      <div className="prompt-actions">
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === "svg" ? "active" : ""}`}
            onClick={() => onModeChange("svg")}
          >
            SVG
          </button>
          <button
            className={`mode-btn ${mode === "artistic" ? "active" : ""}`}
            onClick={() => onModeChange("artistic")}
          >
            Artistic
          </button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="clear-btn"
            onClick={onClear}
            disabled={loading || !prompt.trim()}
          >
            Clear
          </button>
          <button
            className="generate-btn"
            onClick={onGenerate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
